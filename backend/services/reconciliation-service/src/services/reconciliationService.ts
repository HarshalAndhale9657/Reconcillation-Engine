import { kafkaManager } from "@backend/common";
import { EachMessagePayload } from "kafkajs";
import {
  TransactionSource,
  ReconciliationStatus,
  TransactionStatus,
  AlertSeverity
} from "../../generated/prisma/enums";
import { prisma } from "../../prisma/prisma";
import { eventService } from "./eventService";

const REQUIRED_SOURCES: TransactionSource[] = [
  TransactionSource.APP,
  TransactionSource.BANK,
  TransactionSource.GATEWAY
];

const FINAL_STATES = new Set<ReconciliationStatus>([
  ReconciliationStatus.MATCHED,
  ReconciliationStatus.AMOUNT_MISMATCH,
  ReconciliationStatus.STATUS_MISMATCH,
  ReconciliationStatus.TIMEOUT_MISSING
]);

const RECONCILIATION_TIMEOUT_MS = 5 * 60 * 1000;

interface TransactionData {
  transaction_id: string;
  source: string;
  amount: number;
  status: string;
  timestamp: string;
}

interface PendingTransaction {
  transactionId: string;
  sources: Map<TransactionSource, TransactionData>;
  firstSeenAt: Date;
  timeoutId?: NodeJS.Timeout;
}

export class ReconciliationService {
  private pendingTransactions = new Map<string, PendingTransaction>();

  async initialize() {
    await kafkaManager.connectAdmin();
    await kafkaManager.initializeConsumer(
      ["APP", "BANK", "GATEWAY"],
      "reconciliation-group",
      this.handleMessage.bind(this)
    );
  }

  private async handleMessage({ message, topic }: EachMessagePayload) {
    if (!message.value) return;

    const data: TransactionData = JSON.parse(message.value.toString());
    const transactionId = data.transaction_id;
    const source = topic as TransactionSource;

    // 🔒 HARD GUARD — IGNORE REPLAYS
    const existing = await prisma.transactionState.findUnique({
      where: { transactionId }
    });

    if (existing && FINAL_STATES.has(existing.state)) {
      console.log(`Ignoring replay for finalized tx ${transactionId}`);
      return;
    }

    await this.storeRawTransaction(data, source);

    let pending = this.pendingTransactions.get(transactionId);

    if (!pending) {
      pending = {
        transactionId,
        sources: new Map(),
        firstSeenAt: new Date()
      };
      this.pendingTransactions.set(transactionId, pending);

      pending.timeoutId = setTimeout(
        () => this.handleTimeout(transactionId),
        RECONCILIATION_TIMEOUT_MS
      );
    }

    pending.sources.set(source, data);

    await this.updateTransactionState(transactionId, [...pending.sources.keys()]);

    if (this.hasAllSources(pending)) {
      await this.reconcileTransaction(transactionId, pending);
    }
  }

  private async storeRawTransaction(data: TransactionData, source: TransactionSource) {
    await prisma.transactionRaw.upsert({
      where: {
        transactionId_source: {
          transactionId: data.transaction_id,
          source
        }
      },
      create: {
        transactionId: data.transaction_id,
        source,
        amount: data.amount,
        status: this.mapStatus(data.status),
        eventTimestamp: new Date(data.timestamp)
      },
      update: {
        amount: data.amount,
        status: this.mapStatus(data.status),
        eventTimestamp: new Date(data.timestamp)
      }
    });
  }

  private async updateTransactionState(
    transactionId: string,
    receivedSources: TransactionSource[]
  ) {
    await prisma.transactionState.upsert({
      where: { transactionId },
      create: {
        transactionId,
        firstSeenAt: new Date(),
        receivedSources,
        state: ReconciliationStatus.INCOMPLETE
      },
      update: {
        receivedSources: {
          set: Array.from(new Set(receivedSources))
        },
        lastUpdatedAt: new Date()
      }
    });
  }

  private hasAllSources(pending: PendingTransaction) {
    return REQUIRED_SOURCES.every(s => pending.sources.has(s));
  }

  private async reconcileTransaction(
    transactionId: string,
    pending: PendingTransaction
  ) {
    if (pending.timeoutId) clearTimeout(pending.timeoutId);

    const app = pending.sources.get(TransactionSource.APP)!;
    const bank = pending.sources.get(TransactionSource.BANK)!;
    const gateway = pending.sources.get(TransactionSource.GATEWAY)!;

    const result = this.performReconciliation(app, bank, gateway);

    await prisma.transactionState.update({
      where: { transactionId },
      data: {
        state: result.status,
        lastUpdatedAt: new Date()
      }
    });

    await prisma.reconciliationResult.upsert({
      where: { transactionId },
      create: {
        transactionId,
        reconciliationStatus: result.status,
        details: result.details
      },
      update: {
        reconciliationStatus: result.status,
        details: result.details
      }
    });

    if (result.status !== ReconciliationStatus.MATCHED) {
      await this.createAlerts(transactionId, result);
      eventService.emitTransactionFailed(transactionId, result.status, result.details);
    } else {
      eventService.emitTransactionMatched(transactionId, result.status, result.details);
    }

    this.pendingTransactions.delete(transactionId);
  }

  private async handleTimeout(transactionId: string) {
    const pending = this.pendingTransactions.get(transactionId);
    if (!pending) return;

    const existing = await prisma.transactionState.findUnique({
      where: { transactionId }
    });

    if (existing && FINAL_STATES.has(existing.state)) return;

    const missing = REQUIRED_SOURCES.filter(s => !pending.sources.has(s));

    await prisma.transactionState.update({
      where: { transactionId },
      data: {
        state: ReconciliationStatus.TIMEOUT_MISSING,
        lastUpdatedAt: new Date()
      }
    });

    await prisma.reconciliationResult.upsert({
      where: { transactionId },
      create: {
        transactionId,
        reconciliationStatus: ReconciliationStatus.TIMEOUT_MISSING,
        details: `Timeout: Missing ${missing.join(", ")}`
      },
      update: {
        reconciliationStatus: ReconciliationStatus.TIMEOUT_MISSING,
        details: `Timeout: Missing ${missing.join(", ")}`
      }
    });

    await this.createAlerts(transactionId, {
      status: ReconciliationStatus.TIMEOUT_MISSING,
      details: `Timeout: Missing ${missing.join(", ")}`
    });

    eventService.emitTransactionTimeout(transactionId, `Timeout: Missing ${missing.join(", ")}`);

    this.pendingTransactions.delete(transactionId);
  }

  private performReconciliation(a: TransactionData, b: TransactionData, g: TransactionData) {
    const issues: string[] = [];

    if (new Set([a.amount, b.amount, g.amount]).size > 1)
      issues.push("Amount mismatch");

    if (new Set([a.status, b.status, g.status]).size > 1)
      issues.push("Status mismatch");

    if (!issues.length)
      return {
        status: ReconciliationStatus.MATCHED,
        details: "All matched"
      };

    return {
      status: issues.includes("Amount mismatch")
        ? ReconciliationStatus.AMOUNT_MISMATCH
        : ReconciliationStatus.STATUS_MISMATCH,
      details: issues.join("; ")
    };
  }

  private async createAlerts(
    transactionId: string,
    result: { status: ReconciliationStatus; details: string }
  ) {
    const reconciliation = await prisma.reconciliationResult.findUnique({
      where: { transactionId }
    });
    if (!reconciliation) return;

    await prisma.alert.create({
      data: {
        transactionId,
        reconciliationId: reconciliation.id,
        severity:
          result.status === ReconciliationStatus.AMOUNT_MISMATCH
            ? AlertSeverity.HIGH
            : AlertSeverity.MEDIUM,
        message: result.details
      }
    });
  }

  private mapStatus(status: string): TransactionStatus {
    return status.toUpperCase() === "SUCCESS"
      ? TransactionStatus.SUCCESS
      : status.toUpperCase() === "FAILED"
      ? TransactionStatus.FAILED
      : TransactionStatus.PENDING;
  }
}

export const reconciliationService = new ReconciliationService();

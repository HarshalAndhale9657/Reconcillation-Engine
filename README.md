# Reconciliation Engine

The **Reconciliation Engine** is an event-driven, microservice-based backend system designed to ingest, process, and reconcile financial transactions in a reliable, scalable, and auditable manner. It is built for modern fintech and ledger systems where correctness, traceability, and decoupled processing are critical.

---

## Overview

### Problem
Financial systems often deal with:
- Multiple transaction sources producing inconsistent records
- Out-of-order and delayed events
- Manual or tightly coupled reconciliation logic
- Limited auditability and replay capabilities
- Poor scalability under high transaction volume

### Solution
The Reconciliation Engine addresses these challenges using:
- Kafka-based event streaming
- Isolated microservices for ingestion and reconciliation
- Deterministic reconciliation logic
- Durable reconciliation state in PostgreSQL
- Fully Dockerized local and production-ready setup

**Ingest once. Stream events. Reconcile deterministically.**

---

## High-Level Flow

```
[1] INGESTION          [2] STREAMING          [3] RECONCILIATION        [4] STATE & AUDIT

Raw transactions --> Kafka topics --> Reconciliation engine --> Reconciled state
from external                           applies rules          stored in PostgreSQL
sources                                 & validations

```

## Architecture Overview

```
+----------------------------------------------------+
|               Reconciliation Engine                |
|                                                    |
|  +------------------+    +----------------------+  |
|  | Ingestion Service | -->| Kafka (Event Bus)   |  |
|  +------------------+    +----------+-----------+  |
|                                      |              |
|                           +----------v-----------+ |
|                           | Reconciliation        | |
|                           | Service               | |
|                           | - Matching logic      | |
|                           | - Validation rules    | |
|                           | - State transitions   | |
|                           +----------+-----------+ |
|                                      |              |
|                           +----------v-----------+ |
|                           | PostgreSQL            | |
|                           | - Raw transactions    | |
|                           | - Reconciliation state| |
|                           | - Audit history       | |
|                           +----------------------+ |
+----------------------------------------------------+
```


---

## Core Concepts

### Event-Driven Ingestion
- External systems submit raw transaction payloads
- Ingestion Service validates and normalizes data
- Transactions are published as Kafka events

### Stream-Based Processing
- Kafka acts as the system backbone
- Enables replay, backfilling, and fault tolerance
- Services are decoupled and independently scalable

### Deterministic Reconciliation
- Reconciliation Service consumes transaction events
- Applies matching rules and validations
- Produces deterministic reconciliation outcomes

### Persistent State & Auditability
- PostgreSQL stores:
  - Raw transactions
  - Reconciliation results
  - Processing metadata
- Full traceability for audits and reporting

---

## Reconciliation Flow

### Step 1: Transaction Ingestion
- Receive raw transaction data via API
- Validate and normalize payloads
- Publish events to Kafka

### Step 2: Event Streaming
- Kafka guarantees durable, ordered event delivery
- Enables retries and historical reprocessing

### Step 3: Reconciliation Processing
- Consume transaction events
- Apply reconciliation rules:
  - Amount matching
  - Duplicate detection
  - Status validation
- Determine reconciliation status:
  - `MATCHED`
  - `UNMATCHED`
  - `PARTIAL`
  - `FAILED`

### Step 4: State Persistence
- Persist final reconciliation state to PostgreSQL
- Maintain historical audit records

---

## Microservices

### Ingestion Service
Responsibilities:
- Accept and validate transaction data
- Normalize payloads
- Publish Kafka events
- Ensure idempotent ingestion

### Reconciliation Service
Responsibilities:
- Consume Kafka events
- Apply reconciliation logic
- Persist reconciliation results
- Maintain transaction state transitions

---

## Folder Structure
```
backend/
├── services/
│   ├── ingestion-service/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   └── Dockerfile
│   │
│   ├── reconciliation-service/
│   │   ├── src/
│   │   │   ├── consumers/
│   │   │   ├── services/
│   │   │   ├── reconciliation/
│   │   │   └── index.ts
│   │   └── Dockerfile
│
├── packages/
│   └── common/
│       ├── src/
│       ├── dist/
│       └── package.json
│
├── prisma/
│   └── schema.prisma
│
├── docker-compose.yml
└── README.md
```


---

## Kafka Topics (Example)

- `transactions.raw`
- `transactions.normalized`
- `transactions.reconciled`

Topics are append-only and replayable by design.

---

## Running Locally

### Prerequisites
- Docker & Docker Compose

### Start the backend
```bash
Inside /backend
./deploy.sh
```
This will start:

Kafka & Zookeeper

Ingestion Service

Reconciliation Service

PostgreSQL

## Tech Stack

- Node.js, TypeScript
- Kafka (Confluent)
- PostgreSQL, Prisma
- Docker & Docker Compose
- KafkaJS
- Express


## Current Status

✅ Event-based ingestion

✅ Kafka streaming

✅ Deterministic reconciliation logic

✅ Persistent reconciliation state

✅ Fully Dockerized environment

## License

MIT
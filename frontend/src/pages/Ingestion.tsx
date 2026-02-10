import { useEffect, useState } from "react";
import {
  startIngestion,
  stopIngestion,
  getIngestionStatus,
} from "../api/ingestion";
import { Badge } from "../components/Table";

type IngestionState = "running" | "stopped" | "unknown";

export default function Ingestion() {
  const [status, setStatus] = useState<IngestionState>("unknown");
  const [loading, setLoading] = useState(false);

  const refreshStatus = async () => {
    try {
      const res = await getIngestionStatus();

      
      if (res?.isRunning === true) {
        setStatus("running");
      } else {
        setStatus("stopped");
      }
    } catch (err) {
      console.error("Failed to fetch ingestion status", err);
      setStatus("stopped");
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await startIngestion();
      await refreshStatus(); 
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await stopIngestion();
      await refreshStatus(); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Ingestion Control
        </h1>
        <p className="mt-1 text-sm text-muted">
          Start or stop ingesting transactions from APP, BANK, and GATEWAY.
        </p>
      </div>

      <div className="rounded-xl bg-card p-6 shadow-soft border border-border space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Status</span>
          <Badge
            tone={
              status === "running"
                ? "success"
                : status === "stopped"
                ? "danger"
                : "neutral"
            }
          >
            {status.toUpperCase()}
          </Badge>
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading || status === "running"}
            onClick={handleStart}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Start ingestion
          </button>

          <button
            disabled={loading || status === "stopped"}
            onClick={handleStop}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Stop ingestion
          </button>
        </div>

        <p className="text-xs text-muted">
          Changes may take a few seconds to propagate through Kafka and the
          reconciliation service.
        </p>
      </div>
    </div>
  );
}

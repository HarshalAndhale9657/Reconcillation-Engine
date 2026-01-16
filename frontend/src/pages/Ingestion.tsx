import { useEffect, useState } from "react";
import {
  startIngestion,
  stopIngestion,
  getIngestionStatus,
} from "../api/ingestion";

type IngestionStatus = "running" | "stopped" | "unknown";

export default function Ingestion() {
  const [status, setStatus] = useState<IngestionStatus>("unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    try {
      const res = await getIngestionStatus();
      setStatus(res.status ?? "stopped");
    } catch (err) {
      setStatus("unknown");
      setError("Failed to fetch ingestion status");
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);

      await startIngestion();          // ✅ backend call
      await refreshStatus();           // ✅ update UI from backend
    } catch (err) {
      setError("Failed to start ingestion");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      setError(null);

      await stopIngestion();           // ✅ backend call
      await refreshStatus();           // ✅ update UI from backend
    } catch (err) {
      setError("Failed to stop ingestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>⚙️ Ingestion Control</h2>

      <p style={{ marginTop: 8 }}>
        Status:{" "}
        <span
          className={`badge ${
            status === "running" ? "running" : "stopped"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </p>

      {error && (
        <p style={{ color: "red", marginTop: 8 }}>
          ❌ {error}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          className="primary"
          onClick={handleStart}
          disabled={loading || status === "running"}
        >
          ▶️ {loading && status !== "running" ? "Starting..." : "Start Ingestion"}
        </button>

        <button
          className="danger"
          onClick={handleStop}
          disabled={loading || status === "stopped"}
          style={{ marginLeft: 12 }}
        >
          ⏹ {loading && status === "running" ? "Stopping..." : "Stop Ingestion"}
        </button>
      </div>
    </div>
  );
}

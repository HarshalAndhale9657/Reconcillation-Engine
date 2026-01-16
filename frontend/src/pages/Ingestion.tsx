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

  const refreshStatus = async () => {
    try {
      const res = await getIngestionStatus();
      setStatus(res?.status ?? "stopped");
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
    <div>
      <h2>⚙️ Ingestion Control</h2>

      <p>
        Status:{" "}
        <strong
          style={{
            color: status === "running" ? "green" : "red",
          }}
        >
          {status.toUpperCase()}
        </strong>
      </p>

      <div style={{ marginTop: 16 }}>
        <button
          className="primary"
          onClick={handleStart}
          disabled={loading || status === "running"}
        >
          ▶ Start Ingestion
        </button>

        <button
          className="danger"
          onClick={handleStop}
          disabled={loading || status === "stopped"}
          style={{ marginLeft: 12 }}
        >
          ■ Stop Ingestion
        </button>
      </div>
    </div>
  );
}

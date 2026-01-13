import { useEffect, useState } from 'react';
import {
  startIngestion,
  stopIngestion,
  getIngestionStatus,
} from '../api/ingestion';

export default function Ingestion() {
  const [status, setStatus] = useState('unknown');

  const refreshStatus = async () => {
    const res = await getIngestionStatus();
    setStatus(res.status ?? 'stopped');
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  return (
    <div>
      <h2>Ingestion Control</h2>

      <p>
        Status:{' '}
        <span className={`badge ${status === 'running' ? 'running' : 'stopped'}`}>
          {status}
        </span>
      </p>

      <div style={{ marginTop: 16 }}>
        <button className="primary" onClick={startIngestion}>
          Start Ingestion
        </button>

        <button
          className="danger"
          onClick={stopIngestion}
          style={{ marginLeft: 12 }}
        >
          Stop Ingestion
        </button>
      </div>
    </div>
  );
}

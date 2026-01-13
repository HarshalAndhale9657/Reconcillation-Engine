import { useEffect, useState } from 'react';
import { fetchAlerts } from '../api/reconciliation';

export default function Alerts() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAlerts().then(setData);
  }, []);

  if (!data) return <p>Loading alerts...</p>;

  return (
    <div>
      <h2>Alerts</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Severity</th>
            <th>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {data.alerts.map((a: any) => (
            <tr key={a.id}>
              <td>{a.transactionId}</td>
              <td>{a.severity}</td>
              <td>{a.resolved ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

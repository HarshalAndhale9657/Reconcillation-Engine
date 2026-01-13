import { useEffect, useState } from 'react';
import { fetchRawTransactions } from '../api/reconciliation';

export default function RawTransactions() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchRawTransactions().then(setData);
  }, []);

  if (!data) return <p>Loading raw transactions...</p>;

  return (
    <div>
      <h2>Raw Transactions</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Source</th>
            <th>Received At</th>
          </tr>
        </thead>
        <tbody>
          {data.rawTransactions.map((t: any, i: number) => (
            <tr key={i}>
              <td>{t.transactionId}</td>
              <td>{t.source}</td>
              <td>{t.receivedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

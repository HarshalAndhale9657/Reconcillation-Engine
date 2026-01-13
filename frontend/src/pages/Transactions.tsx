import { useEffect, useState } from 'react';
import { fetchTransactions } from '../api/reconciliation';

export default function Transactions() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchTransactions().then(setData);
  }, []);

  if (!data) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2>Transactions</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((t: any) => (
            <tr key={t.transactionId}>
              <td>{t.transactionId}</td>
              <td>{t.state}</td>
              <td>{t.lastUpdatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

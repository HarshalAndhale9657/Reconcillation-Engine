import { useEffect, useState } from 'react';
import { fetchStats } from '../api/reconciliation';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
  fetchStats()
    .then(setStats)
    .catch((err) => {
      console.error('Failed to load stats', err);
    });
}, []);


  if (!stats) {
    return <p className="loading">Loading dashboard...</p>;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <div className="cards">
        <div className="card info">
          <h3>Total Transactions</h3>
          <p>{stats.totalTransactions}</p>
        </div>

        <div className="card success">
          <h3>Matched</h3>
          <p>{stats.matched}</p>
        </div>

        <div className="card warning">
          <h3>Amount Mismatch</h3>
          <p>{stats.amountMismatch}</p>
        </div>

        <div className="card danger">
          <h3>Status Mismatch</h3>
          <p>{stats.statusMismatch}</p>
        </div>

        <div className="card warning">
          <h3>Timeout</h3>
          <p>{stats.timeout}</p>
        </div>

        <div className="card info">
          <h3>Match Rate</h3>
          <p>{stats.matchRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}

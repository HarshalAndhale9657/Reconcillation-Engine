import { useEffect, useState } from "react";
import { fetchStats } from "../api/reconciliation";

type Stats = {
  totalTransactions: number;
  matched: number;
  amountMismatch: number;
  statusMismatch: number;
  timeout: number;
  incomplete: number;
  totalAlerts: number;
  unresolvedAlerts: number;
  matchRate: number;
};

const initialStats: Stats = {
  totalTransactions: 0,
  matched: 0,
  amountMismatch: 0,
  statusMismatch: 0,
  timeout: 0,
  incomplete: 0,
  totalAlerts: 0,
  unresolvedAlerts: 0,
  matchRate: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchStats();
        setStats({
          ...initialStats,
          ...data,
        });
        setError(null);
      } catch (err) {
        console.error("Failed to load stats:", err);
        setError("Backend not responding. Showing default values.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reconciliation Overview
        </h1>
        <p className="mt-1 text-sm text-muted">
          High-level health of your reconciliation pipeline.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard title="Total Transactions" value={stats.totalTransactions} />
        <StatCard title="Matched" value={stats.matched} />
        <StatCard title="Amount Mismatch" value={stats.amountMismatch} />
        <StatCard title="Status Mismatch" value={stats.statusMismatch} />
        <StatCard title="Timeout" value={stats.timeout} />
        <StatCard title="Incomplete" value={stats.incomplete} />
        <StatCard title="Total Alerts" value={stats.totalAlerts} />
        <StatCard title="Unresolved Alerts" value={stats.unresolvedAlerts} />
        <StatCard
          title="Match Rate"
          value={`${stats.matchRate.toFixed(2)}%`}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </p>
      <p className="mt-2 text-2xl font-semibold text-text">{value}</p>
    </div>
  );
}

import { useEffect, useState, useMemo } from "react";
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

function getMatchRateColor(rate: number) {
  if (rate > 98) return "bg-emerald-100 text-emerald-800";
  if (rate > 90) return "bg-yellow-100 text-yellow-800";
  return "bg-rose-100 text-rose-800";
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchStats();
        if (isMounted) {
          setStats({
            ...initialStats,
            ...data,
          });
          setError(null);
          setLastSync(new Date());
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
        setError("Backend not responding. Showing default values.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  const derived = useMemo(() => {
    const matchRate =
      stats.totalTransactions > 0
        ? ((stats.matched / stats.totalTransactions) * 100)
        : 0;
    return {
      flaggedAlerts: stats.totalAlerts - stats.unresolvedAlerts,
      matchRate: matchRate
    };
  }, [stats]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center my-24">
        <svg className="animate-spin h-8 w-8 text-gray-500 mb-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" fill="none"
          />
          <path
            className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <h3 className="text-lg text-muted">Loading dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Reconciliation Overview
          </h1>
          <p className="mt-1 text-sm text-muted">
            Visual health of your reconciliation pipeline, key metrics and live status.
          </p>
        </div>
        {lastSync && (
          <div className="text-xs text-muted italic flex gap-1 items-center">
            <span className="inline-block animate-pulse h-2 w-2 rounded-full bg-green-300 mr-1" />
            Sync: {lastSync.toLocaleTimeString()}
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8.93 3.412a1 1 0 101.86 0l.77-3.08A1 1 0 009.48 9.51l-.77 3.08zm-.07-7.412a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard title="Total Transactions" value={stats.totalTransactions} />
        <StatCard
          title="Matched"
          value={stats.matched}
          accent={stats.totalTransactions > 0 && stats.matched === stats.totalTransactions ? "success" : undefined}
        />
        <StatCard
          title="Amount Mismatch"
          value={stats.amountMismatch}
          accent={stats.amountMismatch > 0 ? "warning" : undefined}
          tooltip="Transactions whose amount differs between sources."
        />
        <StatCard
          title="Status Mismatch"
          value={stats.statusMismatch}
          accent={stats.statusMismatch > 0 ? "warning" : undefined}
          tooltip="Transactions with mismatched states (e.g. APP says 'paid', BANK says 'pending')."
        />
        <StatCard
          title="Timeout"
          value={stats.timeout}
          accent={stats.timeout > 0 ? "danger" : undefined}
          tooltip="Matches exceeded expected reconciliation time."
        />
        <StatCard
          title="Incomplete"
          value={stats.incomplete}
          accent={stats.incomplete > 0 ? "warning" : undefined}
        />
        <StatCard
          title="Total Alerts"
          value={stats.totalAlerts}
          accent={stats.totalAlerts > 0 ? "danger" : undefined}
        />
        <StatCard
          title="Unresolved Alerts"
          value={stats.unresolvedAlerts}
          accent={stats.unresolvedAlerts > 0 ? "danger" : undefined}
        />
        <StatCard
          title="Flagged Alerts"
          value={derived.flaggedAlerts}
          accent={derived.flaggedAlerts > 0 ? "info" : undefined}
          tooltip="Alerts automatically marked as resolved by later data."
        />
        <StatCard
          title="Match Rate"
          value={<span className={`px-2 py-0.5 rounded ${getMatchRateColor(derived.matchRate)}`}>{derived.matchRate.toFixed(2)}%</span>}
          tooltip="Percentage of transactions that matched across all sources."
        />
      </div>

      <div className="mt-5 text-xs text-muted flex gap-2 items-center">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4a9 9 0 11 -8-4 9 9 0 018 4zm-1-4V7a1 1 0 10-2 0v5" />
        </svg>
        Metrics auto-refresh every 10 seconds.
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number | string | JSX.Element;
  accent?: "success" | "warning" | "danger" | "info";
  tooltip?: string;
};

function StatCard({ title, value, accent, tooltip }: StatCardProps) {
  let accentClass = "";
  if (accent === "success") accentClass = "bg-emerald-50 border-emerald-200";
  if (accent === "warning") accentClass = "bg-yellow-50 border-yellow-200";
  if (accent === "danger") accentClass = "bg-rose-50 border-rose-200";
  if (accent === "info") accentClass = "bg-blue-50 border-blue-200";

  return (
    <div className={`rounded-xl bg-card p-4 shadow-soft border transition ${accentClass}`} title={tooltip}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted flex items-center gap-1">
        {title}
        {tooltip && (
          <span tabIndex={0} className="cursor-pointer ml-1 text-blue-400" aria-label="Info">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 7h2v2H9V7zm1-4a8 8 0 110 16 8 8 0 010-16zm0 14a6 6 0 100-12 6 6 0 000 12zm0-4a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </span>
        )}
      </p>
      <p className="mt-2 text-2xl font-semibold text-text break-all">{value}</p>
    </div>
  );
}

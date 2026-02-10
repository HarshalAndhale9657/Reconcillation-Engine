import { useEffect, useState } from "react";
import { fetchAlerts } from "../api/reconciliation";
import { DataTable, Badge } from "../components/Table";

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchAlerts();
        setAlerts(res?.alerts ?? []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No alerts available yet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <h3>Loading alerts...</h3>;

  if (error)
    return (
      <p className="mt-4 text-sm text-muted">
        {error}
      </p>
    );

  if (alerts.length === 0)
    return <p className="mt-4 text-sm text-muted">No alerts generated.</p>;

  return (
    <DataTable
      title="Alerts"
      description="Reconciliation issues that require your attention."
      columns={[
        {
          header: "Transaction ID",
          accessor: (a: any) => a.transactionId,
        },
        {
          header: "Severity",
          accessor: (a: any) => (
            <Badge
              tone={
                a.severity === "HIGH"
                  ? "danger"
                  : a.severity === "MEDIUM"
                  ? "warning"
                  : "neutral"
              }
            >
              {a.severity}
            </Badge>
          ),
        },
        {
          header: "Resolved",
          accessor: (a: any) => (
            <Badge tone={a.resolved ? "success" : "warning"}>
              {a.resolved ? "Yes" : "No"}
            </Badge>
          ),
        },
      ]}
      data={alerts}
    />
  );
}

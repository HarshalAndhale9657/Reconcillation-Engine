import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/reconciliation";
import { DataTable, Badge } from "../components/Table";

export default function Transactions() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchTransactions();
        setData(res?.transactions ?? []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No transaction data available yet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <h3>Loading transactions...</h3>;

  if (error)
    return (
      <p className="mt-4 text-sm text-muted">
        {error}
      </p>
    );

  if (data.length === 0)
    return <p className="mt-4 text-sm text-muted">No transactions found.</p>;

  return (
    <DataTable
      title="Transactions"
      description="Overview of reconciliation state for each transaction."
      columns={[
        {
          header: "ID",
          accessor: (t: any) => t.transactionId,
        },
        {
          header: "Status",
          accessor: (t: any) => (
            <Badge
              tone={
                t.state === "MATCHED"
                  ? "success"
                  : t.state === "TIMEOUT_MISSING"
                  ? "warning"
                  : t.state === "INCOMPLETE"
                  ? "neutral"
                  : "danger"
              }
            >
              {t.state}
            </Badge>
          ),
        },
        {
          header: "Last Updated",
          accessor: (t: any) => t.lastUpdatedAt,
        },
      ]}
      data={data}
    />
  );
}

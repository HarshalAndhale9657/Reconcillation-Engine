import { useEffect, useState } from "react";
import { fetchRawTransactions } from "../api/reconciliation";
import { DataTable } from "../components/Table";

export default function RawTransactions() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchRawTransactions();
        setRows(res?.rawTransactions ?? []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No raw events received yet.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <h3>Loading raw transactions...</h3>;

  if (error)
    return (
      <p className="mt-4 text-sm text-muted">
        {error}
      </p>
    );

  if (rows.length === 0)
    return (
      <p className="mt-4 text-sm text-muted">No raw transactions available.</p>
    );

  return (
    <DataTable
      title="Raw Transactions"
      description="Low-level events as they arrive from each source."
      columns={[
        {
          header: "Transaction ID",
          accessor: (r: any) => r.transactionId,
        },
        {
          header: "Source",
          accessor: (r: any) => r.source,
        },
        {
          header: "Received At",
          accessor: (r: any) => r.receivedAt,
        },
      ]}
      data={rows}
    />
  );
}

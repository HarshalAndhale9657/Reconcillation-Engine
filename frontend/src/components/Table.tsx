import { ReactNode } from "react";

type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
};

type TableProps<T> = {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
};

export function DataTable<T>({
  title,
  description,
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-border hover:bg-slate-50/80"
              >
                {columns.map((col) => (
                  <td key={col.header} className="px-4 py-3 align-middle">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type BadgeProps = {
  tone?: "success" | "warning" | "danger" | "neutral";
  children: ReactNode;
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-800"
      : tone === "danger"
      ? "bg-rose-50 text-rose-700"
      : "bg-slate-100 text-slate-700";

  return <span className={`${base} ${toneClass}`}>{children}</span>;
}


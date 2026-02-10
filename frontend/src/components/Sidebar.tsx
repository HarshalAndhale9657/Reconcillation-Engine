type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const navItems: { id: string; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "alerts", label: "Alerts" },
  { id: "raw", label: "Raw Events" },
  { id: "ingestion", label: "Ingestion" },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex flex-col w-60 bg-slate-950 text-slate-100 border-r border-border">
      <div className="px-5 py-5 border-b border-slate-800">
        <h1 className="text-base font-semibold tracking-tight">
          Reconciliation Engine
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Monitor, compare, and resolve transactions.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePage === item.id
                ? "bg-primary text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

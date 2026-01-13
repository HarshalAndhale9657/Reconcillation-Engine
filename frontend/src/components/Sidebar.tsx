interface SidebarProps {
  onNavigate: (page: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <h2>Recon Engine</h2>

      <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
      <button onClick={() => onNavigate('transactions')}>Transactions</button>
      <button onClick={() => onNavigate('alerts')}>Alerts</button>
      <button onClick={() => onNavigate('raw')}>Raw Events</button>
      <button onClick={() => onNavigate('ingestion')}>Ingestion</button>
    </nav>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Home' },
  { id: 'log', icon: '✏️', label: 'Log' },
  { id: 'friend', icon: '👥', label: 'Friend' },
  { id: 'history', icon: '📊', label: 'History' },
];

export default function NavBar({ tab, setTab }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${tab === item.id ? 'active' : ''}`}
          onClick={() => setTab(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

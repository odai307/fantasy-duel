import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/duels', label: 'Duels', icon: 'sports_kabaddi' },
  { to: '/pools', label: 'Pools', icon: 'sports_score' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'emoji_events' },
  { to: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  { to: '/profile', label: 'Profile', icon: 'person' },
];

export default function Sidebar({
  breakpoint = 'lg',
  topOffsetClass = 'top-0',
  ctaLabel = 'Create Duel',
  ctaTo = '/duels/create',
}) {
  const { user, logout } = useAuth();
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Manager';

  return (
    <aside
      className={`h-screen w-64 hidden ${breakpoint}:flex flex-col border-r border-outline-variant/30 bg-surface py-8 px-4 gap-4 fixed left-0 ${topOffsetClass} z-50`}
    >
      <div className="mb-6 px-2">
        <h1 className="text-xl font-black text-primary tracking-widest font-headline">FantasyDuel GH</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mt-1">
          Premier League 2026/27
        </p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-headline ${
                isActive
                  ? 'text-primary bg-primary/5 border-l-2 border-primary font-semibold'
                  : 'text-on-surface/60 hover:text-on-surface hover:bg-surface-container font-medium'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          to={ctaTo}
          className="block w-full text-center gold-gradient text-on-primary font-headline font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all uppercase tracking-tight text-xs"
        >
          {ctaLabel}
        </Link>

        {/* User Card & Logout Button */}
        {user ? (
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center justify-between">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-on-surface truncate">{userName}</div>
                <div className="text-[10px] text-on-surface-variant truncate">{user.email}</div>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

import { Link, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/join-duel', label: 'Duels', icon: 'sports_kabaddi' },
  { to: '/pools-list', label: 'Pools', icon: 'sports_score' },
  { to: '/leaderboard', label: 'Leaderboard', icon: 'emoji_events' },
  { to: '/wallet', label: 'Wallet', icon: 'account_balance_wallet' },
];

export default function Sidebar({
  breakpoint = 'lg',
  topOffsetClass = 'top-0',
  ctaLabel = 'Create Duel',
  ctaTo = '/create-duel',
}) {
  return (
    <aside
      className={`h-screen w-64 hidden ${breakpoint}:flex flex-col border-r border-outline-variant/30 bg-surface py-8 px-4 gap-4 fixed left-0 ${topOffsetClass} z-50`}
    >
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-primary tracking-widest font-headline">FantasyDuel GH</h1>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mt-1">
          Premier League Season 24/25
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

      <div className="mt-auto">
        <Link
          to={ctaTo}
          className="block w-full text-center gold-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all uppercase tracking-tight"
        >
          {ctaLabel}
        </Link>
      </div>
    </aside>
  );
}

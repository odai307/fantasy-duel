import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getLeaderboard } from '../leaderboardApi';

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Unknown';
}

function initials(user) {
  const first = user?.firstName?.[0] || '';
  const last = user?.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || '?';
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState('all_time');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 30, total: 0, totalPages: 1 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');

      try {
        const data = await getLeaderboard({ period, page: 1, limit: 30 });
        setRows(data?.leaderboard || []);
        setPagination(data?.pagination || { page: 1, limit: 30, total: 0, totalPages: 1 });
      } catch (loadError) {
        setError(loadError.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [period]);

  const topThree = useMemo(() => rows.slice(0, 3), [rows]);

  return (
    <div className="page-leaderboard bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 glass-dark border-b border-outline-variant/30 flex justify-between items-center px-6 h-16 shadow-lg">
        <span className="text-2xl font-black italic text-primary font-headline uppercase tracking-tighter">FantasyDuel GH</span>
        <div className="text-on-surface-variant text-xs uppercase tracking-widest">Global Leaderboard</div>
      </header>

      <div className="flex pt-16 min-h-screen">
        <Sidebar />

        <main className="flex-1 lg:ml-64 p-8 lg:p-16 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-12 bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Hall of Fame</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-headline uppercase tracking-tighter text-on-surface leading-none">
                Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff9d00] italic">Rankings</span>
              </h1>
              <p className="text-on-surface-variant max-w-lg font-medium">Live standings from real user performance.</p>
            </div>

            <div className="bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30 flex shadow-inner">
              <button
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${period === 'this_week' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setPeriod('this_week')}
                type="button"
              >
                This Week
              </button>
              <button
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${period === 'all_time' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setPeriod('all_time')}
                type="button"
              >
                All Time
              </button>
            </div>
          </div>

          {loading ? <p className="text-on-surface-variant mb-6">Loading leaderboard...</p> : null}
          {error ? <p className="text-error mb-6">{error}</p> : null}

          {!loading && !error && topThree.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {topThree.map((row) => (
                <div className="obsidian-gradient rounded-2xl p-6 border border-outline-variant/20" key={row.user.id}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-headline font-black text-primary">#{String(row.rank).padStart(2, '0')}</span>
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant">{period === 'this_week' ? 'Weekly' : 'Overall'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center font-black text-primary">
                      {initials(row.user)}
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-black text-on-surface">{fullName(row.user)}</h3>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest">Duels: {row.duelsPlayed} • Pools: {row.poolsJoined}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-on-surface-variant">
                    <p>Total Points: <span className="text-primary font-black">{row.totalPoints}</span></p>
                    <p>GW Points: <span className="text-secondary font-black">{row.gameweekPoints}</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-outline-variant/30">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Rank</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Manager</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Total Points</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">GW Points</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Duels Played</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Pools Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {!loading && !error && rows.length === 0 ? (
                    <tr>
                      <td className="px-8 py-8 text-on-surface-variant" colSpan={6}>No leaderboard entries yet.</td>
                    </tr>
                  ) : null}
                  {rows.map((row) => (
                    <tr className="group hover:bg-white/[0.03] transition-all" key={row.user.id}>
                      <td className="px-8 py-6 text-xl font-headline font-black text-on-surface-variant/60">{String(row.rank).padStart(2, '0')}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-lg bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center font-black text-primary">{initials(row.user)}</div>
                          <div>
                            <p className="font-black text-on-surface">{fullName(row.user)}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Manager</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-primary">{row.totalPoints}</td>
                      <td className="px-8 py-6 text-right font-black text-secondary">{row.gameweekPoints}</td>
                      <td className="px-8 py-6 text-right font-black text-on-surface">{row.duelsPlayed}</td>
                      <td className="px-8 py-6 text-right font-black text-on-surface">{row.poolsJoined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-5 border-t border-outline-variant/20 text-xs uppercase tracking-widest text-on-surface-variant">
              Showing {rows.length} of {pagination.total} managers
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

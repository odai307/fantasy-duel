import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FplSetupModal from '../components/FplSetupModal';
import { useAuth } from '../context/AuthContext';
import { listDuels } from '../api/duelApi';
import { listPools } from '../api/poolApi';
import { getLeaderboard } from '../api/leaderboardApi';
import { getCurrentGameweek, getMyTeamScore, getUpcomingFixtures } from '../api/fplApi';

function formatMoney(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Unknown';
}

function managerName(user) {
  return user?.fplManagerName || fullName(user);
}

function formatKickoff(iso) {
  if (!iso) return 'TBD';
  const date = new Date(iso);
  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function teamBadgeUrl(teamCode) {
  const safeCode = Number(teamCode);
  if (!Number.isInteger(safeCode) || safeCode <= 0) return '';
  return `https://resources.premierleague.com/premierleague/badges/50/t${safeCode}.png`;
}

function duelStatusTone(status) {
  if (status === 'OPEN') return 'text-secondary';
  if (status === 'LOCKED') return 'text-primary';
  if (status === 'CLOSED') return 'text-on-surface-variant';
  return 'text-on-surface-variant';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, refreshMe } = useAuth();

  const [showFplModal, setShowFplModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentGw, setCurrentGw] = useState(null);
  const [myScore, setMyScore] = useState(null);
  const [duels, setDuels] = useState([]);
  const [pools, setPools] = useState([]);
  const [topRanked, setTopRanked] = useState([]);
  const [fixturesPayload, setFixturesPayload] = useState({ eventName: '', live: [], upcoming: [] });

  useEffect(() => {
    if (user && !user.fplTeamId) {
      const timer = setTimeout(() => setShowFplModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    const handleShowFplModal = () => setShowFplModal(true);
    window.addEventListener('show-fpl-modal', handleShowFplModal);
    return () => window.removeEventListener('show-fpl-modal', handleShowFplModal);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const gw = await getCurrentGameweek();
        if (!active) return;
        setCurrentGw(Number(gw));

        const [duelsData, poolsData, leaderboardData, fixturesData] = await Promise.all([
          listDuels({ status: 'all', page: 1, limit: 12 }),
          listPools({ filter: 'joined_by_me', page: 1, limit: 6 }),
          getLeaderboard({ period: 'all_time', page: 1, limit: 5 }),
          getUpcomingFixtures({ limit: 8 }),
        ]);

        if (!active) return;

        const activeDuels = (duelsData?.duels || []).filter((duel) => duel.status !== 'CLOSED' && duel.status !== 'CANCELLED');
        setDuels(activeDuels);
        setPools(poolsData?.pools || []);
        setTopRanked(leaderboardData?.leaderboard || []);
        setFixturesPayload(fixturesData || { eventName: '', live: [], upcoming: [] });

        if (user?.fplTeamId) {
          try {
            const scoreData = await getMyTeamScore(Number(gw));
            if (!active) return;
            setMyScore(scoreData);
          } catch {
            if (!active) return;
            setMyScore(null);
          }
        } else {
          setMyScore(null);
        }
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || 'Failed to load dashboard data');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [user?.fplTeamId]);

  const totalEntry = useMemo(
    () => duels.reduce((sum, duel) => sum + Number(duel.entryFee || 0), 0),
    [duels],
  );

  const joinedPoolsCount = pools.length;
  const liveFixtures = fixturesPayload?.live || [];
  const upcomingFixtures = fixturesPayload?.upcoming || [];

  return (
    <div className="page-dashboard bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 lg:ml-64 min-h-screen pb-20 lg:pb-8">
          <header className="fixed top-0 lg:left-64 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center px-8 h-16">
            <div className="flex items-center gap-4">
              <h2 className="font-headline uppercase tracking-tighter text-primary font-black italic text-2xl">Dashboard</h2>
            </div>
            <div className="hidden md:flex gap-8 items-center">
              <span className="text-primary font-bold border-b-2 border-primary pb-1 font-headline uppercase text-xs tracking-[0.2em]">Overview</span>
              <span className="text-on-surface-variant font-headline uppercase text-xs tracking-[0.2em]">Insights</span>
              <span className="text-on-surface-variant font-headline uppercase text-xs tracking-[0.2em]">History</span>
            </div>
          </header>

          <div className="pt-24 px-8 max-w-7xl mx-auto space-y-8">
            {loading ? <p className="text-on-surface-variant">Loading dashboard...</p> : null}
            {error ? <p className="text-error">{error}</p> : null}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 obsidian-panel rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
                <div className="relative z-10">
                  <p className="text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold mb-4 flex items-center gap-2">
                    Active Duel Entry
                    <span className="h-[1px] w-12 bg-outline-variant" />
                  </p>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-primary font-headline text-2xl font-bold opacity-80 italic">GHS</span>
                        <span className="text-on-surface font-headline text-6xl font-black tracking-tighter gold-glow-text">{Number(totalEntry || 0).toFixed(2)}</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-secondary bg-secondary/10 px-3 py-1 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm">sports_kabaddi</span>
                        <span className="text-xs font-bold uppercase tracking-widest">{duels.length} Active Duels</span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none gold-gradient text-on-primary px-8 py-3.5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/duels/create')} type="button">
                        Create Duel
                      </button>
                      <button className="flex-1 md:flex-none bg-surface-container-highest border border-outline-variant text-on-surface px-8 py-3.5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs" onClick={() => navigate('/duels')} type="button">
                        Join Duel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 obsidian-panel rounded-2xl p-8 flex flex-col justify-between border-l-4 border-l-secondary relative">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold">FPL Score</p>
                  <div className="bg-secondary/20 text-secondary text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-secondary/30">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    {currentGw ? `LIVE GW${currentGw}` : 'LIVE'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-headline text-7xl font-black text-on-surface tracking-tighter">{Number(myScore?.gameweekPoints || 0)}</span>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-[10px] uppercase font-bold mb-1 opacity-60">Joined Pools</p>
                    <p className="font-headline text-2xl font-bold text-secondary">{joinedPoolsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-4">
                <div className="flex justify-between items-end mb-2 px-1">
                  <h3 className="font-headline text-2xl font-black uppercase tracking-tighter italic">Active Duels</h3>
                  <Link className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity border-b border-primary/30 pb-0.5" to="/duels">View All History</Link>
                </div>

                {duels.length === 0 ? (
                  <div className="obsidian-panel rounded-xl p-6 text-on-surface-variant">No active duels right now.</div>
                ) : null}

                {duels.slice(0, 3).map((duel) => (
                  <button className="w-full text-left obsidian-panel rounded-xl p-6 hover:bg-surface-container-high/50 transition-all group" key={duel.id} onClick={() => navigate(`/duels/${duel.id}`)} type="button">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/20 transition-colors">
                          <span className="material-symbols-outlined text-primary">sports_kabaddi</span>
                        </div>
                        <div>
                          <p className="font-headline font-bold text-on-surface uppercase text-sm tracking-tight">Head-to-Head Duel</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">GW {duel.gameweek}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-60">Entry</p>
                        <p className="font-headline font-black text-primary text-xl tracking-tight">{formatMoney(duel.entryFee)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 items-center">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">{managerName(duel.createdBy)} {duel.isCreator ? <span className="text-[10px] text-primary">(You)</span> : null}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">Creator</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-tight">{duel.opponent ? managerName(duel.opponent) : 'Awaiting Opponent'}</p>
                        <p className={`text-[10px] uppercase tracking-widest mt-2 font-bold ${duelStatusTone(duel.status)}`}>{duel.status}</p>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="obsidian-panel rounded-xl p-6 hover:bg-surface-container-high/50 transition-all border-l-4 border-l-primary/40">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                        <span className="material-symbols-outlined text-primary">groups</span>
                      </div>
                      <div>
                        <p className="font-headline font-bold text-on-surface uppercase text-sm tracking-tight">My Pools</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">Joined Leagues</p>
                      </div>
                    </div>
                    <Link className="text-primary text-[10px] font-black uppercase tracking-[0.2em] border-b border-primary/30 pb-0.5" to="/pools">View Pools</Link>
                  </div>

                  {pools.length === 0 ? <p className="text-on-surface-variant text-sm">You have not joined any pools yet.</p> : null}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pools.slice(0, 4).map((pool) => (
                      <button className="bg-surface-container-highest/50 p-4 rounded-xl border border-outline-variant/10 text-left" key={pool.id} onClick={() => navigate(`/pools/${pool.id}`)} type="button">
                        <p className="text-xs font-bold uppercase tracking-tight">{pool.name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">GW {pool.gameweek} • {pool.visibility}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="obsidian-panel rounded-xl p-6">
                  <h4 className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-2">
                    Live
                    <span className="h-[1px] flex-1 bg-outline-variant" />
                  </h4>

                  {liveFixtures.length === 0 ? <p className="text-on-surface-variant text-sm mb-4">No live fixtures right now.</p> : null}

                  <div className="space-y-3">
                    {liveFixtures.slice(0, 3).map((fixture) => (
                      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10" key={fixture.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img alt={fixture.homeTeam?.name || 'Home team'} className="w-6 h-6" src={teamBadgeUrl(fixture.homeTeam?.code)} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{fixture.homeTeam?.shortName || 'HOME'}</span>
                          </div>
                          <span className="text-[10px] text-secondary font-black uppercase tracking-widest">LIVE</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">{fixture.awayTeam?.shortName || 'AWAY'}</span>
                            <img alt={fixture.awayTeam?.name || 'Away team'} className="w-6 h-6" src={teamBadgeUrl(fixture.awayTeam?.code)} />
                          </div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-2">{formatKickoff(fixture.kickoffTime)}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="font-headline font-black uppercase text-xs tracking-[0.3em] mt-6 mb-4 flex items-center gap-2">
                    Upcoming {fixturesPayload?.eventName ? `• ${fixturesPayload.eventName}` : ''}
                    <span className="h-[1px] flex-1 bg-outline-variant" />
                  </h4>

                  {upcomingFixtures.length === 0 ? <p className="text-on-surface-variant text-sm">No upcoming fixtures found.</p> : null}

                  <div className="space-y-3">
                    {upcomingFixtures.slice(0, 4).map((fixture) => (
                      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10" key={fixture.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img alt={fixture.homeTeam?.name || 'Home team'} className="w-6 h-6" src={teamBadgeUrl(fixture.homeTeam?.code)} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{fixture.homeTeam?.shortName || 'HOME'}</span>
                          </div>
                          <span className="text-xs text-primary font-black italic border-y border-primary/20 py-0.5 px-2">VS</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest">{fixture.awayTeam?.shortName || 'AWAY'}</span>
                            <img alt={fixture.awayTeam?.name || 'Away team'} className="w-6 h-6" src={teamBadgeUrl(fixture.awayTeam?.code)} />
                          </div>
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-2">{formatKickoff(fixture.kickoffTime)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="obsidian-panel rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
                    <span className="material-symbols-outlined text-[140px]">emoji_events</span>
                  </div>
                  <h4 className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-2">
                    Top Ranked
                    <span className="h-[1px] flex-1 bg-outline-variant" />
                  </h4>
                  <div className="space-y-4 relative z-10">
                    {topRanked.slice(0, 5).map((row) => (
                      <div className="flex items-center justify-between" key={row.user.id}>
                        <div className="flex items-center gap-3">
                          <span className="font-headline font-black text-primary w-6 italic">{String(row.rank).padStart(2, '0')}</span>
                          <span className="text-xs font-bold uppercase tracking-tight">{row.user?.fplManagerName || fullName(row.user)}</span>
                        </div>
                        <span className="font-headline font-bold text-secondary text-xs">{row.totalPoints} PTS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <FplSetupModal
        isOpen={showFplModal}
        onClose={() => setShowFplModal(false)}
        onSuccess={() => refreshMe()}
      />
    </div>
  );
}

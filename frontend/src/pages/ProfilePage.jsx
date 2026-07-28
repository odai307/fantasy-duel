import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { listDuels } from '../api/duelApi';
import { listPools } from '../api/poolApi';
import { getCurrentGameweek, getMyTeamScore, syncMyFplScores } from '../api/fplApi';
import { updateUserProfile } from '../api/authApi';

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Unknown Manager';
}

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} GHS`;
}

function resultLabel(duel, isCreator) {
  if (duel.status !== 'CLOSED') return 'PENDING';
  if (duel.result === 'DRAW') return 'DRAW';
  if (duel.result === 'CREATOR_WIN') return isCreator ? 'W' : 'L';
  if (duel.result === 'OPPONENT_WIN') return isCreator ? 'L' : 'W';
  return 'PENDING';
}

function resultTone(result) {
  if (result === 'W') return 'text-secondary border-secondary';
  if (result === 'L') return 'text-error border-error';
  return 'text-on-surface-variant border-outline-variant/30';
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const accountName = fullName(user);
  const firstName = user?.firstName || 'Not set';
  const lastName = user?.lastName || 'Not set';
  const email = user?.email || 'No email provided';
  const fplTeamId = user?.fplTeamId ? `#${user.fplTeamId}` : 'Not set';
  const fplTeamName = user?.fplTeamName || 'Not set';
  const fplManagerName = user?.fplManagerName || 'Not set';

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [currentGw, setCurrentGw] = useState(null);
  const [myGwScore, setMyGwScore] = useState(0);
  const [duels, setDuels] = useState([]);
  const [joinedPoolsCount, setJoinedPoolsCount] = useState(0);

  // Edit Name Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfileData() {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError('');

      try {
        const [duelsData, poolsData, gw] = await Promise.all([
          listDuels({ status: 'all', page: 1, limit: 100 }),
          listPools({ filter: 'joined_by_me', page: 1, limit: 1 }),
          getCurrentGameweek(),
        ]);

        if (!active) return;

        setDuels(duelsData?.duels || []);
        setJoinedPoolsCount(Number(poolsData?.pagination?.total || 0));
        setCurrentGw(Number(gw));

        if (user?.fplTeamId) {
          try {
            const scoreData = await getMyTeamScore(Number(gw));
            if (!active) return;
            setMyGwScore(Number(scoreData?.gameweekPoints || 0));
          } catch {
            if (!active) return;
            setMyGwScore(0);
          }
        } else {
          setMyGwScore(0);
        }
      } catch (error) {
        if (!active) return;
        setLoadError(error.message || 'Failed to load profile data');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfileData();
    return () => {
      active = false;
    };
  }, [user?.id, user?.fplTeamId]);

  const totalDuels = duels.length;
  const closedDuels = useMemo(() => duels.filter((duel) => duel.status === 'CLOSED'), [duels]);
  const wins = useMemo(() => closedDuels.filter((duel) => resultLabel(duel, Boolean(duel.isCreator)) === 'W').length, [closedDuels]);
  const winRate = closedDuels.length > 0 ? ((wins / closedDuels.length) * 100).toFixed(1) : '0.0';

  const recentDuels = useMemo(() => duels.slice(0, 5), [duels]);

  const handleSyncFpl = async () => {
    if (!user?.fplTeamId) {
      setSyncMessage('No FPL Team ID set. Please connect your FPL team first.');
      return;
    }

    setSyncLoading(true);
    setSyncMessage('');
    try {
      const result = await syncMyFplScores();
      setSyncMessage(result.message || 'FPL scores synced successfully!');
    } catch (error) {
      setSyncMessage(error.message || 'Failed to sync FPL scores.');
    } finally {
      setSyncLoading(false);
    }
  };

  const openEditModal = () => {
    setEditFirstName(user?.firstName || '');
    setEditLastName(user?.lastName || '');
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    if (!editFirstName.trim() || !editLastName.trim()) {
      setEditError('First name and Last name are required');
      setEditLoading(false);
      return;
    }

    try {
      await updateUserProfile({
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
      });
      await refreshUser();
      setIsEditModalOpen(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="page-profile bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-grow lg:ml-64 min-h-screen pb-20 lg:pb-8">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full border-b border-white/5">
            <div className="flex items-center gap-6">
              <h2 className="font-headline font-black italic text-2xl text-primary uppercase tracking-tighter">My Account</h2>
              <div className="hidden md:flex items-center gap-6">
                <span className="text-primary font-bold border-b-2 border-primary pb-1 font-headline uppercase text-xs tracking-[0.2em]">Overview</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-1.5 rounded-full border border-outline-variant/10">
                <span className="text-primary font-bold font-headline tracking-tight text-sm">{Number(user?.walletBalance || 0).toFixed(2)} GHS</span>
                <span className="material-symbols-outlined text-primary text-xs">account_balance_wallet</span>
              </div>
              <Link className="text-on-surface-variant hover:text-primary text-sm" to="/wallet">Wallet</Link>
            </div>
          </header>

          <div className="mt-24 px-8 max-w-6xl mx-auto space-y-8">
            {loading ? <p className="text-on-surface-variant mb-6">Loading profile...</p> : null}
            {loadError ? <p className="text-error mb-6">{loadError}</p> : null}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 obsidian-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-primary/10">
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-primary/5 blur-[110px] rounded-full" />
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/20 p-1 bg-[#131313]">
                    <div className="w-full h-full rounded-xl bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary">person</span>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left flex-grow relative z-10">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl font-black font-headline tracking-tight text-white uppercase">{accountName}</h1>
                    <button
                      onClick={openEditModal}
                      className="p-1.5 rounded-lg bg-surface-container-high border border-outline-variant/20 text-primary hover:bg-primary/10 transition-colors"
                      title="Edit Name"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <p className="text-white/40 font-medium flex items-center justify-center md:justify-start gap-2 mt-2 mb-4 text-sm">
                    <span className="material-symbols-outlined text-xs">mail</span>
                    {email}
                  </p>
                  {syncMessage ? <p className="text-sm mb-4 text-secondary bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2 inline-block">{syncMessage}</p> : null}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      className="bg-secondary text-on-secondary px-5 py-2 rounded-lg text-xs font-bold font-headline flex items-center gap-2 hover:bg-secondary-fixed transition-colors disabled:opacity-50"
                      disabled={syncLoading}
                      onClick={handleSyncFpl}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">sync</span>
                      {syncLoading ? 'Syncing...' : 'Sync FPL Scores'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="gold-gradient-bg rounded-2xl p-8 flex flex-col justify-between shadow-[0_18px_40px_rgba(243,190,77,0.2)]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-primary/60 mb-1">Current GW Score</p>
                  <h3 className="text-4xl font-black font-headline text-on-primary tracking-tighter">{myGwScore}</h3>
                  <p className="text-[10px] text-on-primary/70 uppercase tracking-widest mt-2">{currentGw ? `Live GW${currentGw}` : 'Live GW'}</p>
                </div>
                <p className="text-[10px] text-center font-bold text-on-primary/60 mt-6 italic">FPL team: {fplTeamName}</p>
              </div>
            </div>

            {/* Split First Name and Last Name Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="obsidian-card p-6 rounded-2xl border border-outline-variant/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">First Name</p>
                <p className="text-lg font-black font-headline text-white tracking-tight">{firstName}</p>
              </div>
              <div className="obsidian-card p-6 rounded-2xl border border-outline-variant/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Last Name</p>
                <p className="text-lg font-black font-headline text-white tracking-tight">{lastName}</p>
              </div>
              <div className="obsidian-card p-6 rounded-2xl border border-outline-variant/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">FPL Team</p>
                <p className="text-lg font-black font-headline text-white tracking-tight">{fplTeamName}</p>
                <p className="text-xs text-white/60 mt-1">{fplTeamId}</p>
              </div>
              <div className="obsidian-card p-6 rounded-2xl border border-outline-variant/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Total Duels</p>
                <p className="text-2xl font-black font-headline text-white tracking-tight">{totalDuels}</p>
              </div>
            </div>

            {/* Recent Duels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline font-black text-lg flex items-center gap-3 tracking-wider text-white">
                    <span className="w-1 h-6 bg-primary rounded-full" />RECENT DUEL HISTORY
                  </h2>
                  <Link className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest border-b border-primary/30 pb-0.5" to="/duels">View All</Link>
                </div>

                <div className="space-y-3">
                  {recentDuels.length === 0 ? (
                    <div className="obsidian-card rounded-xl p-5 text-on-surface-variant">No duels yet.</div>
                  ) : null}

                  {recentDuels.map((duel) => {
                    const result = resultLabel(duel, Boolean(duel.isCreator));
                    const isCreator = Boolean(duel.isCreator);
                    const meScore = isCreator ? duel.createdByScore : duel.opponentScore;
                    const oppScore = isCreator ? duel.opponentScore : duel.createdByScore;

                    return (
                      <Link className={`obsidian-card rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group border-l-[3px] ${resultTone(result)}`} key={duel.id} to={`/duels/${duel.id}`}>
                        <div className="flex items-center gap-6">
                          <div className="bg-[#131313] w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-white/5">
                            <p className="text-[9px] font-bold text-white/40 uppercase">GW {duel.gameweek}</p>
                            <p className="font-black text-base">{result}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm mb-0.5 tracking-wide">VS. {isCreator ? fullName(duel.opponent) : fullName(duel.createdBy)}</h4>
                            <p className="text-[11px] text-white/40">Head-to-Head Duel • {formatMoney(duel.entryFee)} Entry</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{meScore ?? '-'} vs {oppScore ?? '-'} pts</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Edit Name Modal */}
      {isEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface">Edit Profile Name</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {editError ? (
                <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs">
                  {editError}
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 mt-2"
              >
                {editLoading ? 'Saving...' : 'Save Name Changes'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useDuelsLobby } from '../hooks/useDuelsLobby';

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Waiting for opponent';
}

function formatMoney(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function filterLabel(status) {
  if (status === 'all') return 'All';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DuelsPage() {
  const navigate = useNavigate();
  const {
    status,
    setStatus,
    duels,
    loading,
    error,
    inviteCode,
    setInviteCode,
    joinLoading,
    joinError,
    handleJoinByCode,
    totalStaked,
  } = useDuelsLobby({ navigate });

  return (
    <div className="page-join-duel bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar ctaLabel="Create Duel" ctaTo="/create-duel" />

        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20 lg:pb-8">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-8 h-20 border-b border-white/5">
            <h2 className="text-on-surface/80 font-headline font-bold uppercase tracking-widest text-xs">Duels Lobby</h2>
            <Link className="bg-primary text-on-primary font-headline font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest" to="/create-duel">
              Create Duel
            </Link>
          </header>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-28">
            <section className="relative bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 md:p-10 overflow-hidden mb-10">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
                <div>
                  <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tight uppercase mb-3">Join Private Duel</h1>
                  <p className="text-on-surface-variant">Enter the secure duel code from your opponent and step into the arena.</p>
                </div>
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleJoinByCode}>
                  <input
                    className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 uppercase"
                    maxLength={24}
                    onChange={(event) => setInviteCode(event.target.value)}
                    placeholder="Enter duel code"
                    type="text"
                    value={inviteCode}
                  />
                  <button
                    className="gold-glow-button text-on-primary font-headline font-bold px-6 py-3 rounded-lg uppercase text-xs tracking-widest disabled:opacity-60"
                    disabled={joinLoading}
                    type="submit"
                  >
                    {joinLoading ? 'Joining...' : 'Enter Arena'}
                  </button>
                </form>
              </div>
              {joinError ? <p className="relative z-10 text-error text-sm mt-3">{joinError}</p> : null}
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant/15">
                {['all', 'open', 'locked', 'closed', 'cancelled'].map((value) => (
                  <button
                    className={`px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-widest ${status === value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                    key={value}
                    onClick={() => setStatus(value)}
                    type="button"
                  >
                    {filterLabel(value)}
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-widest text-on-surface-variant flex items-center gap-4">
                <span>Duels: <span className="text-primary font-black">{duels.length}</span></span>
                <span className="w-px h-4 bg-outline-variant/40" />
                <span>Staked: <span className="text-secondary font-black">{formatMoney(totalStaked)}</span></span>
              </div>
            </div>

            {loading ? <p className="text-on-surface-variant mb-6">Loading duels...</p> : null}
            {error ? <p className="text-error mb-6">{error}</p> : null}
            {!loading && !error && duels.length === 0 ? <p className="text-on-surface-variant">No duels found for {filterLabel(status)}.</p> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {duels.map((duel) => (
                <article
                  className="bg-surface-container-high rounded-xl border border-outline-variant/15 p-6 cursor-pointer hover:border-primary/40 transition-all"
                  key={duel.id}
                  onClick={() => navigate(`/duels/${duel.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">GW {duel.gameweek}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{duel.status}</span>
                  </div>

                  <h3 className="font-headline font-black text-xl uppercase mb-4">Head-to-Head Duel</h3>

                  <div className="bg-surface-container-lowest rounded-lg p-4 mb-4 grid grid-cols-2 gap-3 border border-outline-variant/10">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Entry</p>
                      <p className="font-black text-on-surface">{formatMoney(duel.entryFee)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Prize Pot</p>
                      <p className="font-black text-primary">{formatMoney(Number(duel.entryFee || 0) * 2)}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p><span className="text-on-surface-variant">Creator:</span> {fullName(duel.createdBy)}</p>
                    <p><span className="text-on-surface-variant">Opponent:</span> {fullName(duel.opponent)}</p>
                  </div>

                  {duel.inviteCode ? (
                    <div className="mt-4 rounded-lg bg-primary/10 border border-primary/30 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Your code</p>
                      <p className="font-black text-primary tracking-wider">{duel.inviteCode}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

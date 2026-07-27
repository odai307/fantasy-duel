import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getDuelById, settleDuel } from '../api/duelApi';

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Pending';
}

function formatMoney(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function resultLabel(result) {
  if (result === 'CREATOR_WIN') return 'Creator Won';
  if (result === 'OPPONENT_WIN') return 'Opponent Won';
  if (result === 'DRAW') return 'Draw';
  return 'Pending';
}

export default function DuelDetailsPage() {
  const { duelId } = useParams();
  const resolvedId = duelId;
  const [duel, setDuel] = useState(null);
  const [loading, setLoading] = useState(Boolean(resolvedId));
  const [error, setError] = useState('');
  const [settling, setSettling] = useState(false);
  const [settleMessage, setSettleMessage] = useState('');

  useEffect(() => {
    if (!resolvedId) {
      setLoading(false);
      setError('Missing duel id');
      return;
    }

    async function loadDuel() {
      setLoading(true);
      setError('');
      try {
        const data = await getDuelById(resolvedId);
        setDuel(data?.duel || null);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load duel');
      } finally {
        setLoading(false);
      }
    }

    loadDuel();
  }, [resolvedId]);

  const creatorScore = Number.isFinite(Number(duel?.createdByScore)) ? Number(duel.createdByScore) : 0;
  const opponentScore = Number.isFinite(Number(duel?.opponentScore)) ? Number(duel.opponentScore) : 0;

  async function handleSettle() {
    if (!resolvedId) return;
    setSettling(true);
    setSettleMessage('');
    setError('');

    try {
      const data = await settleDuel(resolvedId);
      setDuel(data?.duel || null);
      setSettleMessage(data?.message || 'Duel settled successfully.');
    } catch (settleError) {
      setError(settleError.message || 'Failed to settle duel');
    } finally {
      setSettling(false);
    }
  }

  return (
    <div className="page-duel-details bg-background text-on-background font-body min-h-screen selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar ctaLabel="Back To Duels" ctaTo="/duels" />

        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-6 h-16">
            <Link className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm" to="/duels">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Duels
            </Link>
            <h2 className="font-headline uppercase tracking-tighter text-primary font-bold">Duel Details</h2>
            <span className="w-24" />
          </header>

          <div className="pt-24 px-6 lg:px-10 max-w-6xl mx-auto">
            {loading ? <p className="text-on-surface-variant mb-6">Loading duel...</p> : null}
            {error ? <p className="text-error mb-6">{error}</p> : null}

            {duel ? (
              <>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight">Matchup Details</h1>
                    <p className="text-on-surface-variant mt-1">Gameweek {duel.gameweek} • {duel.status} • {resultLabel(duel.result)}</p>
                  </div>
                  <div className="px-4 py-2 rounded-md bg-surface-container-lowest border border-outline-variant/20 text-xs uppercase tracking-widest">
                    Head-To-Head Entry: <span className="text-primary font-black">{formatMoney(duel.entryFee)}</span>
                  </div>
                </div>
                {settleMessage ? <p className="text-secondary mb-4 text-sm">{settleMessage}</p> : null}

                <section className="bg-surface-container-high rounded-xl p-1 border border-outline-variant/15 mb-8 overflow-hidden">
                  <div className="bg-surface-container rounded-lg p-6 md:p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high/30 via-transparent to-surface-container-lowest/60 pointer-events-none" />
                  <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
                    <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 border border-primary/20 relative z-10">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Creator</p>
                      <h3 className="font-headline text-2xl font-black">{fullName(duel.createdBy)}</h3>
                      <p className="text-on-surface-variant text-sm mt-2 mb-4">Entry: {formatMoney(duel.entryFee)}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">GW Score</p>
                      <p className="font-display font-black text-6xl leading-none text-primary">{creatorScore}</p>
                    </div>

                    <div className="lg:col-span-1 flex justify-center relative z-10">
                      <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center font-headline font-black text-on-surface-variant">VS</div>
                    </div>

                    <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 relative z-10">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2">Opponent</p>
                      <h3 className="font-headline text-2xl font-black">{fullName(duel.opponent)}</h3>
                      <p className="text-on-surface-variant text-sm mt-2 mb-4">Status: {duel.opponent ? 'Joined' : 'Awaiting join'}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">GW Score</p>
                      <p className="font-display font-black text-6xl leading-none text-on-surface-variant">{opponentScore}</p>
                    </div>
                  </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                    <h4 className="font-headline font-bold mb-4">Match Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-on-surface-variant">Created:</span> {new Date(duel.createdAt).toLocaleString()}</p>
                      <p><span className="text-on-surface-variant">Entry Fee:</span> {formatMoney(duel.entryFee)}</p>
                      <p><span className="text-on-surface-variant">Status:</span> {duel.status}</p>
                      <p><span className="text-on-surface-variant">Result:</span> {resultLabel(duel.result)}</p>
                      {duel.closedAt ? (
                        <p><span className="text-on-surface-variant">Closed:</span> {new Date(duel.closedAt).toLocaleString()}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                    <h4 className="font-headline font-bold mb-4">Invite</h4>
                    {duel.inviteCode ? (
                      <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3">
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Your invite code</p>
                        <p className="text-2xl font-black tracking-wider text-primary">{duel.inviteCode}</p>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant text-sm">Invite code hidden. Only the duel creator can view it.</p>
                    )}
                    {duel.status === 'LOCKED' ? (
                      <button
                        className="mt-4 w-full py-3 rounded-lg bg-primary text-on-primary text-xs font-black uppercase tracking-widest disabled:opacity-60"
                        disabled={settling}
                        onClick={handleSettle}
                        type="button"
                      >
                        {settling ? 'Settling...' : 'Settle Duel'}
                      </button>
                    ) : null}
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

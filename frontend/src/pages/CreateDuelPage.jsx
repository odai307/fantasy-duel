import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { createDuel } from '../duelApi';

const QUICK_ADD = [50, 100, 200];
const GAMEWEEKS = [24, 25, 26, 27];

function formatMoney(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

export default function CreateDuelPage() {
  const navigate = useNavigate();
  const [gameweek, setGameweek] = useState(24);
  const [entryFee, setEntryFee] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const prizePot = useMemo(() => Number(entryFee || 0) * 2, [entryFee]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await createDuel({
        gameweek: Number(gameweek),
        entryFee: Number(entryFee),
      });

      navigate(`/duels/${data?.duel?.id}`);
    } catch (submitError) {
      setError(submitError.message || 'Failed to create duel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-create-duel bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar ctaLabel="Back To Duels" ctaTo="/duels" />

        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20 lg:pb-8">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/15 flex justify-between items-center px-8 h-16">
            <Link className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm" to="/duels">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Duels
            </Link>
            <h1 className="text-lg font-headline font-black text-primary uppercase tracking-tight">Create Duel</h1>
            <span className="w-24" />
          </header>

          <div className="pt-24 px-6 lg:px-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-12 bg-surface-container-high rounded-xl p-6 md:p-8">
                <h2 className="font-headline text-xl font-bold uppercase border-b border-outline-variant/15 pb-4 mb-6">Matchup Setup</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Select Gameweek</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {GAMEWEEKS.map((gw) => (
                        <button
                          className={`rounded-lg py-3 text-sm font-black font-headline transition-all ${gameweek === gw ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'}`}
                          key={gw}
                          onClick={() => setGameweek(gw)}
                          type="button"
                        >
                          GW {gw}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Entry Fee (GHS)</label>
                    <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant/15 flex items-center gap-2">
                      <span className="text-on-surface-variant">₵</span>
                      <input
                        className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black font-headline"
                        min="0"
                        onChange={(event) => setEntryFee(event.target.value)}
                        step="0.01"
                        type="number"
                        value={entryFee}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {QUICK_ADD.map((value) => (
                        <button
                          className="px-3 py-1 bg-surface-container-highest text-xs rounded-md"
                          key={value}
                          onClick={() => setEntryFee((prev) => Number(prev || 0) + value)}
                          type="button"
                        >
                          +{value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error ? <p className="text-error text-sm">{error}</p> : null}

                  <button
                    className="w-full py-4 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-black uppercase tracking-widest disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? 'Generating Duel...' : 'Generate Duel Link'}
                  </button>
                  <div className="bg-surface-container-lowest rounded-lg p-4 grid grid-cols-2 gap-3 border border-outline-variant/10">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Entry Fee</p>
                      <p className="font-black text-on-surface">{formatMoney(entryFee)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-primary">Prize Pool</p>
                      <p className="font-black text-primary">{formatMoney(prizePot)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant text-center">Wallet charge is deferred for now and will be added in the wallet phase.</p>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

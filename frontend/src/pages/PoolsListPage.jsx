import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { listPools } from '../poolApi';

function formatMoney(value) {
  return `GHS ${Number(value || 0).toFixed(2)}`;
}

function getFilterLabel(filter) {
  if (filter === 'high_stakes') return 'High Stakes';
  if (filter === 'free_entry') return 'Free Entry';
  return 'All Pools';
}

function getFilterButtonClass(isActive) {
  return isActive
    ? 'px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs uppercase tracking-widest transition-all shadow-lg'
    : 'px-8 py-2.5 text-on-surface-variant hover:text-white font-bold rounded-lg text-xs uppercase tracking-widest transition-all';
}

export default function PoolsListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPools() {
      setLoading(true);
      setError('');

      try {
        const data = await listPools({ filter, page: 1, limit: 30 });
        setPools(data?.pools || []);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load pools');
      } finally {
        setLoading(false);
      }
    }

    loadPools();
  }, [filter]);

  const totalPrize = useMemo(
    () => pools.reduce((sum, pool) => sum + Number(pool.entryFee || 0) * Number(pool.maxParticipants || 0), 0),
    [pools],
  );

  return (
    <div className="page-pools-list bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20 lg:pb-8">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-surface dark:bg-[#131313]/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-[0_24px_24px_rgba(0,0,0,0.06)] lg:static lg:bg-transparent lg:shadow-none lg:backdrop-blur-none">
            <div className="lg:hidden">
              <span className="text-2xl font-black italic text-[#ffd37b] font-headline uppercase tracking-tighter">FantasyDuel GH</span>
            </div>
            <div className="hidden lg:flex flex-col">
              <h2 className="text-2xl font-black text-on-surface font-headline uppercase tracking-tighter">Global Pools</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-primary/60 tracking-widest uppercase">
                <span>Lobby</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span>Open Competitions</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-[#ffd37b]" type="button">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </button>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-8">
            <section className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] lg:aspect-[25/7] flex flex-col justify-end p-10">
              <div className="absolute inset-0 z-0">
                <img
                  className="w-full h-full object-cover opacity-30"
                  data-alt="cinematic wide shot of a modern football stadium at night under bright floodlights with a slight haze and deep shadows"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFBMA0KQ0hAVkpzoCenaA3s7CdmN_KLhVm6rMAqhEUumq5HaKH9GfdSSF6Q2Q3XmSf5VUSiiS-ldemF1QHg-j9hn9B4PPPulzWWhF2C02GnRJfsX_Rk6vXlpoUyshxY1fXvdiu2W2I7hxoGeAvWGdt99UCp0acWE03_5aVCObMe5Hswz7ALdl1GCIvA-uNekoUoTu4YwEzgLZO3AABwPfJSavR5hy4VF1cyz6L1Ij04-nOBVQwKF4YVUXM5qNAQGKhhSYHqlx7aoaa"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <span className="inline-flex items-center gap-2 bg-[#ffd37b]/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 border border-[#ffd37b]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Live Pools Open
                  </span>
                  <h3 className="text-5xl lg:text-7xl font-black font-headline uppercase leading-none tracking-tighter text-white mb-3">
                    The Golden
                    <br />
                    Gameweek
                  </h3>
                  <p className="text-on-surface-variant/80 max-w-lg font-medium leading-relaxed">Join high-stakes pools and compete against thousands of managers.</p>
                </div>
                <Link
                  className="obsidian-gold-btn font-headline font-bold px-12 py-5 rounded-2xl text-lg uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)] inline-flex items-center justify-center"
                  to="/create-pool"
                >
                  Create Pool
                </Link>
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
              <div className="flex p-1 bg-surface-container rounded-xl gap-1">
                <button className={getFilterButtonClass(filter === 'all')} onClick={() => setFilter('all')} type="button">All Pools</button>
                <button className={getFilterButtonClass(filter === 'high_stakes')} onClick={() => setFilter('high_stakes')} type="button">High Stakes</button>
                <button className={getFilterButtonClass(filter === 'free_entry')} onClick={() => setFilter('free_entry')} type="button">Free Entry</button>
              </div>
              <div className="flex items-center gap-8 text-on-surface-variant/60 font-semibold text-xs tracking-widest uppercase">
                <span className="flex items-center gap-3">Active Pools <span className="text-primary font-black text-base">{pools.length}</span></span>
                <div className="w-px h-4 bg-white/10" />
                <span className="flex items-center gap-3">Estimated Pot <span className="text-secondary font-black text-base">{formatMoney(totalPrize)}</span></span>
              </div>
            </div>

            {loading ? <p className="text-on-surface-variant">Loading pools...</p> : null}
            {error ? <p className="text-error">{error}</p> : null}
            {!loading && !error && pools.length === 0 ? (
              <p className="text-on-surface-variant">No pools found for {getFilterLabel(filter)}.</p>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {pools.map((pool) => {
                const maxLabel = pool.maxParticipants == null ? 'Unlimited' : `1 / ${pool.maxParticipants}`;

                return (
                  <div
                    className="group bg-surface-container-low card-border rounded-2xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
                    key={pool.id}
                    onClick={() => navigate(`/pool-details/${pool.id}`)}
                  >
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1.5 opacity-80">Gameweek {pool.gameweek}</span>
                          <h4 className="text-2xl font-black font-headline uppercase leading-tight group-hover:text-primary transition-colors tracking-tight">{pool.name}</h4>
                        </div>
                        <div className="bg-secondary/10 text-secondary text-[9px] font-black px-2 py-1 rounded border border-secondary/20 uppercase tracking-widest">
                          {pool.visibility}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-px bg-white/5 mb-8 rounded-xl overflow-hidden card-border">
                        <div className="bg-surface-container-high/40 p-5">
                          <span className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Entry Fee</span>
                          <span className="text-xl font-black font-headline text-white">{formatMoney(pool.entryFee)}</span>
                        </div>
                        <div className="bg-surface-container-high/40 p-5">
                          <span className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Participants</span>
                          <span className="text-xl font-black font-headline text-primary">{maxLabel}</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <button
                          className="w-full py-4 obsidian-gold-btn font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all"
                          onClick={() => navigate(`/pool-details/${pool.id}`)}
                          type="button"
                        >
                          View Pool
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

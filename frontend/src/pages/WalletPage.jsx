import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DepositModal from '../components/DepositModal';
import WithdrawalModal from '../components/WithdrawalModal';
import { useAuth } from '../context/AuthContext';
import { verifyDeposit, getTransactions } from '../api/walletApi';

export default function WalletPage() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState(null);

  const balance = Number(user?.walletBalance || 0);

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const txData = await getTransactions(1, 15);
        setTransactions(txData.transactions || []);
        setHasMore(Boolean(txData.hasMore));
        setPage(1);
      } catch (err) {
        console.error('Failed to load transaction history:', err);
      }
    }

    async function handlePaystackVerification() {
      const verifyRef = searchParams.get('verify');
      if (!verifyRef) return;

      setVerifying(true);
      try {
        const res = await verifyDeposit(verifyRef);
        setToast({ type: 'success', message: res.message || 'Deposit successful!' });
        await refreshUser();
        const txData = await getTransactions(1, 15);
        setTransactions(txData.transactions || []);
        setHasMore(Boolean(txData.hasMore));
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Verification failed' });
      } finally {
        setVerifying(false);
        searchParams.delete('verify');
        setSearchParams(searchParams, { replace: true });
      }
    }

    loadInitialData();
    handlePaystackVerification();
  }, [searchParams, setSearchParams, refreshUser]);

  // Load More Transactions (Paginated)
  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const txData = await getTransactions(nextPage, 15);
      setTransactions((prev) => [...prev, ...(txData.transactions || [])]);
      setHasMore(Boolean(txData.hasMore));
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more transactions:', err);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleManualVerify(reference) {
    setVerifying(true);
    try {
      const res = await verifyDeposit(reference);
      setToast({ type: 'success', message: res.message || 'Deposit verified!' });
      await refreshUser();
      const txData = await getTransactions(1, 15);
      setTransactions(txData.transactions || []);
      setHasMore(Boolean(txData.hasMore));
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  }

  async function handleWithdrawalSuccess(message) {
    setToast({ type: 'success', message });
    await refreshUser();
    const txData = await getTransactions(1, 15);
    setTransactions(txData.transactions || []);
    setHasMore(Boolean(txData.hasMore));
  }

  return (
    <div className="page-wallet bg-background text-on-background min-h-screen selection:bg-primary/30">
      <div className="flex">
        <Sidebar />

        <main className="flex-grow lg:ml-64 pb-24 lg:pb-12">
          {/* TopAppBar */}
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-background/80 backdrop-blur-2xl flex justify-between items-center px-8 h-20 border-b border-white/5 lg:static lg:bg-transparent lg:border-none lg:backdrop-blur-none">
            <div className="lg:hidden text-2xl font-black italic text-[#ffd37b] headline-font uppercase tracking-tighter">
              FantasyDuel
            </div>
            <div className="hidden lg:block">
              <h2 className="text-xs font-black headline-font uppercase tracking-[0.3em] text-white/40">
                Financial Overview
              </h2>
              <h3 className="text-2xl font-bold headline-font text-white">Elite Wallet</h3>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Active Balance
                </span>
                <span className="text-sm font-bold text-primary headline-font">
                  GHS {balance.toFixed(2)}
                </span>
              </div>
            </div>
          </header>

          <div className="mt-24 lg:mt-12 px-8 max-w-7xl mx-auto space-y-8">
            
            {/* Toast Banner */}
            {toast ? (
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-sm ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-error/10 border-error/30 text-error'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">
                    {toast.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{toast.message}</span>
                </div>
                <button onClick={() => setToast(null)} className="text-xs opacity-70 hover:opacity-100">
                  Dismiss
                </button>
              </div>
            ) : null}

            {/* Verification Spinner */}
            {verifying ? (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center gap-3 font-bold text-sm">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Verifying Paystack deposit...</span>
              </div>
            ) : null}

            {/* Wallet Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Balance Card (Large) */}
              <div className="lg:col-span-8 obsidian-gold-card rounded-3xl p-10 flex flex-col justify-between min-h-[300px] relative group overflow-hidden">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-[1px] bg-primary/40"></div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">
                      Available Capital
                    </p>
                  </div>
                  <h3 className="text-6xl sm:text-7xl font-black headline-font gold-glow-text tracking-tighter leading-none mb-2">
                    GHS {balance.toFixed(2)}
                  </h3>
                  <p className="text-white/20 text-xs font-medium italic">
                    Verified Paystack MoMo & Card wallet balance
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-12 relative">
                  <button
                    onClick={() => setIsDepositOpen(true)}
                    className="elite-button text-on-primary font-black px-8 py-4 rounded-xl flex items-center gap-3 headline-font uppercase tracking-tight text-sm hover:scale-[1.02] transition-transform"
                  >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    Deposit Funds (MoMo / Card)
                  </button>

                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="secondary-elite-button text-white/80 font-bold px-8 py-4 rounded-xl flex items-center gap-3 headline-font uppercase tracking-tight text-sm hover:border-amber-400/40 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-amber-400">payments</span>
                    Request Payout
                  </button>
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                <div className="obsidian-gold-card rounded-2xl p-8 flex flex-col justify-center border-l-4 border-l-primary/40 space-y-3">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    Accepted Payout & Deposit Channels
                  </p>
                  <div className="space-y-2 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>MTN Mobile Money</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <span>Telecel Cash (Vodafone)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>AT Money & Bank Cards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions List (Paginated) */}
            <div className="obsidian-gold-card rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-lg font-bold text-white">Recent Wallet Activity</h4>
                <span className="text-xs text-white/40 font-mono">Paginated ledger</span>
              </div>

              {transactions.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-xs">
                  No transaction history recorded yet. Click "Deposit Funds" to add money to your account!
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                            tx.type === 'DEPOSIT'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {tx.type === 'DEPOSIT' ? 'south_west' : 'north_east'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {tx.description || tx.type}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">
                            Ref: {tx.reference} • {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-sm font-bold font-mono ${
                              tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {tx.type === 'DEPOSIT' ? '+' : '-'}GHS {Number(tx.amount).toFixed(2)}
                          </div>
                          <div
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              tx.status === 'SUCCESS'
                                ? 'text-emerald-400'
                                : tx.status === 'PENDING'
                                ? 'text-amber-400'
                                : 'text-error'
                            }`}
                          >
                            {tx.status}
                          </div>
                        </div>

                        {tx.status === 'PENDING' ? (
                          <button
                            onClick={() => handleManualVerify(tx.reference)}
                            disabled={verifying}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                          >
                            Verify
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {/* Load More Button */}
                  {hasMore ? (
                    <div className="pt-4 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                      >
                        {loadingMore ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <span>Load More Activity</span>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Paystack Deposit Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
      />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        userBalance={balance}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
}

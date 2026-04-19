import Sidebar from '../components/Sidebar';
export default function WalletPage() {
  return (
    <div className="page-wallet bg-background text-on-background min-h-screen selection:bg-primary/30">
<div className="flex">
        {/* SideNavBar */}
        <Sidebar />
        <main className="flex-grow lg:ml-64 pb-24 lg:pb-12">
            {/* TopAppBar */}
            <header
                className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-2xl flex justify-between items-center px-8 h-20 border-b border-white/5 lg:static lg:bg-transparent lg:border-none lg:backdrop-blur-none">
                <div
                    className="lg:hidden text-2xl font-black italic text-[#ffd37b] headline-font uppercase tracking-tighter">
                    FantasyDuel</div>
                <div className="hidden lg:block">
                    <h2 className="text-xs font-black headline-font uppercase tracking-[0.3em] text-white/40">Financial
                        Overview</h2>
                    <h3 className="text-2xl font-bold headline-font text-white">Elite Wallet</h3>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active
                            Balance</span>
                        <span className="text-sm font-bold text-primary headline-font">GHS 4,250.00</span>
                    </div>
                    <button className="relative p-2 text-white/60 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                        <img alt="User profile" className="w-full h-full rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvGlkAIRkRess_4d4eZw7I5MCq_e0Vz3wnWVymFN_621zQtX27zFblc1yClv8D-1HLo-Xa2YNrZD2fqDnLBvF4Ht5MAsX4p_-KhWbRADbTVt22gqgKTd8-1eKV6-Xfow3251WTErppVLQ9tJ1VUBUBP2TdhCBVqXZBcO6_85r-ldmaZPEMIL2GpsmRS27HxmyzEpaCltH8GcRugeWrRJbO56TlDi659YJDZUUTLuCM-7Ng0F0bZAi70YU0sR2_drCa-6AoAK39Sha" />
                    </div>
                </div>
            </header>
            <div className="mt-24 lg:mt-12 px-8 max-w-7xl mx-auto">
                {/* Wallet Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Balance Card (Large) */}
                    <div
                        className="lg:col-span-8 obsidian-gold-card rounded-3xl p-10 flex flex-col justify-between min-h-[300px] relative group overflow-hidden">
                        <div
                            className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-colors duration-700">
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-[1px] bg-primary/40"></div>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Available Capital
                                </p>
                            </div>
                            <h3
                                className="text-7xl font-black headline-font gold-glow-text tracking-tighter leading-none mb-2">
                                GHS 4,250.00
                            </h3>
                            <p className="text-white/20 text-xs font-medium italic">Verified secure balance • Updated just
                                now</p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-12 relative">
                            <button
                                className="elite-button text-on-primary font-black px-10 py-4 rounded-xl flex items-center gap-3 headline-font uppercase tracking-tight text-sm">
                                <span className="material-symbols-outlined text-xl" data-icon="add_circle">add_circle</span>
                                Deposit Funds
                            </button>
                            <button
                                className="secondary-elite-button text-white/80 font-bold px-10 py-4 rounded-xl flex items-center gap-3 headline-font uppercase tracking-tight text-sm">
                                <span className="material-symbols-outlined text-xl" data-icon="payments">payments</span>
                                Request Payout
                            </button>
                        </div>
                    </div>
                    {/* Quick Stats */}
                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                        <div
                            className="obsidian-gold-card rounded-2xl p-8 flex flex-col justify-center border-l-4 border-l-secondary/40">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total
                                Winnings</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold headline-font text-secondary tracking-tight">GHS
                                    12,840</span>
                                <div className="flex flex-col items-end">
                                    <span
                                        className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">+12%</span>
                                    <span className="material-symbols-outlined text-secondary/40 mt-1"
                                        data-icon="trending_up">trending_up</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="obsidian-gold-card rounded-2xl p-8 flex flex-col justify-center border-l-4 border-l-primary/40">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Contest
                                Participation</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold headline-font text-white tracking-tight">142</span>
                                <span className="material-symbols-outlined text-white/20"
                                    data-icon="query_stats">query_stats</span>
                            </div>
                        </div>
                    </div>
                    {/* Transaction History */}
                    <div className="lg:col-span-12 mt-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h4 className="text-xl font-bold headline-font uppercase tracking-tight">Activity Log</h4>
                                <span className="h-4 w-[1px] bg-white/10 hidden md:block"></span>
                                <span className="text-white/30 text-xs hidden md:block">Real-time ledger</span>
                            </div>
                            <div className="flex p-1 bg-surface-container-lowest rounded-xl border border-white/5">
                                <button
                                    className="px-5 py-2 rounded-lg text-xs font-black bg-primary text-on-primary uppercase tracking-tight">All</button>
                                <button
                                    className="px-5 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-tight">Inflow</button>
                                <button
                                    className="px-5 py-2 rounded-lg text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-tight">Outflow</button>
                            </div>
                        </div>
                        <div className="obsidian-gold-card rounded-3xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                                            <th className="px-8 py-5">Transaction Details</th>
                                            <th className="px-8 py-5">Date &amp; Time</th>
                                            <th className="px-8 py-5">Execution Status</th>
                                            <th className="px-8 py-5 text-right">Amount (GHS)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {/* Row 1 */}
                                        <tr className="transaction-row transition-all duration-200">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center justify-center text-secondary">
                                                        <span className="material-symbols-outlined"
                                                            data-icon="trophy">trophy</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Pool Payout</p>
                                                        <p className="text-xs text-white/30">EPL Matchweek 12 Champion</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-white/60">Nov 24, 2024</p>
                                                <p className="text-[10px] text-white/20 uppercase">14:22 GMT</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest">
                                                    <span
                                                        className="w-1 h-1 rounded-full bg-secondary animate-pulse"></span>
                                                    Cleared
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span
                                                    className="text-lg font-black text-secondary headline-font">+850.00</span>
                                            </td>
                                        </tr>
                                        {/* Row 2 */}
                                        <tr className="transaction-row transition-all duration-200">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                                        <span className="material-symbols-outlined"
                                                            data-icon="sports_kabaddi">sports_kabaddi</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Entry Fee</p>
                                                        <p className="text-xs text-white/30">H2H: Apex Predators vs Dynasty
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-white/60">Nov 22, 2024</p>
                                                <p className="text-[10px] text-white/20 uppercase">09:15 GMT</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                    Processed
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-white headline-font">-100.00</span>
                                            </td>
                                        </tr>
                                        {/* Row 3 */}
                                        <tr className="transaction-row transition-all duration-200">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                                                        <span className="material-symbols-outlined"
                                                            data-icon="account_balance">account_balance</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Deposit</p>
                                                        <p className="text-xs text-white/30">MTN MoMo Transfer #7821</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-white/60">Nov 20, 2024</p>
                                                <p className="text-[10px] text-white/20 uppercase">18:45 GMT</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest">
                                                    <span className="w-1 h-1 rounded-full bg-secondary"></span>
                                                    Cleared
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span
                                                    className="text-lg font-black text-primary headline-font">+1,500.00</span>
                                            </td>
                                        </tr>
                                        {/* Row 4 */}
                                        <tr className="transaction-row transition-all duration-200">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl bg-error/5 border border-error/20 flex items-center justify-center text-error">
                                                        <span className="material-symbols-outlined"
                                                            data-icon="outbound">outbound</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Withdrawal</p>
                                                        <p className="text-xs text-white/30">Bank Transfer • Standard
                                                            Chartered</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-white/60">Nov 18, 2024</p>
                                                <p className="text-[10px] text-white/20 uppercase">11:30 GMT</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span
                                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                    Sent
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span
                                                    className="text-lg font-black text-error headline-font">-2,000.00</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-6 flex justify-center border-t border-white/5 bg-white/[0.01]">
                                <button
                                    className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all flex items-center gap-2 group">
                                    Full Statement Access
                                    <span
                                        className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
                                        data-icon="arrow_forward">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Ad Banner Section */}
                <section className="mt-16 relative h-48 rounded-3xl overflow-hidden obsidian-gold-card group">
                    <img className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 scale-105 group-hover:scale-100"
                        data-alt="high stakes stadium night lights"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeyDXMs4rNBJL4TWZwF_4lBCOH9_lncqU4Nux0VHhPMrtlX2VfRXB5CsCGlYxuVMPfc9N3TZeC_WPEshS6VnpmWw_Mn-lbqIY75CHMV-XVOKUal9cuJSSji4H5thDNt0tIPJ66tdonlDS1Ju1C5qZQ57AImocHjFGl_YBMdOPy3X-0ozsbYnPj3bakQtUpg933lEi6fiLV0lHosKLoBQMQnLc7bRqvIYqCcN4IaE1Fm2jxYXU5HSYvy2Gx6ihSnRtnueQOD6LsnDOe" />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex items-center p-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-2 w-2 rounded-full bg-error"></span>
                                <span className="text-error font-black text-[10px] uppercase tracking-widest">Live
                                    Registration</span>
                            </div>
                            <h5
                                className="text-4xl font-black headline-font text-white uppercase italic tracking-tighter leading-none mb-2">
                                Grand Slam Pool #04</h5>
                            <p className="text-primary/80 font-bold headline-font text-lg">Guaranteed GHS 50,000 Prizing</p>
                            <button
                                className="mt-6 bg-white text-black text-xs font-black uppercase px-8 py-3 rounded-xl hover:bg-primary transition-colors tracking-widest">Secure
                                Spot</button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
    {/* BottomNavBar (Mobile Only) */}
    <nav
        className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 bg-background/90 backdrop-blur-2xl border-t border-white/5 z-50 lg:hidden">
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined mb-1" data-icon="dashboard">dashboard</span>
            <span className="text-[9px] font-black uppercase tracking-widest headline-font">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined mb-1" data-icon="swords">swords</span>
            <span className="text-[9px] font-black uppercase tracking-widest headline-font">Duels</span>
        </div>
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined mb-1" data-icon="trophy">trophy</span>
            <span className="text-[9px] font-black uppercase tracking-widest headline-font">Pools</span>
        </div>
        <div
            className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-5 py-2 border border-primary/20">
            <span className="material-symbols-outlined mb-1" data-icon="account_balance_wallet"
                style={{fontVariationSettings: '\'FILL\' 1'}}>account_balance_wallet</span>
            <span className="text-[9px] font-black uppercase tracking-widest headline-font">Wallet</span>
        </div>
    </nav>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
export default function PoolsListPage() {
  const navigate = useNavigate();
  const openPoolDetails = () => navigate('/pool-details');

  return (
    <div className="page-pools-list bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
<div className="flex min-h-screen">
        {/* SideNavBar */}
        <Sidebar />
        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20 lg:pb-8">
            {/* TopNavBar */}
            <header
                className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-surface dark:bg-[#131313]/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-[0_24px_24px_rgba(0,0,0,0.06)] lg:static lg:bg-transparent lg:shadow-none lg:backdrop-blur-none">
                <div className="lg:hidden">
                    <span
                        className="text-2xl font-black italic text-[#ffd37b] font-headline uppercase tracking-tighter">FantasyDuel
                        GH</span>
                </div>
                {/* Desktop Breadcrumbs/Context */}
                <div className="hidden lg:flex flex-col">
                    <h2 className="text-2xl font-black text-on-surface font-headline uppercase tracking-tighter">Global
                        Pools</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary/60 tracking-widest uppercase">
                        <span>Lobby</span>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span>Open Competitions</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-full hover:bg-surface-container-highest transition-colors text-[#ffd37b]">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                        <img alt="User profile" className="w-full h-full rounded-full object-cover"
                            data-alt="close-up portrait of a determined young man with short hair looking confidently towards the side, moody low-key lighting with stadium reflections"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvGlkAIRkRess_4d4eZw7I5MCq_e0Vz3wnWVymFN_621zQtX27zFblc1yClv8D-1HLo-Xa2YNrZD2fqDnLBvF4Ht5MAsX4p_-KhWbRADbTVt22gqgKTd8-1eKV6-Xfow3251WTErppVLQ9tJ1VUBUBP2TdhCBVqXZBcO6_85r-ldmaZPEMIL2GpsmRS27HxmyzEpaCltH8GcRugeWrRJbO56TlDi659YJDZUUTLuCM-7Ng0F0bZAi70YU0sR2_drCa-6AoAK39Sha" />
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-8">
                {/* Hero & Action Section */}
                <section
                    className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] lg:aspect-[25/7] flex flex-col justify-end p-10">
                    <div className="absolute inset-0 z-0">
                        <img className="w-full h-full object-cover opacity-30"
                            data-alt="cinematic wide shot of a modern football stadium at night under bright floodlights with a slight haze and deep shadows"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFBMA0KQ0hAVkpzoCenaA3s7CdmN_KLhVm6rMAqhEUumq5HaKH9GfdSSF6Q2Q3XmSf5VUSiiS-ldemF1QHg-j9hn9B4PPPulzWWhF2C02GnRJfsX_Rk6vXlpoUyshxY1fXvdiu2W2I7hxoGeAvWGdt99UCp0acWE03_5aVCObMe5Hswz7ALdl1GCIvA-uNekoUoTu4YwEzgLZO3AABwPfJSavR5hy4VF1cyz6L1Ij04-nOBVQwKF4YVUXM5qNAQGKhhSYHqlx7aoaa" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent">
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <span
                                className="inline-flex items-center gap-2 bg-[#ffd37b]/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 border border-[#ffd37b]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Live Pools Open
                            </span>
                            <h3
                                className="text-5xl lg:text-7xl font-black font-headline uppercase leading-none tracking-tighter text-white mb-3">
                                The Golden<br />Gameweek</h3>
                            <p className="text-on-surface-variant/80 max-w-lg font-medium leading-relaxed">Join high-stakes
                                pools and compete against thousands of managers. Every goal counts towards the ultimate
                                prize pool.</p>
                        </div>
                        <Link
                            className="obsidian-gold-btn font-headline font-bold px-12 py-5 rounded-2xl text-lg uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)] inline-flex items-center justify-center"
                            to="/create-pool">
                            Create Pool
                        </Link>
                    </div>
                </section>
                {/* Filter & Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
                    <div className="flex p-1 bg-surface-container rounded-xl gap-1">
                        <button
                            className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs uppercase tracking-widest transition-all shadow-lg">All
                            Pools</button>
                        <button
                            className="px-8 py-2.5 text-on-surface-variant hover:text-white font-bold rounded-lg text-xs uppercase tracking-widest transition-all">High
                            Stakes</button>
                        <button
                            className="px-8 py-2.5 text-on-surface-variant hover:text-white font-bold rounded-lg text-xs uppercase tracking-widest transition-all">Free
                            Entry</button>
                    </div>
                    <div
                        className="flex items-center gap-8 text-on-surface-variant/60 font-semibold text-xs tracking-widest uppercase">
                        <span className="flex items-center gap-3">Active Pools <span
                                className="text-primary font-black text-base">1,248</span></span>
                        <div className="w-px h-4 bg-white/10"></div>
                        <span className="flex items-center gap-3">Total Prizes <span
                                className="text-secondary font-black text-base">GHS 250k+</span></span>
                    </div>
                </div>
                {/* Pools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Pool Card 1 */}
                    <div
                        className="group bg-surface-container-low card-border rounded-2xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
                        onClick={openPoolDetails}>
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1.5 opacity-80">Gameweek
                                        24</span>
                                    <h4
                                        className="text-2xl font-black font-headline uppercase leading-tight group-hover:text-primary transition-colors tracking-tight">
                                        Elite Stadium Masters</h4>
                                </div>
                                <div
                                    className="bg-secondary/10 text-secondary text-[9px] font-black px-2 py-1 rounded border border-secondary/20 uppercase tracking-widest">
                                    Verified</div>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-white/5 mb-8 rounded-xl overflow-hidden card-border">
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Entry
                                        Fee</span>
                                    <span className="text-xl font-black font-headline text-white">GHS 50.00</span>
                                </div>
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Prize
                                        Pool</span>
                                    <span className="text-xl font-black font-headline text-primary">GHS 5,000</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <span
                                        className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">Enrollment
                                        Status</span>
                                    <span className="text-xs font-black font-headline text-white">42 / 150 <span
                                            className="text-on-surface-variant/40 font-medium ml-1">SPOTS</span></span>
                                </div>
                                <div className="w-full progress-subtle rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-primary transition-all duration-1000" style={{width: '72%'}}>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-4 obsidian-gold-btn font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all"
                                    onClick={openPoolDetails}
                                    type="button">
                                    Join Competition
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pool Card 2 */}
                    <div
                        className="group bg-surface-container-low card-border rounded-2xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
                        onClick={openPoolDetails}>
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1.5 opacity-80">Gameweek
                                        24</span>
                                    <h4
                                        className="text-2xl font-black font-headline uppercase leading-tight group-hover:text-primary transition-colors tracking-tight">
                                        Weekend Warriors</h4>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-white/5 mb-8 rounded-xl overflow-hidden card-border">
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Entry
                                        Fee</span>
                                    <span className="text-xl font-black font-headline text-white">GHS 10.00</span>
                                </div>
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Prize
                                        Pool</span>
                                    <span className="text-xl font-black font-headline text-primary">GHS 1,200</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <span
                                        className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">Enrollment
                                        Status</span>
                                    <span className="text-xs font-black font-headline text-white">188 / 200 <span
                                            className="text-on-surface-variant/40 font-medium ml-1">SPOTS</span></span>
                                </div>
                                <div className="w-full progress-subtle rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-secondary transition-all duration-1000" style={{width: '12%'}}>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-4 obsidian-gold-btn font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all"
                                    onClick={openPoolDetails}
                                    type="button">
                                    Join Competition
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pool Card 3 (Premium Focused) */}
                    <div
                        className="group bg-surface-container-low card-border border-primary/20 rounded-2xl transition-all duration-500 hover:border-primary/60 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
                        onClick={openPoolDetails}>
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <span className="material-symbols-outlined text-primary text-6xl"
                                style={{fontVariationSettings: '\'FILL\' 1'}}>workspace_premium</span>
                        </div>
                        <div className="p-8 h-full flex flex-col relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1.5">Premium
                                        • GW25</span>
                                    <h4
                                        className="text-2xl font-black font-headline uppercase leading-tight text-white group-hover:text-primary transition-colors tracking-tight">
                                        Accra Grand Cup</h4>
                                </div>
                            </div>
                            <div
                                className="grid grid-cols-2 gap-px bg-primary/10 mb-8 rounded-xl overflow-hidden border border-primary/20">
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-2">Entry
                                        Fee</span>
                                    <span className="text-xl font-black font-headline text-white">GHS 500.00</span>
                                </div>
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-2">Prize
                                        Pool</span>
                                    <span className="text-xl font-black font-headline text-primary">GHS 25k</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <span
                                        className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Enrollment
                                        Status</span>
                                    <span className="text-xs font-black font-headline text-white">2 / 50 <span
                                            className="text-on-surface-variant/40 font-medium ml-1">SPOTS</span></span>
                                </div>
                                <div className="w-full progress-subtle rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-error transition-all duration-1000" style={{width: '96%'}}></div>
                                </div>
                                <button
                                    className="w-full py-4 stadium-glow text-on-primary font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_20px_rgba(255,211,123,0.2)]"
                                    onClick={openPoolDetails}
                                    type="button">
                                    Join Competition
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Pool Card 4 */}
                    <div
                        className="group bg-surface-container-low card-border rounded-2xl transition-all duration-500 hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
                        onClick={openPoolDetails}>
                        <div className="p-8 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex flex-col">
                                    <span
                                        className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-1.5 opacity-80">Gameweek
                                        24</span>
                                    <h4
                                        className="text-2xl font-black font-headline uppercase leading-tight group-hover:text-primary transition-colors tracking-tight">
                                        Underdog Specials</h4>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-white/5 mb-8 rounded-xl overflow-hidden card-border">
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Entry
                                        Fee</span>
                                    <span className="text-xl font-black font-headline text-white">GHS 5.00</span>
                                </div>
                                <div className="bg-surface-container-high/40 p-5">
                                    <span
                                        className="block text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest mb-2">Prize
                                        Pool</span>
                                    <span className="text-xl font-black font-headline text-primary">GHS 750</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <span
                                        className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">Enrollment
                                        Status</span>
                                    <span className="text-xs font-black font-headline text-white">450 / 500 <span
                                            className="text-on-surface-variant/40 font-medium ml-1">SPOTS</span></span>
                                </div>
                                <div className="w-full progress-subtle rounded-full overflow-hidden mb-8">
                                    <div className="h-full bg-secondary transition-all duration-1000" style={{width: '10%'}}>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-4 obsidian-gold-btn font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all"
                                    onClick={openPoolDetails}
                                    type="button">
                                    Join Competition
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Add More Card Placeholder */}
                    <div
                        className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/30 transition-all">
                        <div
                            className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary/5 border border-white/5">
                            <span
                                className="material-symbols-outlined text-primary/40 text-4xl group-hover:text-primary transition-colors">add</span>
                        </div>
                        <h4
                            className="text-xl font-black font-headline uppercase text-white/80 group-hover:text-primary transition-colors tracking-tight">
                            Start Your Own</h4>
                        <p className="text-xs text-on-surface-variant/60 font-medium px-8 mt-3 leading-relaxed">Challenge
                            friends in a private or public pool with custom entry fees.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    {/* BottomNavBar (Mobile Only) */}
    <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-surface dark:bg-[#131313]/80 backdrop-blur-md z-50 border-t border-[#ffd37b]/15">
        <Link className="flex flex-col items-center justify-center text-white/50 px-3 py-1" to="/dashboard">
            <span className="material-symbols-outlined text-xl">home</span>
            <span className="font-['Inter'] text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-white/50 px-3 py-1" to="/create-duel">
            <span className="material-symbols-outlined text-xl">swords</span>
            <span className="font-['Inter'] text-[9px] font-bold uppercase tracking-wider">Duels</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-[#ffd37b]/10 text-[#ffd37b] rounded-xl px-4 py-1.5 scale-95 transition-transform"
            to="/pools-list">
            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: '\'FILL\' 1'}}>groups</span>
            <span className="font-['Inter'] text-[9px] font-bold uppercase tracking-wider">Pools</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-white/50 px-3 py-1" to="/leaderboard">
            <span className="material-symbols-outlined text-xl">leaderboard</span>
            <span className="font-['Inter'] text-[9px] font-bold uppercase tracking-wider">Rank</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-white/50 px-3 py-1" to="/wallet">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            <span className="font-['Inter'] text-[9px] font-bold uppercase tracking-wider">Wallet</span>
        </Link>
    </nav>
    </div>
  );
}

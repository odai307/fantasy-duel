import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
export default function CreateDuelPage() {
  return (
    <div className="page-create-duel bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
{/* Sidebar Navigation (Shared Component SideNavBar) */}
    <Sidebar />
    {/* Main Content Area */}
    <main className="lg:ml-64 min-h-screen pb-24 lg:pb-8">
        {/* Top Nav Bar (Shared Component TopNavBar) */}
        <header
            className="fixed top-0 lg:left-64 right-0 z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 border-b border-white/5">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-primary">
                    <span className="material-symbols-outlined" data-icon="menu">menu</span>
                </button>
                <h2 className="text-lg font-headline font-black italic text-primary uppercase tracking-tighter">Create Duel
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright transition-colors">
                    <span className="material-symbols-outlined text-primary text-sm font-variation-fill"
                        data-icon="account_balance_wallet">account_balance_wallet</span>
                    <span className="text-sm font-bold font-headline text-primary">GHS 1.4K</span>
                </button>
                <div
                    className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-on-primary text-lg" data-icon="person">person</span>
                </div>
            </div>
        </header>
        {/* Content */}
        <section className="mt-24 px-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <Link
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80"
                    to="/join-duel">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Duels
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                {/* Left: Setup Form */}
                <div className="md:col-span-7 space-y-8">
                    <div className="obsidian-panel p-8 lg:p-10 rounded-2xl border border-white/5 premium-shadow">
                        <div className="flex items-center gap-3 mb-10">
                            <div
                                className="w-10 h-10 rounded-lg stadium-glow flex items-center justify-center shadow-[0_0_15px_rgba(255,211,123,0.3)]">
                                <span className="material-symbols-outlined text-on-primary font-bold"
                                    data-icon="add_moderator">add_moderator</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-headline font-black uppercase tracking-tight">Elite Battle
                                    Setup</h3>
                                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em]">
                                    Configure your high-stakes encounter</p>
                            </div>
                        </div>
                        <form className="space-y-10">
                            {/* Step 1: Gameweek */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary font-black font-headline italic">01.</span>
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">Active
                                        Gameweek</label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-primary bg-primary/5 group relative"
                                        type="button">
                                        <span className="text-[10px] font-black text-primary/60 uppercase">GW 32</span>
                                        <span className="text-sm font-headline font-bold text-white">Active</span>
                                        <div
                                            className="absolute -top-2 -right-2 bg-primary text-on-primary rounded-full p-1 leading-none">
                                            <span className="material-symbols-outlined text-xs"
                                                data-icon="check">check</span>
                                        </div>
                                    </button>
                                    <button
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-surface-container hover:border-primary/50 transition-colors group"
                                        type="button">
                                        <span className="text-[10px] font-black text-on-surface-variant uppercase">GW
                                            33</span>
                                        <span className="text-sm font-headline font-bold text-white">Next</span>
                                    </button>
                                    <button
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-surface-container hover:border-primary/50 transition-colors group"
                                        type="button">
                                        <span className="text-[10px] font-black text-on-surface-variant uppercase">GW
                                            34</span>
                                        <span className="text-sm font-headline font-bold text-white">Upcoming</span>
                                    </button>
                                </div>
                            </div>
                            {/* Step 2: Entry Fee */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary font-black font-headline italic">02.</span>
                                    <label
                                        className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">Stakes
                                        (GHS)</label>
                                </div>
                                <div className="relative group">
                                    <div
                                        className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black font-headline text-2xl italic">
                                        ₵</div>
                                    <input
                                        className="w-full bg-surface-container-lowest border border-white/5 rounded-2xl py-6 pl-14 pr-6 text-white font-headline font-black text-3xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/10"
                                        placeholder="0.00" type="number" />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                        <button
                                            className="h-10 px-4 rounded-lg bg-surface-container-high border border-white/5 text-[10px] font-black text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
                                            type="button">+ 50</button>
                                        <button
                                            className="h-10 px-4 rounded-lg bg-surface-container-high border border-white/5 text-[10px] font-black text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
                                            type="button">+ 100</button>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="w-full stadium-glow text-on-primary font-headline font-black py-6 rounded-2xl text-xl uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(255,211,123,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(255,211,123,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                                type="button">
                                Initialize Duel
                            </button>
                        </form>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#005b14]/10 border border-[#88d982]/20 flex items-start gap-4">
                        <span className="material-symbols-outlined text-secondary" data-icon="verified">verified</span>
                        <div>
                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Verified Fair Play</p>
                            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">All duels are locked 1
                                hour before the first kick-off. Live points are synced every 60 seconds during match
                                windows.</p>
                        </div>
                    </div>
                </div>
                {/* Right: Code & Preview */}
                <div className="md:col-span-5">
                    <div className="sticky top-24 space-y-6">
                        {/* Sophisticated Code Display */}
                        <div className="gold-border-gradient rounded-3xl overflow-hidden premium-shadow group">
                            <div className="p-8 lg:p-10 text-center relative">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                    <svg height="100%" width="100%">
                                        <pattern height="40" id="grid" patternunits="userSpaceOnUse" width="40">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor"
                                                strokeWidth="1"></path>
                                        </pattern>
                                        <rect fill="url(#grid)" height="100%" width="100%"></rect>
                                    </svg>
                                </div>
                                <span
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary text-[10px] font-black uppercase mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                    Duel Ready
                                </span>
                                <h4
                                    className="text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
                                    Elite Entry Protocol</h4>
                                {/* High Contrast Code Box */}
                                <div
                                    className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/5">
                                    <span
                                        className="text-5xl font-headline font-black text-primary tracking-[0.15em] block mb-2 italic">DUEL-4X9K</span>
                                    <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-1/3 animate-[loading_2s_infinite]"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    <button
                                        className="col-span-4 flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-container-highest border border-white/10 hover:border-primary/50 hover:bg-surface-bright transition-all text-xs font-black uppercase tracking-widest text-white">
                                        <span className="material-symbols-outlined text-lg text-primary"
                                            data-icon="content_copy">content_copy</span>
                                        Copy Protocol
                                    </button>
                                    <button
                                        className="col-span-1 flex items-center justify-center py-4 rounded-xl bg-surface-container-highest border border-white/10 hover:border-primary/50 transition-all text-primary">
                                        <span className="material-symbols-outlined" data-icon="share">share</span>
                                    </button>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                    <button
                                        className="w-full flex items-center justify-center gap-3 py-5 rounded-xl bg-[#25D366] text-white font-headline font-black uppercase tracking-[0.2em] text-sm hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.4)] transition-all">
                                        <span className="material-symbols-outlined" data-icon="send">send</span>
                                        Share on WhatsApp
                                    </button>
                                    <p className="text-[10px] text-on-surface-variant/60 font-medium">Valid for the next 48
                                        hours</p>
                                </div>
                            </div>
                        </div>
                        {/* Visual Context Card */}
                        <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5 group">
                            <img alt="Stadium Lighting"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_hywsTPBMlat8w0iCj4_VDo6ikhVjM_1BZkAV3oS0OaxHFrQJ9gRcQlUp6ksQWADu3CIOrMG92lc72tAYBT6Jp8TMwir7Nenjf4CzktrQpRh9QY5WZ-RdqPFOrL4ONn9Fn_cZ2-Lnfm-GdhTkf8l4QtQ0MichnFNRwWxBUzSuCFNK3UFB6A1wI88WmnctkjnVmbv5tWt9jk4N-dcM84qSCI3kNqIfEom9KUY1QoDHy6MBN0AxMBUbpWGOaB41wgbiV48n-4dLgcNh" />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent">
                            </div>
                            <div className="absolute bottom-6 left-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Active
                                        Global Battles</p>
                                </div>
                                <p
                                    className="text-3xl font-headline font-black text-white italic tracking-tighter leading-none">
                                    12,402</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    {/* Bottom Nav Bar (Shared Component - Mobile Only) */}
    <nav
        className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 bg-surface/80 backdrop-blur-md pb-safe px-2 z-50 border-t border-white/5">
        <a className="flex flex-col items-center justify-center text-white/50 px-3 py-1" href="#">
            <span className="material-symbols-outlined" data-icon="home">home</span>
            <span className="text-[10px] font-bold uppercase mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary px-3 py-1" href="#">
            <span className="material-symbols-outlined font-variation-fill" data-icon="sports_kabaddi">sports_kabaddi</span>
            <span className="text-[10px] font-bold uppercase mt-1">Duels</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white/50 px-3 py-1" href="#">
            <span className="material-symbols-outlined" data-icon="sports_score">sports_score</span>
            <span className="text-[10px] font-bold uppercase mt-1">Pools</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white/50 px-3 py-1" href="#">
            <span className="material-symbols-outlined" data-icon="emoji_events">emoji_events</span>
            <span className="text-[10px] font-bold uppercase mt-1">Leaderboard</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white/50 px-3 py-1" href="#">
            <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
            <span className="text-[10px] font-bold uppercase mt-1">Wallet</span>
        </a>
    </nav>
    <style>{`
        @keyframes loading {
            0% {
                transform: translateX(-100%);
            }

            100% {
                transform: translateX(300%);
            }
        }
    `}</style>
    </div>
  );
}

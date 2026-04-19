import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
export default function JoinDuelPage() {
  return (
    <div className="page-join-duel bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
<div className="flex min-h-screen">
        {/* SideNavBar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 relative pb-24">
            {/* TopAppBar */}
            <header
                className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-8 h-20 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <span
                        className="lg:hidden text-xl font-black italic text-primary font-headline uppercase tracking-tighter">FantasyDuel
                        GH</span>
                    <h2
                        className="hidden lg:block text-on-surface/80 font-headline font-bold uppercase tracking-widest text-xs">
                        Join Existing Duel</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button className="relative text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        <span
                            className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                        <img alt="User profile" className="w-full h-full rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvGlkAIRkRess_4d4eZw7I5MCq_e0Vz3wnWVymFN_621zQtX27zFblc1yClv8D-1HLo-Xa2YNrZD2fqDnLBvF4Ht5MAsX4p_-KhWbRADbTVt22gqgKTd8-1eKV6-Xfow3251WTErppVLQ9tJ1VUBUBP2TdhCBVqXZBcO6_85r-ldmaZPEMIL2GpsmRS27HxmyzEpaCltH8GcRugeWrRJbO56TlDi659YJDZUUTLuCM-7Ng0F0bZAi70YU0sR2_drCa-6AoAK39Sha" />
                    </div>
                </div>
            </header>
            {/* Page Content */}
            <div className="pt-32 px-8 max-w-5xl mx-auto">
                {/* Headline Section */}
                <div className="mb-14">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-primary font-headline font-bold text-[10px] tracking-widest uppercase">Arena
                            Access</span>
                    </div>
                    <h1
                        className="text-6xl lg:text-8xl font-headline font-black uppercase tracking-tighter leading-[0.9] italic">
                        Battle For <br /><span className="text-primary">Glory.</span>
                    </h1>
                </div>
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-headline font-black uppercase tracking-widest text-white/80">
                            Your Active Duels
                        </h3>
                        <Link
                            className="text-[10px] text-primary uppercase font-black tracking-widest hover:opacity-80"
                            to="/create-duel"
                        >
                            Create New
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            className="obsidian-panel rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-colors"
                            to="/duel-details"
                        >
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Duel #7842</p>
                            <p className="mt-2 text-sm font-black font-headline text-white">vs Kwadwo_Striker</p>
                            <p className="mt-1 text-[10px] text-primary font-bold uppercase tracking-wider">Live - GW24</p>
                        </Link>
                        <Link
                            className="obsidian-panel rounded-xl p-4 border border-white/10 hover:border-primary/40 transition-colors"
                            to="/duel-details"
                        >
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Duel #7781</p>
                            <p className="mt-2 text-sm font-black font-headline text-white">vs Ama_Elite</p>
                            <p className="mt-1 text-[10px] text-secondary font-bold uppercase tracking-wider">Winning</p>
                        </Link>
                        <Link
                            className="obsidian-panel rounded-xl p-4 border border-white/10 hover:border-primary/40 transition-colors"
                            to="/duel-details"
                        >
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Duel #7704</p>
                            <p className="mt-2 text-sm font-black font-headline text-white">vs Nana_FPL</p>
                            <p className="mt-1 text-[10px] text-white/50 font-bold uppercase tracking-wider">Pending</p>
                        </Link>
                    </div>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                    {/* Left: Input Form */}
                    <div className="md:col-span-7 space-y-8">
                        <div className="obsidian-panel p-10 rounded-2xl">
                            <label
                                className="block text-white/40 font-headline font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Duel
                                Invitation Code</label>
                            <div
                                className="relative group input-focus-ring border border-white/10 bg-black rounded-xl overflow-hidden transition-all duration-300">
                                <input
                                    className="w-full bg-transparent border-none py-8 px-8 text-3xl font-headline font-bold text-primary placeholder:text-white/5 focus:ring-0 uppercase tracking-[0.25em]"
                                    placeholder="FD-XXXX-XXXX" type="text" />
                                <div className="absolute inset-y-0 right-8 flex items-center">
                                    <button className="text-white/20 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-3xl"
                                            data-icon="qr_code_scanner">qr_code_scanner</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-6">
                                <span className="material-symbols-outlined text-white/20 text-sm"
                                    data-icon="security">security</span>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Codes are
                                    private and single-use</p>
                            </div>
                        </div>
                        {/* Enhanced Info Card */}
                        <div
                            className="flex gap-5 p-6 bg-secondary-container/5 border border-secondary-container/10 rounded-2xl items-center">
                            <div
                                className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-secondary text-xl"
                                    data-icon="info">info</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Instant Preview
                                </h4>
                                <p className="text-xs text-white/40 leading-relaxed">Enter a code to automatically reveal
                                    your opponent's stats and the prize pool before confirming entry.</p>
                            </div>
                        </div>
                    </div>
                    {/* Right: Preview Card */}
                    <div className="md:col-span-5">
                        <div className="obsidian-panel rounded-2xl overflow-hidden shadow-2xl relative">
                            {/* Premium Background Glow */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px]"></div>
                            {/* Card Header Image */}
                            <div className="relative h-44">
                                <img className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0tNzZoN3P7Jud4L-RE7GwGq7IZjxPoeqGp_wBesuk_R3qXziaBWGK1SzY7EIK65EI-3-2a2wliw4JAOyHDL1dfSaaLCged4a_yA1ISTFSx-jwKElZ7jnTzYuqZqWot7Vv5D5Bd8B-bqMRnc7W2b0IVOlScnHSQKp5ljC2yAx3LCxSog199Mk5lQlqG5SRZEjJAGQwS3qsXqLZ9lg1nPgKFRYZiAMJq9L20_h2tIljJZvd_T5dSWBFdY6MzgALCUOjh0-5micBU8jF" />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent">
                                </div>
                                <div className="absolute top-6 left-6 flex items-center gap-2">
                                    <span
                                        className="bg-primary/20 backdrop-blur-md text-primary text-[9px] font-black px-2.5 py-1 rounded border border-primary/20 uppercase tracking-tighter">Gold
                                        Elite Duel</span>
                                    <span
                                        className="bg-black/50 backdrop-blur-md text-white/70 text-[9px] font-black px-2.5 py-1 rounded border border-white/10 uppercase tracking-tighter">Verified</span>
                                </div>
                            </div>
                            {/* Card Content */}
                            <div className="px-8 pb-10 -mt-12 relative z-10 space-y-8">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em]">
                                            Opponent</p>
                                        <h3
                                            className="text-2xl font-headline font-black text-white uppercase italic tracking-tight">
                                            Kwadwo_Striker</h3>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
                                        <img className="h-16 w-16 rounded-xl border-2 border-primary/30 relative z-10 grayscale hover:grayscale-0 transition-all duration-500"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSFRUjcRg6bRQRNjCYvsFyrXAQitLH4eLehRgv1iZWW_w9tbLI7QNbAmuBCpCoDNvmaxPAI3OX8ucJ-TZCWQohwN8IvIbkXhA2UrUmM6_U-slfBN9kTerwP_MlHwcGzvwLMSey203lNmRGaUFBqpKPBGTZh_SmMYlsJUtNvpwPw7ryirBizJ5dUvTFvv5Ibp0lseICa8My2sZ3m9DFRRzuSkTz2XykR_dVlcrCoBwC2MdD7WrdAPAsVgXY9zEt7MpPG9map8JyQ1sY" />
                                    </div>
                                </div>
                                <div
                                    className="grid grid-cols-2 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                                    <div className="bg-surface-container-high p-5">
                                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-1">
                                            Gameweek</p>
                                        <p className="text-xl font-headline font-bold text-white italic">GW 24</p>
                                    </div>
                                    <div className="bg-surface-container-high p-5 text-right">
                                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-1">
                                            Entry Fee</p>
                                        <p className="text-xl font-headline font-bold text-primary">₵50.00</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div
                                        className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                                        <span className="text-white/40">Prize Pool</span>
                                        <span className="text-secondary italic">₵90.00 Winner Takes All</span>
                                    </div>
                                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent">
                                    </div>
                                    <div
                                        className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                                        <span className="text-white/40">Platform Fee</span>
                                        <span className="text-white/80">₵10.00</span>
                                    </div>
                                </div>
                                <Link
                                    className="block w-full text-center gold-glow-button py-6 rounded-xl text-on-primary font-headline font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.04] active:scale-[0.96] transition-all duration-300"
                                    to="/duel-details">
                                    Confirm &amp; Pay ₵50
                                </Link>
                            </div>
                        </div>
                        <p
                            className="mt-8 text-[9px] text-center text-white/20 font-bold px-8 uppercase tracking-[0.2em] leading-loose">
                            Automated smart-match distribution system. Terms &amp; conditions apply.
                        </p>
                    </div>
                </div>
            </div>
        </main>
        {/* BottomNavBar (Mobile only) */}
        <nav
            className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 bg-background/95 backdrop-blur-xl z-50 border-t border-white/5">
            <a className="flex flex-col items-center justify-center text-white/40 px-4" href="#">
                <span className="material-symbols-outlined text-2xl" data-icon="grid_view">grid_view</span>
            </a>
            <a className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-2xl h-14 w-14"
                href="#">
                <span className="material-symbols-outlined text-2xl" data-icon="swords">swords</span>
            </a>
            <a className="flex flex-col items-center justify-center text-white/40 px-4" href="#">
                <span className="material-symbols-outlined text-2xl" data-icon="groups">groups</span>
            </a>
            <a className="flex flex-col items-center justify-center text-white/40 px-4" href="#">
                <span className="material-symbols-outlined text-2xl"
                    data-icon="account_balance_wallet">account_balance_wallet</span>
            </a>
        </nav>
    </div>
    </div>
  );
}

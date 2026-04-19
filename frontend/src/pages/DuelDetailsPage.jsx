import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
export default function DuelDetailsPage() {
  return (
    <div className="page-duel-details bg-background text-on-background font-body min-h-screen flex">
{/* SideNavBar (Desktop Shell) */}
    <Sidebar />
    {/* Main Content Canvas */}
    <main className="flex-1 lg:ml-64 min-w-0 relative pb-20 lg:pb-0">
        {/* TopAppBar */}
        <header
            className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 border-b border-white/5">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-primary">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-xl font-bold italic text-white/90 font-headline uppercase tracking-tight">Duel <span
                        className="text-primary">#7842</span></h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-8">
                    <a className="text-on-surface-variant/60 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest font-headline"
                        href="#">Rules</a>
                    <a className="text-on-surface-variant/60 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest font-headline"
                        href="#">History</a>
                </div>
                <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1 border border-white/5">
                    <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                    <span className="text-xs font-black">2,450 GHS</span>
                </div>
            </div>
        </header>
        <div className="pt-24 px-6 lg:px-16 max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <Link
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80"
                    to="/join-duel">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Duels
                </Link>
            </div>
            {/* Match Header */}
            <section className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div className="flex flex-col">
                        <span
                            className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#88d982]"></span>
                            Live Gameweek 24
                        </span>
                        <h3
                            className="text-5xl lg:text-6xl font-black font-headline uppercase tracking-tighter leading-none">
                            High Roller Duel</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Prize
                                Pool</span>
                            <div
                                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-primary font-black font-headline text-xl tracking-tight">
                                1,000 GHS
                            </div>
                        </div>
                        <div className="h-12 w-px bg-white/10 mx-2"></div>
                        <div
                            className="px-6 py-3 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm"
                                style={{fontVariationSettings: '\'FILL\' 1'}}>bolt</span>
                            Active
                        </div>
                    </div>
                </div>
                {/* VS Broadcast View */}
                <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
                    {/* Player 1 */}
                    <div className="lg:col-span-5 obsidian-card leader-glow rounded-2xl overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-1 stadium-glow opacity-50"></div>
                        <div className="absolute top-6 right-6 z-20">
                            <div
                                className="bg-primary/10 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[12px]"
                                    style={{fontVariationSettings: '\'FILL\' 1'}}>star</span>
                                Leader
                            </div>
                        </div>
                        <div className="flex flex-col p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <div
                                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 bg-surface-container-highest">
                                        <img alt="Player 1" className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVLyaRVM_xKS6Q7Q5nlEbKb82PXQlMlCwq64JbWFKQ8wNx9XlvHx_fpZdabUOvvFAGtXFtfFBSX5UZHDR2rpyhXDH5zCehsxDyuDyE0os7svrIxEK6XWa0Ujj_uA5CcemI8YMRWAwEswWZVuJHy9sYKboyn43NnbqRUaAw8pMmcdTRF7pr0bL83vqvicHd_nXvA_INgghMtEpPYu0MhftaAHYGWNQBj-uTzjS9jdGSZTWAP_nPoXyhIAvA_Y1f77Z730NPKOu650E1" />
                                    </div>
                                    <div
                                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full stadium-glow flex items-center justify-center text-on-primary font-black text-sm border-4 border-[#0e0e0e]">
                                        1</div>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black font-headline uppercase tracking-tighter">Kojo Mensah
                                    </h4>
                                    <p
                                        className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1 opacity-70">
                                        Mensah United FC</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live
                                            Score</span>
                                        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-5xl font-black font-headline text-white tracking-tighter">78</span>
                                        <span className="text-primary text-xs font-bold font-headline">PTS</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span
                                            className="text-[9px] font-black text-white/40 uppercase tracking-widest">Squad
                                            Status</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black font-headline text-white/90">3</span>
                                        <span className="text-white/30 text-xs font-bold">/ 11 LEFT</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[27%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* VS Divider */}
                    <div className="lg:col-span-1 flex flex-col items-center justify-center h-full broadcast-vs">
                        <div
                            className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block">
                        </div>
                        <div
                            className="my-4 text-4xl font-black italic font-headline text-white/20 tracking-tighter scale-150">
                            VS</div>
                        <div
                            className="w-px h-16 bg-gradient-to-t from-transparent via-white/20 to-transparent hidden lg:block">
                        </div>
                    </div>
                    {/* Player 2 */}
                    <div
                        className="lg:col-span-5 obsidian-card rounded-2xl overflow-hidden relative group opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex flex-col p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <div
                                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 bg-surface-container-highest grayscale">
                                        <img alt="Player 2" className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB23aJgsjhpYJ1JIhv4wo4XhOYHeAsT_iqcsObykS6UmlZS3hN7xt0f_-2mkH5f4NZ0-frTO64rzcl7C_gA7gSdsqL-hcTn_uFZ1Kr9KOFyrDXYe-1FpP0ty-dYrqkWyDZV72-DZP1MtzpDuHyG57twg6lERkEm3oHudFS8ca9A2F2JhdQU7phSEmsrfbBCyFZc9xfbpRgme-6aZ5cPRtoiV8xsexEITeyvMYxibZOnWAGdwDwiUKT9sgXnCM-ZupI3Kk4u6WVOa1Uj" />
                                    </div>
                                    <div
                                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-black text-sm border-4 border-[#0e0e0e]">
                                        2</div>
                                </div>
                                <div>
                                    <h4
                                        className="text-3xl font-black font-headline uppercase tracking-tighter text-white/70">
                                        Ama Serwaa</h4>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Star
                                        Girl XI</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live
                                            Score</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-5xl font-black font-headline text-white/60 tracking-tighter">64</span>
                                        <span className="text-white/20 text-xs font-bold font-headline uppercase">pts</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span
                                            className="text-[9px] font-black text-white/40 uppercase tracking-widest">Squad
                                            Status</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black font-headline text-white/60">5</span>
                                        <span className="text-white/20 text-xs font-bold uppercase">/ 11 left</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/40 w-[45%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Detailed Stats */}
            <section className="mt-16 pb-24">
                <div className="flex items-center gap-6 mb-8">
                    <h5 className="font-headline font-black text-xl uppercase tracking-[0.2em] text-white/90">Elite
                        Performance Analysis</h5>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat Card 1 */}
                    <div className="obsidian-card rounded-xl p-7 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl">person_pin</span>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Captain
                            Performance</span>
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-white/40 mb-1 uppercase">Haaland (C)</p>
                                <p className="text-4xl font-black font-headline text-primary tracking-tighter">26</p>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/40 mb-1 uppercase">Salah (C)</p>
                                <p className="text-4xl font-black font-headline text-white/40 tracking-tighter">14</p>
                            </div>
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="obsidian-card rounded-xl p-7 border-t border-white/5">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Squad
                            Valuation</span>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-3xl font-black font-headline tracking-tighter">102.4<span
                                        className="text-sm font-bold ml-1 opacity-40">M</span></p>
                            </div>
                            <span className="material-symbols-outlined text-white/20 text-3xl">compare_arrows</span>
                            <div className="flex flex-col items-end">
                                <p className="text-3xl font-black font-headline tracking-tighter text-white/60">101.8<span
                                        className="text-sm font-bold ml-1 opacity-40">M</span></p>
                            </div>
                        </div>
                        <div className="w-full h-[2px] bg-white/5 mt-4 flex rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40" style={{width: '50.5%'}}></div>
                            <div className="h-full bg-white/10" style={{width: '49.5%'}}></div>
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="obsidian-card rounded-xl p-7 border-t border-white/5">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Win
                            Probability</span>
                        <div className="mt-6">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-3xl font-black font-headline text-primary tracking-tighter">68%</span>
                                <span className="text-sm font-black font-headline text-white/20 tracking-widest">32%</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-sm overflow-hidden flex gap-1">
                                <div className="h-full stadium-glow shadow-[0_0_15px_rgba(255,211,123,0.3)]"
                                    style={{width: '68%'}}></div>
                                <div className="h-full bg-white/10" style={{width: '32%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Winner Celebration Mockup (Hidden by default, used when finished) */}
                <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 hidden">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-4xl"
                                style={{fontVariationSettings: '\'FILL\' 1'}}>emoji_events</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Duel
                                Concluded</span>
                            <h4 className="text-3xl font-black font-headline uppercase tracking-tighter">Winner: Kojo Mensah
                            </h4>
                            <p className="text-white/40 text-sm mt-1">+500 GHS Profit credited to wallet</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
    {/* BottomNavBar (Mobile) */}
    <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-background/90 backdrop-blur-xl z-50 border-t border-white/10">
        <a className="flex flex-col items-center justify-center text-white/40 py-1" href="#">
            <span className="material-symbols-outlined text-xl">home</span>
            <span className="text-[9px] font-black uppercase mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary py-1" href="#">
            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: '\'FILL\' 1'}}>swords</span>
            <span className="text-[9px] font-black uppercase mt-1">Duels</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white/40 py-1" href="#">
            <span className="material-symbols-outlined text-xl">sports_score</span>
            <span className="text-[9px] font-black uppercase mt-1">Pools</span>
        </a>
        <a className="flex flex-col items-center justify-center text-white/40 py-1" href="#">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            <span className="text-[9px] font-black uppercase mt-1">Wallet</span>
        </a>
    </nav>
    </div>
  );
}

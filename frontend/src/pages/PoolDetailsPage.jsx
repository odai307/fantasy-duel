import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
export default function PoolDetailsPage() {
  const location = useLocation();
  const pool = location.state?.pool;
  const entryFee = Number(pool?.entryFee ?? 250);
  const maxParticipants = pool?.maxParticipants === null ? null : (pool?.maxParticipants ?? 150);
  const gameweekLabel = pool?.gameweekLabel ?? 'GW 24';
  const poolName = pool?.name ?? 'Elite Strikers Hub';
  const visibility = pool?.visibility ?? 'PUBLIC';

  return (
    <div className="page-pool-details bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
<div className="flex min-h-screen">
        {/* SideNavBar */}
        <Sidebar />
        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-20">
            {/* TopNavBar */}
            <header
                className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-outline-variant/10 flex justify-between items-center px-6 h-16">
                <div className="flex items-center gap-4">
                    <button className="lg:hidden text-primary">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span
                        className="font-headline uppercase tracking-tighter text-[#ffd37b] font-bold border-b-2 border-[#ffd37b] pb-1">Pool
                        Overview</span>
                </div>
                <div className="flex items-center gap-6">
                    <div
                        className="hidden md:flex items-center gap-4 text-xs font-headline uppercase tracking-widest text-on-surface-variant/70">
                        <span>Active Duels: 14</span>
                        <div className="h-4 w-[1px] bg-outline-variant/30"></div>
                        <span>GW 24 Deadline: 12h 45m</span>
                    </div>
                    <button className="text-[#ffd37b] hover:scale-102 transition-transform duration-200">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </button>
                </div>
            </header>
            {/* Content Canvas */}
            <div className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="mb-6">
                    <Link
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80"
                        to="/pools-list">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Pools
                    </Link>
                </div>
                {/* Obsidian Gold Hero Section */}
                <div className="relative overflow-hidden rounded-2xl obsidian-card mb-12 p-10 border border-primary/10">
                    <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full">
                    </div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6">
                            <span
                                className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">
                                {visibility === 'PRIVATE' ? 'Private Pool' : 'Public Pool'}
                            </span>
                            <h2
                                className="text-5xl lg:text-7xl font-black font-headline text-on-surface leading-tight uppercase mb-6 tracking-tighter">
                                {poolName}</h2>
                            <div className="flex items-center gap-6">
                                <div
                                    className="bg-secondary/10 px-4 py-1.5 rounded-full flex items-center gap-2 border border-secondary/20">
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Live
                                        Track</span>
                                </div>
                                <span
                                    className="text-on-surface-variant/70 text-sm font-medium font-headline uppercase tracking-widest">{gameweekLabel} • Season 24/25</span>
                            </div>
                        </div>
                        <div
                            className="lg:col-span-3 flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                            <span
                                className="text-on-surface-variant text-[10px] uppercase font-bold tracking-[0.2em] mb-2 opacity-60">Entry
                                Fee</span>
                            <div className="text-4xl font-black text-primary font-headline italic tracking-tighter">GH₵
                                {entryFee.toFixed(2)}</div>
                        </div>
                        <div className="lg:col-span-3">
                            <span
                                className="text-on-surface-variant text-[10px] uppercase font-bold tracking-[0.2em] mb-4 block opacity-60">Prize
                                Pool Distribution</span>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="opacity-70 font-medium">1st Place (60%)</span>
                                        <span className="text-primary font-black">GH₵ 12,000</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{width: '60%'}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="opacity-70 font-medium">2nd Place (30%)</span>
                                        <span className="font-bold">GH₵ 6,000</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-white/20" style={{width: '30%'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Leaderboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Main Leaderboard Table */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <h3
                                className="text-2xl font-black font-headline uppercase tracking-tight flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-3xl">leaderboard</span>
                                Live Rankings
                            </h3>
                            <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
                                <button
                                    className="px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 hover:text-white transition-all">By
                                    Gameweek</button>
                                <button
                                    className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">Overall</button>
                            </div>
                        </div>
                        {/* Table Headers */}
                        <div
                            className="grid grid-cols-12 px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 border-b border-outline-variant/10">
                            <div className="col-span-1">Pos</div>
                            <div className="col-span-6">Manager &amp; Team</div>
                            <div className="col-span-2 text-right">GW Points</div>
                            <div className="col-span-3 text-right">Total Points</div>
                        </div>
                        {/* Participants List */}
                        <div className="space-y-3 mt-4">
                            {/* Ranked 1 (Obsidian Gold Highlight) */}
                            <div
                                className="grid grid-cols-12 items-center px-8 py-6 obsidian-card border-l-4 border-primary rounded-xl group hover:scale-[1.01] transition-all cursor-pointer gold-glow">
                                <div className="col-span-1 text-primary font-black font-headline text-2xl">01</div>
                                <div className="col-span-6 flex items-center gap-5">
                                    <div className="relative">
                                        <div
                                            className="absolute -inset-1 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all">
                                        </div>
                                        <img className="relative w-12 h-12 rounded-full border-2 border-primary object-cover"
                                            data-alt="close-up portrait of a confident male football manager avatar with professional aesthetic"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtL4EOPikzkEpEmxvOViX2VUdJvb621aH3_C2y4EzNKdgrs6MCSXTm60mnmAgsxYBrSeCXhbyQVs4M85bWpEwragFQXpQbhJUAcoAvJSxFMzbpS4EB8l5lPfg6j2jn-KXDytNfCdmPiKrTe4RzGndcE6MlyP4P8ieOhOkpqLwb7SJ8zcUpkWeqKz17Y9XAVcTPvPxK2qlk4YxMh9qXYY-ZKYG-bRygFKEs8PW2bh9uinTwVqv6m_Q-xaue1iambLEY1VLLwVA-RmgV" />
                                        <span
                                            className="absolute -top-1 -right-1 bg-primary text-on-primary text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm">MVP</span>
                                    </div>
                                    <div>
                                        <div
                                            className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                                            Kofi Mensah</div>
                                        <div
                                            className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                            Accra United FC</div>
                                    </div>
                                </div>
                                <div className="col-span-2 text-right font-headline text-2xl font-bold text-secondary">82
                                </div>
                                <div className="col-span-3 text-right font-headline text-2xl font-black">1,452</div>
                            </div>
                            {/* Ranked 2 */}
                            <div
                                className="grid grid-cols-12 items-center px-8 py-6 bg-surface-container-low/40 border border-white/5 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer group">
                                <div
                                    className="col-span-1 text-on-surface-variant/30 font-black font-headline text-2xl group-hover:text-white transition-colors">
                                    02</div>
                                <div className="col-span-6 flex items-center gap-5">
                                    <img className="w-12 h-12 rounded-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-white/10"
                                        data-alt="portrait avatar of a female gamer with athletic gear and focused expression"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO5R3YQJtuUEe5LmbP_CFzLmP0DohyDZMiVV4HRem5ULvCRRhgH4rgkAXb6K8vKrvJCcg81pCg8bdaOOkdoa0xYwUW06a3Lqw71g1pcrEFRkN3HolgNF6ifcpKiIaO0oa7GTWwwiRjEORxP0Kt_Gw0v1YATa1XECmK7iYuBlS4lD0XffkJDxPDSsOIWbU6zH179td2GE1i6Lq01KLeBcbkUXMWgDRCMA8BLqYo2WDhBo-pTT7ZEvGtOZ5o6CJbzIVNhzzTUBUjtizK" />
                                    <div>
                                        <div className="font-bold text-lg text-on-surface">Abena Serwaa</div>
                                        <div
                                            className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                            Queen Stars</div>
                                    </div>
                                </div>
                                <div
                                    className="col-span-2 text-right font-headline text-xl font-bold text-on-surface-variant/80">
                                    74</div>
                                <div className="col-span-3 text-right font-headline text-xl font-bold">1,418</div>
                            </div>
                            {/* Ranked 3 */}
                            <div
                                className="grid grid-cols-12 items-center px-8 py-6 bg-surface-container-low/40 border border-white/5 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer group">
                                <div
                                    className="col-span-1 text-on-surface-variant/30 font-black font-headline text-2xl group-hover:text-white transition-colors">
                                    03</div>
                                <div className="col-span-6 flex items-center gap-5">
                                    <img className="w-12 h-12 rounded-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-white/10"
                                        data-alt="stylized avatar of a male football fan with a team jersey and excited expression"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-RmD0bIXu2G_gwRlfhZJN33pLSAEh_q5k-Z7iXzOpCyGOAEPVYmXEDpB1TetbKlgotejY-3pa72wlEXCuV3_fVw4BcawgJApcmQt_MrK5wV820ZbgWQxNdU3d0pI4u8v-9Ep__dFkmBg--nF_3YTuNSSiWC6wpG4d9Ze_wVcX4cAUxN8gn8TPRQwySuHXtDrl1XHEj04dHN1GJi1ZBp-edaTbKCAcBQ8B6BeZu_utVn2j_JrVFY_2s2KGrkc5XouiEsePbEULzONi" />
                                    <div>
                                        <div className="font-bold text-lg text-on-surface">Yaw Boateng</div>
                                        <div
                                            className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                            Kumasi Kings</div>
                                    </div>
                                </div>
                                <div
                                    className="col-span-2 text-right font-headline text-xl font-bold text-on-surface-variant/80">
                                    71</div>
                                <div className="col-span-3 text-right font-headline text-xl font-bold">1,405</div>
                            </div>
                            {/* Current User Rank (High-Performance Context Card) */}
                            <div
                                className="grid grid-cols-12 items-center px-8 py-6 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                                <div className="col-span-1 text-primary/40 font-black font-headline text-2xl relative">14
                                </div>
                                <div className="col-span-6 flex items-center gap-5 relative">
                                    <img className="w-12 h-12 rounded-full ring-2 ring-primary ring-offset-4 ring-offset-background object-cover"
                                        data-alt="professional user profile placeholder avatar with soft lighting"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa4Qxpd7ZL_gV_pG_ElgUPnbKHQcM9Rpmzdfwk8ND8K7LfJDBodpGX6hnd3k7KWkwUDXaBSeimBs0mjoQGFMolxl-Eevi-OG308MdS3gAkkCnQiCpSj_XoDy1zwvPO1k9Yz1BrBqcZSNgbaLZtnJlHxPEzxOICHhk8Fw9-os36rTB-g-DXWRkrgFDJEh27kKs8DX6duTJfnLeZ5O7zRLAiIkEZ_jm48J4cHpxqr1hIHxQ5vzsHHbw6QSxjn3PS41E1IYCqOiS5spR1" />
                                    <div>
                                        <div className="font-black text-lg text-primary italic uppercase tracking-tight">You
                                            (Kwame)</div>
                                        <div
                                            className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                            Black Star Tactics</div>
                                    </div>
                                </div>
                                <div
                                    className="col-span-2 text-right font-headline text-xl font-bold text-on-surface relative">
                                    58</div>
                                <div className="col-span-3 text-right font-headline text-xl font-black relative">1,288</div>
                            </div>
                            {/* Standard Row */}
                            <div
                                className="grid grid-cols-12 items-center px-8 py-6 bg-surface-container-low/20 border border-white/5 rounded-xl opacity-60 hover:opacity-100 transition-all cursor-pointer">
                                <div className="col-span-1 text-on-surface-variant/30 font-black font-headline text-2xl">15
                                </div>
                                <div className="col-span-6 flex items-center gap-5">
                                    <img className="w-12 h-12 rounded-full grayscale opacity-50 border border-white/5"
                                        data-alt="minimalist avatar of a male gamer with sleek modern design"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2a6I6cDZWCozxtU8nBjdIYQJo4M3d4fBm315q_3Ot1G43s8O7Ss3Mis6KcAe-93nWjfY4Z-XLWqasGfBcgya4fIJ9MstB5w6-aXqFjSyQmKZ1uPRpLs88OQLVcXltn5TD4JzOwHbgykXOpcyCn1XHKGmC-1e5foREtA9Nbiij3vpUkIJNDBq4yyseHq6otcrhpbLMPnsvtyi6qHoA3zI2EgAkmrZwhZXNkSoWVVIJbOPOHx8zfxXGbBfYpCLjHMW3HC8qpG9xOoUi" />
                                    <div>
                                        <div className="font-bold text-lg text-on-surface">Ekow Smith</div>
                                        <div
                                            className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                            Coastal FC</div>
                                    </div>
                                </div>
                                <div
                                    className="col-span-2 text-right font-headline text-xl font-bold text-on-surface-variant/60">
                                    54</div>
                                <div className="col-span-3 text-right font-headline text-xl font-bold">1,275</div>
                            </div>
                        </div>
                        <div className="mt-12 flex justify-center">
                            <button
                                className="flex items-center gap-3 px-10 py-4 bg-surface-container-highest/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all border border-white/5">
                                Load Full Leaderboard
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                        </div>
                    </div>
                    {/* Sidebar Stats & Insights */}
                    <div className="space-y-8">
                        {/* Pool Status Card */}
                        <div className="obsidian-card rounded-2xl p-8">
                            <h4
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                Pool Pulse
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="opacity-60 font-medium">Participants</span>
                                        <span className="font-black text-on-surface">
                                            {maxParticipants === null ? 'Unlimited' : `1 / ${maxParticipants}`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full rounded-full" style={{width: '85%'}}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-white/5">
                                    <span className="text-xs opacity-60 font-medium">Avg. GW Score</span>
                                    <span className="font-black text-secondary text-lg">62.4</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs opacity-60 font-medium">Status</span>
                                    <span
                                        className="bg-secondary/10 text-secondary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-secondary/20">Verified</span>
                                </div>
                            </div>
                        </div>
                        {/* Top Captains Section */}
                        <div className="bg-surface-container-low/40 rounded-2xl p-8 border border-white/5">
                            <h4
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70 mb-6">
                                Captained (GW 24)</h4>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 group">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-primary text-sm group-hover:scale-110 transition-transform">
                                        1</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-on-surface">Erling Haaland</div>
                                        <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold">MCI • 72%
                                            Ownership</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-surface-container-highest/50 flex items-center justify-center font-black text-on-surface-variant text-sm group-hover:scale-110 transition-transform">
                                        2</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-on-surface">Mohamed Salah</div>
                                        <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold">LIV • 14%
                                            Ownership</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div
                                        className="w-10 h-10 rounded-xl bg-surface-container-highest/50 flex items-center justify-center font-black text-on-surface-variant text-sm group-hover:scale-110 transition-transform">
                                        3</div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-on-surface">Bukayo Saka</div>
                                        <div className="text-[9px] uppercase tracking-widest opacity-50 font-bold">ARS • 9%
                                            Ownership</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* CTA Promo */}
                        <div
                            className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-primary-container group cursor-pointer border border-primary/20">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10">
                            </div>
                            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                                data-alt="cinematic shot of a professional football stadium illuminated by floodlights at night with a vibrant atmosphere"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm9eszj4Hv8j56LB6CzbsG7i9gdwKGHlEDfd7_1eWUn8xi0D_rzZ7SEh5QnFIrnKblgGdOuFudRcFNaav2fTvfLoMfzsfJDGwfpDI7rfELbWOZnGUFAM6jIK799rpNqz6mvfgcJDXZ1WiED_FaIg--LzLdV2tHY7D8UMGITze_Lzuwru_Jto30YJtdUTlQfXPxCupadkftpvLbd0LnHPQWvqxbWcN5PzMD2YxQk5xkm2N0LRKG89qlV7TCzIblYIH6UDk4elaFAOlu" />
                            <div
                                className="absolute inset-0 z-15 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                            <div className="relative z-20 h-full flex flex-col justify-end p-8">
                                <span
                                    className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">Premium
                                    Access</span>
                                <h5 className="text-2xl font-black font-headline uppercase leading-tight text-white mb-6">
                                    Unlock Scout Insights</h5>
                                <button
                                    className="w-full py-4 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Get
                                    Pro Membership</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        {/* BottomNavBar (Mobile Only) */}
        <nav
            className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-[#131313]/90 backdrop-blur-xl border-t border-primary/10 z-50">
            <Link className="flex flex-col items-center justify-center text-white/40" to="/dashboard">
                <span className="material-symbols-outlined text-2xl">home</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Home</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-white/40" to="/create-duel">
                <span className="material-symbols-outlined text-2xl">swords</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Duels</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-primary" to="/pools-list">
                <span className="material-symbols-outlined text-2xl">groups</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Pools</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-white/40" to="/leaderboard">
                <span className="material-symbols-outlined text-2xl">leaderboard</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Rankings</span>
            </Link>
            <Link className="flex flex-col items-center justify-center text-white/40" to="/wallet">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Wallet</span>
            </Link>
        </nav>
    </div>
    </div>
  );
}

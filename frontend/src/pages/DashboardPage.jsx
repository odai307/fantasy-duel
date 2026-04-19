import Sidebar from '../components/Sidebar';
export default function DashboardPage() {
  return (
    <div className="page-dashboard bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
<div className="flex min-h-screen">
        {/* SideNavBar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen pb-20 lg:pb-8">
            {/* TopNavBar */}
            <header
                className="fixed top-0 lg:left-64 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center px-8 h-16">
                <div className="flex items-center gap-4">
                    <h2 className="font-headline uppercase tracking-tighter text-primary font-black italic text-2xl">
                        Dashboard</h2>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8 items-center">
                        <span
                            className="text-primary font-bold border-b-2 border-primary pb-1 font-headline uppercase text-xs tracking-[0.2em]">Overview</span>
                        <span
                            className="text-on-surface-variant font-headline uppercase text-xs tracking-[0.2em] cursor-pointer hover:text-on-surface transition-colors">Insights</span>
                        <span
                            className="text-on-surface-variant font-headline uppercase text-xs tracking-[0.2em] cursor-pointer hover:text-on-surface transition-colors">History</span>
                    </div>
                    <button className="text-primary hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                        <img alt="User profile" className="w-full h-full rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvGlkAIRkRess_4d4eZw7I5MCq_e0Vz3wnWVymFN_621zQtX27zFblc1yClv8D-1HLo-Xa2YNrZD2fqDnLBvF4Ht5MAsX4p_-KhWbRADbTVt22gqgKTd8-1eKV6-Xfow3251WTErppVLQ9tJ1VUBUBP2TdhCBVqXZBcO6_85r-ldmaZPEMIL2GpsmRS27HxmyzEpaCltH8GcRugeWrRJbO56TlDi659YJDZUUTLuCM-7Ng0F0bZAi70YU0sR2_drCa-6AoAK39Sha" />
                    </div>
                </div>
            </header>
            <div className="pt-24 px-8 max-w-7xl mx-auto space-y-8">
                {/* Hero Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Premium Wallet Card */}
                    <div className="lg:col-span-8 obsidian-panel rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full"></div>
                        <div className="relative z-10">
                            <p
                                className="text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold mb-4 flex items-center gap-2">
                                Available Balance
                                <span className="h-[1px] w-12 bg-outline-variant"></span>
                            </p>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <span
                                            className="text-primary font-headline text-2xl font-bold opacity-80 italic">GHS</span>
                                        <span
                                            className="text-on-surface font-headline text-6xl font-black tracking-tighter gold-glow-text">12,450.00</span>
                                    </div>
                                    <div
                                        className="mt-4 flex items-center gap-2 text-secondary bg-secondary/10 px-3 py-1 rounded-full w-fit">
                                        <span className="material-symbols-outlined text-sm">trending_up</span>
                                        <span className="text-xs font-bold uppercase tracking-widest">+12.4% Profit</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        className="flex-1 md:flex-none gold-gradient text-on-primary px-8 py-3.5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_8px_20px_rgba(243,190,77,0.15)]">
                                        Create Duel
                                    </button>
                                    <button
                                        className="flex-1 md:flex-none bg-surface-container-highest border border-outline-variant text-on-surface px-8 py-3.5 rounded-xl font-headline font-bold uppercase tracking-widest text-xs hover:bg-surface-container-high transition-colors">
                                        Join Duel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Live FPL Score */}
                    <div
                        className="lg:col-span-4 obsidian-panel rounded-2xl p-8 flex flex-col justify-between border-l-4 border-l-secondary relative">
                        <div className="flex justify-between items-start mb-6">
                            <p className="text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold">FPL
                                SCORE</p>
                            <div
                                className="bg-secondary/20 text-secondary text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-secondary/30">
                                <span
                                    className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#88d982]"></span>
                                LIVE GW24
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-headline text-7xl font-black text-on-surface tracking-tighter">74</span>
                            <div className="text-right">
                                <p className="text-on-surface-variant text-[10px] uppercase font-bold mb-1 opacity-60">
                                    Projected</p>
                                <p className="font-headline text-2xl font-bold text-secondary">82</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[74%] shadow-[0_0_12px_rgba(136,217,130,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Dashboard Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Active Duels */}
                    <div className="md:col-span-8 space-y-4">
                        <div className="flex justify-between items-end mb-2 px-1">
                            <h3 className="font-headline text-2xl font-black uppercase tracking-tighter italic">Active Duels
                            </h3>
                            <a className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity border-b border-primary/30 pb-0.5"
                                href="#">View All History</a>
                        </div>
                        {/* Duel Card 1 */}
                        <div
                            className="obsidian-panel rounded-xl p-6 hover:bg-surface-container-high/50 transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-primary">sports_kabaddi</span>
                                    </div>
                                    <div>
                                        <p
                                            className="font-headline font-bold text-on-surface uppercase text-sm tracking-tight">
                                            The High Roller Clash</p>
                                        <p
                                            className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                                            Head-to-Head Duel</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-60">
                                        Prize Pool</p>
                                    <p className="font-headline font-black text-primary text-xl tracking-tight">GHS 500.00
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-12 relative items-center">
                                <div
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-headline font-black italic text-white/5 text-5xl select-none">
                                    VS</div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img className="w-8 h-8 rounded-full border border-primary/20"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjCyWDwvTCTPJN3WW4AMeRFzHZghHiHLotsvaLRABgm3dpuDUsTeqnJ0Se9RjUj5JO5oM6jRak8F76Fpfsq5KHBm0YwK2f3qxAZd4e3kZ-u7X14xmZAW6udoCZG98Q6SJicXC0p3T6LL7yMv7zOrz2zADx3NW4JiElWr1bFylNT9ReoRPfcjgvY66doF_TObo8i8UUgxpGkhzb_v1SGwr2C8E7LYYwAwuW9UkL0I3nTiLq2VQbMKipgGSRMRGbc1SbOYttWdMTQrK4" />
                                        <span className="text-xs font-bold uppercase tracking-tight">Kwesi_FPL <span
                                                className="text-[10px] text-primary">(You)</span></span>
                                    </div>
                                    <div
                                        className="bg-surface-container-highest/50 p-4 rounded-xl border border-outline-variant/10 flex justify-between items-center">
                                        <span
                                            className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Score</span>
                                        <span className="font-headline font-black text-on-surface text-xl">74</span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-right">
                                    <div className="flex items-center gap-3 justify-end">
                                        <span className="text-xs font-bold uppercase tracking-tight">Abena_United</span>
                                        <img className="w-8 h-8 rounded-full border border-outline-variant"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1Jsa8HHYj-vQ616_39Yb1ODM9OZTtWaAPAm-bgmJsadr8iRe2kVyaykJ5fnCDc51fJM_3aJDpN5JUzKYRoBBORWZAZNkanhxOPD14ZItXg8-YR-OmSBC00HU_c2peBlKL9E6A-VY935hYX4BESzREA0TykVPxuj6yPksj1cEYsfygZO_UVoZJUG3rzBeD_MswnGekg5xPpVIx88jhYpdcffHusz61NSBjgsdC-S30_gE2osLsLDJfpYM3OLH-OulxWQLLYYW2KcLf" />
                                    </div>
                                    <div
                                        className="bg-surface-container-highest/50 p-4 rounded-xl border border-outline-variant/10 flex justify-between items-center">
                                        <span className="font-headline font-black text-on-surface text-xl">68</span>
                                        <span
                                            className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Pool Card */}
                        <div
                            className="obsidian-panel rounded-xl p-6 hover:bg-surface-container-high/50 transition-all border-l-4 border-l-primary/40">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                                        <span className="material-symbols-outlined text-primary">groups</span>
                                    </div>
                                    <div>
                                        <p
                                            className="font-headline font-bold text-on-surface uppercase text-sm tracking-tight">
                                            Accra Weekend League</p>
                                        <p
                                            className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                                            Tournament Pool</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p
                                        className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-60">
                                        Global Prize</p>
                                    <p className="font-headline font-black text-primary text-xl tracking-tight">GHS 2,500.00
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <img className="w-10 h-10 rounded-full border-2 border-surface"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3fqlk7pplYKMakhiMYJpgQLbnrvfU6AiOVa857J5xnvMn0hD3Gl7hIZYoczbZGnLa4xPQJJlBxT1IamgLcS_eCYXSC8FzzrmsJZu3w2Xy1hWHEtQY95e_LfCc862umei0YXDb1ia17J7y0Gvo-8e3RiY2o5VQIz0RgKpf5GVCQ9xyJAy74qMwew3RYB3FyliEH6rqlpZULG3BQLbTTVUAaHB9JXwzCHjLTs1wpeQvJEAKeQhIHtm8A08wIo9F8_u090iq-1dxLu3t" />
                                        <img className="w-10 h-10 rounded-full border-2 border-surface"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvyTo0FYSPUHOHcspQE8cQoBj9Hvt4KOhDMSbxUjthoB1YMxdxBuBLUpDnhEuibrDxFBIyZFfrcLWLzfpHSTPAB_xkx4HXh8J-NufMSsm4qll_xv-IpIZMDw6fcd5wcxOrpTMcKaRYj5JYjEQKeAKXYz3Ygc8XtkK5mf2Ssl417qd8PFh3joRreGnARXc6uBzl4Daqvy37RmSa--k6wFeMHU-PVmhPAT0GwzsZN05lu0Q4aA-EKBjHQM6MYTN_BcOv-wmsrNMPp1kJ" />
                                        <img className="w-10 h-10 rounded-full border-2 border-surface"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb3LWwRzH8bJLaFfUK6r4wkxfqPMyLDetXYvdBOqT1GPFP1LtrP0TLHJNdICWwyF9pQ7l2CECQNIVB7jsx14nK9pYQSmwtrGZC1ReD1ArbAlXRP2MEoHb_rRlUiFsLinaSjOkpuRJcnCKGOHfsLSQhEKK8_vqkn_d1ROUO4zgUbwqOXdHPN3wbfCwk44PvdAXnwfnsqngZV1Z4_O0CZ2NdjuLHJHT8Dc8NVJm8248IZ__4IKzCCsG9UcJbA9bhPi5vr5FF7VQl13A6" />
                                        <div
                                            className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-surface flex items-center justify-center text-[10px] font-black text-primary">
                                            +14</div>
                                    </div>
                                    <span
                                        className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Enrolled
                                        Players</span>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <div className="text-right">
                                        <p
                                            className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-60">
                                            Your Position</p>
                                        <p className="font-headline font-black text-secondary text-lg">4th <span
                                                className="text-xs text-on-surface/40 font-bold">/ 18</span></p>
                                    </div>
                                    <button
                                        className="bg-primary/10 p-3 rounded-xl hover:bg-primary/20 transition-all text-primary">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Data */}
                    <div className="md:col-span-4 space-y-6">
                        {/* Fixtures */}
                        <div className="obsidian-panel rounded-xl p-6">
                            <h4
                                className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-2">
                                Upcoming
                                <span className="h-[1px] flex-1 bg-outline-variant"></span>
                            </h4>
                            <div className="space-y-4">
                                <div
                                    className="flex items-center justify-between bg-surface-container rounded-xl p-4 border border-outline-variant/10">
                                    <div className="flex flex-col items-center gap-2">
                                        <img className="w-7 h-7"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBKNo2j8JURFmFOnBu9f-SyKxsSQjehF3CJGOA12iOD0gDbs6Bx_CEOQMJ6tX8Rica4GZ06EWpRI-IejsOQjLdqGPmo4Z9Jke8UQt7Mm5g8qvU_mTcnG7jquP69CDIdymPDKZdVC9eG2Ssi6OkARv5QRbIQEoV3TSUxRejfOGhwOGQ9LjhUNtLfZMvPSmuw904oOBQ1uCh0A_Ps8C7jPswG1jBdN85k60jwI5qW1Hh5N6CSIU3sUIsI8iEc1eiG1b-_6PRPKKNMWn4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">MUN</span>
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">
                                            SAT 12:30</p>
                                        <div
                                            className="text-xs text-primary font-black italic border-y border-primary/20 py-0.5 px-2">
                                            VS</div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <img className="w-7 h-7"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB91qw1oLkNn28uAFS_KtSuh7KPD8YFQUyhuGjQ6_XTN8fFWVINWeOTdsfCoQnSjeOFmM1D4gM_IKiNe4z3phTLBj75LvbNZxI8QrQeAUqJFxmPBixEv5wGL_8Fcx9FJME5cFE5Z7WvVazYm_QDPtSMtzic1qYyw6UxiLqSW0T-V__wWHyB3mesCJo5tci2eqEIPOJyetyh9zw6BCuF8QmaXGWx1gZtYSCHH4Cx73bJAbmdEc394_2BJ7FnnH7iDS3ZAPpMxtPMwE0w" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">ARS</span>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-between bg-surface-container rounded-xl p-4 border border-outline-variant/10">
                                    <div className="flex flex-col items-center gap-2">
                                        <img className="w-7 h-7"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIdimqNNoJp8Rbs6rz18rWEX351di4F74nLrKtEhT_jowML7W4D_LKma7doKMcmKjccDMe_ooX-rZ0zSQt-Cc-FfChJwqBP3OCqjENeengzBDi1xbVTXrpyzrUhKA0wYng4rVwEKdWWz-h9gYbs0PpZ1rvL79T4ogXBJEjxtzH__PQmvY6ZsbD0RvsmNBmepclo5aQx0KfxNkRso2WA-8EjEfKpkoGHJ1FbyryEOS1X0wqjQ_wTu-ibPK5-l2PaqVRfHMHmN2reshE" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">LIV</span>
                                    </div>
                                    <div className="text-center">
                                        <p
                                            className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">
                                            SUN 16:30</p>
                                        <div
                                            className="text-xs text-primary font-black italic border-y border-primary/20 py-0.5 px-2">
                                            VS</div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <img className="w-7 h-7"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIPMs1b1nxPtTJMW3VXQMU1DPKlEzlvn-y8CcmJazRAVpSfp5f_33znBbxUzBA2M9-nrr-IEZpnDTJzkj7KnNxh4nZjRIMnFHXYOlhQccRBuHeNQFMJo5fIgYjaLzMHz3WE_THTWrgOs7yet7SaQ23JjbBl8RbF7EjxnlMBg-mjLpuSc5Y1pouAyLvXdYwbmOj3UZrdag9LtpS9UECJQPUHNGA5VDyl42lpfiHsmJcpbsHz0a6gy2_lvexvgvJG558Fi_lydFpkbwT" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">CHE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Top Performers */}
                        <div className="obsidian-panel rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
                                <span className="material-symbols-outlined text-[140px]">emoji_events</span>
                            </div>
                            <h4
                                className="font-headline font-black uppercase text-xs tracking-[0.3em] mb-6 flex items-center gap-2">
                                Top Ranked
                                <span className="h-[1px] flex-1 bg-outline-variant"></span>
                            </h4>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-headline font-black text-primary w-4 italic">01</span>
                                        <span className="text-xs font-bold uppercase tracking-tight">Ekow_Tactics</span>
                                    </div>
                                    <span className="font-headline font-bold text-secondary text-xs">1,420 PTS</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-headline font-black text-on-surface/30 w-4 italic">02</span>
                                        <span className="text-xs font-bold uppercase tracking-tight">Nana_FPL</span>
                                    </div>
                                    <span className="font-headline font-bold text-on-surface text-xs opacity-80">1,395
                                        PTS</span>
                                </div>
                                <div className="h-[1px] bg-outline-variant/30 my-4"></div>
                                <div className="flex items-center justify-between opacity-60">
                                    <div className="flex items-center gap-3">
                                        <span className="font-headline font-black w-4 italic">128</span>
                                        <span className="text-xs font-bold uppercase tracking-tight text-primary">You</span>
                                    </div>
                                    <span className="font-headline font-bold text-xs">842 PTS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        {/* Mobile Bottom NavBar */}
        <nav
            className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-surface/90 backdrop-blur-xl z-50 border-t border-outline-variant/30">
            <a className="flex flex-col items-center justify-center text-primary px-3 py-1 scale-95 transition-transform"
                href="#">
                <span className="material-symbols-outlined">home</span>
                <span className="font-body text-[10px] font-black uppercase mt-1">Home</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface transition-colors"
                href="#">
                <span className="material-symbols-outlined">sports_kabaddi</span>
                <span className="font-body text-[10px] font-bold uppercase mt-1">Duels</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface transition-colors"
                href="#">
                <span className="material-symbols-outlined">groups</span>
                <span className="font-body text-[10px] font-bold uppercase mt-1">Pools</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface transition-colors"
                href="#">
                <span className="material-symbols-outlined">leaderboard</span>
                <span className="font-body text-[10px] font-bold uppercase mt-1">Ranks</span>
            </a>
            <a className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface transition-colors"
                href="#">
                <span className="material-symbols-outlined">account_balance_wallet</span>
                <span className="font-body text-[10px] font-bold uppercase mt-1">Wallet</span>
            </a>
        </nav>
    </div>
    </div>
  );
}

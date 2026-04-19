import Sidebar from '../components/Sidebar';
export default function LeaderboardPage() {
  return (
    <div className="page-leaderboard bg-background text-on-surface selection:bg-primary selection:text-on-primary">
{/* TopNavBar */}
    <header
        className="fixed top-0 right-0 left-0 lg:left-64 z-50 glass-dark border-b border-outline-variant/30 flex justify-between items-center px-6 h-16 shadow-lg">
        <div className="flex items-center gap-8">
            <span className="text-2xl font-black italic text-primary font-headline uppercase tracking-tighter">FantasyDuel
                GH</span>
            <nav className="hidden md:flex gap-8 items-center">
                <a className="text-on-surface-variant/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    href="#">Home</a>
                <a className="text-on-surface-variant/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    href="#">Duels</a>
                <a className="text-on-surface-variant/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    href="#">Pools</a>
                <a className="text-primary text-xs font-black uppercase tracking-widest border-b-2 border-primary pb-5 mt-5"
                    href="#">Rankings</a>
                <a className="text-on-surface-variant/70 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                    href="#">Wallet</a>
            </nav>
        </div>
        <div className="flex items-center gap-4">
            <button
                className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity">account_balance_wallet</button>
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
                <img alt="User profile" className="w-full h-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUvGlkAIRkRess_4d4eZw7I5MCq_e0Vz3wnWVymFN_621zQtX27zFblc1yClv8D-1HLo-Xa2YNrZD2fqDnLBvF4Ht5MAsX4p_-KhWbRADbTVt22gqgKTd8-1eKV6-Xfow3251WTErppVLQ9tJ1VUBUBP2TdhCBVqXZBcO6_85r-ldmaZPEMIL2GpsmRS27HxmyzEpaCltH8GcRugeWrRJbO56TlDi659YJDZUUTLuCM-7Ng0F0bZAi70YU0sR2_drCa-6AoAK39Sha" />
            </div>
        </div>
    </header>
    <div className="flex pt-16 min-h-screen">
        {/* SideNavBar */}
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-8 lg:p-16 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="h-[2px] w-12 bg-primary"></span>
                        <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Hall of Fame</span>
                    </div>
                    <h1
                        className="text-7xl md:text-8xl font-black font-headline uppercase tracking-tighter text-on-surface leading-none">
                        Elite <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff9d00] italic">Rankings</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-lg font-medium">Recognizing the absolute masterminds of the
                        season. Only the top 1% reach these heights.</p>
                </div>
                {/* Professional Toggle */}
                <div
                    className="bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30 flex shadow-inner">
                    <button
                        className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-on-primary shadow-lg">This
                        Week</button>
                    <button
                        className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">All
                        Time</button>
                </div>
            </div>
            {/* Podium Hall of Fame */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
                {/* Rank 2 */}
                <div className="order-2 md:order-1 flex flex-col items-center">
                    <div
                        className="w-full obsidian-gradient rounded-3xl p-1 pb-0 border border-outline-variant/20 hover:border-outline-variant/50 transition-all group relative">
                        <div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-dark border border-outline-variant/30 flex items-center justify-center font-headline font-black text-on-surface-variant italic text-lg">
                            #02</div>
                        <div className="p-8 flex flex-col items-center pt-10">
                            <div
                                className="w-24 h-24 rounded-2xl overflow-hidden mb-6 border-2 border-outline-variant shadow-2xl relative">
                                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    data-alt="portrait"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk24NHp8Dku7sM_gyAG8z6xik9eLiQR7cq4H-PRcWYD3yfC8IUZq0vqo3qMWIafVaBERetjIIjB7J4OGrIWf4nwi7TLPGuAzsrBxiX5IId52CaZHqug8RlCnF5_Q0tc58GnpuSmspRp4MNZBpx51Mg8pcYb5VsbPMgzOUBLYRfg8fLC3BLVBDJv32dhAxhfyCb1JF8zgnEnsuPAJsGugNmpjWo1jEjG3Jql2fOAcMHJmFYw0zgGRcmaxBAUsI25deJS4dH3Rn7S8_k" />
                            </div>
                            <h3
                                className="font-headline text-2xl font-black text-on-surface group-hover:text-primary transition-colors">
                                Kojo_Striker</h3>
                            <div className="mt-6 w-full space-y-4">
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Wins</span>
                                    <span className="text-secondary">42</span>
                                </div>
                                <div className="h-px w-full bg-outline-variant/20"></div>
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Earnings</span>
                                    <span className="text-primary italic">₵12,400</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Rank 1: The Mastermind */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                    <div
                        className="w-full bg-gradient-to-b from-[#2a261e] to-surface-container-lowest rounded-3xl p-1 pb-0 border-2 border-primary/40 gold-glow relative transition-transform hover:scale-[1.02] duration-300">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                            <span className="material-symbols-outlined text-6xl text-primary"
                                style={{fontVariationSettings: '\'FILL\' 1'}}>workspace_premium</span>
                        </div>
                        <div className="p-10 flex flex-col items-center pt-12">
                            <div
                                className="w-32 h-32 rounded-3xl overflow-hidden mb-8 border-4 border-primary shadow-[0_0_30px_rgba(255,211,123,0.3)] relative">
                                <img className="w-full h-full object-cover" data-alt="portrait"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYqbNczqDa-LvaWXvaPIL9h8yJjMvUPnn5sENx1BuAnYuM6i1JaoAzjMiC4zhliuONzLLaQOflCwCODXmCBnr0AH3Z86rYzeT1PZJrlGLWW7HKXa42cD2E1EX3JcVVPRZv6g9MnxUVSC2URIhT29K0LRpM4e1TPSG-mS9cYIeo9U6cLq6qNAaYV0zyTIqrnlq7VO5hFDVyeil1-BDYr8cNAl8eyGe0Lfw3C2jKhHxhMK_QvQuudgL1z4zOatUWTLjChZQJrKLYn9Ii" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                            </div>
                            <h3 className="font-headline text-3xl font-black text-primary tracking-tight">Kwesi_Baller</h3>
                            <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.3em] mt-2">Undisputed
                                Champion</p>
                            <div className="mt-8 w-full bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Duels Won</span>
                                    <span className="text-2xl font-headline font-black text-secondary">89</span>
                                </div>
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Total Bank</span>
                                    <span className="text-2xl font-headline font-black text-primary italic">₵45.2k</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Rank 3 */}
                <div className="order-3 flex flex-col items-center">
                    <div
                        className="w-full obsidian-gradient rounded-3xl p-1 pb-0 border border-outline-variant/20 hover:border-outline-variant/50 transition-all group relative">
                        <div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-dark border border-outline-variant/30 flex items-center justify-center font-headline font-black text-on-surface-variant italic text-lg">
                            #03</div>
                        <div className="p-8 flex flex-col items-center pt-10">
                            <div
                                className="w-24 h-24 rounded-2xl overflow-hidden mb-6 border-2 border-outline-variant shadow-2xl relative">
                                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    data-alt="portrait"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfQQhEqlLL1YIrr0DtXk7jmfTGfM5oMD3vCxdo1jS_x8-zceVCV5-Pm9bbwrkdlQOGim2DGTBLlfWOowxAzMpnwK9QNRxBv53TMEFUtT6SY2ilGEDN6RQ8Ikj80LoAQD-QFGn5uNQMmJ41yXqyJqxEtLMtOqSTZ_dmRAt-6J8e-bmpDeOvEKjBRsxxoYokgVH22hysxyF9EsUQNpnio0Ly4oby-P3Be3A3LKwEuJBtngXvbWO_YG6Ezc78OzMl3wGCZNuMEmKZ2sJF" />
                            </div>
                            <h3
                                className="font-headline text-2xl font-black text-on-surface group-hover:text-primary transition-colors">
                                Ama_Queen</h3>
                            <div className="mt-6 w-full space-y-4">
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Wins</span>
                                    <span className="text-secondary">38</span>
                                </div>
                                <div className="h-px w-full bg-outline-variant/20"></div>
                                <div
                                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                                    <span>Earnings</span>
                                    <span className="text-primary italic">₵9,800</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* High-Quality Data Table */}
            <div
                className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-outline-variant/30">
                                <th
                                    className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                                    Rank</th>
                                <th
                                    className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                                    Manager Elite</th>
                                <th
                                    className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant text-right">
                                    Duels Won</th>
                                <th
                                    className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant text-right">
                                    Pools Won</th>
                                <th
                                    className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant text-right">
                                    Total Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {/* Row 4 */}
                            <tr className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                                <td className="px-10 py-8">
                                    <span
                                        className="text-2xl font-headline font-black text-on-surface-variant/40 group-hover:text-primary transition-colors">04</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-14 h-14 rounded-xl bg-surface-container-highest overflow-hidden border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                                            <img className="w-full h-full object-cover" data-alt="portrait"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0-fDSIXjZT5lBz9k8hcSWZs_N1uJjibkQG45wTYaWeAOM39mRIG0PTvKq5yIES-ciCann71Lyc3K-cL4x4eYz_8aNTD20mq7ZEz3dzxmikdG4vv8EsV7EbCdC_7jidH_gHMQqA8Eo8W9SHOPrLkXeMqldt2KjpiB-J34pg5KOkpw91u1gcjJgMSaVvKrwjmuU6_7Qma9JC96rCq_pgKh3RwCWchAMXNuHk02AzWyviOfn3m_J1cdJIQEOox6HHhXV2dmyjP412v1m" />
                                        </div>
                                        <div>
                                            <p
                                                className="text-lg font-black text-on-surface group-hover:translate-x-1 transition-transform">
                                                Yaw_Scout</p>
                                            <p
                                                className="text-[10px] text-secondary font-black uppercase tracking-widest mt-0.5">
                                                Pro Specialist</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface">31
                                </td>
                                <td
                                    className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface-variant">
                                    14</td>
                                <td className="px-10 py-8 text-right">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 font-headline font-black text-primary italic text-xl">₵8,250</span>
                                </td>
                            </tr>
                            {/* Row 5 */}
                            <tr className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                                <td className="px-10 py-8">
                                    <span
                                        className="text-2xl font-headline font-black text-on-surface-variant/40 group-hover:text-primary transition-colors">05</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-14 h-14 rounded-xl bg-surface-container-highest overflow-hidden border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                                            <img className="w-full h-full object-cover" data-alt="portrait"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT5GDKiwYFHkn6c15RGaq8qtzh9xeJFBlTD0wVNSr0kpUxH5il9CxbkF6X5RSH9TJVu3sXJmTEmNDg9pJ6m3glDZpPylAeZg0A5mR8K8K6oWyDu0G44jsceRbNgAOEs80HRLQAuf_VYZKoYucQj2VGLT4qGOhTVNc_vhNPVbyPoBOnZ0ebkccgTifPERVNwjYNrlq7SrkyNAcBRL1bYPWdo5a6q7cn27g9sjnRZNGmPk3o-87OGNvmYyG3q0zwCOBCPDS5jUDFmzLH" />
                                        </div>
                                        <div>
                                            <p
                                                className="text-lg font-black text-on-surface group-hover:translate-x-1 transition-transform">
                                                Fifi_Master</p>
                                            <p
                                                className="text-[10px] text-primary/60 font-black uppercase tracking-widest mt-0.5">
                                                Elite Tier</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface">28
                                </td>
                                <td
                                    className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface-variant">
                                    19</td>
                                <td className="px-10 py-8 text-right">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 font-headline font-black text-primary italic text-xl">₵7,900</span>
                                </td>
                            </tr>
                            {/* Row 6 */}
                            <tr className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                                <td className="px-10 py-8">
                                    <span
                                        className="text-2xl font-headline font-black text-on-surface-variant/40 group-hover:text-primary transition-colors">06</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-14 h-14 rounded-xl bg-surface-container-highest overflow-hidden border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                                            <img className="w-full h-full object-cover" data-alt="portrait"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe9rKwVsuyGWCrtYW3llUMPXtB-gyRSOMVtMqC8VxnjML3ISo4q3axbmj0ygFB8rGs-Q5UnUi9wsAT1TVycGPfeotOGBevJNpP8LMrNr_EklqRoB4u7KP8ZTQ7zLbAgkg5pFc3PX7nMtGODsq8CIV7nqXjAhjauF4v7m4HCbm8VK1cbd0E82HnI3sUbtcW7kpCovR4kBMR8pDtn141NTYemZbOtwUwWEA_9MGuwRUIDk8fo3jNlLLco0gB6_kM1whdsok4hFXRrEPd" />
                                        </div>
                                        <div>
                                            <p
                                                className="text-lg font-black text-on-surface group-hover:translate-x-1 transition-transform">
                                                Efya_Bets</p>
                                            <p
                                                className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-0.5">
                                                Master Expert</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface">25
                                </td>
                                <td
                                    className="px-10 py-8 text-right font-headline font-bold text-xl text-on-surface-variant">
                                    22</td>
                                <td className="px-10 py-8 text-right">
                                    <span
                                        className="px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 font-headline font-black text-primary italic text-xl">₵6,450</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-10 flex justify-center bg-white/[0.02] border-t border-outline-variant/10">
                    <button
                        className="px-12 py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] border-2 border-outline-variant/30 text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all active:scale-95">
                        Reveal Full Leaderboard
                    </button>
                </div>
            </div>
            {/* Awards Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="obsidian-gradient p-8 rounded-3xl border border-secondary/20 flex items-center gap-8 group">
                    <div
                        className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-lg">
                        <span className="material-symbols-outlined text-5xl">trending_up</span>
                    </div>
                    <div>
                        <h4 className="font-headline text-2xl font-black text-secondary uppercase tracking-tight">Rising
                            Star</h4>
                        <p className="text-sm text-on-surface-variant mt-1"><span
                                className="text-white font-bold">Yaw_Scout</span> soared <span
                                className="text-secondary font-black italic">+12 spots</span> since Monday.</p>
                    </div>
                </div>
                <div className="obsidian-gradient p-8 rounded-3xl border border-primary/20 flex items-center gap-8 group">
                    <div
                        className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                        <span className="material-symbols-outlined text-5xl">military_tech</span>
                    </div>
                    <div>
                        <h4 className="font-headline text-2xl font-black text-primary uppercase tracking-tight">Season
                            Bounty</h4>
                        <p className="text-sm text-on-surface-variant mt-1">Top 100 managers will battle for the <span
                                className="text-primary font-black italic">₵100,000</span> prize pool.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    {/* BottomNavBar */}
    <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 glass-dark border-t border-outline-variant/30 z-50">
        <a className="flex flex-col items-center justify-center text-on-surface-variant/50 px-4" href="#">
            <span className="material-symbols-outlined mb-0.5">home</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/50 px-4" href="#">
            <span className="material-symbols-outlined mb-0.5">swords</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Duels</span>
        </a>
        <a className="flex flex-col items-center justify-center text-primary bg-primary/10 rounded-xl px-6 py-2" href="#">
            <span className="material-symbols-outlined mb-0.5"
                style={{fontVariationSettings: '\'FILL\' 1'}}>military_tech</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Rank</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant/50 px-4" href="#">
            <span className="material-symbols-outlined mb-0.5">account_balance_wallet</span>
            <span className="text-[9px] font-black uppercase tracking-tighter">Wallet</span>
        </a>
    </nav>
    </div>
  );
}

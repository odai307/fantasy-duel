import Sidebar from '../components/Sidebar';
export default function ProfilePage() {
  return (
    <div className="page-profile bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
<div className="flex min-h-screen">
        {/* SideNavBar Component */}
        <Sidebar />
        {/* Main Content Canvas */}
        <main className="flex-grow lg:ml-64 min-h-screen pb-20">
            {/* TopNavBar */}
            <header
                className="fixed top-0 right-0 left-0 lg:left-64 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full border-b border-white/5">
                <div className="flex items-center gap-4">
                    <h2 className="font-headline font-black italic text-2xl text-primary uppercase tracking-tighter">My
                        Account</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div
                        className="flex items-center gap-2 bg-surface-container-highest px-4 py-1.5 rounded-full border border-outline-variant/10">
                        <span className="text-primary font-bold font-headline tracking-tight text-sm">1,240 GHS</span>
                        <span className="material-symbols-outlined text-primary text-xs"
                            style={{fontVariationSettings: '\'FILL\' 1'}}>account_balance_wallet</span>
                    </div>
                    <button
                        className="material-symbols-outlined text-on-surface hover:text-primary transition-colors text-xl">notifications</button>
                    <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden border border-primary/30">
                        <img alt="Profile" className="w-full h-full object-cover"
                            data-alt="close-up portrait of a confident young man with a slight smile in high-end studio lighting with dark background"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJNjgoPSp0mh0xAMefXlNmui09qV58--Tlth2GzEh01JM2l2jbifDCecfai-8rPUP8vt7JlQNJMNNZC6toaSJBw2yY27mhmk9FpHYgvvOQG7LuAf6s22FlVm-47UrXWk8iI6Ki1BeMxftDOQYRhrz49i6OUwsjB_o3tP2CZbJRb7pdWfAKJpmXqi1ibHlaNDtYJu3DJBbPGZt0YAenzypciba7yhiGdaBGIrHJ4bwoTgT6Voss6zFYctTLU1OVDP2tvYb9S_Mnc3LX" />
                    </div>
                </div>
            </header>
            {/* Profile Content */}
            <div className="mt-24 px-8 max-w-6xl mx-auto">
                {/* Professional Header & Quick Wallet Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Elite User Summary */}
                    <div
                        className="lg:col-span-2 obsidian-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 p-1 bg-[#131313]">
                                <img alt="User Avatar" className="w-full h-full object-cover rounded-xl"
                                    data-alt="professional portrait of a man with clean aesthetic and sharp features in soft cinematic lighting"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdcaE7MFljEdlMPhYkmX8wnyUauwh-0w7M8mfXvnjTOjUkkvTqBeenel2xYZtnuyxu2QmI-WEyh1RVKV6MA592Co4ctgNawyeXxksh4rtB4Odd5dE-QEpmGerhayJa8rtCeR6uvGX_n-KJ2_LVjXeREh2b-VMxkidhy8g3SOnWviS1MsXnijEXRISM5Gxo4FyGZQ3-BUGiRjy2WPDWkxKLDUDhR0uIOnlQ9KG-2uOLnAjCkkzI9f6U1kDMc7JZbZVvBWLOuwuWYDMf" />
                            </div>
                            <button
                                className="absolute -bottom-2 -right-2 bg-primary w-8 h-8 flex items-center justify-center text-on-primary rounded-lg shadow-xl hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black font-headline tracking-tight text-white uppercase">Kwame
                                    Ampofo</h1>
                                <span
                                    className="bg-secondary/10 text-secondary text-[10px] px-2.5 py-1 rounded-md font-black border border-secondary/20 flex items-center justify-center gap-1.5 self-center md:self-auto uppercase">
                                    <span className="w-1 h-1 bg-secondary rounded-full"></span> Verified
                                </span>
                            </div>
                            <p
                                className="text-white/40 font-medium flex items-center justify-center md:justify-start gap-2 mb-6 text-sm">
                                <span className="material-symbols-outlined text-xs">mail</span>
                                kwame.dev@fduel.gh
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <button
                                    className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-bold font-headline flex items-center gap-2 hover:bg-primary-fixed transition-colors">
                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                    Edit Profile
                                </button>
                                <button
                                    className="bg-white/5 text-white/70 px-5 py-2 rounded-lg text-xs font-bold font-headline border border-white/5 hover:bg-white/10 hover:text-white transition-all">
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Wallet Feature Card */}
                    <div
                        className="gold-gradient-bg rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
                        <div
                            className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-primary/60 mb-1">
                                Available Balance</p>
                            <h3 className="text-4xl font-black font-headline text-on-primary tracking-tighter">1,240.50
                                <span className="text-xl font-medium">GHS</span></h3>
                        </div>
                        <div className="relative z-10 mt-8">
                            <button
                                className="bg-on-primary text-primary w-full py-3 rounded-xl font-black font-headline text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase tracking-wider">
                                <span className="material-symbols-outlined text-base">add_circle</span>
                                Deposit Funds
                            </button>
                            <p className="text-[10px] text-center font-bold text-on-primary/50 mt-3 italic">Last win: +450
                                GHS (2h ago)</p>
                        </div>
                    </div>
                </div>
                {/* Elite Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="obsidian-card p-6 rounded-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl">id_card</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">FPL ID</p>
                        <p className="text-2xl font-black font-headline text-white tracking-tight">#482910</p>
                    </div>
                    <div className="obsidian-card p-6 rounded-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl">swords</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Total Duels</p>
                        <p className="text-2xl font-black font-headline text-white tracking-tight">142</p>
                    </div>
                    <div className="obsidian-card p-6 rounded-2xl relative group overflow-hidden">
                        <div
                            className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-secondary">
                            <span className="material-symbols-outlined text-4xl">trending_up</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Win Rate</p>
                        <p className="text-2xl font-black font-headline text-secondary tracking-tight">68.4%</p>
                    </div>
                    <div className="obsidian-card p-6 rounded-2xl relative group overflow-hidden">
                        <div
                            className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
                            <span className="material-symbols-outlined text-4xl">trophy</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Earnings</p>
                        <p className="text-2xl font-black font-headline gold-text-gradient tracking-tight">12,850 <span
                                className="text-sm font-bold text-primary/60">GHS</span></p>
                    </div>
                </div>
                {/* Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity History */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2
                                className="font-headline font-black text-lg flex items-center gap-3 tracking-wider text-white">
                                <span className="w-1 h-6 bg-primary rounded-full"></span>
                                RECENT DUEL HISTORY
                            </h2>
                            <button
                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">View
                                All</button>
                        </div>
                        <div className="space-y-3">
                            {/* Duel Row Win */}
                            <div
                                className="obsidian-card rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group border-l-[3px] border-secondary">
                                <div className="flex items-center gap-6">
                                    <div
                                        className="bg-[#131313] w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-white/5">
                                        <p className="text-[9px] font-bold text-white/40 uppercase">GW 24</p>
                                        <p className="font-black text-secondary text-base">W</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-0.5 tracking-wide">VS. KOBBY_BALLER
                                        </h4>
                                        <p className="text-[11px] text-white/40">Head-to-Head Duel • 50 GHS Entry</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-lg font-black font-headline text-secondary">+95 GHS</p>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">78 vs
                                            62 pts</p>
                                    </div>
                                    <span
                                        className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                            </div>
                            {/* Duel Row Loss */}
                            <div
                                className="obsidian-card rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group border-l-[3px] border-error">
                                <div className="flex items-center gap-6">
                                    <div
                                        className="bg-[#131313] w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-white/5">
                                        <p className="text-[9px] font-bold text-white/40 uppercase">GW 23</p>
                                        <p className="font-black text-error text-base">L</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-0.5 tracking-wide">VS.
                                            THE_SPECIAL_ONE</h4>
                                        <p className="text-[11px] text-white/40">High Roller Pool • 200 GHS Entry</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-lg font-black font-headline text-error">-200 GHS</p>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">54 vs
                                            81 pts</p>
                                    </div>
                                    <span
                                        className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                            </div>
                            {/* Duel Row Win */}
                            <div
                                className="obsidian-card rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-all group border-l-[3px] border-secondary">
                                <div className="flex items-center gap-6">
                                    <div
                                        className="bg-[#131313] w-12 h-12 flex flex-col items-center justify-center rounded-lg border border-white/5">
                                        <p className="text-[9px] font-bold text-white/40 uppercase">GW 23</p>
                                        <p className="font-black text-secondary text-base">W</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-0.5 tracking-wide">VS. ACCRA_KINGS
                                        </h4>
                                        <p className="text-[11px] text-white/40">Mini League • 20 GHS Entry</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-lg font-black font-headline text-secondary">+120 GHS</p>
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">92 vs
                                            45 pts</p>
                                    </div>
                                    <span
                                        className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Panel */}
                    <div className="space-y-8">
                        {/* Achievements Panel */}
                        <section>
                            <h2 className="font-headline font-black text-lg mb-6 tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">military_tech</span>
                                ACHIEVEMENTS
                            </h2>
                            <div className="obsidian-card rounded-2xl border border-white/5 p-2 overflow-hidden">
                                <div
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors rounded-xl group">
                                    <div
                                        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-xl"
                                            style={{fontVariationSettings: '\'FILL\' 1'}}>military_tech</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-xs text-white uppercase tracking-tight">Duel Veteran
                                        </p>
                                        <p className="text-[10px] text-white/40">Completed 100+ Duels</p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors rounded-xl group">
                                    <div
                                        className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-xl"
                                            style={{fontVariationSettings: '\'FILL\' 1'}}>local_fire_department</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-xs text-white uppercase tracking-tight">Win Streak</p>
                                        <p className="text-[10px] text-white/40">5 consecutive victories</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 opacity-40 grayscale group">
                                    <div
                                        className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                        <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-xs text-white uppercase tracking-tight">GHS
                                            Millionaire</p>
                                        <p className="text-[10px] text-white/40 text-left">Earn 1,000,000 GHS total</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Security & Management */}
                        <section>
                            <h2 className="font-headline font-black text-lg mb-6 tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-white/40 text-xl">security</span>
                                SECURITY
                            </h2>
                            <div className="obsidian-card rounded-2xl border border-white/5 p-2 overflow-hidden">
                                <button
                                    className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between text-xs font-bold group">
                                    <span
                                        className="text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Change
                                        Password</span>
                                    <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
                                </button>
                                <div
                                    className="w-full text-left p-4 rounded-xl flex items-center justify-between text-xs font-bold">
                                    <span className="text-white/60 uppercase tracking-widest">Two-Factor Auth</span>
                                    <span
                                        className="bg-secondary/10 text-secondary text-[9px] px-2 py-0.5 rounded font-black border border-secondary/20">ACTIVE</span>
                                </div>
                                <button
                                    className="w-full text-left p-4 rounded-xl hover:bg-error/5 transition-colors flex items-center justify-between text-xs font-bold group">
                                    <span
                                        className="text-error/60 group-hover:text-error transition-colors uppercase tracking-widest">Close
                                        Account</span>
                                    <span
                                        className="material-symbols-outlined text-error/60 group-hover:text-error text-base">delete</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    </div>
    {/* Mobile Nav */}
    <nav
        className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe px-2 bg-[#0e0e0e]/95 backdrop-blur-md z-50 border-t border-white/5">
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined">home</span>
            <span className="font-label text-[9px] font-black uppercase mt-0.5">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined">swords</span>
            <span className="font-label text-[9px] font-black uppercase mt-0.5">Duels</span>
        </div>
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined">groups</span>
            <span className="font-label text-[9px] font-black uppercase mt-0.5">Pools</span>
        </div>
        <div className="flex flex-col items-center justify-center text-white/40">
            <span className="material-symbols-outlined">leaderboard</span>
            <span className="font-label text-[9px] font-black uppercase mt-0.5">Rank</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{fontVariationSettings: '\'FILL\' 1'}}>person</span>
            <span className="font-label text-[9px] font-black uppercase mt-0.5">Profile</span>
        </div>
    </nav>
    </div>
  );
}

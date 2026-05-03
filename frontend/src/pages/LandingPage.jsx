import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="page-landing bg-background text-white font-sans selection:bg-primary selection:text-on-primary">
{/* Top Navigation */}
<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-8 md:px-12">
<div className="flex justify-between items-center w-full max-w-7xl mx-auto">
<div className="text-xl font-black tracking-[0.2em] text-primary uppercase">
            FantasyDuel GH
        </div>
<div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.15em]">
<Link className="text-primary" to="/landing">Home</Link>
<Link className="text-text-muted hover:text-white transition-colors" to="/duels">Duels</Link>
<Link className="text-text-muted hover:text-white transition-colors" to="/pools">Pools</Link>
<Link className="text-text-muted hover:text-white transition-colors" to="/leaderboard">Rankings</Link>
</div>
<div className="flex items-center gap-6">
<Link className="text-white/60 hover:text-primary transition-colors" to="/wallet">
<span className="material-symbols-outlined">account_balance_wallet</span>
</Link>
<Link className="hidden md:block gold-matte text-on-primary text-[11px] font-black px-8 py-3 rounded-sm uppercase tracking-widest" to="/auth">
                Get Started
            </Link>
</div>
</div>
</nav>
<main className="pt-20">
{/* Hero Section */}
<section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 py-24">
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 obsidian-gradient z-10"></div>
<img className="w-full h-full object-cover opacity-20 scale-105" data-alt="Dark, high-contrast aerial view of a professional football stadium at night" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgTxldbQw5iTTuyuBo5RaQrftEvZ3w2QKA6nMbE-grkEQ1oib4U0H1qJirC9lgQWYRVR-zfJ3Xoow_8jd2wPK011J-7yHMadwvh31oKg2J63FzoigTtDv66U3ZbQYhd8xRiZFtpn--2rY9wci0a0BH9hcriPYonYlfQo36sBjuRxDB0KnCYxuKqAqWIXd9FaQd-scktUEYzT9hy43aEbyEYTxTQ-rgtcnNBCYcgBgm8IMuO1ydKGaLC8RQF5sgnSSWqUZHnGy70DMt"/>
</div>
<div className="relative z-20 max-w-5xl w-full text-center space-y-12">
<div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
<span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#D4AF37]"></span>
                Premier League 24/25 Season
            </div>
<div className="space-y-4">
<h1 className="font-black text-6xl md:text-8xl leading-[0.9] tracking-tighter text-white uppercase italic">
                    Challenge Your Friends.<br/>
<span className="text-primary">Win Real Cash.</span>
</h1>
<p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted font-light tracking-wide leading-relaxed">
                    Elite head-to-head fantasy duels for the dedicated manager. <br className="hidden md:block"/>
                    Join the premier high-stakes arena in Ghana.
                </p>
</div>
<div className="flex flex-col md:row items-center justify-center gap-6 pt-8">
<Link className="w-full md:w-auto gold-matte text-on-primary font-black text-xs px-16 py-5 rounded-sm uppercase tracking-[0.2em] inline-flex justify-center" to="/auth">
                    Get Started
                </Link>
<Link className="w-full md:w-auto border border-white/10 text-white font-black text-xs px-16 py-5 rounded-sm uppercase tracking-[0.2em] hover:bg-white/5 transition-all inline-flex justify-center" to="/pools">
                    View Pools
                </Link>
</div>
</div>
</section>
{/* Bento Grid Section */}
<section className="max-w-7xl mx-auto px-8 md:px-12 py-32">
<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
{/* The Arena */}
<div className="md:col-span-8 bg-surface rounded-sm p-10 border border-white/5 relative overflow-hidden group">
<div className="relative z-10 space-y-6">
<h3 className="font-black text-3xl text-white uppercase italic tracking-tight">The Arena</h3>
<p className="text-text-muted max-w-md leading-relaxed">Experience the adrenaline of daily winner-take-all duels and exclusive season-long pools with Ghana's top fantasy managers.</p>
<div className="flex items-center gap-4 pt-6">
<div className="flex -space-x-4">
<img className="w-12 h-12 rounded-full border-2 border-surface" data-alt="manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMIV2dKYApyJHCm3hRgw17ApVvq2VxUwDu6qzsxqOTIcmvZDmiBINw9WLWVezezfRmCSb0o-_XTWHfrrMKSWfP3m9rhCoojpLySAPWKxGTpuCUza6vNTMsNDKVhjd6lM7e8b6kms-KTVF9U75rN4KH-TIzUIyzZ1wofSFU5sTFGVp18zVRQ20oMudn4WGdP2jOA4ZBDh8o0EM_EKvAfLMf5Jtr6qQOQv_q3S2zY5mgK-gLj503_-lxuBlzZY2Md5niI04gre9J4_yK"/>
<img className="w-12 h-12 rounded-full border-2 border-surface" data-alt="manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDObi5V84tY3DyIQW0SDLfu3hH8W4SVKq_lvTSfbZbvtHfipZYN_zc3m-m9ErlEmoA80HUpgdqc0LPkmKNgtWSyx5KYgjJBJfJxTWsK94o4QK_PAA0Es3iS81kXSW79rH4cFhN8inuNyTGsdRvnj_IfhJlOmHvuyfjXXKiCVItyLMP4ZlvUAfPu-t1bW82kSmQjRX7PdHxcnVyXK3k19x0wm-wheEyPlW6axXOb5sPqmTV7nHCkogWiK69Iuc6nDnCxMRUnqdiJE7hf"/>
</div>
<span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">12k+ Elite Managers</span>
</div>
</div>
<div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
<span className="material-symbols-outlined text-[15rem]">sports_kabaddi</span>
</div>
</div>
{/* Instant Payouts */}
<div className="md:col-span-4 bg-surface rounded-sm p-10 border border-white/5 flex flex-col justify-between">
<div className="text-primary">
<span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
</div>
<div className="space-y-3">
<h4 className="font-bold text-lg uppercase tracking-wider text-white italic">Instant Payouts</h4>
<p className="text-sm text-text-muted leading-relaxed">Secure Mobile Money transfers. Withdraw your winnings immediately after gameweek validation.</p>
</div>
</div>
{/* Verified Data */}
<div className="md:col-span-4 bg-surface rounded-sm p-10 border border-white/5 flex flex-col justify-between">
<div className="text-primary">
<span className="material-symbols-outlined text-3xl">verified</span>
</div>
<div className="space-y-3">
<h4 className="font-bold text-lg uppercase tracking-wider text-white italic">Official Data</h4>
<p className="text-sm text-text-muted leading-relaxed">Real-time synchronization with the official FPL API ensures unparalleled accuracy.</p>
</div>
</div>
{/* Leaderboard */}
<div className="md:col-span-8 bg-surface rounded-sm p-10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
<div className="space-y-4">
<h4 className="font-black text-3xl uppercase italic text-white">Elite Rankings</h4>
<p className="text-text-muted text-sm max-w-xs">Compete for the weekly GHS 5,000 bonus pool awarded to the top 10 performing managers.</p>
</div>
<div className="w-full md:w-64 space-y-2">
<div className="bg-background/50 border border-white/5 p-3 flex justify-between items-center rounded-sm">
<span className="text-[10px] font-bold tracking-tighter">01. Kwesi_FPL</span>
<span className="text-[10px] text-primary font-black">98 PTS</span>
</div>
<div className="bg-background/50 border border-white/5 p-3 flex justify-between items-center rounded-sm opacity-70">
<span className="text-[10px] font-bold tracking-tighter">02. Abena_Utd</span>
<span className="text-[10px] text-primary font-black">94 PTS</span>
</div>
<div className="bg-background/50 border border-white/5 p-3 flex justify-between items-center rounded-sm opacity-40">
<span className="text-[10px] font-bold tracking-tighter">03. Kofi_Striker</span>
<span className="text-[10px] text-primary font-black">92 PTS</span>
</div>
</div>
</div>
</div>
</section>
{/* How It Works */}
<section className="bg-[#161616] py-40 border-y border-white/5" id="how-it-works">
<div className="max-w-7xl mx-auto px-12">
<div className="text-center mb-32 space-y-6">
<h2 className="font-black text-5xl md:text-7xl uppercase italic tracking-tighter">The Process</h2>
<div className="w-24 h-1 bg-primary mx-auto"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-24">
{/* Step 1 */}
<div className="text-center space-y-10 group">
<div className="relative w-20 h-20 mx-auto flex items-center justify-center">
<div className="absolute inset-0 border border-primary/30 rounded-full group-hover:scale-110 transition-transform"></div>
<span className="material-symbols-outlined text-primary text-3xl">link</span>
</div>
<div className="space-y-4">
<h3 className="font-black text-xl uppercase italic tracking-wide text-white">01. Sync Team</h3>
<p className="text-text-muted text-sm leading-relaxed px-4">Securely connect your official Fantasy Premier League account ID.</p>
</div>
</div>
{/* Step 2 */}
<div className="text-center space-y-10 group">
<div className="relative w-20 h-20 mx-auto flex items-center justify-center">
<div className="absolute inset-0 border border-primary/30 rounded-full group-hover:scale-110 transition-transform"></div>
<span className="material-symbols-outlined text-primary text-3xl">swords</span>
</div>
<div className="space-y-4">
<h3 className="font-black text-xl uppercase italic tracking-wide text-white">02. Issue Duel</h3>
<p className="text-text-muted text-sm leading-relaxed px-4">Set your stake and challenge rivals in direct head-to-head combat.</p>
</div>
</div>
{/* Step 3 */}
<div className="text-center space-y-10 group">
<div className="relative w-20 h-20 mx-auto flex items-center justify-center">
<div className="absolute inset-0 border border-primary/30 rounded-full group-hover:scale-110 transition-transform"></div>
<span className="material-symbols-outlined text-primary text-3xl">payments</span>
</div>
<div className="space-y-4">
<h3 className="font-black text-xl uppercase italic tracking-wide text-white">03. Claim Pot</h3>
<p className="text-text-muted text-sm leading-relaxed px-4">Outscore your opponent and receive instant mobile money payouts.</p>
</div>
</div>
</div>
</div>
</section>
{/* Final CTA */}
<section className="max-w-6xl mx-auto px-8 py-40 text-center">
<div className="bg-surface rounded-sm p-16 md:p-32 border border-white/5 relative overflow-hidden">
<div className="absolute inset-0 opacity-10 grayscale pointer-events-none">
<img className="w-full h-full object-cover" data-alt="Geometric stadium architecture detail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl663gFbx9gv5d5OXACCaNgmgK7qyM7hiqMvrjkeZB1Wh7T7VkvkMJS-pY1WvvImNET66zwnQTkfOYx1-Howk_nBIdqMmqppYF99dKIgHzviiLfB9mcIY-xYSoGhDrlU8RJxeYhmpju2N3wXiE9NNFFmgPmwsTrZQOOy2FuN87B_JrJA3R21565KRUYiXYzqKy6OIjqB3bPdYA1_VUD0tUQYBbDHzG3qvIT_B9_Q7PKhryrq57XqKCVjPkw9XxxSPa86OiCH-fhpiU"/>
</div>
<div className="relative z-10 space-y-12">
<h2 className="font-black text-5xl md:text-7xl uppercase italic leading-[0.9] tracking-tighter">
                    Ready to Prove <br/> You're the <span className="text-primary">Best?</span>
</h2>
<p className="text-text-muted text-lg max-w-lg mx-auto font-light tracking-wide">
                    Join Ghana's elite community of managers. No shortcuts. Just pure skill and strategy.
                </p>
<div className="pt-6">
<Link className="gold-matte text-on-primary font-black text-sm px-20 py-6 rounded-sm uppercase tracking-[0.25em] inline-flex justify-center" to="/auth">
                        Get Started Now
                    </Link>
</div>
<div className="flex items-center justify-center gap-10 opacity-30">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm">security</span>
<span className="text-[9px] font-bold uppercase tracking-widest">SSL Secure</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-sm">payments</span>
<span className="text-[9px] font-bold uppercase tracking-widest">MoMo Ready</span>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-[#0A0A0A] border-t border-white/5 pt-24 pb-12">
<div className="max-w-7xl mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
<div className="md:col-span-1 space-y-8">
<div className="text-xl font-black tracking-[0.2em] text-primary uppercase">
                FantasyDuel GH
            </div>
<p className="text-xs text-text-muted leading-relaxed font-light">
                The premier peer-to-peer fantasy sports destination in Ghana. Designed for the serious manager.
            </p>
</div>
<div>
<h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Platform</h5>
<ul className="space-y-4 text-xs text-text-muted">
<li><a className="hover:text-primary transition-colors" href="#how-it-works">How it Works</a></li>
<li><Link className="hover:text-primary transition-colors" to="/leaderboard">Leaderboards</Link></li>
<li><Link className="hover:text-primary transition-colors" to="/pools">Prize Pools</Link></li>
</ul>
</div>
<div>
<h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Legal</h5>
<ul className="space-y-4 text-xs text-text-muted">
<li><Link className="hover:text-primary transition-colors" to="/not-found">Terms of Service</Link></li>
<li><Link className="hover:text-primary transition-colors" to="/not-found">Privacy Policy</Link></li>
<li><Link className="hover:text-primary transition-colors" to="/not-found">Responsible Gaming</Link></li>
</ul>
</div>
<div>
<h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Connect</h5>
<div className="flex gap-4">
<a className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors" href="mailto:support@fantasyduel.gh">
<span className="material-symbols-outlined text-sm">alternate_email</span>
</a>
<a className="w-10 h-10 border border-white/10 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors" href="https://wa.me/233000000000" rel="noreferrer" target="_blank">
<span className="material-symbols-outlined text-sm">chat_bubble</span>
</a>
</div>
<div className="mt-10">
<p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] mb-2">Powered By</p>
<div className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Official FPL API Integration</div>
</div>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 md:px-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
<p className="text-[9px] text-text-muted/40 uppercase tracking-[0.2em]">© 2024 FantasyDuel GH. Obsidian Elite Series.</p>
<p className="text-[9px] text-text-muted/40 uppercase tracking-[0.1em] text-center">18+ Play Responsibly. Gaming can be addictive.</p>
</div>
</footer>
{/* Mobile Navigation */}
<nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 bg-background/95 backdrop-blur-md border-t border-white/10 z-50 px-4">
<Link className="flex flex-col items-center gap-1 text-primary" to="/landing">
<span className="material-symbols-outlined">home</span>
<span className="text-[8px] font-black uppercase tracking-widest">Home</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-white/40" to="/duels">
<span className="material-symbols-outlined">swords</span>
<span className="text-[8px] font-black uppercase tracking-widest">Duels</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-white/40" to="/leaderboard">
<span className="material-symbols-outlined">leaderboard</span>
<span className="text-[8px] font-black uppercase tracking-widest">Elite</span>
</Link>
<Link className="flex flex-col items-center gap-1 text-white/40" to="/wallet">
<span className="material-symbols-outlined">account_balance_wallet</span>
<span className="text-[8px] font-black uppercase tracking-widest">Wallet</span>
</Link>
</nav>
    </div>
  );
}

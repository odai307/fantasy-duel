import Sidebar from '../components/Sidebar';
export default function NotFoundPage() {
  return (
    <div className="page-not-found bg-background text-on-background font-body antialiased overflow-hidden">
{/* TopNavBar */}
<nav className="fixed top-0 w-full z-50 bg-[#131313] flex justify-between items-center px-6 h-16 w-full shadow-none font-['Inter'] font-extrabold tracking-tight">
<div className="text-xl font-black text-[#D4AF37] uppercase tracking-tighter">FantasyDuel GH</div>
<div className="hidden md:flex items-center gap-8">
<a className="text-gray-400 hover:text-[#F2CA50] transition-colors duration-200 active:scale-95 transition-transform" href="#">Lobby</a>
<a className="text-gray-400 hover:text-[#F2CA50] transition-colors duration-200 active:scale-95 transition-transform" href="#">Contests</a>
<a className="text-gray-400 hover:text-[#F2CA50] transition-colors duration-200 active:scale-95 transition-transform" href="#">Standings</a>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#D4AF37] cursor-pointer" data-icon="notifications">notifications</span>
<span className="material-symbols-outlined text-[#D4AF37] cursor-pointer" data-icon="account_circle">account_circle</span>
</div>
</nav>
{/* Shell Container */}
<div className="flex h-screen pt-16">
{/* SideNavBar */}
<Sidebar breakpoint="md" topOffsetClass="top-16" ctaLabel="Deposit Now" ctaTo="/wallet" />
{/* Main Content (404 Page) */}
<main className="flex-1 ml-0 md:ml-64 bg-surface flex items-center justify-center relative overflow-hidden">
{/* Atmospheric Depth Background Texture */}
<div className="absolute inset-0 opacity-10 pointer-events-none">
<div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary-container rounded-full blur-[120px]"></div>
</div>
{/* 404 Hero Section */}
<section className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center">
{/* Large Display Number with Editorial Scale */}
<div className="relative mb-8">
<h1 className="text-[10rem] md:text-[14rem] font-headline font-extrabold leading-none tracking-tighter text-surface-container-highest/30 select-none">
                        404
                    </h1>
{/* Overlaid Icon Representing Missing Player */}
<div className="absolute inset-0 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-8xl md:text-9xl drop-shadow-[0_0_30px_rgba(242,202,80,0.4)]" data-icon="person_search" style={{fontVariationSettings: '\'FILL\' 1'}}>person_search</span>
</div>
</div>
{/* Headline */}
<h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface mb-4 tracking-tight">
                    PAGE NOT FOUND
                </h2>
{/* Subtext */}
<p className="text-on-surface-variant text-lg md:text-xl font-body max-w-md mb-10 leading-relaxed">
                    The whistle has blown, but this page isn't on the field. It looks like you've wandered out of bounds.
                </p>
{/* Action Button */}
<div className="flex flex-col sm:flex-row gap-4 items-center">
<a className="group relative px-8 py-4 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center gap-3 transition-all duration-300 hover:shadow-[0px_4px_24px_rgba(242,202,80,0.3)] active:scale-95" href="#">
<span className="text-on-primary font-headline font-extrabold tracking-tight">BACK TO DASHBOARD</span>
<span className="material-symbols-outlined text-on-primary group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</a>
<button className="px-8 py-4 bg-transparent border border-outline-variant/30 hover:bg-surface-container-high transition-colors rounded-lg flex items-center gap-3 text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="refresh">refresh</span>
<span className="font-headline font-bold text-sm tracking-wide">TRY RELOADING</span>
</button>
</div>
{/* Technical Broadcast Ticker (Unique Component) */}
<div className="mt-20 w-full bg-surface-container-lowest border-l-4 border-primary p-4 flex items-center gap-6 overflow-hidden">
<span className="text-primary font-headline font-bold text-xs uppercase tracking-widest whitespace-nowrap">LIVE STATUS:</span>
<div className="flex gap-12 animate-marquee whitespace-nowrap overflow-hidden">
<div className="flex items-center gap-2">
<span className="text-on-surface-variant font-label text-[10px] uppercase">Lobby Status:</span>
<span className="text-tertiary font-label text-xs">OPERATIONAL</span>
</div>
<div className="flex items-center gap-2">
<span className="text-on-surface-variant font-label text-[10px] uppercase">Match 404:</span>
<span className="text-error font-label text-xs">NOT FOUND</span>
</div>
<div className="flex items-center gap-2">
<span className="text-on-surface-variant font-label text-[10px] uppercase">Server Load:</span>
<span className="text-tertiary font-label text-xs">OPTIMAL</span>
</div>
<div className="flex items-center gap-2">
<span className="text-on-surface-variant font-label text-[10px] uppercase">Next Draft:</span>
<span className="text-primary font-label text-xs">00:14:52</span>
</div>
</div>
</div>
</section>
</main>
</div>
{/* Mobile Bottom Navigation Shell */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low flex justify-around items-center px-4 z-50 border-t border-outline-variant/10">
<div className="flex flex-col items-center gap-1 text-gray-500">
<span className="material-symbols-outlined" data-icon="sports_esports">sports_esports</span>
<span className="text-[10px] font-bold uppercase">Lobby</span>
</div>
<div className="flex flex-col items-center gap-1 text-gray-500">
<span className="material-symbols-outlined" data-icon="Format_list_bulleted">format_list_bulleted</span>
<span className="text-[10px] font-bold uppercase">My Walks</span>
</div>
<div className="flex flex-col items-center gap-1 text-primary">
<span className="material-symbols-outlined" data-icon="warning" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
<span className="text-[10px] font-bold uppercase">Error</span>
</div>
<div className="flex flex-col items-center gap-1 text-gray-500">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span className="text-[10px] font-bold uppercase">Rank</span>
</div>
<div className="flex flex-col items-center gap-1 text-gray-500">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
<span className="text-[10px] font-bold uppercase">Profile</span>
</div>
</nav>
    </div>
  );
}

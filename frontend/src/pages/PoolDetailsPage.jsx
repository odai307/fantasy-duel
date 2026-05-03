import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../AuthContext';
import { usePoolDetails } from '../hooks/usePoolDetails';

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Unknown User';
}

export default function PoolDetailsPage() {
  const { poolId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const {
    pool,
    loading,
    error,
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    joinLoading,
    joinError,
    joinSuccess,
    isInviteModalOpen,
    setIsInviteModalOpen,
    inviteCode,
    setInviteCode,
    joinPoolByFlow,
    handleJoinClick,
    entryFee,
    maxParticipants,
    gameweekLabel,
    poolName,
    visibility,
    poolStatus,
    currentParticipants,
    averageGameweekScore,
    participantFillPercent,
    isJoined,
    isPoolFull,
    isCreator,
    isJoinClosed,
  } = usePoolDetails({
    poolId,
    initialPool: location.state?.pool || null,
    viewerUserId: user?.id || null,
  });

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
                {loading ? <p className="text-on-surface-variant mb-6">Loading pool...</p> : null}
                {error ? <p className="text-error mb-6">{error}</p> : null}
                <div className="mb-6">
                    <Link
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80"
                        to="/pools">
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
                            <div className="mt-8 flex gap-4">
                                <button
                                    className="px-10 py-4 bg-primary text-on-primary font-headline font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                    disabled={isJoined || isPoolFull || joinLoading || isJoinClosed}
                                    onClick={handleJoinClick}
                                    type="button"
                                >
                                    {isJoined
                                      ? 'Already Joined'
                                      : isPoolFull
                                        ? 'Pool Full'
                                        : isJoinClosed
                                          ? `Pool ${poolStatus}`
                                          : joinLoading
                                            ? 'Joining...'
                                            : 'Join Pool'}
                                </button>
                                <button
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-on-surface font-headline font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                    onClick={() => {
                                      const section = document.getElementById('pool-rules');
                                      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    type="button"
                                >
                                    View Rules
                                </button>
                            </div>
                            {isCreator && pool?.inviteCode ? (
                              <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                                <span className="material-symbols-outlined text-primary text-base">vpn_key</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                                  Pool Code
                                </span>
                                <span className="font-headline font-black text-primary tracking-wider">{pool.inviteCode}</span>
                              </div>
                            ) : null}
                            {joinError ? <p className="mt-4 text-sm text-error">{joinError}</p> : null}
                            {joinSuccess ? <p className="mt-4 text-sm text-secondary">{joinSuccess}</p> : null}
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4" id="pool-rules">
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
                            {leaderboardLoading ? (
                                <div className="px-8 py-6 rounded-xl border border-white/10 bg-surface-container-low/40 text-on-surface-variant">
                                    Loading rankings...
                                </div>
                            ) : null}
                            {leaderboardError ? (
                                <div className="px-8 py-6 rounded-xl border border-error/30 bg-error/10 text-error">
                                    {leaderboardError}
                                </div>
                            ) : null}
                            {!leaderboardLoading && !leaderboardError && currentParticipants === 0 ? (
                                <div className="px-8 py-6 rounded-xl border border-white/10 bg-surface-container-low/40 text-on-surface-variant">
                                    No participants on this pool yet.
                                </div>
                            ) : null}

                            {!leaderboardLoading && !leaderboardError && leaderboard.map((row) => (
                                <div
                                    className={`grid grid-cols-12 items-center px-8 py-6 rounded-xl border transition-all ${
                                        row.isCurrentUser
                                          ? 'bg-primary/5 border-primary/25'
                                          : 'bg-surface-container-low/40 border-white/5'
                                    }`}
                                    key={row.user.id}
                                >
                                    <div className={`col-span-1 font-black font-headline text-2xl ${row.rank === 1 ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                                        {String(row.rank).padStart(2, '0')}
                                    </div>
                                    <div className="col-span-6 flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-full border border-primary/20 bg-surface-container-highest flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">person</span>
                                        </div>
                                        <div>
                                            <div className={`font-bold text-lg ${row.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
                                                {row.isCurrentUser ? `You (${fullName(row.user)})` : fullName(row.user)}
                                            </div>
                                            <div className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-medium">
                                                Manager
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right font-headline text-xl font-bold text-secondary">
                                        {row.gameweekPoints ?? 0}
                                    </div>
                                    <div className="col-span-3 text-right font-headline text-xl font-black">
                                        {row.points ?? 0}
                                    </div>
                                </div>
                            ))}
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
                                            {maxParticipants === null ? `${currentParticipants} / Unlimited` : `${currentParticipants} / ${maxParticipants}`}
                                        </span>
                                    </div>
                                    <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full rounded-full" style={{width: `${participantFillPercent}%`}}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-white/5">
                                    <span className="text-xs opacity-60 font-medium">Avg. GW Score</span>
                                    <span className="font-black text-secondary text-lg">{averageGameweekScore}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs opacity-60 font-medium">Status</span>
                                    <span
                                        className="bg-secondary/10 text-secondary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-secondary/20">{poolStatus}</span>
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
            <Link className="flex flex-col items-center justify-center text-primary" to="/pools">
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
    {isInviteModalOpen ? (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-surface border border-primary/20 rounded-3xl w-full max-w-md shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffd37b] to-[#e9b544]" />
          <button
            className="absolute top-4 right-4 text-white/40 hover:text-primary transition-colors"
            onClick={() => setIsInviteModalOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">vpn_key</span>
            </div>
            <h3 className="text-2xl font-black font-headline uppercase tracking-tighter text-white mb-2">Join Private Pool</h3>
            <p className="text-on-surface-variant/60 text-sm font-medium mb-8">
              Enter the invite code from the pool creator.
            </p>
            <div className="mb-8">
              <label className="block text-[10px] text-primary tracking-[0.2em] font-bold uppercase mb-2" htmlFor="inviteCodeInput">
                Access Code
              </label>
              <input
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-4 text-white font-headline text-lg tracking-widest uppercase focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                id="inviteCodeInput"
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="ENTER CODE"
                type="text"
                value={inviteCode}
              />
            </div>
            <div className="flex gap-4">
              <button
                className="flex-1 py-4 text-white/60 font-headline font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                onClick={() => setIsInviteModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex-[2] py-4 bg-primary text-on-primary font-headline font-bold rounded-xl uppercase tracking-[0.2em] text-xs transition-all shadow-[0_10px_20px_rgba(255,211,123,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={joinLoading || !inviteCode.trim()}
                onClick={() => joinPoolByFlow(inviteCode)}
                type="button"
              >
                {joinLoading ? 'Verifying...' : 'Confirm Join'}
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </div>
  );
}

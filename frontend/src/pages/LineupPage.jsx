import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getEntryLineup } from '../api/fplApi';

function playerName(player) {
  return player?.webName || [player?.firstName, player?.secondName].filter(Boolean).join(' ') || 'Unknown';
}

function teamShort(player) {
  return player?.teamShortName || 'N/A';
}

function PlayerDot({ pick, bench = false }) {
  return (
    <div className={`flex flex-col items-center ${bench ? 'opacity-80' : ''}`}>
      <div className={`relative overflow-hidden rounded-full border-2 ${pick.isCaptain ? 'border-primary' : 'border-surface-bright'} h-12 w-12 bg-surface-container md:h-14 md:w-14`}>
        {pick.player?.photo?.small ? (
          <img
            alt={playerName(pick.player)}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            src={pick.player.photo.small}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">person</span>
          </div>
        )}
      </div>

      <div className="mt-[-7px] min-w-[72px] rounded bg-surface-container-high px-2 py-1 text-center border border-outline-variant/15 z-10">
        <div className="truncate text-[10px] font-bold uppercase text-on-surface">
          {playerName(pick.player)}
          {pick.isCaptain ? ' (C)' : pick.isViceCaptain ? ' (V)' : ''}
        </div>
        <div className="text-[9px] text-on-surface-variant">{teamShort(pick.player)}</div>
      </div>

      <div className={`mt-1 rounded-sm border px-2 py-0.5 text-xs font-black ${pick.isCaptain ? 'border-primary/40 text-primary' : 'border-outline-variant/40 text-on-surface'}`}>
        {pick.points}
      </div>
    </div>
  );
}

export default function LineupPage() {
  const [searchParams] = useSearchParams();
  const teamId = Number(searchParams.get('teamId'));
  const eventId = searchParams.get('eventId') ? Number(searchParams.get('eventId')) : null;

  const [lineup, setLineup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLineup() {
      setLoading(true);
      setError('');
      try {
        if (!Number.isInteger(teamId) || teamId <= 0) {
          throw new Error('Invalid team id');
        }
        const data = await getEntryLineup(teamId, { eventId });
        setLineup(data);
      } catch (loadError) {
        setError(loadError.message || 'Failed to load lineup');
      } finally {
        setLoading(false);
      }
    }

    loadLineup();
  }, [eventId, teamId]);

  const startersByPosition = useMemo(() => {
    const groups = { GKP: [], DEF: [], MID: [], FWD: [] };
    for (const pick of lineup?.starters || []) {
      const key = pick?.player?.positionName;
      if (groups[key]) groups[key].push(pick);
    }
    return groups;
  }, [lineup]);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto w-full">
          <div className="flex-1 flex flex-col gap-6">
            <div className="mb-1">
              <Link className="text-xs font-bold uppercase tracking-widest text-primary" to="/leaderboard">Back to Leaderboard</Link>
            </div>
            {loading ? <p className="text-on-surface-variant">Loading lineup...</p> : null}
            {error ? <p className="text-error">{error}</p> : null}

            {!loading && !error && lineup ? (
              <>
                {(lineup.starters || []).length === 0 ? (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-8 text-center space-y-3">
                    <span className="material-symbols-outlined text-4xl text-primary">lock_clock</span>
                    <h3 className="text-lg font-bold text-on-surface">Gameweek {lineup.eventId} Lineup Locked Until Deadline</h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                      Official Premier League manager squad picks for Gameweek {lineup.eventId} will lock and display here automatically after the August 21 deadline passes!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4 md:p-8 shadow-2xl bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_60%)]">
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-center">
                          {startersByPosition.GKP.map((pick) => <PlayerDot key={`gkp-${pick.elementId}`} pick={pick} />)}
                        </div>
                        <div className="flex justify-center gap-4 md:gap-10 flex-wrap">
                          {startersByPosition.DEF.map((pick) => <PlayerDot key={`def-${pick.elementId}`} pick={pick} />)}
                        </div>
                        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                          {startersByPosition.MID.map((pick) => <PlayerDot key={`mid-${pick.elementId}`} pick={pick} />)}
                        </div>
                        <div className="flex justify-center gap-6 md:gap-14 flex-wrap">
                          {startersByPosition.FWD.map((pick) => <PlayerDot key={`fwd-${pick.elementId}`} pick={pick} />)}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-4">
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Bench</h3>
                      <div className="flex gap-4 overflow-x-auto pb-1">
                        {(lineup.bench || []).map((pick) => (
                          <div key={`bench-${pick.elementId}`} className="min-w-[90px]">
                            <PlayerDot bench pick={pick} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : null}
          </div>

          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {!loading && !error && lineup ? (
              <>
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-6 text-center">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-container mb-1">Gameweek {lineup.eventId}</div>
                  <div className="font-headline text-5xl font-black">{lineup.gameweekPoints}</div>
                  <div className="text-sm text-on-surface-variant">GW Points</div>
                </div>

                <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Manager</span>
                      <span className="font-bold">{lineup.teamInfo?.managerName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Team</span>
                      <span className="font-bold">{lineup.teamInfo?.teamName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Total Points</span>
                      <span className="font-bold text-primary">{lineup.entryHistory?.totalPoints ?? lineup.teamInfo?.overallPoints ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Overall Rank</span>
                      <span className="font-bold">{lineup.teamInfo?.overallRank || 0}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Transfers</span>
                      <span className="font-bold">{lineup.entryHistory?.eventTransfers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
                      <span className="text-on-surface-variant">Transfer Cost</span>
                      <span className="font-bold text-error">-{lineup.entryHistory?.eventTransfersCost || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant">Active Chip</span>
                      <span className="font-bold uppercase">{lineup.activeChip || 'None'}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </aside>
        </main>
      </div>
    </div>
  );
}

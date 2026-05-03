import { useCallback, useEffect, useState } from 'react';
import { getPoolById, getPoolLeaderboard, joinPool } from '../poolApi';

export function usePoolDetails({ poolId, initialPool, viewerUserId }) {
  const [pool, setPool] = useState(initialPool || null);
  const [loading, setLoading] = useState(Boolean(poolId));
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardTotal, setLeaderboardTotal] = useState(0);
  const [leaderboardLoading, setLeaderboardLoading] = useState(Boolean(poolId));
  const [leaderboardError, setLeaderboardError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const loadPool = useCallback(async () => {
    if (!poolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getPoolById(poolId);
      setPool(data.pool);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load pool');
    } finally {
      setLoading(false);
    }
  }, [poolId]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  const loadLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    setLeaderboardError('');
    try {
      const data = await getPoolLeaderboard(poolId, { page: 1, limit: 50 });
      setLeaderboard(data?.leaderboard || []);
      setLeaderboardTotal(Number(data?.pagination?.total || 0));
    } catch (loadError) {
      setLeaderboardError(loadError.message || 'Failed to load leaderboard');
      setLeaderboardTotal(0);
    } finally {
      setLeaderboardLoading(false);
    }
  }, [poolId]);

  useEffect(() => {
    if (!poolId) {
      setLeaderboardLoading(false);
      return;
    }

    loadLeaderboard();
  }, [loadLeaderboard, poolId]);

  const entryFee = Number(pool?.entryFee ?? 250);
  const maxParticipants = pool?.maxParticipants === null ? null : pool?.maxParticipants ?? 150;
  const gameweekLabel = pool?.gameweekLabel ?? `GW ${pool?.gameweek || 24}`;
  const poolName = pool?.name ?? 'Elite Strikers Hub';
  const visibility = pool?.visibility ?? 'PUBLIC';
  const poolStatus = pool?.status ?? 'OPEN';
  const poolParticipantCount = Number(pool?.participantCount);
  const currentParticipants = Number.isFinite(poolParticipantCount)
    ? poolParticipantCount
    : Number.isFinite(leaderboardTotal)
      ? leaderboardTotal
      : leaderboard.length;
  const averageGameweekScore = leaderboard.length
    ? (leaderboard.reduce((sum, row) => sum + Number(row.gameweekPoints || 0), 0) / leaderboard.length).toFixed(1)
    : '0.0';
  const participantFillPercent = maxParticipants
    ? Math.min(100, Math.round((currentParticipants / maxParticipants) * 100))
    : 100;
  const isJoined = Boolean(viewerUserId) && leaderboard.some((row) => row.user.id === viewerUserId);
  const isPoolFull = maxParticipants !== null && currentParticipants >= maxParticipants;
  const isCreator = Boolean(viewerUserId) && viewerUserId === pool?.createdBy?.id;
  const isJoinClosed = poolStatus !== 'OPEN';

  const joinPoolByFlow = useCallback(async (code = '') => {
    if (!poolId) return;

    setJoinError('');
    setJoinSuccess('');
    setJoinLoading(true);
    try {
      const payload = visibility === 'PRIVATE'
        ? { inviteCode: code.trim().toUpperCase() }
        : {};
      const data = await joinPool(poolId, payload);
      setJoinSuccess(data?.message || 'Successfully joined pool.');
      await Promise.all([loadLeaderboard(), loadPool()]);
      setIsInviteModalOpen(false);
      setInviteCode('');
    } catch (joinErr) {
      setJoinError(joinErr.message || 'Could not join pool.');
    } finally {
      setJoinLoading(false);
    }
  }, [loadLeaderboard, loadPool, poolId, visibility]);

  const handleJoinClick = useCallback(() => {
    if (isJoined || isPoolFull || joinLoading || isJoinClosed) return;

    if (visibility === 'PRIVATE') {
      setIsInviteModalOpen(true);
      return;
    }

    joinPoolByFlow();
  }, [isJoined, isPoolFull, joinLoading, isJoinClosed, visibility, joinPoolByFlow]);

  return {
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
  };
}

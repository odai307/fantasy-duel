import { useCallback, useEffect, useMemo, useState } from 'react';
import { joinDuelByCode, listDuels } from '../duelApi';

export function useDuelsLobby({ navigate }) {
  const [status, setStatus] = useState('all');
  const [duels, setDuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const loadDuels = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listDuels({ status, page: 1, limit: 30 });
      setDuels(data?.duels || []);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load duels');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadDuels();
  }, [loadDuels]);

  const handleJoinByCode = useCallback(async (event) => {
    event.preventDefault();
    const code = inviteCode.trim().toUpperCase();
    setJoinError('');

    if (!code) {
      setJoinError('Enter an invite code.');
      return;
    }

    setJoinLoading(true);
    try {
      const data = await joinDuelByCode(code);
      const duelId = data?.duel?.id;
      if (duelId) navigate(`/duels/${duelId}`);
    } catch (joinErrorValue) {
      setJoinError(joinErrorValue.message || 'Could not join duel');
    } finally {
      setJoinLoading(false);
    }
  }, [inviteCode, navigate]);

  const totalStaked = useMemo(
    () => duels.reduce((sum, duel) => sum + Number(duel.entryFee || 0), 0),
    [duels],
  );

  return {
    status,
    setStatus,
    duels,
    loading,
    error,
    inviteCode,
    setInviteCode,
    joinLoading,
    joinError,
    handleJoinByCode,
    totalStaked,
  };
}

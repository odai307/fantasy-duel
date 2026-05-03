import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { joinDuelByCode } from '../duelApi';

export default function JoinDuelPage() {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleJoin(event) {
    event.preventDefault();
    const code = inviteCode.trim().toUpperCase();

    setError('');
    setSuccess('');

    if (!code) {
      setError('Enter an invite code.');
      return;
    }

    setLoading(true);
    try {
      const data = await joinDuelByCode(code);
      setSuccess(data?.message || 'Joined duel.');
      const duelId = data?.duel?.id;
      if (duelId) {
        navigate(`/duels/${duelId}`);
      }
    } catch (joinError) {
      setError(joinError.message || 'Failed to join duel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-join-duel bg-background text-on-background font-body">
      <div className="flex min-h-screen">
        <Sidebar ctaLabel="Create Duel" ctaTo="/create-duel" />
        <main className="flex-1 lg:ml-64 p-6 lg:p-10">
          <div className="max-w-xl">
            <Link className="text-primary text-sm" to="/dashboard">Back to Dashboard</Link>
            <h1 className="text-3xl font-headline font-bold mt-4 mb-6">Join Duel By Code</h1>

            <form className="space-y-5" onSubmit={handleJoin}>
              <label className="block">
                <span className="text-sm text-on-surface-variant">Invite Code</span>
                <input
                  className="mt-1 w-full rounded-lg bg-surface border border-outline-variant px-3 py-2 uppercase"
                  maxLength={24}
                  onChange={(event) => setInviteCode(event.target.value)}
                  placeholder="ENTER CODE"
                  type="text"
                  value={inviteCode}
                />
              </label>

              {error ? <p className="text-error text-sm">{error}</p> : null}
              {success ? <p className="text-secondary text-sm">{success}</p> : null}

              <button
                className="bg-primary text-on-primary font-bold px-6 py-3 rounded-lg disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? 'Joining...' : 'Join Duel'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

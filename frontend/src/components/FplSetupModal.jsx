import { useState } from 'react';
import { setupFplTeam, validateFplTeam } from '../api/authApi';

export default function FplSetupModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [fplTeamId, setFplTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamInfo, setTeamInfo] = useState(null);

  const handleTeamIdSubmit = async (e) => {
    e.preventDefault();
    if (!fplTeamId.trim()) return;

    setLoading(true);
    setError('');

    try {
      // First validate and get team info without updating the user record
      const result = await validateFplTeam({ fplTeamId: parseInt(fplTeamId.trim()) });
      setTeamInfo(result.teamInfo);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to validate FPL team');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      await setupFplTeam({ fplTeamId: parseInt(fplTeamId.trim()) });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to connect FPL team');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFplTeamId('');
    setError('');
    setTeamInfo(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-highest rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">
              {step === 1 ? '🚀 Connect Your FPL Team' : '✅ Confirm Your Team'}
            </h2>
            <button
              onClick={handleClose}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Enter Team ID
            <>
              <div className="mb-6">
                <p className="text-on-surface-variant mb-4">
                  Connect your Fantasy Premier League team to start competing with real scores!
                  Your performance in FPL will determine your points in pools and duels.
                </p>

                <div className="bg-secondary/10 rounded-lg p-4 mb-4">
                  <p className="text-sm text-on-surface-variant">
                    <strong>How to find your Team ID:</strong><br />
                    Go to your FPL team page → The number in the URL is your Team ID
                  </p>
                </div>
              </div>

              <form onSubmit={handleTeamIdSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    FPL Team ID
                  </label>
                  <input
                    type="number"
                    value={fplTeamId}
                    onChange={(e) => setFplTeamId(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant/20 focus:border-primary focus:outline-none text-on-surface"
                    required
                  />
                </div>

                {error && (
                  <p className="text-error text-sm mb-4">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !fplTeamId.trim()}
                    className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-lg font-medium hover:bg-primary-fixed transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Validating...' : 'Continue'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            // Step 2: Confirm Team
            <>
              <div className="mb-6">
                <div className="bg-secondary/10 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-on-surface mb-2">Team Found! 🎉</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Team Name:</strong> {teamInfo?.teamName}</p>
                    <p><strong>Manager:</strong> {teamInfo?.playerName}</p>
                    <p><strong>Overall Points:</strong> {teamInfo?.overallPoints?.toLocaleString()}</p>
                    <p><strong>Overall Rank:</strong> #{teamInfo?.overallRank?.toLocaleString()}</p>
                    <p><strong>Current GW Points:</strong> {teamInfo?.eventPoints}</p>
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm">
                  This will connect your FPL team to your account. Your scores will be automatically synced for competitions.
                </p>
              </div>

              {error && (
                <p className="text-error text-sm mb-4">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-secondary text-on-secondary px-4 py-3 rounded-lg font-medium hover:bg-secondary-fixed transition-colors disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect Team'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
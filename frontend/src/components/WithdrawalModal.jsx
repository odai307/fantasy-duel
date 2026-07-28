import { useState, useEffect } from 'react';
import { requestWithdrawal } from '../api/walletApi';

export default function WithdrawalModal({ isOpen, onClose, userBalance, onSuccess }) {
  const [amount, setAmount] = useState('10');
  const [provider, setProvider] = useState('MTN MoMo');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear errors when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const providers = ['MTN MoMo', 'Telecel Cash', 'AT Money', 'Bank Transfer'];

  function handleClose() {
    setError('');
    setLoading(false);
    onClose();
  }

  async function handleWithdrawal(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      setError('Minimum withdrawal amount is GHS 1.00');
      setLoading(false);
      return;
    }

    if (numAmount > userBalance) {
      setError(`Insufficient balance. You have GHS ${userBalance.toFixed(2)} available.`);
      setLoading(false);
      return;
    }

    if (!accountNumber || !accountName) {
      setError('Please provide phone number and account holder name');
      setLoading(false);
      return;
    }

    try {
      const res = await requestWithdrawal({
        amount: numAmount,
        provider,
        accountNumber,
        accountName,
      });

      if (onSuccess) {
        onSuccess(res.message || `Payout of GHS ${numAmount.toFixed(2)} requested!`);
      }
      setAmount('10');
      handleClose();
    } catch (err) {
      setError(err.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Request Payout</h3>
              <p className="text-xs text-on-surface-variant">Available: GHS {userBalance.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleWithdrawal} className="space-y-4">
          {error ? (
            <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs">
              {error}
            </div>
          ) : null}

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Payout Channel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {providers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left flex items-center gap-2 ${
                    provider === p
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-surface-container-high border-outline-variant/15 text-on-surface-variant hover:border-outline-variant/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="truncate">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Amount to Withdraw (GHS)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">
                GHS
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="20.00"
                className="w-full pl-14 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold text-lg focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Phone / Account Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Mobile Money / Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 0551234567"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-amber-400 transition-colors"
              required
            />
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Kwame Mensah"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface text-sm focus:outline-none focus:border-amber-400 transition-colors"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 text-slate-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                <span>Processing Payout...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Confirm Withdrawal GHS {Number(amount || 0).toFixed(2)}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { initializeDeposit } from '../api/walletApi';

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const presetAmounts = ['1', '5', '10', '20', '50'];

  function handleClose() {
    setError('');
    setLoading(false);
    onClose();
  }

  async function handleDeposit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      setError('Minimum deposit amount is GHS 1.00');
      setLoading(false);
      return;
    }

    try {
      const res = await initializeDeposit(numAmount);
      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      } else {
        throw new Error('Failed to retrieve payment link');
      }
    } catch (err) {
      setError(err.message || 'Deposit initialization failed');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">Deposit Funds</h3>
              <p className="text-xs text-on-surface-variant">Paystack Secure Checkout</p>
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
        <form onSubmit={handleDeposit} className="space-y-5">
          {error ? (
            <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs">
              {error}
            </div>
          ) : null}

          {/* Quick Amount Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Select Amount (GHS)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    amount === preset
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                      : 'bg-surface-container-high border-outline-variant/15 text-on-surface hover:border-primary/40'
                  }`}
                >
                  ₵{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Custom Amount (GHS)
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
                placeholder="1.00"
                className="w-full pl-14 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-bold text-lg focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Supported Channels Badge */}
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/10 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span className="font-medium">Supported Channels:</span>
            <div className="flex items-center gap-2 font-bold text-on-surface">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">MTN MoMo</span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Telecel</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Card</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                <span>Connecting to Paystack...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Proceed to Pay GHS {Number(amount || 0).toFixed(2)}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

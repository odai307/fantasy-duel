import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../AuthContext';
import { createPool } from '../poolApi';

function formatMoney(amount) {
  const value = Number(amount) || 0;
  return `GH₵ ${value.toFixed(2)}`;
}

function gameweekLabelFromValue(gameweek) {
  return gameweek.replace('gw', 'GW ');
}

export default function CreatePoolPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, userFullName } = useAuth();

  const [poolName, setPoolName] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [gameweek, setGameweek] = useState('gw10');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [noMaxParticipants, setNoMaxParticipants] = useState(false);
  const [entryFee, setEntryFee] = useState(50);
  const [description, setDescription] = useState('Standard head-to-head format. Winner takes 70%, runner-up 30%.');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const creatorName = userFullName || '';
  const creatorLoading = isInitializing;
  const creatorError = !isInitializing && !isAuthenticated
    ? 'Login to auto-fill creator name from your account.'
    : '';

  const participantsValue = Math.min(20, Math.max(2, Number(maxParticipants) || 2));
  const entryFeeValue = Math.max(0, Number(entryFee) || 0);
  const estimatedPrizePot = noMaxParticipants ? null : entryFeeValue * participantsValue;

  const previewName = poolName.trim() || 'Untitled Pool';
  const previewDescription = description.trim() || 'No description yet.';

  const handleCreatePool = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!isAuthenticated) {
      setFormError('Please log in to create a pool.');
      return;
    }

    const parsedGameweek = Number(gameweek.replace('gw', ''));

    setIsSubmitting(true);
    try {
      const data = await createPool({
        name: previewName,
        description: previewDescription,
        gameweek: parsedGameweek,
        entryFee: entryFeeValue,
        maxParticipants: noMaxParticipants ? null : participantsValue,
        visibility,
      });

      navigate(`/pools/${data.pool.id}`);
    } catch (error) {
      setFormError(error.message || 'Failed to create pool');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-create-pool bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <div className="flex min-h-screen">
        <Sidebar ctaLabel="Back To Pools" ctaTo="/pools" />

        <main className="flex-1 lg:ml-64 min-w-0 bg-background pb-12">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-[#0e0e0e]/60 backdrop-blur-md border-b border-[#4D4635]/15 shadow-2xl shadow-black/20 flex justify-between items-center px-8 h-16">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-gray-400 hover:text-[#D4AF37]" type="button">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-lg font-black text-[#D4AF37] tracking-tighter uppercase font-headline">
                Create Pool
              </h1>
            </div>
            <button className="p-2 text-gray-400 hover:bg-[#1C1B1B] hover:text-[#D4AF37] rounded-md transition-all" type="button">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </header>

          <div className="pt-24 px-4 md:px-8 pb-12 flex-1 flex flex-col">
            <div className="mb-8">
              <Link
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-200 mb-6 group w-fit"
                to="/pools"
              >
                <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
                <span className="text-sm font-label font-semibold tracking-wide uppercase">Back to Pools</span>
              </Link>

              <h2 className="text-3xl md:text-[2rem] font-headline font-bold text-on-surface tracking-tight mb-2">
                Create New Pool
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
                Establish a private league, set the stakes, and invite rivals. Define the parameters for your custom FantasyDuel competition.
              </p>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" onSubmit={handleCreatePool}>
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                <section className="bg-surface-container-low rounded-lg p-6 md:p-8">
                  <h3 className="font-headline font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/15 pb-2">
                    Pool Configuration
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-label text-xs text-on-surface-variant mb-2" htmlFor="poolName">
                        POOL NAME
                      </label>
                      <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all">
                        <input
                          className="w-full bg-transparent border-none text-on-surface text-base focus:ring-0 px-3 py-2"
                          id="poolName"
                          onChange={(event) => setPoolName(event.target.value)}
                          placeholder="e.g., Accra Elite Division"
                          required
                          type="text"
                          value={poolName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label text-xs text-on-surface-variant mb-2" htmlFor="creatorName">
                          CREATOR NAME
                        </label>
                        <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all">
                          <input
                            className="w-full bg-transparent border-none text-on-surface text-base focus:ring-0 px-3 py-2"
                            id="creatorName"
                            readOnly
                            required
                            type="text"
                            value={creatorLoading ? 'Loading creator...' : creatorName}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">
                          {creatorError || 'Creator is pulled from your logged-in account.'}
                        </p>
                      </div>

                      <div>
                        <label className="block font-label text-xs text-on-surface-variant mb-2">
                          VISIBILITY
                        </label>
                        <div className="flex bg-surface-container-lowest rounded-DEFAULT p-1 border border-outline-variant/20">
                          <button
                            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-DEFAULT transition-colors ${
                              visibility === 'PUBLIC' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            onClick={() => setVisibility('PUBLIC')}
                            type="button"
                          >
                            Public
                          </button>
                          <button
                            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-DEFAULT transition-colors ${
                              visibility === 'PRIVATE' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            onClick={() => setVisibility('PRIVATE')}
                            type="button"
                          >
                            Private
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">
                          {visibility === 'PUBLIC'
                            ? 'Visible in pools listing.'
                            : 'Hidden from listing. Join via invite code.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label text-xs text-on-surface-variant mb-2" htmlFor="gameweek">
                          STARTING GAMEWEEK
                        </label>
                        <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all relative">
                          <select
                            className="w-full bg-transparent border-none text-on-surface text-base focus:ring-0 px-3 py-2 appearance-none"
                            id="gameweek"
                            onChange={(event) => setGameweek(event.target.value)}
                            value={gameweek}
                          >
                            <option className="bg-surface-container-highest text-on-surface" value="gw10">Gameweek 10 (Upcoming)</option>
                            <option className="bg-surface-container-highest text-on-surface" value="gw11">Gameweek 11</option>
                            <option className="bg-surface-container-highest text-on-surface" value="gw12">Gameweek 12</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-lowest rounded-DEFAULT px-4 py-3 text-on-surface-variant text-sm border border-outline-variant/20">
                        Invite code is auto-generated after creation.
                      </div>
                    </div>

                    {formError ? (
                      <p className="text-xs text-error font-semibold">{formError}</p>
                    ) : null}
                    {!creatorName.trim() ? (
                      <p className="text-xs text-on-surface-variant/80 font-semibold">
                        Waiting for creator identity from your account...
                      </p>
                    ) : (
                      <p className="text-xs text-secondary font-semibold">Creator loaded from account.</p>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2 gap-4">
                        <label className="block font-label text-xs text-on-surface-variant" htmlFor="maxParticipants">
                          MAX PARTICIPANTS (2-20)
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer">
                          <input
                            checked={noMaxParticipants}
                            className="h-4 w-4 rounded border-outline-variant/40 bg-surface-container-lowest text-primary focus:ring-primary/40"
                            onChange={(event) => setNoMaxParticipants(event.target.checked)}
                            type="checkbox"
                          />
                          No max limit
                        </label>
                      </div>
                      <label className="sr-only" htmlFor="maxParticipants">
                        MAX PARTICIPANTS (2-20)
                      </label>
                      {noMaxParticipants ? (
                        <div className="bg-surface-container-lowest rounded-DEFAULT px-4 py-3 text-on-surface-variant text-sm border border-outline-variant/20">
                          Unlimited participants
                        </div>
                      ) : (
                        <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all">
                          <input
                            className="w-full bg-transparent border-none text-on-surface text-base focus:ring-0 px-3 py-2"
                            id="maxParticipants"
                            max="20"
                            min="2"
                            onChange={(event) => setMaxParticipants(event.target.value)}
                            required
                            type="number"
                            value={participantsValue}
                          />
                        </div>
                      )}
                      {noMaxParticipants ? (
                        <p className="text-xs text-secondary mt-2">Pool will allow unlimited participants.</p>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-low rounded-lg p-6 md:p-8">
                  <h3 className="font-headline font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/15 pb-2">
                    Entry & Stakes
                  </h3>

                  <div>
                    <label className="block font-label text-xs text-on-surface-variant mb-2" htmlFor="entryFee">
                      ENTRY FEE (GHS)
                    </label>
                    <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all flex items-center">
                      <span className="text-gray-500 pl-3 font-semibold">GH₵</span>
                      <input
                        className="w-full bg-transparent border-none text-on-surface text-lg focus:ring-0 px-3 py-2"
                        id="entryFee"
                        min="0"
                        onChange={(event) => setEntryFee(event.target.value)}
                        placeholder="0.00"
                        required
                        step="0.01"
                        type="number"
                        value={entryFeeValue}
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-low rounded-lg p-6 md:p-8">
                  <h3 className="font-headline font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/15 pb-2">
                    Description & Rules
                  </h3>

                  <div className="bg-surface-container-lowest rounded-DEFAULT p-1 focus-within:border-b focus-within:border-primary transition-all">
                    <textarea
                      className="w-full bg-transparent border-none text-on-surface text-base focus:ring-0 px-3 py-2 resize-none"
                      id="description"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Briefly describe the rules, payout structure, or trash talk..."
                      rows="4"
                      value={description}
                    />
                  </div>
                </section>

                <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/15 mt-8">
                  <Link
                    className="px-6 py-3 rounded-DEFAULT border border-outline-variant/15 text-primary font-semibold text-sm hover:bg-surface-container-highest transition-colors"
                    to="/pools"
                  >
                    Cancel
                  </Link>
                  <button
                    className="px-8 py-3 rounded-DEFAULT bg-primary-gradient text-on-primary font-bold text-sm hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={creatorLoading || !creatorName.trim() || isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 'Creating Pool...' : 'Create Pool'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                <div className="bg-surface-container-high rounded-lg p-6 shadow-ambient">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-xs font-label text-tertiary">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      DRAFT
                    </span>
                    <span className="text-xs font-label text-gray-500">PREVIEW</span>
                  </div>

                  <h4 className="font-headline font-bold text-xl text-on-surface mb-2 truncate">{previewName}</h4>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{previewDescription}</p>
                  <div className="mb-6">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant">
                      {visibility === 'PRIVATE' ? 'Private Pool' : 'Public Pool'}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-gray-500">Entry Fee</span>
                      <span className="font-semibold text-on-surface">{formatMoney(entryFeeValue)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-gray-500">Participants</span>
                      <span className="font-semibold text-on-surface">
                        {noMaxParticipants ? 'Unlimited' : `1 / ${participantsValue}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-gray-500">Starts</span>
                      <span className="font-semibold text-on-surface">{gameweekLabelFromValue(gameweek)}</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-DEFAULT border border-outline-variant/15 flex flex-col items-center justify-center text-center">
                    <span className="font-label text-xs text-on-surface-variant mb-1">ESTIMATED PRIZE POT</span>
                    <span className="font-headline font-extrabold text-3xl text-primary tracking-tight">
                      {estimatedPrizePot === null ? 'Variable' : formatMoney(estimatedPrizePot)}
                    </span>
                    <span className="text-[10px] text-gray-600 mt-2 uppercase tracking-wide">
                      {estimatedPrizePot === null ? 'No participant cap set' : 'Based on max capacity'}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

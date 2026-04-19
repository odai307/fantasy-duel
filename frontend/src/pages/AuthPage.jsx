import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../authUtils';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const [authMode, setAuthMode] = useState('register');
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    fplTeamId: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAuthToken()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  function handleRegisterChange(field, value) {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLoginChange(field, value) {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  }

  function parseName(fullName) {
    const clean = fullName.trim().replace(/\s+/g, ' ');
    const [firstName, ...rest] = clean.split(' ');
    return {
      firstName: firstName || '',
      lastName: rest.join(' ').trim(),
    };
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!registerForm.acceptedTerms) {
      setErrorMessage('Please accept the terms to continue.');
      return;
    }

    const { firstName, lastName } = parseName(registerForm.fullName);
    if (!firstName || !lastName) {
      setErrorMessage('Please enter your full name (first and last name).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: registerForm.email.trim().toLowerCase(),
          password: registerForm.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed');
      }

      setStatusMessage('Registration successful. Please log in.');
      setRegisterForm({
        fullName: '',
        fplTeamId: '',
        email: '',
        password: '',
        acceptedTerms: false,
      });
      setLoginForm((prev) => ({ ...prev, email: registerForm.email.trim().toLowerCase() }));
      setAuthMode('login');
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim().toLowerCase(),
          password: loginForm.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      if (!data?.token) {
        throw new Error('Login token missing from response');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('fantasyduel_token', data.token);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-auth bg-background text-on-background font-body selection:bg-primary selection:text-on-primary min-h-screen flex items-center justify-center p-4 lg:p-0">
{/* Background Ambience */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
    </div>
    {/* Main Auth Canvas */}
    <main
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 obsidian-panel rounded-xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-outline-variant/10">
        {/* Branding Side */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-surface-container-lowest">
            <div className="absolute inset-0 z-0">
                <img className="w-full h-full object-cover opacity-20 grayscale brightness-50"
                    data-alt="Cinematic shot of a modern football stadium at night under bright floodlights with a slight hazy atmosphere"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByt6bqMdh_A--zbwE-BNWPgWjPbD30_WqbH3VLXc3BswfOO0JusyGCiztDT7iMz0g7qu9eAROxQk6Qg9PnILZJdgTUgMsyC3iyhnv15EMOE_-IPql2xW1l860FWzoIEqM4ZUTXis7vhn4xQdJyI4HyBCHpH3vS5CQOmMuueHYnO-sl6m9f7DtHN8vxWKBEPkK3_hMAA9tSfbMq-RJwOnpaNnQ8uqWG3bkrpuvUImRaOUol-cAI01rDPE9p26pnwKWpd19I31C-xgxg" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            </div>
            <div className="relative z-10">
                <h1 className="font-headline text-5xl font-bold tracking-tighter text-primary flex flex-col">
                    <span className="text-xs uppercase tracking-[0.5em] text-primary/60 font-medium mb-2">The Elite
                        League</span>
                    FantasyDuel GH
                </h1>
                <p
                    className="mt-6 text-on-surface-variant font-medium max-w-xs leading-relaxed border-l-2 border-primary/30 pl-4">
                    Enter the premier arena for Ghana's tactical masterminds. Stake your reputation, challenge the
                    elite, and secure your legacy.
                </p>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="flex -space-x-3">
                        <img className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover grayscale"
                            data-alt="Manager avatar"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIj7p1c6Mg-lVvQErPgiaUyVMmElgiRf2bDBqf32tT5fHkP4AVBhGtgvMQmCyslUTrx0YOoqosotto7msXbuPVpWkLC5F90pOyskNgpzkIihBCRYjaED2_3JS3jA2irOMNUS7MvRI1XxE629wHHfjlE7R3EfMLJsYe07dLDUWLyOtgPJ0I55dO-RbERPoaU6na3LLuI11uT9t_UxAPy9G4d9X4foAygOF_IEtRzim5bqAomQ9JYF28QUsMZNtrB2rWNoYMxIpdr2jC" />
                        <img className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover grayscale"
                            data-alt="Manager avatar"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtIZkUnPQWem6PSvA3h74Ucm9aqULUe_T7N9XusuT63JgqsiIcdAtygud2SjRCHtgrCotLK8GcVoaX4cl7aZE2m_x58xIqbS_kR-Wd92_pRpHpx5Ub1MEV02tzh7yOqVCfUo-HYWKOzUM4mEGH38qCDZpzhBCMoLuBpv47rBfE7-UeUaQN1JmowPWZlDyWQ8lPW6vEif69_rM6dxSR5k2tM9wkZo_IdJfEiKuVMibzh2xN3xSZkXtScLW_M7jpapoL7ljLewUieDaL" />
                        <img className="w-10 h-10 rounded-full border-2 border-surface-container-lowest object-cover grayscale"
                            data-alt="Manager avatar"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjin5vwjwUmrd4STz0r6Vq4VrfpFtzvpNLheFNShBMxaa-rkqGZ6sMpZClwzATdIvFWHhNuhaKKDrMtTkpf5ElFQ6P07NbgV-dQGuGk6X1pne51_6Ieik8ubYBMd-sN__t8_sg-FDSm_-hY86a-93CdONhiKRrtuQQBQBHa3f_ZQEnx9UvefR8432YZBkqC8uGIXzMvIwSXGcnpuawPsNg_ZoOOtEARQ4jrU_3uyUIEXFzOH32NkUZ6MH5ropU0Dzvbypi70aILFkf" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">15,000+ Verified
                        Managers</span>
                </div>
                <div
                    className="bg-primary/5 backdrop-blur-xl p-6 rounded-lg border border-primary/10 group hover:border-primary/30 transition-all duration-500">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-sm"
                            style={{fontVariationSettings: '\'FILL\' 1'}}>workspace_premium</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Prize
                            Pools</span>
                    </div>
                    <p
                        className="text-sm font-headline font-bold leading-relaxed tracking-tight group-hover:text-on-surface transition-colors">
                        "THE HIGHEST STAKES IN GHANA FANTASY HISTORY ARE OPEN NOW."</p>
                </div>
            </div>
        </div>
        {/* Forms Side */}
        <div className="p-8 lg:p-16 bg-surface-container-low flex flex-col justify-center">
            {/* Auth Toggle Tabs */}
            <div
                className="flex gap-0 bg-surface-container-lowest p-1 rounded-lg mb-12 w-fit border border-outline-variant/10">
                <button
                    className={`px-8 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                      authMode === 'register'
                        ? 'bg-primary text-on-primary shadow-lg'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setAuthMode('register')}
                    type="button">
                    Register
                </button>
                <button
                    className={`px-8 py-2.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                      authMode === 'login'
                        ? 'bg-primary text-on-primary shadow-lg'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setAuthMode('login')}
                    type="button">
                    Login
                </button>
            </div>
            {errorMessage ? (
              <p className="mb-6 text-sm text-error">{errorMessage}</p>
            ) : null}
            {statusMessage ? (
              <p className="mb-6 text-sm text-secondary">{statusMessage}</p>
            ) : null}
            {authMode === 'register' ? (
            <div className="space-y-8" id="register-view">
                <div>
                    <h2 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">Create Elite
                        Account</h2>
                    <div className="w-12 h-1 bg-primary mt-3"></div>
                </div>
                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Full
                                Name</label>
                            <div className="relative group">
                                <span
                                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">person</span>
                                <input
                                    className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                    onChange={(event) => handleRegisterChange('fullName', event.target.value)}
                                    placeholder="Kwame Mensah" type="text"
                                    value={registerForm.fullName} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">FPL
                                Team ID</label>
                            <div className="relative group">
                                <span
                                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">sports_soccer</span>
                                <input
                                    className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                    onChange={(event) => handleRegisterChange('fplTeamId', event.target.value)}
                                    placeholder="827391" type="text"
                                    value={registerForm.fplTeamId} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Email
                            Address</label>
                        <div className="relative group">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                            <input
                                className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                onChange={(event) => handleRegisterChange('email', event.target.value)}
                                placeholder="manager@fantasyduel.gh" type="email"
                                value={registerForm.email} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Create
                            Password</label>
                        <div className="relative group">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">lock</span>
                            <input
                                className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                onChange={(event) => handleRegisterChange('password', event.target.value)}
                                placeholder="••••••••" type="password"
                                value={registerForm.password} />
                        </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                        <div className="relative flex items-center">
                            <input
                                className="w-4 h-4 rounded-sm border-outline-variant/50 bg-surface-container-highest text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                checked={registerForm.acceptedTerms}
                                onChange={(event) => handleRegisterChange('acceptedTerms', event.target.checked)}
                                type="checkbox" />
                        </div>
                        <label className="text-[11px] text-on-surface-variant leading-relaxed select-none">
                            I agree to the <a
                                className="text-primary hover:text-primary-container transition-colors font-medium"
                                href="#">Terms of Service</a> and confirm I am over 18 years of age.
                        </label>
                    </div>
                    <button
                        className="w-full gold-gradient text-on-primary font-headline font-bold uppercase py-4 rounded-lg shadow-xl button-glow hover:-translate-y-0.5 active:translate-y-0 transition-all tracking-[0.2em] flex items-center justify-center gap-3"
                        disabled={isSubmitting}
                        type="submit">
                        {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                        <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                    </button>
                </form>
                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-outline-variant/10"></div>
                    <span
                        className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">Trusted
                        Partners</span>
                    <div className="flex-grow border-t border-outline-variant/10"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className="flex items-center justify-center gap-3 bg-surface-container-highest/30 border border-outline-variant/10 py-3.5 rounded-lg hover:bg-surface-container-highest hover:border-primary/20 transition-all group">
                        <svg className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"></path>
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"></path>
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"></path>
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"></path>
                        </svg>
                        <span
                            className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Google</span>
                    </button>
                    <button
                        className="flex items-center justify-center gap-3 bg-surface-container-highest/30 border border-outline-variant/10 py-3.5 rounded-lg hover:bg-surface-container-highest hover:border-primary/20 transition-all group">
                        <svg className="w-5 h-5 text-[#1877F2] grayscale group-hover:grayscale-0 transition-all"
                            fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z">
                            </path>
                        </svg>
                        <span
                            className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Facebook</span>
                    </button>
                </div>
                <p className="text-center text-[10px] font-medium tracking-wide text-on-surface-variant/60 pt-4">
                    Already an elite manager?{' '}
                    <button
                        className="text-primary font-bold hover:underline underline-offset-4"
                        onClick={() => setAuthMode('login')}
                        type="button">
                        LOGIN TO VAULT
                    </button>
                </p>
            </div>
            ) : (
            <div className="space-y-8" id="login-view">
                <div>
                    <h2 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface">
                        Login To Vault
                    </h2>
                    <div className="w-12 h-1 bg-primary mt-3"></div>
                </div>
                <form className="space-y-5" onSubmit={handleLoginSubmit}>
                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Email
                            Address</label>
                        <div className="relative group">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                            <input
                                className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                onChange={(event) => handleLoginChange('email', event.target.value)}
                                placeholder="manager@fantasyduel.gh" type="email"
                                value={loginForm.email} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70">Password</label>
                        <div className="relative group">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">lock</span>
                            <input
                                className="w-full pl-12 bg-surface-container-highest/50 border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none input-focus-gold py-3.5 text-sm transition-all"
                                onChange={(event) => handleLoginChange('password', event.target.value)}
                                placeholder="••••••••" type="password"
                                value={loginForm.password} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                        <label className="flex items-center gap-2 text-on-surface-variant">
                            <input
                                className="w-4 h-4 rounded-sm border-outline-variant/50 bg-surface-container-highest text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                checked={loginForm.rememberMe}
                                onChange={(event) => handleLoginChange('rememberMe', event.target.checked)}
                                type="checkbox" />
                            Remember me
                        </label>
                        <button className="text-primary hover:underline underline-offset-4 font-medium" type="button">
                            Forgot password?
                        </button>
                    </div>
                    <button
                        className="w-full gold-gradient text-on-primary font-headline font-bold uppercase py-4 rounded-lg shadow-xl button-glow hover:-translate-y-0.5 active:translate-y-0 transition-all tracking-[0.2em] flex items-center justify-center gap-3"
                        disabled={isSubmitting}
                        type="submit">
                        {isSubmitting ? 'Signing in...' : 'Secure Login'}
                        <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                    </button>
                </form>
                <p className="text-center text-[10px] font-medium tracking-wide text-on-surface-variant/60 pt-4">
                    New to FantasyDuel?{' '}
                    <button
                        className="text-primary font-bold hover:underline underline-offset-4"
                        onClick={() => setAuthMode('register')}
                        type="button">
                        CREATE ACCOUNT
                    </button>
                </p>
            </div>
            )}
        </div>
    </main>
    {/* Floating Support */}
    <div className="fixed bottom-8 right-8 z-20">
        <button
            className="bg-surface-container-highest hover:bg-surface-bright p-3.5 rounded-full shadow-2xl border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all duration-300 flex items-center gap-3 group">
            <span
                className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">headset_mic</span>
            <span className="text-[10px] font-bold uppercase tracking-widest pr-2 hidden sm:inline">Concierge Support</span>
        </button>
    </div>
    </div>
  );
}

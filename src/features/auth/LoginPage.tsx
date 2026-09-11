import React, { useState } from 'react';
import { authStore, useAuth } from '../../stores/auth-store.ts';
import { uiStore, useUI } from '../../stores/ui-store.ts';
import { Role, RoleLabels } from './authConfig.ts';
import { AshielderLogo } from '../../components/ui/AshielderLogo.tsx';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const ui = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'google' | 'microsoft' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [activeDevRole, setActiveDevRole] = useState<Role | null>(null);

  // Submit standard email/password authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const success = await authStore.login(email, password);
      if (success) {
        uiStore.addToast('success', 'Authenticated successfully. Initializing workspace...');
        uiStore.navigate('/overview');
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle SSO (Google / Microsoft)
  const handleSSO = async (provider: 'google' | 'microsoft') => {
    setSsoProvider(provider);
    setErrorMsg(null);
    try {
      // Simulate OAuth redirect & exchange
      await new Promise((res) => setTimeout(res, 600));
      await authStore.login(
        provider === 'google' ? 'analyst.google@soc.local' : 'analyst.msft@soc.local',
        'oauth_sso_verified'
      );
      uiStore.addToast('success', `Signed in via ${provider === 'google' ? 'Google Workspace' : 'Microsoft Entra ID'}`);
      uiStore.navigate('/overview');
    } catch {
      setErrorMsg(`Failed to authenticate with ${provider}.`);
    } finally {
      setSsoProvider(null);
    }
  };

  // Quick fill developer roles (all 5 official ASHEILDER roles)
  const handleQuickRoleSelect = (role: Role) => {
    setActiveDevRole(role);
    setErrorMsg(null);
    switch (role) {
      case Role.SOC_ANALYST:
        setEmail('alice@soc.local');
        setPassword('soc_analyst_2026');
        break;
      case Role.INVESTIGATOR:
        setEmail('bob.investigator@soc.local');
        setPassword('investigator_2026');
        break;
      case Role.IT_ADMIN:
        setEmail('charlie.itadmin@soc.local');
        setPassword('it_admin_2026');
        break;
      case Role.FRAUD_IR:
        setEmail('dave.fraud@soc.local');
        setPassword('fraud_ir_2026');
        break;
      case Role.ADMIN:
        setEmail('eve.admin@soc.local');
        setPassword('admin_root_2026');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#f4f7fb] dark:bg-[#070b14] relative select-none antialiased theme-transition">
      {/* Top right theme mode toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={() => uiStore.toggleTheme()}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0e1627]/80 backdrop-blur-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={ui.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {ui.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>

      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Login Card matching user reference */}
      <div className="w-full max-w-[390px] sm:max-w-[420px] bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 animate-fadeIn">
        {/* Top Header with Exact Dashboard AshielderLogo Component */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-2">
            <AshielderLogo
              size="md"
              variant="full"
              theme={ui.theme === 'dark' ? 'dark' : 'light'}
            />
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight mt-4">
            Sign in to your account
          </h1>
          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            Access your forensic investigation workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div className="relative">
            <label htmlFor="auth-email-input" className="sr-only">
              Email address
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a68ff] transition-all shadow-2xs"
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <label htmlFor="auth-password-input" className="sr-only">
              Password
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="auth-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1a68ff] transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Sign In Primary Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1a68ff] hover:bg-[#1557d6] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white dark:bg-[#0c1322] px-3 text-slate-400 dark:text-slate-500">
                or continue with
              </span>
            </div>
          </div>

          {/* SIH 26106 DEMO MODE BUTTON (GOLDEN PATH) */}
          <button
            type="button"
            onClick={async () => {
              setIsSubmitting(true);
              try {
                // Log in as Investigator
                await authStore.login('demo.investigator@ashielder.local', 'sih_demo_2026');
                // Force SIH Demo Case Context
                uiStore.addToast('success', 'SIH 26106 Demo initialized. Loading golden path case...');
                uiStore.navigate('/investigator');
              } catch {
                setErrorMsg('Demo initialization failed.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#08B4ED] bg-cyan-50/10 hover:bg-[#08B4ED]/10 text-[#08B4ED] font-bold text-sm transition-all shadow-[0_0_15px_rgba(8,180,237,0.15)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            <span>Launch SIH 26106 Demo (Golden Path)</span>
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white dark:bg-[#0c1322] px-3 text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                or sign in
              </span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => handleSSO('google')}
            disabled={Boolean(ssoProvider) || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            {ssoProvider === 'google' ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              /* Google 4-Color G SVG */
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Microsoft SSO Button */}
          <button
            type="button"
            onClick={() => handleSSO('microsoft')}
            disabled={Boolean(ssoProvider) || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1627] hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            {ssoProvider === 'microsoft' ? (
              <span className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              /* Microsoft 4-Square SVG */
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            )}
            <span>Continue with Microsoft</span>
          </button>

          {/* Forgot Password Link (right-aligned matching reference) */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-[#1a68ff] dark:text-sky-400 hover:underline cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      {/* Developer Testing Bar (Preserves multi-role testing for all 5 roles) */}
      <div className="mt-6 w-full max-w-[420px] p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs text-center z-10">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>DEVELOPER ROLE PREVIEW (PRE-FILL)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {(Object.keys(RoleLabels) as Role[]).map((role) => {
            const isSelected = activeDevRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleQuickRoleSelect(role)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-sky-400'
                }`}
              >
                {RoleLabels[role]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Password Reset Assistance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Because ASHEILDER operates within enterprise tenant partitions under zero-trust guidelines, password resets must be provisioned through your organization’s designated SOC Administrator or Identity Provider (IdP).
            </p>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-blue-500/30 text-[11px] text-slate-700 dark:text-slate-300">
              For evaluation environments, you can select any role from the <strong>Developer Role Preview</strong> to sign in instantly.
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1a68ff] text-white text-xs font-semibold hover:bg-[#1557d6] cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

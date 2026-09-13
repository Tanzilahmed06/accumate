import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FlaskConical,
  Lock,
  Mail,
  QrCode,
  RefreshCw,
  Smartphone,
  Users,
} from 'lucide-react';
import type { UserRole } from '../types';
import { BrandLogo } from './BrandLogo';
import { Navbar } from './Navbar';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, identity: { email: string; mobile: string }) => void | Promise<void>;
  onLoadDemoWorkspace: () => void;
  onOpenPublicVerify: () => void;
}

const roles: Array<{
  value: UserRole;
  label: string;
  detail: string;
  icon: React.ElementType;
}> = [
  { value: 'trader', label: 'Business owner', detail: 'Manage your instruments', icon: Building2 },
  { value: 'officer', label: 'Field officer', detail: 'Review and inspect', icon: Award },
  { value: 'gatc', label: 'Test centre', detail: 'Record test results', icon: FlaskConical },
  { value: 'admin', label: 'Department admin', detail: 'Oversee the service', icon: Users },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onLoadDemoWorkspace, onOpenPublicVerify }) => {
  const [authMethod, setAuthMethod] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('trader');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('9 K 4 B 2');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCaptcha = () => {
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const code = Array.from({ length: 5 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join(' ');
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanInput = captchaInput.replace(/\s+/g, '').toUpperCase();
    const cleanCaptcha = captchaCode.replace(/\s+/g, '').toUpperCase();
    if (!cleanInput) {
      setError('Please enter the security code to continue.');
      return;
    }
    if (cleanInput !== cleanCaptcha) {
      setError('That security code does not match. Please try the new one.');
      generateCaptcha();
      return;
    }
    if (authMethod === 'OTP' && !otpSent) {
      setError('Send an OTP to your registered mobile number first.');
      return;
    }
    if (authMethod === 'OTP' && otp.replace(/\s/g, '').length !== 6) {
      setError('Enter the 6-digit OTP to continue.');
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      void Promise.resolve(onLoginSuccess(selectedRole, { email, mobile: mobileNumber }))
        .catch((loginError: unknown) => {
          setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please check your details.');
        })
        .finally(() => setIsLoading(false));
    }, 650);
  };

  const handleSendOtp = () => {
    if (mobileNumber.replace(/\D/g, '').length !== 10) {
      setError('Enter a valid 10-digit registered mobile number.');
      return;
    }
    setOtpSent(true);
    setOtp('482910');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-950">
      <Navbar className="bg-white/90 px-5 py-4 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <BrandLogo />
            <div>
              <div className="font-heading text-lg font-bold tracking-tight text-slate-950">AccuMate</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Legal Metrology Services</div>
            </div>
          </div>
          <button
            onClick={onOpenPublicVerify}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-3"
          >
            <QrCode className="size-4" />
            <span className="hidden sm:inline">Verify a certificate</span>
            <span className="sm:hidden">Verify</span>
          </button>
        </div>
      </Navbar>

      <main className="mx-auto grid w-full max-w-7xl items-stretch gap-8 px-5 py-8 lg:min-h-[calc(100vh-137px)] lg:grid-cols-[1fr_480px] lg:gap-16 lg:px-8 lg:py-12">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-7 py-10 text-white shadow-xl shadow-slate-300/40 sm:px-10 lg:py-14">
          <div className="absolute -left-16 -top-20 size-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 size-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              A simpler way to stay verified
            </div>
            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Confidence in every measurement.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-indigo-100/85 sm:text-lg">
              Apply for verification, follow inspections, and keep every certificate close at hand — all in one welcoming workspace.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Apply online', 'Start in a few minutes'],
                ['02', 'Track progress', 'See every next step'],
                ['03', 'Stay certified', 'Receive timely reminders'],
              ].map(([number, title, detail]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="text-xs font-bold tracking-wider text-cyan-300">{number}</div>
                  <div className="mt-3 text-sm font-semibold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-indigo-200/75">{detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-3 text-xs text-indigo-100/70">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              Your certificate can always be verified publicly by its QR code.
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-semibold text-indigo-700">Welcome back</p>
              <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight text-slate-950">Sign in to your account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Choose your workspace and we’ll take you where you need to go.</p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setAuthMethod('PASSWORD')}
                className={`rounded-lg px-3 py-2.5 transition ${authMethod === 'PASSWORD' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Email & password
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('OTP')}
                className={`rounded-lg px-3 py-2.5 transition ${authMethod === 'OTP' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Mobile OTP
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <fieldset>
                <legend className="mb-2.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">I’m signing in as</legend>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const active = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => selectRole(role.value)}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                          active ? 'border-indigo-600 bg-indigo-50 text-indigo-950' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon className="size-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold leading-4">{role.label}</span>
                          <span className="block truncate text-[11px] leading-4 text-slate-500">{role.detail}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {authMethod === 'PASSWORD' ? (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
                    <span className="relative block">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        placeholder="you@example.com"
                        required
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                      Password
                      <button type="button" className="text-xs font-semibold text-indigo-700 hover:text-indigo-900">Forgot password?</button>
                    </span>
                    <span className="relative block">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Registered mobile number</span>
                    <span className="flex gap-2">
                      <span className="relative block min-w-0 flex-1">
                        <Smartphone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(event) => setMobileNumber(event.target.value)}
                          className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          placeholder="10-digit mobile number"
                        />
                      </span>
                      <button type="button" onClick={handleSendOtp} className="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100">
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </span>
                  </label>
                  {otpSent && (
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">6-digit OTP</span>
                      <input
                        type="text"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-center font-mono text-base tracking-[0.45em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        placeholder="000000"
                      />
                    </label>
                  )}
                </>
              )}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="security-code" className="text-sm font-medium text-slate-700">Security check</label>
                  <span className="text-xs text-slate-500">Enter the characters shown</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex min-w-[132px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 font-mono text-sm font-bold tracking-[0.22em] text-indigo-700">
                    {captchaCode}
                  </div>
                  <button type="button" onClick={generateCaptcha} className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-700" aria-label="Generate a new security code">
                    <RefreshCw className="size-4" />
                  </button>
                  <input
                    id="security-code"
                    type="text"
                    value={captchaInput}
                    onChange={(event) => setCaptchaInput(event.target.value.toUpperCase())}
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-center font-mono text-sm tracking-wider text-slate-900 outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Code"
                    required
                  />
                </div>
              </div>

              {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs leading-5 text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-wait disabled:opacity-70"
              >
                {isLoading ? 'Signing you in…' : <>Sign in securely <ArrowRight className="size-4" /></>}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-500">
              Want to explore sample records? <button type="button" onClick={onLoadDemoWorkspace} className="font-semibold text-indigo-700 hover:text-indigo-900">Load Demo Workspace</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 pb-6 text-center text-xs text-slate-500 sm:px-8">
        <span>Government of India · Department of Legal Metrology</span>
        <span className="mx-2 text-slate-300">|</span>
        <button onClick={onOpenPublicVerify} className="font-medium text-indigo-700 hover:text-indigo-900">Public certificate verification</button>
      </footer>
    </div>
  );
};

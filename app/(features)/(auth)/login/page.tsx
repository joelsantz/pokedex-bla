'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type FieldErrors = Partial<Record<'username' | 'password', string>>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const redirectParam = searchParams.get('redirectTo');
  const redirectTarget =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : null;

  function clearFieldError(field: keyof FieldErrors) {
    if (!fieldErrors[field]) {
      return;
    }

    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateCredentials() {
    const trimmedUsername = username.trim();
    const errors: FieldErrors = {};

    if (!trimmedUsername) {
      errors.username = 'Username is required.';
    } else if (trimmedUsername.length < 3) {
      errors.username = 'Username must be at least 3 characters long.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters long.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!validateCredentials()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const payload: { message?: string; errors?: FieldErrors } | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setFieldErrors(prev => ({ ...prev, ...(payload?.errors ?? {}) }));
        setError(payload?.message ?? 'Invalid credentials.');
        return;
      }

      setFieldErrors({});
      router.replace(redirectTarget ?? '/pokedex');
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const baseInputClasses =
    'mt-2 w-full rounded-3xl border bg-slate-50 px-5 py-4 text-base text-slate-800 shadow-inner shadow-slate-200 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[rgba(var(--accent-focus-rgb),0.4)]';

  const usernameInputClass = fieldErrors.username
    ? `${baseInputClasses} border-red-300 focus:ring-red-200`
    : `${baseInputClasses} border-slate-200`;

  const passwordInputClass = fieldErrors.password
    ? `${baseInputClasses} border-red-300 focus:ring-red-200`
    : `${baseInputClasses} border-slate-200`;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[#ff2150] px-4 py-6">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-4xl text-slate-900">
          <div className="rounded-[40px] bg-white p-2 shadow-[0_35px_90px_rgba(0,0,0,0.4)]">
            <div className="rounded-[36px] bg-white/95 p-10 sm:p-14">
              <div className="mb-10">
                <h1 className="mt-3 text-4xl font-bold text-slate-900">Trainer Login</h1>
                <p className="mt-3 text-base text-slate-500">Sign in to keep exploring the Pokedex.</p>
              </div>

              {redirectTarget && (
                <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                  Please sign in to continue to <span className="font-semibold">{redirectTarget}</span>.
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                <div>
                  <label className="block text-sm font-semibold text-slate-600" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    className={usernameInputClass}
                    placeholder="Trainer name"
                    autoComplete="username"
                    value={username}
                    onChange={event => {
                      setUsername(event.target.value);
                      clearFieldError('username');
                      setError('');
                    }}
                    aria-invalid={Boolean(fieldErrors.username)}
                    aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                  />
                  {fieldErrors.username && (
                    <p id="username-error" className="mt-2 text-sm font-medium text-red-600">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={passwordInputClass}
                    placeholder="********"
                    autoComplete="current-password"
                    value={password}
                    onChange={event => {
                      setPassword(event.target.value);
                      clearFieldError('password');
                      setError('');
                    }}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  />
                  {fieldErrors.password && (
                    <p id="password-error" className="mt-2 text-sm font-medium text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm font-medium text-red-600" role="alert" aria-live="polite">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-[30px] bg-gradient-to-r from-[var(--primary)] to-[#ff8a00] py-4 text-base font-semibold uppercase tracking-wide text-white shadow-[0_15px_30px_rgba(255,45,85,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

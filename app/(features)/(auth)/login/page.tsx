'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/'); 
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[#ff2150] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl text-slate-900">
        <div className="rounded-[40px] bg-white shadow-[0_35px_90px_rgba(0,0,0,0.4)] p-2">
          <div className="rounded-[36px] bg-white/95 p-10 sm:p-14">
            <div className="mb-10">
              <h1 className="mt-3 text-4xl font-bold text-slate-900">Trainer Login</h1>
              <p className="mt-3 text-base text-slate-500">
                Sign in to keep exploring the Pokedex.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-7">
              <label className="block text-sm font-semibold text-slate-600">
                Username
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-800 shadow-inner shadow-slate-200 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[rgba(var(--accent-focus-rgb),0.4)]"
                  placeholder="Trainer name"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </label>

              <label className="block text-sm font-semibold text-slate-600">
                Password
                <input
                  type="password"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-800 shadow-inner shadow-slate-200 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-[rgba(var(--accent-focus-rgb),0.4)]"
                  placeholder="********"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>

              {error && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[30px] bg-gradient-to-r from-[var(--primary)] to-[#ff8a00] py-4 text-white text-base font-semibold tracking-wide uppercase shadow-[0_15px_30px_rgba(255,45,85,0.4)] transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

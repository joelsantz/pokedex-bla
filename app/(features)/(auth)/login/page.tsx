import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[var(--primary)] via-[var(--primary)] to-[#ff2150] px-4 py-6">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-4xl rounded-[40px] bg-white/80 p-10 text-center text-slate-600 shadow-[0_35px_90px_rgba(0,0,0,0.2)]">
          Loading login...
        </div>
      </main>
    </div>
  );
}

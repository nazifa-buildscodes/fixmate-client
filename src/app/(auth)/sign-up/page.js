'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { signUp, useSession } from '@/lib/auth-client';
import { getDashboardPath } from '@/lib/constants';

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.replace(getDashboardPath(session.user.role));
    }
  }, [session, router]);

  const validatePassword = (val) => {
    if (val.length < 6) return 'Password must be at least 6 characters long.';
    if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(val)) return 'Password must contain at least one lowercase letter.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePassword(password);
    if (err) {
      setPwError(err);
      return;
    }
    setPwError('');
    setLoading(true);

    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role: role === 'technician' ? 'technician' : 'customer',
      });

      if (res.error) {
        toast.error(res.error.message || 'Sign up failed');
        return;
      }

      toast.success('Account created successfully!');
      router.push(getDashboardPath(role));
      router.refresh();
    } catch {
      toast.error('Could not create account. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="card-surface w-full max-w-md p-8">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold">
            Fix<span className="text-brand-600">Mate</span>
          </span>
        </Link>

        <h1 className="text-center text-2xl font-extrabold">Create your FixMate account</h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          Choose your role and get started in seconds
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Role Selection Cards */}
          <div>
            <label className="mb-2 block text-xs font-semibold">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex flex-col items-center rounded-xl border-2 p-3.5 text-center transition ${
                  role === 'customer'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="mt-1.5 text-sm font-bold">Customer</span>
                <span className="text-[11px] text-slate-500">Book repairs</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('technician')}
                className={`flex flex-col items-center rounded-xl border-2 p-3.5 text-center transition ${
                  role === 'technician'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}
              >
                <Briefcase className="h-5 w-5" />
                <span className="mt-1.5 text-sm font-bold">Technician</span>
                <span className="text-[11px] text-slate-500">Offer services</span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mahmudul Hasan"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPwError(validatePassword(e.target.value));
                }}
                placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {pwError && <p className="mt-1 text-xs font-medium text-rose-600">{pwError}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
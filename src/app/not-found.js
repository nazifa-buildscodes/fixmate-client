import Link from 'next/link';
import { Wrench, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-100 text-brand-600 dark:bg-brand-950">
        <Wrench className="h-10 w-10" />
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        404
      </h1>
      <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">
        Oops! This part seems to be missing.
      </p>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The page or repair service you are looking for doesn&apos;t exist or is no longer available.
      </p>
      <Link href="/" className="btn-primary mt-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}

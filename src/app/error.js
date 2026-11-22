'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {error?.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button onClick={() => reset()} className="btn-primary mt-6">
        <RotateCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

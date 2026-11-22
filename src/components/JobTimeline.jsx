import { Check } from 'lucide-react';

const STEPS = ['requested', 'accepted', 'in-progress', 'completed', 'paid'];

export default function JobTimeline({ status, paymentStatus }) {
  if (status === 'rejected' || status === 'cancelled') {
    return (
      <div className="text-xs font-medium text-rose-600 dark:text-rose-400">
        Job {status}
      </div>
    );
  }

  const currentIndex =
    paymentStatus === 'paid'
      ? 4
      : Math.max(0, STEPS.indexOf(status));

  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIndex;
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              title={step}
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : idx + 1}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-4 rounded ${
                  idx < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

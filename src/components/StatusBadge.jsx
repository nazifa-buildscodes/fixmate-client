import { STATUS_COLORS } from '@/lib/constants';

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const style =
    STATUS_COLORS[key] ||
    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}
    >
      {key.replace('-', ' ')}
    </span>
  );
}

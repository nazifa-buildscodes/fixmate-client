export const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export const SERVICE_MODES = ['Home Visit', 'Shop Drop-off'];

export const STATUS_COLORS = {
  requested: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  accepted: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  unpaid: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
};

export function getDashboardPath(role) {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'technician') return '/dashboard/technician';
  return '/dashboard/customer';
}

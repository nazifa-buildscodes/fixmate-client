'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  PlusCircle,
  Briefcase,
  Users,
  ShieldCheck,
  User,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from '@/lib/auth-client';
import { clearCachedToken } from '@/lib/api';
import { getDashboardPath } from '@/lib/constants';
import ThemeToggle from '@/components/ThemeToggle';

const MENUS = {
  customer: [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: ClipboardList },
    { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
    { label: 'Update Profile', href: '/dashboard/profile', icon: User },
  ],
  technician: [
    { label: 'Overview', href: '/dashboard/technician', icon: LayoutDashboard },
    { label: 'Add a Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
    { label: 'My Services', href: '/dashboard/technician/my-services', icon: Briefcase },
    { label: 'Manage Requests', href: '/dashboard/technician/requests', icon: ClipboardList },
    { label: 'Update Profile', href: '/dashboard/profile', icon: User },
  ],
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Service Approval', href: '/dashboard/admin/services', icon: ShieldCheck },
    { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: ClipboardList },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: CreditCard },
    { label: 'Update Profile', href: '/dashboard/profile', icon: User },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;
  const role = user?.role || 'customer';

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role route protection
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      toast.error('Forbidden: Admin access only');
      router.replace(getDashboardPath(role));
    } else if (pathname.startsWith('/dashboard/technician') && role !== 'technician') {
      toast.error('Forbidden: Technician access only');
      router.replace(getDashboardPath(role));
    } else if (pathname.startsWith('/dashboard/customer') && role !== 'customer') {
      toast.error('Forbidden: Customer access only');
      router.replace(getDashboardPath(role));
    }
  }, [user, role, isPending, pathname, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  const menuItems = MENUS[role] || MENUS.customer;

  const handleLogout = async () => {
    await signOut();
    clearCachedToken();
    toast.success('Signed out');
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold">
              Fix<span className="text-brand-600">Mate</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-500 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 space-y-1 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm font-bold capitalize text-slate-500 lg:block">
            {role} Dashboard
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5">
              <img
                src={
                  user.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || 'U'
                  )}&background=1382f6&color=fff`
                }
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <span className="text-[11px] font-semibold uppercase text-brand-600">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

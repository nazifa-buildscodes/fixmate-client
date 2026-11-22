'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench, Menu, X, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from '@/lib/auth-client';
import { clearCachedToken } from '@/lib/api';
import { getDashboardPath } from '@/lib/constants';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user;

  const handleSignOut = async () => {
    await signOut();
    clearCachedToken();
    setDropdownOpen(false);
    setMobileOpen(false);
    toast.success('Signed out successfully');
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Fix<span className="text-brand-600">Mate</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 text-sm font-medium transition hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900"
              >
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || 'U'
                    )}&background=1382f6&color=fff`
                  }
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-[110px] truncate text-slate-800 dark:text-slate-200">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="card-surface absolute right-0 mt-2 w-60 p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold uppercase text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {user.role || 'customer'}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <User className="h-4 w-4 text-brand-600" />
                      Update Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Right Slide-Over Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <aside
          className={`fixed right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col justify-between border-l border-slate-200 bg-white p-5 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="space-y-5 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Fix<span className="text-brand-600">Mate</span>
                </span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* User Info (if signed in) */}
            {user && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/80">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || 'U'
                    )}&background=1382f6&color=fff`
                  }
                  alt={user.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {user.role || 'customer'}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Account Actions */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={getDashboardPath(user.role)}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex w-full items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard ({user.role || 'customer'})
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary flex w-full items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Update Profile
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          {user ? (
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <p className="border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400 dark:border-slate-800">
              FixMate · Reliable Device Care
            </p>
          )}
        </aside>
      </div>
    </header>
  );
}
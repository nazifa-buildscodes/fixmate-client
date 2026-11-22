import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white">
              Fix<span className="text-brand-400">Mate</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Trusted smart device &amp; home appliance repairs by verified technicians.
            Track every step and pay only after the job is done.
          </p>
          {/* Social links including the new X logo */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-300 transition hover:bg-brand-600 hover:text-white"
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-slate-300 transition hover:bg-brand-600 hover:text-white"
            >
              in
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-brand-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-400">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-400">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-brand-400">
                Become a Technician
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Categories */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Popular Categories
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat}>
                <Link
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="hover:text-brand-400"
                >
                  {cat} Repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Contact Us
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand-400" />
              support@fixmate.com
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand-400" />
              +880 1700-000000
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-brand-400" />
              House 12, Road 7, Dhanmondi, Dhaka 1209
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FixMate. All rights reserved. Built for reliable device &amp; appliance care.
      </div>
    </footer>
  );
}

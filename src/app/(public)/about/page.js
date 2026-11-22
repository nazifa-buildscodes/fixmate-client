import Link from 'next/link';
import { ShieldCheck, Wrench, CreditCard, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-brand-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          About FixMate
        </span>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
          Transparent Repairs, Built on Trust
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
          FixMate connects everyday device owners with verified local technicians. No hidden
          fees, no upfront payment risks, and complete visibility from request to completion.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {[
          {
            icon: ShieldCheck,
            title: 'Admin-Verified Listings',
            desc: 'Every technician service is reviewed and approved by our admin team before going live.',
          },
          {
            icon: Wrench,
            title: 'Strict Step-by-Step Tracking',
            desc: 'Jobs progress cleanly through Requested, Accepted, In Progress, Completed, and Paid.',
          },
          {
            icon: CreditCard,
            title: 'Pay Only After Completion',
            desc: 'Stripe checkout becomes active only when your technician completes the repair.',
          },
          {
            icon: Users,
            title: 'Empowering Skilled Technicians',
            desc: 'Technicians get a dedicated dashboard to showcase services, manage requests, and grow earnings.',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card-surface p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Link href="/services" className="btn-primary">
          Browse Services
        </Link>
        <Link href="/sign-up" className="btn-secondary">
          Join as a Technician
        </Link>
      </div>
    </div>
  );
}

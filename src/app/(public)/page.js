'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShieldCheck,
  Clock,
  CreditCard,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Zap,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { apiFetch } from '@/lib/api';

const CATEGORY_CARDS = [
  { name: 'Smartphone', icon: Smartphone, desc: 'Screens, batteries & ports' },
  { name: 'Laptop & PC', icon: Laptop, desc: 'Motherboard, SSD & OS' },
  { name: 'AC', icon: Wind, desc: 'Jet wash, gas & cooling' },
  { name: 'Refrigerator', icon: ShieldCheck, desc: 'Thermostat & compressor' },
  { name: 'TV', icon: Tv, desc: 'Backlight & panel repair' },
  { name: 'Washing Machine', icon: Wrench, desc: 'Drum, pump & spin fix' },
  { name: 'Electrical', icon: Zap, desc: 'Wiring, MCB & IPS setup' },
];

const STEPS = [
  {
    step: '01',
    title: 'Find a Service',
    desc: 'Browse admin-verified technicians across smartphones, laptops, and home appliances.',
  },
  {
    step: '02',
    title: 'Send a Request',
    desc: 'Share your device issue, preferred date, and address in under a minute.',
  },
  {
    step: '03',
    title: 'Technician Fixes It',
    desc: 'Track live status updates from Accepted to In Progress to Completed.',
  },
  {
    step: '04',
    title: 'Pay After Completion',
    desc: 'Zero upfront risk. Pay securely via Stripe only once your repair is done.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/services?featured=true')
      .then((data) => setFeatured(data.services || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/services?search=${encodeURIComponent(q)}` : '/services');
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-3.5 py-1.5 text-xs font-semibold text-brand-200">
              <ShieldCheck className="h-4 w-4 text-brand-300" />
              Pay Only After Your Repair Is Completed
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Broken Device? Get It Fixed by{' '}
              <span className="text-brand-400">Verified Technicians</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Book trusted experts for smartphones, laptops, AC, refrigerators, TVs, and
              home electrical repairs with transparent step-by-step tracking.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search iPhone screen, AC servicing, laptop..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary py-3.5">
                Find Technicians
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Admin-Approved Listings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-300" /> Live Job Tracking
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-amber-300" /> Stripe Protected Payment
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1000&q=85"
                alt="Technician repairing smart device"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Trusted Platform
              </p>
              <p className="mt-1 text-2xl font-extrabold text-white">2,400+ Repairs</p>
              <p className="text-xs text-slate-400">98.6% Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Services (6 Latest Approved & Available) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Featured Services
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
              Latest Verified Repair Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Explore All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="card-surface mt-8 p-10 text-center">
            <p className="text-sm text-slate-500">
              No approved services yet. Run the seed script or approve services from Admin Dashboard.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 3. How FixMate Works */}
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Simple &amp; Transparent
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
              How FixMate Works
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <div key={item.step} className="card-surface p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-extrabold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Categories & Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Browse by Category
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
            Popular Repair Categories
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="card-surface group flex items-center gap-4 p-5 transition hover:border-brand-400 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Trust Banner */}
        <div className="mt-14 grid gap-6 rounded-3xl bg-slate-900 p-8 text-white sm:grid-cols-3 lg:p-10">
          <div>
            <p className="text-3xl font-extrabold text-brand-400">100%</p>
            <p className="mt-1 font-semibold">Pay After Service</p>
            <p className="mt-1 text-xs text-slate-400">
              Stripe checkout unlocks only after the technician completes your repair.
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400">Verified</p>
            <p className="mt-1 font-semibold">Admin-Reviewed Services</p>
            <p className="mt-1 text-xs text-slate-400">
              Every service listing is inspected and approved before appearing publicly.
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-amber-400">Real-Time</p>
            <p className="mt-1 font-semibold">Job Status Pipeline</p>
            <p className="mt-1 text-xs text-slate-400">
              Know whether your device is Requested, Accepted, In Progress, or Completed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

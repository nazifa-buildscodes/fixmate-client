'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Wrench,
  CreditCard,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Search,
  MessageSquare,
  PlusCircle,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Admin-Verified Listings',
    desc: 'Every technician service is reviewed and approved by our admin team before going live.',
  },
  {
    icon: Wrench,
    title: 'Step-by-Step Repair Process',
    desc: 'Every repair moves clearly from request to completion so you always know what happens next.',
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
];

const CUSTOMER_POINTS = [
  {
    icon: Search,
    title: 'Browse & Book Verified Services',
    desc: 'Search by device or category, compare transparent starting prices in ৳, pick Home Visit or Shop Drop-off, and submit a repair request.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Contact & 2-Way Messaging',
    desc: 'View technician contact details on the service page, send a direct message, and chat or reply inside your Dashboard Messages tab.',
  },
  {
    icon: CreditCard,
    title: 'Safe Post-Repair Payment & Reviews',
    desc: 'Pay securely via Stripe only after the work is finished, and share ratings and feedback on your completed repairs.',
  },
];

const TECHNICIAN_POINTS = [
  {
    icon: PlusCircle,
    title: 'Create & Manage Repair Listings',
    desc: 'Add services with pricing, estimated duration, service area, and mode—then manage listings and availability from My Services.',
  },
  {
    icon: ClipboardList,
    title: 'Handle Requests & Job Progress',
    desc: 'Review incoming repair requests from Manage Requests, accept or decline jobs, update repair progress, and track earnings.',
  },
  {
    icon: BarChart3,
    title: 'Customer Messages & Review Insights',
    desc: 'Reply directly to customer messages, manage your inbox, and check good or poor customer feedback in the Reviews section.',
  },
];

export default function AboutPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
        phone: prev.phone || session.user.phone || '',
      }));
    }
  }, [session]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || formData.message.trim().length < 15) {
      toast.error('Please enter your name, email, and at least 15 characters in your message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        body: {
          senderName: formData.name.trim(),
          senderEmail: formData.email.trim(),
          senderPhone: formData.phone.trim(),
          senderRole: session?.user?.role || 'guest',
          recipientRole: 'admin',
          topic: formData.topic,
          message: formData.message.trim(),
        },
      });
      const ticketCode = res?.id ? String(res.id).slice(-6).toUpperCase() : 'SENT';
      setTicket({
        id: ticketCode,
        topic: formData.topic,
        email: formData.email.trim(),
      });
      toast.success(`Inquiry sent to Admin! Ticket ID: ${ticketCode}`);
      setFormData((prev) => ({
        ...prev,
        phone: '',
        topic: 'General Inquiry',
        message: '',
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-brand-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          About FixMate
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Transparent Repairs, Built on Trust
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          FixMate connects everyday device owners with verified local technicians. No hidden
          fees, no upfront payment risks, and complete visibility from request to completion.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((item) => {
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

      {/* Detailed Role Walkthrough: Customers & Technicians */}
      <section className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800">
        <div className="mb-10 text-center">
          <span className="rounded-full bg-brand-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            How FixMate Works
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Built for Both Customers &amp; Technicians
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Whether you need a quick, dependable repair or want to grow your repair business online, each role has dedicated tools and workflows.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Workflow & Features */}
          <div className="card-surface space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
                  For Customers
                </span>
                <h3 className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                  How It Works for You
                </h3>
              </div>
              <span className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                Customer Guide
              </span>
            </div>

            <div className="space-y-4">
              {CUSTOMER_POINTS.map((point, idx) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {point.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <strong>Customer Dashboard Features:</strong> Overview summary, 2-way Messages with replies, My Bookings, Payment History, and Profile management.
            </div>
          </div>

          {/* Technician Workflow & Features */}
          <div className="card-surface space-y-5 p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                  For Technicians
                </span>
                <h3 className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                  How It Works for Technicians
                </h3>
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Technician Guide
              </span>
            </div>

            <div className="space-y-4">
              {TECHNICIAN_POINTS.map((point, idx) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {point.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <strong>Technician Dashboard Features:</strong> Earnings &amp; job Overview, Service Reviews (Good/Poor filter), Messages inbox, Add/My Services, Manage Requests, and Profile setup.
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/services" className="btn-primary">
          Browse Services
        </Link>
        <Link href="/sign-up" className="btn-secondary">
          Join as a Technician
        </Link>
      </div>

      <section id="contact" className="mt-16 border-t border-slate-200 pt-14 dark:border-slate-800">
        <div className="mb-8 text-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            Support &amp; Contact
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Get in Touch With FixMate
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Have a question about a repair booking, technician verification, or payment? Send us a message directly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="card-surface flex items-start gap-3.5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Email Support</p>
                <a
                  href="mailto:support@fixmate.com"
                  className="text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-white"
                >
                  support@fixmate.com
                </a>
              </div>
            </div>

            <div className="card-surface flex items-start gap-3.5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Hotline</p>
                <a
                  href="tel:+8801700000000"
                  className="text-sm font-bold text-slate-900 hover:text-brand-600 dark:text-white"
                >
                  +880 1700-000000
                </a>
              </div>
            </div>

            <div className="card-surface flex items-start gap-3.5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Office Address</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  House 12, Road 7, Dhanmondi, Dhaka 1209
                </p>
              </div>
            </div>

            <div className="card-surface flex items-start gap-3.5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Service Hours</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Sat – Thu: 9:00 AM – 9:00 PM
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="card-surface space-y-4 p-6 lg:col-span-3">
            {ticket && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">Request Sent to Admin — Ticket #{ticket.id}</p>
                  <p className="mt-0.5">
                    Topic: <span className="font-semibold">{ticket.topic}</span> · Reply will appear in your dashboard for{' '}
                    <span className="font-semibold">{ticket.email}</span>.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  className="input-field"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking & Repair Support">Booking &amp; Repair Support</option>
                  <option value="Technician Onboarding">Technician Onboarding</option>
                  <option value="Payment & Invoice">Payment &amp; Invoice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold">Message * (min 15 chars)</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3 sm:w-auto sm:px-6"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
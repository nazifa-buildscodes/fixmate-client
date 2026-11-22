'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin, MessageSquarePlus, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/constants';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export default function Footer() {
  const { data: session } = useSession();
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName((prev) => prev || session.user.name || '');
      setEmail((prev) => prev || session.user.email || '');
      setPhone((prev) => prev || session.user.phone || '');
    }
  }, [session]);

  const handleQuickContact = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      toast.error('Please fill all fields (message at least 10 characters).');
      return;
    }

    setSending(true);
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        body: {
          senderName: name.trim(),
          senderEmail: email.trim(),
          senderPhone: phone.trim(),
          senderRole: session?.user?.role || 'guest',
          recipientRole: 'admin',
          topic: 'Quick Footer Inquiry',
          message: message.trim(),
        },
      });
      const refCode = res?.id ? String(res.id).slice(-6).toUpperCase() : 'SENT';
      toast.success(`Message sent to Admin! Reference: ${refCode}`);
      setPhone('');
      setMessage('');
      setContactOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="overflow-x-hidden border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-8 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-4 lg:px-8">
        <div className="min-w-0">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white">
              Fix<span className="text-brand-400">Mate</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400 sm:mt-4 sm:text-sm">
            Trusted smart device &amp; home appliance repairs by verified technicians.
            Track every step and pay only after the job is done.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white sm:h-9 sm:w-9"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300 transition hover:bg-brand-600 hover:text-white sm:h-9 sm:w-9 sm:text-sm"
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300 transition hover:bg-brand-600 hover:text-white sm:h-9 sm:w-9 sm:text-sm"
            >
              in
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
            Quick Links
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:mt-4 sm:block sm:space-y-2.5 sm:text-sm">
            <li>
              <Link href="/" className="transition hover:text-brand-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition hover:text-brand-400">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-brand-400">
                How It Works &amp; Contact
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="transition hover:text-brand-400">
                Become a Technician
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
            Popular Categories
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:mt-4 sm:block sm:space-y-2.5 sm:text-sm">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat}>
                <Link
                  href={`/services?category=${encodeURIComponent(cat)}`}
                  className="transition hover:text-brand-400"
                >
                  {cat} Repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">
            Contact Us
          </h4>
          <ul className="mt-3 space-y-2.5 text-xs text-slate-400 sm:mt-4 sm:space-y-3 sm:text-sm">
            <li>
              <a
                href="mailto:support@fixmate.com"
                className="flex items-start gap-2.5 break-all transition hover:text-brand-400"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>support@fixmate.com</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+8801700000000"
                className="flex items-center gap-2.5 transition hover:text-brand-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                <span>+880 1700-000000</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>House 12, Road 7, Dhanmondi, Dhaka 1209</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700 sm:w-auto sm:py-2"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" /> Quick Message
          </button>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-[11px] text-slate-500 sm:px-6 sm:py-5 sm:text-xs">
        © {new Date().getFullYear()} FixMate. All rights reserved. Built for reliable device &amp; appliance care.
      </div>

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4">
          <form
            onSubmit={handleQuickContact}
            className="max-h-[90vh] w-full max-w-md space-y-3.5 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100 shadow-xl sm:space-y-4 sm:p-6"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Send a Quick Message</h3>
                <p className="text-xs text-slate-400">Sent to Admin with your contact details</p>
              </div>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Message</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}
    </footer>
  );
}
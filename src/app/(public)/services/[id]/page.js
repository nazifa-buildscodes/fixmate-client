'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Wrench,
  Star,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundErr, setNotFoundErr] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  // Technician Direct Message Modal State
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [msgSenderName, setMsgSenderName] = useState('');
  const [msgSenderEmail, setMsgSenderEmail] = useState('');
  const [msgSenderPhone, setMsgSenderPhone] = useState('');
  const [msgText, setMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    apiFetch(`/api/services/${id}`)
      .then((res) => setData(res))
      .catch(() => setNotFoundErr(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!session?.user) return;

    const u = session.user;
    const sessionPhone = u.phone || u.phoneNumber || u.mobile || '';

    setMsgSenderName((prev) => prev || u.name || '');
    setMsgSenderEmail((prev) => prev || u.email || '');
    setMsgSenderPhone((prev) => prev || sessionPhone);
    setPhone((prev) => prev || sessionPhone);

    apiFetch('/api/users/me', { authRequired: true })
      .then((res) => {
        const profile = res?.user || res || {};
        const savedPhone =
          profile.phone || profile.phoneNumber || profile.mobile || sessionPhone || '';
        const savedArea = profile.area || profile.address || '';

        if (savedPhone) {
          setPhone((prev) => prev || savedPhone);
          setMsgSenderPhone((prev) => prev || savedPhone);
        }
        if (savedArea) {
          setAddress((prev) => prev || savedArea);
        }
      })
      .catch(() => {});
  }, [session]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (notFoundErr || !data?.service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          This service may have been removed or is currently unavailable.
        </p>
        <Link href="/services" className="btn-primary mt-5">
          Back to Services
        </Link>
      </div>
    );
  }

  const { service, technician, reviews = [], avgRating } = data;
  const user = session?.user;
  const role = user?.role;

  const techName = technician?.name || service.technicianName || 'Technician';
  const techArea = technician?.area || service.serviceArea || '';
  const techPhone =
    technician?.phone ||
    technician?.phoneNumber ||
    technician?.mobile ||
    technician?.contact ||
    service?.technicianPhone ||
    service?.phone ||
    '';
  const techEmail =
    technician?.email ||
    service?.technicianEmail ||
    service?.providerEmail ||
    '';

  const handleRequestClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=/services/${id}`);
      return;
    }
    if (role !== 'customer') return;
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (problemDescription.trim().length < 20) {
      toast.error('Please describe the problem in at least 20 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        authRequired: true,
        body: {
          serviceId: service._id,
          customerPhone: phone,
          address,
          preferredDate,
          problemDescription,
        },
      });
      toast.success('Repair request sent successfully!');
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendTechMessage = async (e) => {
    e.preventDefault();
    if (!msgSenderName.trim() || !msgSenderEmail.trim() || msgText.trim().length < 5) {
      toast.error('Please enter your name, email, and message.');
      return;
    }

    setSendingMsg(true);
    try {
      await apiFetch('/api/messages', {
        method: 'POST',
        body: {
          senderName: msgSenderName.trim(),
          senderEmail: msgSenderEmail.trim(),
          senderPhone: msgSenderPhone.trim(),
          senderRole: user?.role || 'guest',
          recipientRole: 'technician',
          recipientEmail: techEmail,
          serviceId: service._id,
          serviceTitle: service.title,
          topic: 'Service Inquiry',
          message: msgText.trim(),
        },
      });
      toast.success(`Message sent to ${techName}!`);
      setMsgText('');
      setMsgModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Service Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <img
              src={service.image}
              alt={service.title}
              className="h-[340px] w-full object-cover"
            />
          </div>

          <div className="card-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {service.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {service.serviceMode}
              </span>
              {avgRating && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {avgRating} ({reviews.length} reviews)
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              {service.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-600" />
                Est. Duration: <strong>{service.estimatedDuration}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-600" />
                Area: <strong>{service.serviceArea}</strong>
              </span>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                What&apos;s Included
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {service.description}
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Customer Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No reviews yet. Be the first to review after completing a repair!
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{r.customerName}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" /> {r.rating}/5
                      </span>
                    </div>
                    {r.review && (
                      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                        {r.review}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Card & Technician Info */}
        <div className="space-y-6">
          <div className="card-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Starting Price
            </p>
            <p className="mt-1 text-4xl font-extrabold text-brand-600">
              ৳{service.basePrice}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Pay via Stripe only after completion
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-5 w-5" /> Request Submitted!
                </div>
                <p className="mt-1 text-xs">
                  Track your job status in your dashboard.
                </p>
                <Link
                  href="/dashboard/customer/bookings"
                  className="btn-primary mt-3 w-full text-xs"
                >
                  Go to My Bookings
                </Link>
              </div>
            ) : user && role !== 'customer' ? (
              <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Only customers can request a repair. Sign in with a customer account to book.
              </div>
            ) : (
              <button onClick={handleRequestClick} className="btn-primary mt-6 w-full">
                <Wrench className="h-4 w-4" />
                Request Repair
              </button>
            )}
          </div>

          {/* Technician Profile Card */}
          <div className="card-surface p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Verified Technician
            </h3>
            <div className="mt-4 flex items-center gap-3.5">
              <img
                src={
                  technician?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    techName
                  )}&background=1382f6&color=fff`
                }
                alt={techName}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{techName}</p>
                {techArea && (
                  <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-brand-600" />
                    {techArea}
                  </p>
                )}
              </div>
            </div>

            {/* Direct Urgent Contact Links & Message Trigger */}
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
              {techPhone ? (
                <a
                  href={`tel:${techPhone}`}
                  className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>Call: {techPhone}</span>
                </a>
              ) : (
                <p className="text-slate-400">Phone number not added by technician yet</p>
              )}

              {techEmail && (
                <a
                  href={`mailto:${techEmail}`}
                  className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2 font-semibold text-brand-700 transition hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-300"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Email: {techEmail}</span>
                </a>
              )}

              {techEmail && user?.email?.toLowerCase() !== techEmail.toLowerCase() && (
                <button
                  type="button"
                  onClick={() => setMsgModalOpen(true)}
                  className="btn-secondary mt-1 flex w-full items-center justify-center gap-1.5 py-2 text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-brand-600" />
                  Message Technician
                </button>
              )}
            </div>

            {technician?.bio && (
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {technician.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Repair Request Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="card-surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
            <h2 className="text-xl font-bold">Send Repair Request</h2>
            <p className="mt-1 text-xs text-slate-500">{service.title}</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    readOnly
                    className="input-field bg-slate-100 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="input-field bg-slate-100 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17xxxxxxxx"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">Service Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, City"
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold">
                  Problem Description * (min 20 characters)
                </label>
                <textarea
                  rows={4}
                  required
                  minLength={20}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the exact issue with your device or appliance..."
                  className="input-field"
                />
                <p className="mt-1 text-right text-[11px] text-slate-400">
                  {problemDescription.trim().length} / 20 min chars
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Message to Technician Modal */}
      {msgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleSendTechMessage} className="card-surface w-full max-w-md space-y-4 p-6">
            <div>
              <h3 className="text-lg font-extrabold">Message {techName}</h3>
              <p className="text-xs text-slate-500">Regarding: {service.title}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold">Your Name *</label>
                <input
                  type="text"
                  required
                  value={msgSenderName}
                  onChange={(e) => setMsgSenderName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Your Phone</label>
                <input
                  type="tel"
                  value={msgSenderPhone}
                  onChange={(e) => setMsgSenderPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Your Email *</label>
              <input
                type="email"
                required
                value={msgSenderEmail}
                onChange={(e) => setMsgSenderEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Message *</label>
              <textarea
                rows={3}
                required
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Ask about availability, parts, or repair details..."
                className="input-field"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMsgModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={sendingMsg} className="btn-primary text-xs">
                <Send className="h-3.5 w-3.5" />
                {sendingMsg ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
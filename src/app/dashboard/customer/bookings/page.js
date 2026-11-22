'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, FileText, Star, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import JobTimeline from '@/components/JobTimeline';
import ConfirmModal from '@/components/ConfirmModal';
import InvoiceModal from '@/components/InvoiceModal';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);

  const loadBookings = () => {
    setLoading(true);
    apiFetch('/api/bookings/my', { authRequired: true })
      .then((res) => setBookings(res.bookings || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await apiFetch(`/api/bookings/${cancelId}/cancel`, {
        method: 'PATCH',
        authRequired: true,
      });
      toast.success('Booking cancelled');
      setCancelId(null);
      loadBookings();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const res = await apiFetch('/api/payments/create-checkout-session', {
        method: 'POST',
        authRequired: true,
        body: { bookingId },
      });
      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error(err.message);
      setPayingId(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/bookings/${reviewModal._id}/review`, {
        method: 'PATCH',
        authRequired: true,
        body: { rating, review: reviewText },
      });
      toast.success('Review submitted!');
      setReviewModal(null);
      setReviewText('');
      loadBookings();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openBookingInvoice = (b) => {
    setInvoiceData({
      roleLabel: 'Customer Payment Invoice',
      docId: b._id,
      serviceTitle: b.serviceTitle,
      technicianName: b.technicianName,
      dateLabel: 'Service Date',
      dateValue: new Date(b.preferredDate).toLocaleDateString(),
      statusText: b.status || 'completed',
      paymentStatus: b.paymentStatus || 'unpaid',
      amount: b.finalAmount || b.basePrice,
    });
  };

  const renderActions = (b) => (
    <div className="flex flex-wrap gap-2 md:justify-end">
      {b.status === 'requested' && (
        <button
          type="button"
          onClick={() => setCancelId(b._id)}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
        >
          <XCircle className="h-3.5 w-3.5" /> Cancel
        </button>
      )}
      {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
        <button
          type="button"
          disabled={payingId === b._id}
          onClick={() => handlePayNow(b._id)}
          className="btn-primary whitespace-nowrap px-3 py-1.5 text-xs"
        >
          <CreditCard className="h-3.5 w-3.5" />
          {payingId === b._id ? 'Redirecting...' : 'Pay Now'}
        </button>
      )}
      {b.paymentStatus === 'paid' && (
        <button
          type="button"
          onClick={() => openBookingInvoice(b)}
          className="btn-secondary inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 text-xs"
        >
          <FileText className="h-3.5 w-3.5" /> Invoice
        </button>
      )}
      {b.paymentStatus === 'paid' && !b.rating && (
        <button
          type="button"
          onClick={() => setReviewModal(b)}
          className="btn-secondary inline-flex items-center gap-1 whitespace-nowrap px-3 py-1.5 text-xs"
        >
          <Star className="h-3.5 w-3.5 text-amber-500" /> Review
        </button>
      )}
    </div>
  );

  if (loading) return <div className="p-6 text-sm">Loading bookings...</div>;

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">My Repair Bookings</h1>
        <Link href="/services" className="btn-primary w-fit text-xs">
          Book New Repair
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <p className="text-sm text-slate-500">You haven&apos;t requested any repairs yet.</p>
          <Link href="/services" className="btn-primary mt-4">
            Browse Services
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3.5 md:hidden">
            {bookings.map((b) => (
              <div key={b._id} className="card-surface min-w-0 space-y-3.5 p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={b.serviceImage}
                    alt={b.serviceTitle}
                    className="h-12 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Tech: <span className="font-medium">{b.technicianName}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-brand-600">
                    ৳{b.finalAmount || b.basePrice}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-y border-slate-100 py-2.5 text-xs dark:border-slate-800">
                  <span className="text-slate-500">
                    Date: <strong>{new Date(b.preferredDate).toLocaleDateString()}</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={b.status} />
                    <StatusBadge status={b.paymentStatus} />
                  </div>
                </div>

                <JobTimeline status={b.status} paymentStatus={b.paymentStatus} />

                <div className="pt-1">{renderActions(b)}</div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Table View */}
          <div className="card-surface hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3.5 sm:p-4">Service</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Technician</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Date</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Amount</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Status &amp; Timeline</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Payment</th>
                  <th className="whitespace-nowrap p-3.5 text-right sm:p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="align-middle">
                    <td className="p-3.5 pr-4 sm:p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.serviceImage}
                          alt={b.serviceTitle}
                          className="h-11 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <span className="line-clamp-2 min-w-[160px] font-semibold">
                          {b.serviceTitle}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-3.5 text-slate-600 dark:text-slate-300 sm:p-4">
                      {b.technicianName}
                    </td>
                    <td className="whitespace-nowrap p-3.5 text-xs text-slate-500 sm:p-4">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap p-3.5 font-bold sm:p-4">
                      ৳{b.finalAmount || b.basePrice}
                    </td>
                    <td className="p-3.5 sm:p-4">
                      <div className="space-y-1.5">
                        <StatusBadge status={b.status} />
                        <JobTimeline status={b.status} paymentStatus={b.paymentStatus} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-3.5 sm:p-4">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="p-3.5 text-right sm:p-4">{renderActions(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(cancelId)}
        title="Cancel Repair Request?"
        message="This action cannot be undone. Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelId(null)}
      />

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <form onSubmit={handleReviewSubmit} className="card-surface w-full max-w-md p-6">
            <h3 className="text-lg font-bold">Rate Your Repair</h3>
            <p className="text-xs text-slate-500">{reviewModal.serviceTitle}</p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold">Rating (1–5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="input-field"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold">Short Review</label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was the technician's work?"
                className="input-field"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      <InvoiceModal invoice={invoiceData} onClose={() => setInvoiceData(null)} />
    </div>
  );
}
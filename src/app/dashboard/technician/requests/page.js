'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [rejectId, setRejectId] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [finalAmount, setFinalAmount] = useState('');

  const loadRequests = (statusFilter = filter) => {
    setLoading(true);
    apiFetch(`/api/bookings/technician?status=${statusFilter}`, { authRequired: true })
      .then((res) => setBookings(res.bookings || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests(filter);
  }, [filter]);

  const updateStatus = async (id, nextStatus, amount = null) => {
    try {
      await apiFetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        authRequired: true,
        body: amount ? { status: nextStatus, finalAmount: Number(amount) } : { status: nextStatus },
      });
      toast.success(`Job marked as ${nextStatus}`);
      setRejectId(null);
      setCompleteModal(null);
      loadRequests(filter);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Manage Repair Requests</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-44"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-sm">Loading requests...</div>
      ) : bookings.length === 0 ? (
        <div className="card-surface p-12 text-center text-sm text-slate-500">
          No repair requests match this filter.
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="p-4">Service &amp; Problem</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="max-w-xs p-4">
                    <p className="font-bold">{b.serviceTitle}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {b.problemDescription}
                    </p>
                  </td>
                  <td className="p-4 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{b.customerName}</p>
                    <p className="text-slate-500">{b.customerPhone}</p>
                    <p className="text-slate-400">{b.address}</p>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(b.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={b.status} />
                      {b.status === 'completed' && <StatusBadge status={b.paymentStatus} />}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {b.status === 'requested' && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, 'accepted')}
                            className="btn-primary px-3 py-1.5 text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => setRejectId(b._id)}
                            className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === 'accepted' && (
                        <button
                          onClick={() => updateStatus(b._id, 'in-progress')}
                          className="btn-primary px-3 py-1.5 text-xs"
                        >
                          Start Work
                        </button>
                      )}
                      {b.status === 'in-progress' && (
                        <button
                          onClick={() => {
                            setCompleteModal(b);
                            setFinalAmount(String(b.basePrice));
                          }}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(rejectId)}
        title="Reject Repair Request?"
        message="Rejecting is a final state and cannot be undone."
        confirmText="Reject Request"
        danger
        onConfirm={() => updateStatus(rejectId, 'rejected')}
        onClose={() => setRejectId(null)}
      />

      {completeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateStatus(completeModal._id, 'completed', finalAmount);
            }}
            className="card-surface w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-lg font-bold">Complete Repair Job</h3>
            <p className="text-xs text-slate-500">
              Set the final invoice amount (BDT) for <strong>{completeModal.serviceTitle}</strong>.
            </p>
            <div>
              <label className="mb-1 block text-xs font-semibold">Final Amount (BDT) *</label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCompleteModal(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Complete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

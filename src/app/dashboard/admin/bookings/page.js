'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/admin/bookings?status=${filter}`, { authRequired: true })
      .then((res) => setBookings(res.bookings || []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">All Platform Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-full sm:w-44"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-sm">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="card-surface p-10 text-center text-sm text-slate-500">
          No bookings found for this filter.
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3.5 md:hidden">
            {bookings.map((b) => (
              <div key={b._id} className="card-surface min-w-0 space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Customer: {b.customerName} · Tech: {b.technicianName}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-brand-600">
                    ৳{b.finalAmount || b.basePrice}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
                  <span className="text-slate-500">
                    Date: {new Date(b.preferredDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={b.status} />
                    <StatusBadge status={b.paymentStatus} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Table View */}
          <div className="card-surface hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="p-4 font-semibold">{b.serviceTitle}</td>
                    <td className="p-4 text-xs">{b.customerName}</td>
                    <td className="p-4 text-xs">{b.technicianName}</td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold">৳{b.finalAmount || b.basePrice}</td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">All Platform Bookings</h1>
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
          <option value="cancelled">Cancelled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-sm">Loading bookings...</div>
      ) : (
        <div className="card-surface overflow-x-auto">
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
      )}
    </div>
  );
}

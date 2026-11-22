'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/payments/my', { authRequired: true })
      .then((res) => setPayments(res.payments || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-sm">Loading payment history...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Payment History</h1>
      {payments.length === 0 ? (
        <div className="card-surface p-10 text-center text-sm text-slate-500">
          No payments recorded yet.
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Technician</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="p-4 font-semibold">{p.serviceTitle}</td>
                  <td className="p-4">{p.technicianName}</td>
                  <td className="p-4 font-bold text-emerald-600">৳{p.amount}</td>
                  <td className="p-4 font-mono text-xs">{p.transactionId}</td>
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(p.paidAt).toLocaleString()}
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

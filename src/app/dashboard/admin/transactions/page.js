'use client';

import { useEffect, useState } from 'react';
import { Banknote } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function AdminTransactionsPage() {
  const [data, setData] = useState({ payments: [], totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/payments', { authRequired: true })
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-sm">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">All Transactions</h1>
        <div className="card-surface flex items-center gap-3 px-5 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Platform Revenue</p>
            <p className="text-xl font-extrabold text-emerald-600">৳{data.totalRevenue}</p>
          </div>
        </div>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="p-4">Service</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Technician</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.payments.map((p) => (
              <tr key={p._id}>
                <td className="p-4 font-semibold">{p.serviceTitle}</td>
                <td className="p-4 text-xs">{p.customerName}</td>
                <td className="p-4 text-xs">{p.technicianName}</td>
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
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Banknote, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import InvoiceModal from '@/components/InvoiceModal';

export default function AdminTransactionsPage() {
  const [data, setData] = useState({ payments: [], totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    apiFetch('/api/admin/payments', { authRequired: true })
      .then(setData)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openAdminInvoice = (p) => {
    setInvoiceData({
      roleLabel: 'Admin Transaction Invoice',
      docId: p.transactionId || p._id,
      serviceTitle: p.serviceTitle,
      customerName: p.customerName,
      technicianName: p.technicianName,
      dateLabel: 'Paid At',
      dateValue: new Date(p.paidAt).toLocaleString(),
      statusText: p.paymentStatus || 'paid',
      amount: p.amount,
    });
  };

  if (loading) return <div className="p-6 text-sm">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">All Transactions</h1>
        <div className="card-surface flex w-fit items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Platform Revenue</p>
            <p className="text-xl font-extrabold text-emerald-600">৳{data.totalRevenue}</p>
          </div>
        </div>
      </div>

      <div className="card-surface w-full overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="p-3.5 sm:p-4">Service</th>
              <th className="whitespace-nowrap p-3.5 sm:p-4">Customer</th>
              <th className="whitespace-nowrap p-3.5 sm:p-4">Technician</th>
              <th className="whitespace-nowrap p-3.5 sm:p-4">Amount</th>
              <th className="whitespace-nowrap p-3.5 sm:p-4">Transaction ID</th>
              <th className="whitespace-nowrap p-3.5 sm:p-4">Date</th>
              <th className="whitespace-nowrap p-3.5 text-right sm:p-4">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {(data.payments || []).map((p) => (
              <tr key={p._id} className="align-middle">
                <td className="p-3.5 pr-4 font-semibold sm:p-4">
                  <span className="line-clamp-2 min-w-[150px]">{p.serviceTitle}</span>
                </td>
                <td className="whitespace-nowrap p-3.5 text-xs sm:p-4">{p.customerName}</td>
                <td className="whitespace-nowrap p-3.5 text-xs sm:p-4">{p.technicianName}</td>
                <td className="whitespace-nowrap p-3.5 font-bold text-emerald-600 sm:p-4">
                  ৳{p.amount}
                </td>
                <td className="whitespace-nowrap p-3.5 font-mono text-xs sm:p-4">
                  {p.transactionId}
                </td>
                <td className="whitespace-nowrap p-3.5 text-xs text-slate-500 sm:p-4">
                  {new Date(p.paidAt).toLocaleString()}
                </td>
                <td className="whitespace-nowrap p-3.5 text-right sm:p-4">
                  <button
                    type="button"
                    onClick={() => openAdminInvoice(p)}
                    className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                  >
                    <FileText className="h-3.5 w-3.5" /> Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InvoiceModal invoice={invoiceData} onClose={() => setInvoiceData(null)} />
    </div>
  );
}
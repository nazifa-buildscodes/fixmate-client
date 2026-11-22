'use client';

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import InvoiceModal from '@/components/InvoiceModal';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    apiFetch('/api/payments/my', { authRequired: true })
      .then((res) => setPayments(res.payments || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openPaymentInvoice = (p) => {
    setInvoiceData({
      roleLabel: 'Customer Receipt & Invoice',
      docId: p.transactionId || p._id,
      serviceTitle: p.serviceTitle,
      technicianName: p.technicianName,
      dateLabel: 'Paid At',
      dateValue: new Date(p.paidAt).toLocaleString(),
      statusText: 'completed',
      paymentStatus: p.paymentStatus || 'paid',
      amount: p.amount,
    });
  };

  if (loading) return <div className="p-6 text-sm">Loading payment history...</div>;

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">Payment History</h1>
        <p className="text-xs text-slate-500">
          {payments.length} transaction{payments.length === 1 ? '' : 's'}
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="card-surface p-10 text-center text-sm text-slate-500">
          No payments recorded yet.
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3.5 md:hidden">
            {payments.map((p) => (
              <div key={p._id} className="card-surface min-w-0 space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {p.serviceTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Technician: {p.technicianName}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-extrabold text-emerald-600">
                    ৳{p.amount}
                  </span>
                </div>

                <div className="space-y-1 border-y border-slate-100 py-2.5 text-xs dark:border-slate-800">
                  <p className="truncate font-mono text-slate-600 dark:text-slate-300">
                    Txn: {p.transactionId}
                  </p>
                  <p className="text-slate-500">
                    Paid: {new Date(p.paidAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => openPaymentInvoice(p)}
                    className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                  >
                    <FileText className="h-3.5 w-3.5" /> Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet Table View */}
          <div className="card-surface hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3.5 sm:p-4">Service</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Technician</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Amount</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Transaction ID</th>
                  <th className="whitespace-nowrap p-3.5 sm:p-4">Paid At</th>
                  <th className="whitespace-nowrap p-3.5 text-right sm:p-4">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="align-middle">
                    <td className="p-3.5 pr-4 font-semibold sm:p-4">
                      <span className="line-clamp-2 min-w-[150px]">{p.serviceTitle}</span>
                    </td>
                    <td className="whitespace-nowrap p-3.5 text-slate-600 dark:text-slate-300 sm:p-4">
                      {p.technicianName}
                    </td>
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
                        onClick={() => openPaymentInvoice(p)}
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
        </>
      )}

      <InvoiceModal invoice={invoiceData} onClose={() => setInvoiceData(null)} />
    </div>
  );
}
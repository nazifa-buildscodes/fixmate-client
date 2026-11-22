'use client';

import { Download, Printer, X } from 'lucide-react';

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const {
    roleLabel = 'Invoice',
    docId = '',
    serviceTitle = '',
    customerName = '',
    customerPhone = '',
    address = '',
    technicianName = '',
    dateLabel = 'Date',
    dateValue = '',
    statusText = 'completed',
    paymentStatus = 'unpaid',
    amount = 0,
  } = invoice;

  const isPaid = String(paymentStatus).toLowerCase() === 'paid';
  const paymentBadgeText = isPaid ? 'PAID' : 'UNPAID';

  const handleDownloadTextInvoice = () => {
    const content = [
      '========================================',
      `FIXMATE - ${roleLabel.toUpperCase()}`,
      '========================================',
      `Reference ID   : ${docId}`,
      `Service        : ${serviceTitle}`,
      customerName ? `Customer       : ${customerName}` : null,
      customerPhone ? `Phone          : ${customerPhone}` : null,
      address ? `Address        : ${address}` : null,
      technicianName ? `Technician     : ${technicianName}` : null,
      `${dateLabel.padEnd(14, ' ')} : ${dateValue}`,
      `Job Status     : ${String(statusText).toUpperCase()}`,
      `Payment Status : ${paymentBadgeText}`,
      `Amount         : BDT ${amount}`,
      '========================================',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fixmate-invoice-${docId || 'receipt'}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="card-surface w-full max-w-md space-y-4 p-6">
        <div className="flex items-start justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              {roleLabel}
            </span>
            <h3 className="mt-1 text-lg font-extrabold">FixMate Invoice</h3>
            <p className="font-mono text-xs text-slate-500">ID: {docId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Service</span>
            <span className="text-right font-semibold">{serviceTitle}</span>
          </div>
          {customerName && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Customer</span>
              <span className="text-right font-medium">{customerName}</span>
            </div>
          )}
          {customerPhone && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Phone</span>
              <span className="text-right">{customerPhone}</span>
            </div>
          )}
          {address && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Address</span>
              <span className="max-w-[220px] text-right text-xs">{address}</span>
            </div>
          )}
          {technicianName && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Technician</span>
              <span className="text-right font-medium">{technicianName}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">{dateLabel}</span>
            <span className="text-right text-xs">{dateValue}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Status</span>
            <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">
              {statusText}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">Payment</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
              }`}
            >
              {paymentBadgeText}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-2.5 text-base font-extrabold dark:border-slate-800">
            <span>Total Amount</span>
            <span>৳{amount}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleDownloadTextInvoice}
            className="btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" /> Print / PDF
          </button>
          <button type="button" onClick={onClose} className="btn-primary text-xs">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
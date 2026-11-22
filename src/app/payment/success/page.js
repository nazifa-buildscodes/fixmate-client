'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '@/lib/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('verifying');
  const [payment, setPayment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('Missing Stripe session ID.');
      return;
    }

    apiFetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`, {
      authRequired: true,
    })
      .then((res) => {
        setPayment(res.payment);
        setStatus('success');
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setStatus('error');
      });
  }, [sessionId]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-surface w-full max-w-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <h1 className="mt-4 text-xl font-bold">Verifying your payment...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">Payment Successful!</h1>
            <p className="mt-2 text-sm text-slate-500">
              Thank you for using FixMate. Your repair job is now marked as Paid.
            </p>
            {payment && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-xs dark:bg-slate-800/70">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold">{payment.serviceTitle}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">${payment.amount}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-[11px]">{payment.transactionId}</span>
                </div>
              </div>
            )}
            <Link href="/dashboard/customer/bookings" className="btn-primary mt-6 w-full">
              Back to My Bookings
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle className="h-9 w-9" />
            </div>
            <h1 className="mt-4 text-xl font-bold">Verification Issue</h1>
            <p className="mt-2 text-sm text-slate-500">{errorMsg}</p>
            <Link href="/dashboard/customer/bookings" className="btn-secondary mt-6 w-full">
              Back to My Bookings
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

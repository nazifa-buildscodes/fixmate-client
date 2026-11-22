import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <XCircle className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">Payment Cancelled</h1>
        <p className="mt-2 text-sm text-slate-500">
          No charges were made. You can complete your payment anytime from My Bookings.
        </p>
        <Link href="/dashboard/customer/bookings" className="btn-primary mt-6 w-full">
          Try Again in My Bookings
        </Link>
      </div>
    </div>
  );
}

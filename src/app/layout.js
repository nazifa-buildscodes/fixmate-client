import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'FixMate — Smart Device & Home Appliance Repair Platform',
  description:
    'Book verified technicians for smartphone, laptop, AC, refrigerator, TV, and electrical repairs. Track every step and pay only after completion.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakarta.variable}>
      <body className="min-h-screen font-sans">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

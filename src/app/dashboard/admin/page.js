'use client';

import { useEffect, useState } from 'react';
import { Users, Wrench, Clock, Banknote } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { apiFetch } from '@/lib/api';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/dashboard/admin-stats', { authRequired: true })
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return <div className="p-6 text-sm">Loading admin overview...</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-brand-600 bg-brand-50' },
    { label: 'Total Technicians', value: stats.totalTechnicians, icon: Wrench, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Pending Services', value: stats.pendingServices, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total Revenue', value: `৳${stats.totalRevenue}`, icon: Banknote, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card-surface flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{c.label}</p>
                <p className="text-2xl font-extrabold">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-6">
        <h2 className="mb-4 text-base font-bold">Bookings by Repair Category</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.bookingsByCategory || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="category" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
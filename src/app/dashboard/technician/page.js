'use client';

import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Clock, Banknote } from 'lucide-react';
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

export default function TechnicianOverviewPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/dashboard/technician-stats', { authRequired: true })
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return <div className="p-6 text-sm">Loading technician stats...</div>;

  const cards = [
    { label: 'Total Services', value: stats.totalServices, icon: Briefcase, color: 'text-brand-600 bg-brand-50' },
    { label: 'Approved Services', value: stats.approvedServices, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total Earned', value: `৳${stats.totalEarned}`, icon: Banknote, color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Technician Overview</h1>

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
        <h2 className="mb-4 text-base font-bold">Incoming Jobs Breakdown</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.jobBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="status" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#0d6be2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadServices = (st = filter) => {
    setLoading(true);
    apiFetch(`/api/admin/services?status=${st}`, { authRequired: true })
      .then((res) => setServices(res.services || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices(filter);
  }, [filter]);

  const updateApproval = async (id, approvalStatus) => {
    try {
      await apiFetch(`/api/admin/services/${id}/approval`, {
        method: 'PATCH',
        authRequired: true,
        body: { approvalStatus },
      });
      toast.success(`Service ${approvalStatus}`);
      loadServices(filter);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Service Approval Queue</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-44"
        >
          <option value="all">All (Pending First)</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-sm">Loading services...</div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Technician</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="h-10 w-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{s.title}</p>
                        <p className="text-xs text-slate-500">{s.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs">
                    <p className="font-semibold">{s.technicianName}</p>
                    <p className="text-slate-500">{s.technicianEmail}</p>
                  </td>
                  <td className="p-4 font-bold">৳{s.basePrice}</td>
                  <td className="p-4">
                    <StatusBadge status={s.approvalStatus} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {s.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => updateApproval(s._id, 'approved')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}
                      {s.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => updateApproval(s._id, 'rejected')}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      )}
                    </div>
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

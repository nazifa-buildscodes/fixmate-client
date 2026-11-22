'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';

export default function MyServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const loadServices = () => {
    setLoading(true);
    apiFetch('/api/services/my', { authRequired: true })
      .then((res) => setServices(res.services || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const toggleAvailability = async (svc) => {
    try {
      await apiFetch(`/api/services/${svc._id}`, {
        method: 'PATCH',
        authRequired: true,
        body: { isAvailable: !svc.isAvailable },
      });
      toast.success(`Marked as ${!svc.isAvailable ? 'Available' : 'Unavailable'}`);
      loadServices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/api/services/${deleteId}`, {
        method: 'DELETE',
        authRequired: true,
      });
      toast.success('Service deleted');
      setDeleteId(null);
      loadServices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/api/services/${editItem._id}`, {
        method: 'PATCH',
        authRequired: true,
        body: {
          title: editItem.title,
          category: editItem.category,
          basePrice: Number(editItem.basePrice),
          estimatedDuration: editItem.estimatedDuration,
          serviceMode: editItem.serviceMode,
          serviceArea: editItem.serviceArea,
          description: editItem.description,
        },
      });
      toast.success('Service updated! Status reset to pending for admin re-approval.');
      setEditItem(null);
      loadServices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-6 text-sm">Loading your services...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">My Repair Services</h1>
        <Link href="/dashboard/technician/add-service" className="btn-primary text-xs">
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <p className="text-sm text-slate-500">You haven&apos;t added any services yet.</p>
          <Link href="/dashboard/technician/add-service" className="btn-primary mt-4">
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Approval</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
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
                      <span className="font-semibold">{s.title}</span>
                    </div>
                  </td>
                  <td className="p-4">{s.category}</td>
                  <td className="p-4 font-bold">৳{s.basePrice}</td>
                  <td className="p-4">
                    <StatusBadge status={s.approvalStatus} />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        s.isAvailable
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.isAvailable ? 'Available' : 'Paused'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditItem({ ...s })}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s._id)}
                        className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete Service?"
        message="Are you sure you want to permanently delete this service listing?"
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <form
            onSubmit={handleEditSave}
            className="card-surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 space-y-4"
          >
            <h3 className="text-lg font-bold">Edit Service</h3>
            <p className="text-xs text-amber-600">
              Note: Saving edits will reset approval status to Pending.
            </p>
            <div>
              <label className="mb-1 block text-xs font-semibold">Title</label>
              <input
                type="text"
                required
                value={editItem.title}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Category</label>
                <select
                  value={editItem.category}
                  onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                  className="input-field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Mode</label>
                <select
                  value={editItem.serviceMode}
                  onChange={(e) => setEditItem({ ...editItem, serviceMode: e.target.value })}
                  className="input-field"
                >
                  {SERVICE_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold">Base Price (৳)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editItem.basePrice}
                  onChange={(e) => setEditItem({ ...editItem, basePrice: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Service Area</label>
                <input
                  type="text"
                  required
                  value={editItem.serviceArea}
                  onChange={(e) => setEditItem({ ...editItem, serviceArea: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold">Description</label>
              <textarea
                rows={3}
                required
                value={editItem.description}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

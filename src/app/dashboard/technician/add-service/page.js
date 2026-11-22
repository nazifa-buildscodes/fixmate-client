'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';
import { useSession } from '@/lib/auth-client';

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    basePrice: '',
    estimatedDuration: '',
    serviceMode: SERVICE_MODES[0],
    serviceArea: '',
    image: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success('Service banner uploaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error('Please upload a service image first.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/services', {
        method: 'POST',
        authRequired: true,
        body: { ...form, basePrice: Number(form.basePrice) },
      });
      toast.success('Service created! Waiting for admin approval.');
      router.push('/dashboard/technician/my-services');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">Add a New Repair Service</h1>
      <p className="mt-1 text-sm text-slate-500">
        New listings are reviewed by Admin before going live publicly.
      </p>

      <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Technician Name</label>
            <input
              type="text"
              readOnly
              value={session?.user?.name || ''}
              className="input-field bg-slate-100 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Technician Email</label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ''}
              className="input-field bg-slate-100 dark:bg-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">Service Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. iPhone Screen Replacement"
            className="input-field"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
            <label className="mb-1 block text-xs font-semibold">Service Mode *</label>
            <select
              value={form.serviceMode}
              onChange={(e) => setForm({ ...form, serviceMode: e.target.value })}
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

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold">Base Price (BDT) *</label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Est. Duration *</label>
            <input
              type="text"
              required
              value={form.estimatedDuration}
              onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
              placeholder="e.g. 2-3 hours"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Service Area *</label>
            <input
              type="text"
              required
              value={form.serviceArea}
              onChange={(e) => setForm({ ...form, serviceArea: e.target.value })}
              placeholder="Dhanmondi, Dhaka"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">Service Image (ImgBB) *</label>
          <div className="flex items-center gap-4">
            <label className="btn-secondary cursor-pointer text-xs">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Banner Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-12 w-20 rounded-lg object-cover border"
              />
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">Description *</label>
          <textarea
            rows={4}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what is included, warranty, parts used, etc."
            className="input-field"
          />
        </div>

        <button type="submit" disabled={submitting || uploading} className="btn-primary">
          {submitting ? 'Submitting...' : 'Publish Service'}
        </button>
      </form>
    </div>
  );
}

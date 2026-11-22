'use client';

import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { authClient } from '@/lib/auth-client';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    area: '',
    bio: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    apiFetch('/api/users/me', { authRequired: true })
      .then((res) => {
        if (res.user) {
          setForm({
            name: res.user.name || '',
            email: res.user.email || '',
            role: res.user.role || 'customer',
            phone: res.user.phone || '',
            area: res.user.area || '',
            bio: res.user.bio || '',
            image: res.user.image || '',
          });
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success('Profile photo uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch('/api/users/profile', {
        method: 'PATCH',
        authRequired: true,
        body: {
          name: form.name,
          phone: form.phone,
          area: form.area,
          bio: form.bio,
          image: form.image,
        },
      });
      // Sync BetterAuth client session immediately without logout
      await authClient.updateUser({ name: form.name, image: form.image });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-sm">Loading profile...</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">Update Profile</h1>
      <p className="mt-1 text-sm text-slate-500">
        Keep your contact information and photo up to date.
      </p>

      <form onSubmit={handleSubmit} className="card-surface mt-6 space-y-5 p-6">
        <div className="flex items-center gap-5">
          <img
            src={
              form.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.name || 'U'
              )}&background=1382f6&color=fff`
            }
            alt={form.name}
            className="h-20 w-20 rounded-full object-cover border border-slate-200"
          />
          <div>
            <label className="btn-secondary cursor-pointer text-xs">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Change Photo (ImgBB)'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            <p className="mt-1.5 text-xs text-slate-400">JPG, PNG up to 5MB</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Email (Read-only)</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="input-field bg-slate-100 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Role (Read-only)</label>
            <input
              type="text"
              value={form.role}
              readOnly
              className="input-field capitalize bg-slate-100 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold">Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 17xxxxxxxx"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">City / Area</label>
          <input
            type="text"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            placeholder="e.g. Mirpur, Dhaka"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold">Short Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Share your skills, certifications, or notes..."
            className="input-field"
          />
        </div>

        <button type="submit" disabled={saving || uploading} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

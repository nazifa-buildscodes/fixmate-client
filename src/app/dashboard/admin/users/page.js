'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    apiFetch('/api/admin/users', { authRequired: true })
      .then((res) => setUsers(res.users || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        authRequired: true,
        body: { role: newRole },
      });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-6 text-sm">Loading users...</div>;

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-2xl font-extrabold">Manage Users</h1>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {users.map((u) => {
          const isSelf = u.email === session?.user?.email;
          return (
            <div key={u._id} className="card-surface min-w-0 space-y-3 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    u.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`
                  }
                  alt={u.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-white">
                    {u.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{u.email}</p>
                </div>
                <span className="shrink-0 text-xs font-bold uppercase text-brand-600">
                  {u.role}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <span className="text-xs text-slate-500">Role</span>
                <select
                  disabled={isSelf}
                  value={u.role || 'customer'}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="input-field w-36 py-1.5 text-xs disabled:opacity-50"
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="card-surface hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => {
              const isSelf = u.email === session?.user?.email;
              return (
                <tr key={u._id}>
                  <td className="flex items-center gap-3 p-4">
                    <img
                      src={
                        u.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`
                      }
                      alt={u.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="font-semibold">{u.name}</span>
                  </td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4 text-xs font-bold uppercase text-brand-600">{u.role}</td>
                  <td className="p-4 text-right">
                    <select
                      disabled={isSelf}
                      value={u.role || 'customer'}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="input-field w-36 py-1.5 text-xs disabled:opacity-50"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
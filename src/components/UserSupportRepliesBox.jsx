'use client';

import { useEffect, useState } from 'react';
import { MessageSquareReply } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { getSupportMessages } from '@/lib/supportMessages';

export default function UserSupportRepliesBox() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const syncMessages = () => {
      const userEmail = session?.user?.email?.toLowerCase();
      const all = getSupportMessages();
      if (!userEmail) {
        setItems([]);
        return;
      }
      setItems(all.filter((m) => m.email?.toLowerCase() === userEmail));
    };

    syncMessages();
    window.addEventListener('storage', syncMessages);
    return () => window.removeEventListener('storage', syncMessages);
  }, [session]);

  if (!session?.user || items.length === 0) return null;

  return (
    <div className="card-surface space-y-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquareReply className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-extrabold">Your Messages &amp; Admin Replies</h3>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
          {items.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-slate-200 p-3.5 text-xs dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold">{m.topic}</span>
              <span className="font-mono text-[11px] text-slate-400">#{m.id}</span>
            </div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">Your message: {m.message}</p>
            {m.reply ? (
              <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                Admin Reply: {m.reply}
              </p>
            ) : (
              <p className="mt-1.5 italic text-amber-600 dark:text-amber-400">
                Sent to Admin — waiting for reply...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
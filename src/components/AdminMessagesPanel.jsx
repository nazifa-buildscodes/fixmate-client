'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Mail, Phone, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { getSupportMessages, replyToSupportMessage } from '@/lib/supportMessages';

export default function AdminMessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    setMessages(getSupportMessages());
  }, []);

  const handleCopy = async (value, key) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success(`Copied: ${value}`);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  const handleReplySubmit = (e, id) => {
    e.preventDefault();
    const text = (replyDrafts[id] || '').trim();
    if (!text) {
      toast.error('Please write a reply first.');
      return;
    }
    const updated = replyToSupportMessage(id, text);
    setMessages(updated);
    setReplyDrafts((prev) => ({ ...prev, [id]: '' }));
    toast.success('Reply sent to user dashboard!');
  };

  return (
    <div className="card-surface space-y-5 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Support &amp; Contact Messages</h2>
          <p className="text-xs text-slate-500">
            Sender details, direct call/mail links, and replies for Customer &amp; Technician dashboards
          </p>
        </div>
        <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
          {messages.length} Messages
        </span>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-800">
          No messages received yet.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="space-y-3.5 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                      <User className="h-3.5 w-3.5 text-brand-600" />
                      {m.name}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {m.role || 'guest'}
                    </span>
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {m.topic || 'General Inquiry'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-300">
                    <span>
                      <strong>Email:</strong> {m.email}
                    </span>
                    <span>
                      <strong>Phone:</strong> {m.phone || 'Not provided'}
                    </span>
                    {m.createdAt && (
                      <span className="text-slate-400">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {m.phone && (
                    <>
                      <a
                        href={`tel:${m.phone}`}
                        className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(m.phone, `phone-${m.id}`)}
                        className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                      >
                        {copiedKey === `phone-${m.id}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        Copy Phone
                      </button>
                    </>
                  )}

                  {m.email && (
                    <>
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(
                          `Re: ${m.topic || 'FixMate Support'} (${m.id})`
                        )}`}
                        className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                      >
                        <Mail className="h-3.5 w-3.5 text-brand-600" /> Mail
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(m.email, `mail-${m.id}`)}
                        className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                      >
                        {copiedKey === `mail-${m.id}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        Copy Mail
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                {m.message}
              </p>

              {m.reply && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">Admin Reply</span>
                    {m.repliedAt && (
                      <span className="text-[11px] opacity-75">
                        {new Date(m.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1">{m.reply}</p>
                </div>
              )}

              <form
                onSubmit={(e) => handleReplySubmit(e, m.id)}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="text"
                  value={replyDrafts[m.id] || ''}
                  onChange={(e) =>
                    setReplyDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))
                  }
                  placeholder={`Reply to ${m.name}...`}
                  className="input-field flex-1 text-xs"
                />
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  {m.reply ? 'Update Reply' : 'Send Reply'}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
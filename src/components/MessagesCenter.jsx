'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export default function MessagesCenter() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingId, setSendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedKey, setCopiedKey] = useState('');

  const userEmail = session?.user?.email?.toLowerCase() || '';
  const userRole = (session?.user?.role || '').toLowerCase();

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/messages/my', { authRequired: true });
      setMessages(res.messages || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [userEmail, userRole]);

  const handleCopy = async (value, key) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success(`Copied: ${value}`);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch {
      toast.error('Could not copy');
    }
  };

  const handleReplySubmit = async (e, msgId) => {
    e.preventDefault();
    const text = (replyDrafts[msgId] || '').trim();
    if (!text) {
      toast.error('Please write a reply first.');
      return;
    }

    setSendingId(msgId);
    try {
      await apiFetch(`/api/messages/${msgId}/reply`, {
        method: 'PATCH',
        authRequired: true,
        body: { reply: text },
      });
      toast.success('Reply sent!');
      setReplyDrafts((prev) => ({ ...prev, [msgId]: '' }));
      loadMessages();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendingId(null);
    }
  };

  const handleDelete = async (msgId) => {
    setDeletingId(msgId);
    try {
      await apiFetch(`/api/messages/${msgId}`, {
        method: 'DELETE',
        authRequired: true,
      });
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((item) => item._id !== msgId));
    } catch (err) {
      toast.error(err.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading messages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Messages</h1>
          <p className="text-xs text-slate-500">
            {userRole === 'admin' && 'Messages & inquiries sent to Admin'}
            {userRole === 'technician' && 'Service messages from Customers & your sent inquiries'}
            {userRole !== 'admin' &&
              userRole !== 'technician' &&
              'Your messages to Technicians & Admin with replies'}
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="btn-secondary inline-flex w-fit items-center gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center p-12 text-center">
          <MessageSquare className="h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold">No messages yet</h3>
          <p className="mt-1 text-xs text-slate-500">
            Messages sent from Contact/Footer or Service Details will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => {
            const isSender = (m.senderEmail || '').toLowerCase() === userEmail;
            const isRecipient =
              (userRole === 'admin' && m.recipientRole === 'admin') ||
              (userRole === 'technician' &&
                m.recipientRole === 'technician' &&
                (m.recipientEmail || '').toLowerCase() === userEmail);

            const canReply = isRecipient || isSender;
            const canDelete = userRole === 'admin' || isSender || isRecipient;
            const toRoleLabel = (m.recipientRole || 'admin').toUpperCase();
            const fromRoleLabel = (m.senderRole || 'guest').toUpperCase();

            return (
              <div key={m._id} className="card-surface space-y-4 p-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                        <User className="h-4 w-4 text-brand-600" />
                        From: {m.senderName}
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {fromRoleLabel}
                      </span>

                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        To: {toRoleLabel}
                        {m.recipientEmail ? ` (${m.recipientEmail})` : ''}
                        {m.topic ? ` · ${m.topic}` : ''}
                      </span>
                    </div>

                    {m.serviceTitle && (
                      <p className="inline-flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                        <Wrench className="h-3.5 w-3.5" />
                        Service: {m.serviceTitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-300">
                      <span>
                        <strong>Email:</strong> {m.senderEmail}
                      </span>
                      <span>
                        <strong>Phone:</strong> {m.senderPhone || 'Not provided'}
                      </span>
                      {m.createdAt && (
                        <span className="text-slate-400">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {m.senderPhone && (
                      <>
                        <a
                          href={`tel:${m.senderPhone}`}
                          className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                        >
                          <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.senderPhone, `ph-${m._id}`)}
                          className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                        >
                          {copiedKey === `ph-${m._id}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Copy Phone
                        </button>
                      </>
                    )}

                    {m.senderEmail && (
                      <>
                        <a
                          href={`mailto:${m.senderEmail}?subject=${encodeURIComponent(
                            `Re: ${m.serviceTitle || m.topic || 'FixMate Support'}`
                          )}`}
                          className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                        >
                          <Mail className="h-3.5 w-3.5 text-brand-600" /> Mail
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.senderEmail, `em-${m._id}`)}
                          className="btn-secondary inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
                        >
                          {copiedKey === `em-${m._id}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Copy Mail
                        </button>
                      </>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(m._id)}
                        disabled={deletingId === m._id}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === m._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                  {m.message}
                </div>

                {m.reply ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold uppercase">
                        Reply from {m.repliedBy || m.recipientRole}
                      </span>
                      {m.repliedAt && (
                        <span className="text-[11px] opacity-75">
                          {new Date(m.repliedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm">{m.reply}</p>
                  </div>
                ) : (
                  !canReply && (
                    <p className="text-xs italic text-amber-600 dark:text-amber-400">
                      Sent — waiting for reply...
                    </p>
                  )
                )}

                {canReply && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, m._id)}
                    className="flex flex-col gap-2 pt-1 sm:flex-row"
                  >
                    <input
                      type="text"
                      value={replyDrafts[m._id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [m._id]: e.target.value }))
                      }
                      placeholder={
                        isRecipient
                          ? `Write a reply to ${m.senderName}...`
                          : 'Write a follow-up reply...'
                      }
                      className="input-field flex-1 text-xs"
                    />
                    <button
                      type="submit"
                      disabled={sendingId === m._id}
                      className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {sendingId === m._id
                        ? 'Sending...'
                        : m.reply
                        ? 'Update Reply'
                        : 'Send Reply'}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
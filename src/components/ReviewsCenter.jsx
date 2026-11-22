'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  RefreshCw,
  Star,
  ThumbsDown,
  ThumbsUp,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';

function getSentimentMeta(rating) {
  const num = Number(rating) || 0;
  if (num >= 4) {
    return {
      label: 'Good Review',
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900',
      icon: ThumbsUp,
    };
  }
  if (num <= 2) {
    return {
      label: 'Poor Review',
      tone: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900',
      icon: ThumbsDown,
    };
  }
  return {
    label: 'Average Review',
    tone: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900',
    icon: Star,
  };
}

export default function ReviewsCenter() {
  const { data: session } = useSession();
  const role = (session?.user?.role || '').toLowerCase();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');

  const loadReviews = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const endpoint =
        role === 'admin' ? '/api/reviews/admin' : '/api/reviews/technician';
      const res = await apiFetch(endpoint, { authRequired: true });
      setReviews(res.reviews || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [role]);

  const goodCount = reviews.filter((r) => (Number(r.rating) || 0) >= 4).length;
  const poorCount = reviews.filter((r) => (Number(r.rating) || 0) <= 2).length;

  const serviceTitles = [...new Set(reviews.map((r) => r.serviceTitle).filter(Boolean))];

  const filteredReviews = reviews.filter((r) => {
    const ratingNum = Number(r.rating) || 0;
    const matchesService =
      selectedService === 'all' || r.serviceTitle === selectedService;
    const matchesSentiment =
      sentimentFilter === 'all' ||
      (sentimentFilter === 'good' && ratingNum >= 4) ||
      (sentimentFilter === 'poor' && ratingNum <= 2);
    return matchesService && matchesSentiment;
  });

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Reviews</h1>
          <p className="text-xs text-slate-500">
            {role === 'admin'
              ? 'All customer reviews across services with good & poor feedback indicators'
              : 'Customer reviews on your services — see whether feedback is good or poor'}
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          className="btn-secondary inline-flex w-fit items-center gap-1.5 text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-4">
          <p className="text-xs font-medium text-slate-500">Total Reviews</p>
          <p className="mt-1 text-2xl font-extrabold">{reviews.length}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium text-emerald-600">Good Reviews (4–5★)</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {goodCount}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-medium text-rose-600">Poor Reviews (1–2★)</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700 dark:text-rose-400">
            {poorCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSentimentFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              sentimentFilter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setSentimentFilter('good')}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              sentimentFilter === 'good'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" /> Good ({goodCount})
          </button>
          <button
            type="button"
            onClick={() => setSentimentFilter('poor')}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              sentimentFilter === 'poor'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" /> Poor ({poorCount})
          </button>
        </div>

        {serviceTitles.length > 0 && (
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="input-field w-full text-xs sm:w-64"
          >
            <option value="all">All Services</option>
            {serviceTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center p-12 text-center">
          <MessageSquareQuote className="h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-bold">No matching reviews</h3>
          <p className="mt-1 text-xs text-slate-500">
            Reviews submitted after completed repairs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const meta = getSentimentMeta(rev.rating);
            const SentimentIcon = meta.icon;

            return (
              <div key={rev.id} className="card-surface space-y-3 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {rev.customerName}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.tone}`}
                    >
                      <SentimentIcon className="h-3 w-3" />
                      {meta.label}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      <Wrench className="h-3 w-3" />
                      {rev.serviceTitle}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" /> {rev.rating}/5
                  </span>
                </div>

                {role === 'admin' && rev.technicianName && (
                  <p className="text-xs text-slate-500">
                    Technician: <strong>{rev.technicianName}</strong>
                    {rev.technicianEmail ? ` (${rev.technicianEmail})` : ''}
                  </p>
                )}

                {rev.review && (
                  <p className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                    {rev.review}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
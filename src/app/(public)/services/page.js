'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { apiFetch } from '@/lib/api';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [serviceMode, setServiceMode] = useState(searchParams.get('serviceMode') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const syncUrlAndFetch = useCallback(
    async (params) => {
      const qs = new URLSearchParams();
      if (params.search?.trim()) qs.set('search', params.search.trim());
      if (params.category && params.category !== 'all') qs.set('category', params.category);
      if (params.serviceMode && params.serviceMode !== 'all')
        qs.set('serviceMode', params.serviceMode);
      if (params.sort && params.sort !== 'newest') qs.set('sort', params.sort);
      if (params.page > 1) qs.set('page', String(params.page));

      const queryString = qs.toString();
      router.replace(queryString ? `/services?${queryString}` : '/services', {
        scroll: false,
      });

      setLoading(true);
      try {
        const data = await apiFetch(
          `/api/services?search=${encodeURIComponent(params.search || '')}&category=${encodeURIComponent(
            params.category || 'all'
          )}&serviceMode=${encodeURIComponent(params.serviceMode || 'all')}&sort=${encodeURIComponent(
            params.sort || 'newest'
          )}&page=${params.page || 1}&limit=9`
        );
        setServices(data.services || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    syncUrlAndFetch({ search, category, serviceMode, sort, page });
  }, [category, serviceMode, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    syncUrlAndFetch({ search, category, serviceMode, sort, page: 1 });
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setServiceMode('all');
    setSort('newest');
    setPage(1);
    syncUrlAndFetch({ search: '', category: 'all', serviceMode: 'all', sort: 'newest', page: 1 });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Browse Repair Services
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Showing {total} verified &amp; available repair services
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card-surface mb-8 p-4">
        <div className="grid gap-3 md:grid-cols-12">
          <form onSubmit={handleSearchSubmit} className="relative md:col-span-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="input-field pl-10"
            />
          </form>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="input-field md:col-span-3"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={serviceMode}
            onChange={(e) => {
              setServiceMode(e.target.value);
              setPage(1);
            }}
            className="input-field md:col-span-2"
          >
            <option value="all">All Modes</option>
            {SERVICE_MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="input-field md:col-span-2"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="btn-secondary md:col-span-1 px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center p-14 text-center">
          <SlidersHorizontal className="h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            No matching services found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing your filters or searching a different keyword.
          </p>
          <button onClick={resetFilters} className="btn-primary mt-5">
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          {/* Server-Side Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary px-4 py-2 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary px-4 py-2 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading services...</div>}>
      <ServicesContent />
    </Suspense>
  );
}

import Link from 'next/link';
import { MapPin, Star, Wrench, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <div className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-sm dark:bg-slate-900/90 dark:text-slate-100">
          {service.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-brand-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {service.serviceMode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-brand-500" />
            {service.serviceArea}
          </span>
          {service.avgRating ? (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              {service.avgRating} ({service.reviewCount})
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">New</span>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
          {service.title}
        </h3>

        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Wrench className="h-3.5 w-3.5 text-slate-400" />
          By <span className="font-medium text-slate-700 dark:text-slate-300">{service.technicianName}</span>
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400">
              Starts from
            </span>
            <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">
              ৳{service.basePrice}
            </span>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

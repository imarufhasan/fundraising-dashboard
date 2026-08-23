"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, Mail, Search } from "lucide-react";

import { useGetNewsletterSubscribersQuery } from "@/store/api/dashboardApi";

const PAGE_SIZE = 10;

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NewsletterPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isFetching, isError, refetch } = useGetNewsletterSubscribersQuery({
    page,
    limit: PAGE_SIZE,
  });

  const subscribers = data?.data ?? [];
  const meta = data?.meta;

  const filteredSubscribers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(term));
  }, [subscribers, searchTerm]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Newsletter Subscribers
          </h1>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            {meta ? `${meta.total.toLocaleString()} total subscriber${meta.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Subscribers List */}
      {isLoading ? (
        <NewsletterTableSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Failed to load newsletter subscribers
          </h2>
          <p className="max-w-md text-sm text-slate-500">
            Something went wrong while loading subscribers.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-1 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Subscribed At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {filteredSubscribers.map((subscriber, index) => (
                  <tr key={subscriber._id} className="transition-colors duration-200 hover:bg-slate-50/30">
                    <td className="px-6 py-4 text-slate-400">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 text-slate-700">
                        <Mail className="size-4 shrink-0 text-pink-500" />
                        {subscriber.email}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right text-slate-500">
                      {formatDateTime(subscriber.subscribedAt)}
                    </td>
                  </tr>
                ))}

                {!filteredSubscribers.length && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center font-semibold text-slate-400">
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="divide-y divide-slate-100 sm:hidden">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber._id} className="p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Mail className="size-4 shrink-0 text-pink-500" />
                  <span className="truncate">{subscriber.email}</span>
                </div>

                <div className="mt-1.5 text-xs font-medium text-slate-400">
                  Subscribed {formatDateTime(subscriber.subscribedAt)}
                </div>
              </div>
            ))}

            {!filteredSubscribers.length && (
              <div className="py-12 text-center text-sm font-semibold text-slate-400">
                No subscribers found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-semibold text-slate-400">
                Page {meta.page} of {meta.totalPages} • {meta.total} subscribers
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <button
                  type="button"
                  disabled={page >= meta.totalPages || isFetching}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewsletterTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="grid grid-cols-3 items-center gap-4 px-6 py-4">
              <div className="h-4 w-6 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
              <div className="ml-auto h-4 w-32 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
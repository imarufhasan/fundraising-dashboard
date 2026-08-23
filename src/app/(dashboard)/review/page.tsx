"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Star,
  StarOff,
  X,
  MessageSquareQuote,
  ArrowUpDown,
  Loader2,
  XCircle,
  Calendar,
  UserRound,
  Copy,
  Check,
} from "lucide-react";

import {
  Review,
  ReviewSortBy,
  ReviewSortOrder,
  useGetAllReviewsQuery,
  useToggleReviewFeaturedMutation,
} from "@/store/api/reviewApi";
import Pagination from "@/components/ui/Pagination";
import { useToast } from "@/components/ToastProvider";
import { getErrorMessage } from "@/lib/utils/error-handler";

const LIMIT = 10;

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < safeRating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}

      <span className="ml-1.5 text-[12px] font-bold text-slate-500">
        {rating}/5
      </span>
    </div>
  );
}

function OrganizerIdChip({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  const shortId = `${id.slice(0, 6)}…${id.slice(-4)}`;

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={id}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
    >
      <UserRound className="size-3.5 text-slate-400" />
      {shortId}
      {copied ? (
        <Check className="size-3 text-emerald-500" />
      ) : (
        <Copy className="size-3 text-slate-400" />
      )}
    </button>
  );
}

type FeaturedFilter = "all" | "featured" | "not_featured";

export default function ReviewsPage() {
  const { success, error: showError } = useToast();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const [sortBy, setSortBy] = useState<ReviewSortBy>("createdAt");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [sortOrder, setSortOrder] = useState<ReviewSortOrder>("desc");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const isFeaturedParam =
    featuredFilter === "all" ? undefined : featuredFilter === "featured";

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllReviewsQuery({
      page,
      limit: LIMIT,
      searchTerm: debouncedSearch,
      sortBy,
      sortOrder,
      isFeatured: isFeaturedParam,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

  const reviews = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const isTableLoading = isLoading || isFetching;

  const resetFilters = () => {
    setSearchTerm("");
    setFeaturedFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const [toggleFeatured, { isLoading: isToggling, originalArgs }] =
    useToggleReviewFeaturedMutation();

  const handleToggleFeatured = async (review: Review, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const nextFeatured = !review.isFeatured;

    try {
      const res = await toggleFeatured({
        id: review._id,
        isFeatured: nextFeatured,
      }).unwrap();

      if (!res?.success) {
        throw new Error(res?.message || "Failed to update review.");
      }

      success(
        nextFeatured ? "Review Featured" : "Review Unfeatured",
        nextFeatured
          ? "This review will now show as featured."
          : "This review has been removed from featured.",
      );

      setSelectedReview((prev) =>
        prev && prev._id === review._id ? res.data : prev,
      );
    } catch (err: unknown) {
      console.error("TOGGLE REVIEW FEATURED ERROR:", err);
      const message = getErrorMessage(err, "Failed to update review.");
      showError("Update Failed", message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <MessageSquareQuote className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Reviews
            </h1>

            <p className="text-sm font-medium text-slate-400">
              Manage organizer reviews and testimonials
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stats + Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Reviews
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">{total}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Featured filter */}
          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value as FeaturedFilter);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Reviews</option>
            <option value="featured">Featured Only</option>
            <option value="not_featured">Not Featured</option>
          </select>

          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as ReviewSortBy);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="createdAt">Sort: Date Created</option>
            <option value="updatedAt">Sort: Date Updated</option>
          </select>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={toggleSortOrder}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
            title={sortOrder === "desc" ? "Descending" : "Ascending"}
          >
            <ArrowUpDown className="size-3.5" />
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>

          {/* Date range */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <Calendar className="size-3.5 shrink-0 text-slate-400" />

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="w-[120px] border-0 bg-transparent text-[12px] font-bold text-slate-600 outline-none"
            />

            <span className="text-slate-300">–</span>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="w-[120px] border-0 bg-transparent text-[12px] font-bold text-slate-600 outline-none"
            />
          </div>

          {(searchTerm ||
            featuredFilter !== "all" ||
            sortBy !== "createdAt" ||
            sortOrder !== "desc" ||
            fromDate ||
            toDate) && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
          )}

          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
              <Loader2 className="size-3.5 animate-spin" />
              Updating...
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {isError && !isTableLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 px-6 py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <XCircle className="size-5" />
          </div>

          <p className="mt-4 font-bold text-rose-700">
            Failed to load reviews.
          </p>

          <p className="mt-1 text-sm font-medium text-rose-500">
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <ReviewsSkeleton />
      ) : (
        !isError && (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Organizer</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Featured</th>
                      <th className="px-6 py-4">Created</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {reviews.map((review) => (
                      <tr
                        key={review._id}
                        onClick={() => setSelectedReview(review)}
                        className="cursor-pointer transition-colors duration-200 hover:bg-slate-50/50"
                      >
                        {/* Organizer */}
                        <td className="px-6 py-4">
                          <div onClick={(e) => e.stopPropagation()}>
                            <OrganizerIdChip id={review.organizer} />
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <StarRating rating={review.rating} />
                        </td>

                        {/* Message */}
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 max-w-md text-sm font-medium text-slate-600">
                            {review.message}
                          </p>
                        </td>

                        {/* Featured */}
                        {/* <td className="whitespace-nowrap px-6 py-4">
                          <FeaturedBadge isFeatured={review.isFeatured} />
                        </td> */}

                        {/* Featured */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <div onClick={(e) => e.stopPropagation()}>
                            <FeaturedBadge
                              isFeatured={review.isFeatured}
                              onToggle={(e) => handleToggleFeatured(review, e)}
                              isLoading={
                                isToggling && originalArgs?.id === review._id
                              }
                            />
                          </div>
                        </td>

                        {/* Created */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-[12px] font-bold text-slate-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <MessageSquareQuote className="mx-auto size-8 text-slate-300" />

                          <p className="mt-3 text-sm font-bold text-slate-700">
                            No reviews found.
                          </p>

                          <p className="mt-1 text-[12px] font-medium text-slate-400">
                            Try changing your search or filters.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {meta && meta.total > 0 && (
                <ReviewPagination
                  page={page}
                  totalPages={totalPages}
                  total={meta.total}
                  limit={meta.limit}
                  isFetching={isFetching}
                  onPageChange={setPage}
                />
              )}
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 lg:hidden">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  onClick={() => setSelectedReview(review)}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                >
                  {/* <div className="flex items-start justify-between gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <OrganizerIdChip id={review.organizer} />
                    </div>

                    <FeaturedBadge isFeatured={review.isFeatured} />
                  </div> */}
                  <div className="flex items-start justify-between gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <OrganizerIdChip id={review.organizer} />
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <FeaturedBadge
                        isFeatured={review.isFeatured}
                        onToggle={(e) => handleToggleFeatured(review, e)}
                        isLoading={
                          isToggling && originalArgs?.id === review._id
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <StarRating rating={review.rating} />
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-slate-600">
                    {review.message}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Created
                    </p>

                    <p className="mt-0.5 text-[12px] font-bold text-slate-600">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
                  <MessageSquareQuote className="mx-auto size-8 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    No reviews found.
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              )}

              {meta && meta.total > 0 && (
                <ReviewPagination
                  page={page}
                  totalPages={totalPages}
                  total={meta.total}
                  limit={meta.limit}
                  isFetching={isFetching}
                  onPageChange={setPage}
                />
              )}
            </div>
          </>
        )
      )}

      {/* Review Details Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Review Details
                </h2>

                <div className="mt-2">
                  <OrganizerIdChip id={selectedReview.organizer} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            {/* <div className="space-y-5 px-6 py-5">
              <div className="flex items-center justify-between">
                <StarRating rating={selectedReview.rating} />
                <FeaturedBadge isFeatured={selectedReview.isFeatured} />
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Message
                </p>

                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                  {selectedReview.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(selectedReview.updatedAt)}
                  </p>
                </div>
              </div>
            </div> */}
            <div className="flex items-center justify-between">
              <StarRating rating={selectedReview.rating} />
              <FeaturedBadge
                isFeatured={selectedReview.isFeatured}
                onToggle={(e) => handleToggleFeatured(selectedReview, e)}
                isLoading={
                  isToggling && originalArgs?.id === selectedReview._id
                }
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedBadge({
  isFeatured,
  onToggle,
  isLoading,
}: {
  isFeatured: boolean;
  onToggle?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}) {
  const classes = isFeatured
    ? "inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[12px] font-bold text-amber-600"
    : "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-500";

  const icon = isLoading ? (
    <Loader2 className="size-3 animate-spin" />
  ) : isFeatured ? (
    <Star className="size-3 fill-amber-500 text-amber-500" />
  ) : (
    <StarOff className="size-3" />
  );

  const label = isFeatured ? "Featured" : "Not Featured";

  if (!onToggle) {
    return (
      <span className={classes}>
        {icon}
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      title={isFeatured ? "Click to unfeature" : "Click to feature"}
      className={`${classes} transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {icon}
      {label}
    </button>
  );
}

function ReviewPagination({
  page,
  totalPages,
  total,
  limit,
  isFetching,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}) {
  if (total <= 0) return null;

  const currentLimit = limit || LIMIT;
  const start = (page - 1) * currentLimit + 1;
  const end = Math.min(page * currentLimit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[12px] font-bold text-slate-400">
        Showing{" "}
        <span className="text-slate-700">
          {start}–{end}
        </span>{" "}
        of <span className="text-slate-700">{total}</span> reviews
        {isFetching && (
          <span className="ml-2 text-slate-400">(updating...)</span>
        )}
      </p>

      <div className="shrink-0">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          disabled={isFetching}
        />
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="grid grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-3 animate-pulse rounded bg-slate-200"
              />
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: LIMIT }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center gap-6 px-6 py-5"
            >
              <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="grid gap-4 p-4 lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div className="h-7 w-28 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>

            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-100" />

            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
              <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

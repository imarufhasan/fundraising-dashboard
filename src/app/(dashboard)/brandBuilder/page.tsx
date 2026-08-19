"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Loader2,
  Palette,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

import { useGetBrandsQuery, Brand } from "@/store/api/brandApi";
import Pagination from "@/components/ui/Pagination";
import ExpandableTags from "@/components/ui/ExpandableTags";
import BrandDetailsModal from "@/components/brand/BrandDetailsModal";
import BrandCompleteModal from "@/components/brand/BrandCompleteModal";
import { useToast } from "@/components/ToastProvider";

const LIMIT = 10;

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value: number | string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "$0.00";
  }

  return `$${amount.toFixed(2)}`;
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";

    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-100";

    case "completed":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";

    case "cancelled":
    case "canceled":
    case "failed":
      return "bg-rose-50 text-rose-700 border border-rose-100";

    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

export default function BrandBuilderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { success, error } = useToast();

  // View-only details modal
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Separate complete-confirmation modal
  const [completeTarget, setCompleteTarget] = useState<Brand | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useGetBrandsQuery({
    page,
    limit: LIMIT,
    searchTerm: search,
  });

  const brands = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const isInitialLoading = isLoading;
  const isUpdating = isFetching && !isLoading;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedSearch = searchTerm.trim();

      setPage(1);
      setSearch(trimmedSearch);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleViewDetails = (brand: Brand) => {
    setSelectedBrand(brand);
  };

  const handleOpenComplete = (brand: Brand) => {
    setCompleteTarget(brand);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Palette className="size-5" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-tight text-slate-900">
              Brand Builder
            </h1>

            <p className="truncate text-sm font-medium text-slate-400">
              Manage and review brand builder requests
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full shrink-0 sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Brands
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">{total}</p>
        </div>

        {isUpdating && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Loader2 className="size-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {isError && !isInitialLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 px-6 py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <XCircle className="size-5" />
          </div>

          <p className="mt-4 font-bold text-rose-700">
            Failed to load Brand Builder data.
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

      {isInitialLoading ? (
        <BrandBuilderSkeleton />
      ) : (
        !isError && (
          <>
            <div className="hidden w-full max-w-full min-w-0 rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
              <div className="w-full max-w-full overflow-x-auto">
                <table className="min-w-300 w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="whitespace-nowrap px-6 py-4">Brand</th>

                      <th className="whitespace-nowrap px-6 py-4">Organizer</th>

                      <th className="px-6 py-4">Products</th>

                      <th className="whitespace-nowrap px-6 py-4">Style</th>

                      <th className="whitespace-nowrap px-6 py-4">Budget</th>

                      <th className="whitespace-nowrap px-6 py-4">Fee</th>

                      <th className="whitespace-nowrap px-6 py-4">Status</th>

                      <th className="whitespace-nowrap px-6 py-4">Created</th>

                      <th className="whitespace-nowrap px-6 py-4 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {brands.map((brand) => {
                      const isCompleted =
                        brand.status?.toLowerCase() === "completed";

                      return (
                        <tr
                          key={brand._id}
                          className="cursor-pointer transition-colors duration-200 hover:bg-slate-50/50"
                          onClick={() => handleViewDetails(brand)}
                        >
                          {/* Brand */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <BrandImage brand={brand} size="small" />

                              <div className="min-w-0 max-w-[210px]">
                                <p className="truncate text-sm font-extrabold text-slate-900">
                                  {brand.businessName || "Unnamed Brand"}
                                </p>

                                <p className="mt-0.5 truncate text-[12px] font-semibold text-slate-400">
                                  {brand.sellingItem || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Organizer */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-600">
                                {brand.organizerProfileImage ? (
                                  <Image
                                    src={brand.organizerProfileImage}
                                    alt={brand.organizerName || "Organizer"}
                                    width={36}
                                    height={36}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <UserRound className="size-4" />
                                )}
                              </div>

                              <div className="min-w-0 max-w-[200px]">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {brand.organizerName || "—"}
                                </p>

                                <p className="truncate text-[12px] font-medium text-slate-400">
                                  {brand.organizerEmail || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Products — expandable, standard "+N more" pattern */}
                          <td className="px-6 py-4">
                            <div
                              className="max-w-[220px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExpandableTags
                                items={brand.products ?? []}
                                visibleCount={2}
                              />
                            </div>
                          </td>

                          {/* Style */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-sm font-bold text-slate-700">
                              {brand.brandStyle || "—"}
                            </span>
                          </td>

                          {/* Budget */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-sm font-extrabold text-slate-800">
                              {formatCurrency(brand.budget)}
                            </span>
                          </td>

                          {/* Fee */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="text-sm font-extrabold text-slate-800">
                              {formatCurrency(brand.brandBuilderFee)}
                            </p>

                            <p className="mt-0.5 text-[12px] font-medium text-slate-400">
                              Paid: {formatCurrency(brand.paidAmount)}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold capitalize ${getStatusClass(
                                brand.status,
                              )}`}
                            >
                              {brand.status || "Unknown"}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-[12px] font-bold text-slate-500">
                              {formatDate(brand.createdAt)}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* View Details — view only */}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleViewDetails(brand);
                                }}
                                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                                title="View Details"
                              >
                                <Eye className="size-4" />
                              </button>

                              {/* Complete — opens separate confirm modal */}
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenComplete(brand);
                                }}
                                disabled={isCompleted}
                                className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                title={
                                  isCompleted
                                    ? "Already Completed"
                                    : "Mark as Complete"
                                }
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Empty */}
                    {brands.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-16 text-center">
                          <Palette className="mx-auto size-8 text-slate-300" />

                          <p className="mt-3 text-sm font-bold text-slate-700">
                            No brands found.
                          </p>

                          <p className="mt-1 text-[12px] font-medium text-slate-400">
                            Try changing your search term.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {meta && meta.total > 0 && (
                <BrandPagination
                  page={page}
                  totalPages={totalPages}
                  total={meta.total}
                  limit={meta.limit}
                  isFetching={isFetching}
                  onPageChange={setPage}
                />
              )}
            </div>

            <div className="grid min-w-0 gap-4 lg:hidden">
              {brands.map((brand) => {
                const isCompleted = brand.status?.toLowerCase() === "completed";

                return (
                  <div
                    key={brand._id}
                    onClick={() => handleViewDetails(brand)}
                    className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <BrandImage brand={brand} size="medium" />

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-slate-900">
                            {brand.businessName || "Unnamed Brand"}
                          </h3>

                          <p className="mt-0.5 truncate text-[12px] font-medium text-slate-400">
                            {brand.sellingItem || "—"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold capitalize ${getStatusClass(
                          brand.status,
                        )}`}
                      >
                        {brand.status || "Unknown"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <InfoBox
                        label="Organizer"
                        value={brand.organizerName || "—"}
                      />

                      <InfoBox label="Style" value={brand.brandStyle || "—"} />

                      <InfoBox
                        label="Budget"
                        value={formatCurrency(brand.budget)}
                      />

                      <InfoBox
                        label="Builder Fee"
                        value={formatCurrency(brand.brandBuilderFee)}
                      />
                    </div>

                    {/* Products — expandable */}
                    {brand.products?.length ? (
                      <div
                        className="mt-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Products
                        </p>

                        <ExpandableTags
                          items={brand.products}
                          visibleCount={3}
                        />
                      </div>
                    ) : null}

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Created
                        </p>

                        <p className="mt-0.5 text-[12px] font-bold text-slate-600">
                          {formatDate(brand.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleViewDetails(brand);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-bold text-slate-600 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                        >
                          <Eye className="size-4" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenComplete(brand);
                          }}
                          disabled={isCompleted}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-bold text-slate-600 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-600"
                        >
                          <CheckCircle2 className="size-4" />
                          {isCompleted ? "Done" : "Complete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {brands.length === 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
                  <Palette className="mx-auto size-8 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    No brands found.
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    Try changing your search term.
                  </p>
                </div>
              )}

              {/* Mobile Pagination */}
              {meta && meta.total > 0 && (
                <BrandPagination
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

      {/* Details modal — view only */}
      <BrandDetailsModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
      />

      {/* Complete modal — separate confirm dialog */}
      <BrandCompleteModal
        brand={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onCompleted={() => refetch()}
      />
    </div>
  );
}

function BrandImage({
  brand,
  size,
}: {
  brand: Brand;
  size: "small" | "medium";
}) {
  const imageSize = size === "small" ? "size-11" : "size-12";

  return (
    <div
      className={`relative ${imageSize} shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100`}
    >
      {brand.brandLogo ? (
        <Image
          src={brand.brandLogo}
          alt={brand.businessName || "Brand"}
          fill
          className="object-contain p-1"
          sizes={size === "small" ? "44px" : "48px"}
        />
      ) : brand.brandImage ? (
        <Image
          src={brand.brandImage}
          alt={brand.businessName || "Brand"}
          fill
          className="object-cover"
          sizes={size === "small" ? "44px" : "48px"}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-slate-400">
          <Palette className="size-5" />
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function BrandPagination({
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

  const currentPage = page;
  const currentLimit = limit || LIMIT;

  const start = (currentPage - 1) * currentLimit + 1;
  const end = Math.min(currentPage * currentLimit, total);

  return (
    <div className="flex min-w-0 flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[12px] font-bold text-slate-400">
        Showing{" "}
        <span className="text-slate-700">
          {start}–{end}
        </span>{" "}
        of <span className="text-slate-700">{total}</span> brands
        {isFetching && (
          <span className="ml-2 text-slate-400">(updating...)</span>
        )}
      </p>

      <div className="shrink-0">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          disabled={isFetching}
        />
      </div>
    </div>
  );
}

function BrandBuilderSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="hidden lg:block">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="grid grid-cols-9 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
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
              className="grid grid-cols-9 items-center gap-6 px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 animate-pulse rounded-lg bg-slate-100" />

                <div className="space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              {Array.from({ length: 8 }).map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-4 w-20 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="size-12 animate-pulse rounded-lg bg-slate-100" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

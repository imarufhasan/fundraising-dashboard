"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  X,
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Ban,
} from "lucide-react";
import {
  useGetAllCampaignsQuery,
  useLazyGetCampaignByIdQuery,
  useRejectCampaignMutation,
} from "@/store/api/campaignApi";
import { useToast } from "@/components/ToastProvider";

const LIMIT = 10;

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getErrorMessage(err: unknown, fallback: string) {
  const message = (err as { data?: { message?: string } })?.data?.message;
  return message || fallback;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600 border border-emerald-100">
        Active
      </span>
    );
  }
  if (normalized === "completed") {
    return (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold text-blue-600 border border-blue-100">
        Completed
      </span>
    );
  }
  if (
    normalized === "cancelled" ||
    normalized === "flagged" ||
    normalized === "rejected"
  ) {
    return (
      <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-[12px] font-extrabold text-rose-600 border-2 border-rose-600 leading-normal inline-block uppercase tracking-wider">
        {status}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-500 border border-slate-200 capitalize">
      {status}
    </span>
  );
}

export default function CampaignsPage() {
  const { success, error } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllCampaignsQuery({
      page,
      limit: LIMIT,
      searchTerm: debouncedSearch,
    });

  const campaigns = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const isTableLoading = isLoading || isFetching;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"details" | "reject" | null>(null);

  const [fetchCampaignById, { data: detailRes, isFetching: isDetailLoading }] =
    useLazyGetCampaignByIdQuery();

  const [rejectCampaign, { isLoading: isRejecting }] =
    useRejectCampaignMutation();

  const [rejectReason, setRejectReason] = useState("");

  const handleViewDetails = (id: string) => {
    setSelectedId(id);
    setModalType("details");
    setRejectReason("");
    fetchCampaignById(id);
  };

  const handleRejectClick = (id: string) => {
    setSelectedId(id);
    setModalType("reject");
    setRejectReason("");
    fetchCampaignById(id);
  };

  const closeModal = () => {
    setSelectedId(null);
    setModalType(null);
    setRejectReason("");
  };

  const detail = detailRes?.data;

  const handleRejectSubmit = async () => {
    if (!selectedId) return;

    const trimmedReason = rejectReason.trim();

    if (!trimmedReason) {
      error(
        "Rejection Failed",
        "Please provide a reason for rejecting this campaign.",
      );
      return;
    }

    try {
      const res = await rejectCampaign({
        id: selectedId,
        rejectedReason: trimmedReason,
      }).unwrap();

      success(
        "Campaign Rejected",
        res.message || "The campaign has been rejected successfully.",
      );

      refetch();

      fetchCampaignById(selectedId);

      closeModal();
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to reject campaign. Please try again.",
      );

      error("Campaign Rejection Failed", message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Campaigns
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Code</th>
                <th className="py-4 px-6">Campaign</th>
                <th className="py-4 px-6">Organizer</th>
                <th className="py-4 px-6">Progress</th>
                <th className="py-4 px-6">Supporters</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Cancel Reason</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {isTableLoading && <CampaignTableSkeleton />}

              {isError && !isTableLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-rose-500 font-semibold"
                  >
                    Couldn&apos;t load campaigns. Please try again.
                  </td>
                </tr>
              )}

              {!isTableLoading && !isError && campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400 font-semibold"
                  >
                    No campaigns found.
                  </td>
                </tr>
              )}

              {!isTableLoading &&
                !isError &&
                campaigns.map((campaign) => {
                  return (
                    <tr
                      key={campaign._id}
                      className="transition-colors duration-200 hover:bg-slate-50/30"
                    >
                      <td className="py-4 px-6 font-bold text-slate-500">
                        {campaign.campaignCode}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-extrabold text-slate-900 leading-tight">
                          {campaign.name}
                        </div>

                        <div className="text-[12px] text-slate-400 font-semibold mt-0.5">
                          {formatDate(campaign.createdAt)}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {campaign.organizerName}
                      </td>

                      <td className="py-4 px-6">
                        <div className="w-40 space-y-1">
                          <div className="flex items-center justify-between text-[12px] font-bold">
                            <span className="text-slate-900">
                              ${campaign.raisedAmount.toLocaleString()}
                            </span>

                            <span className="text-slate-500">
                              {Math.round(campaign.progress)}%
                            </span>
                          </div>

                          <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{
                                width: `${Math.min(campaign.progress, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-800">
                        {campaign.totalSupporters}
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={campaign.status} />
                      </td>

                      <td className="py-4 px-6 max-w-45">
                        {campaign.cancelledReason ? (
                          <span
                            className="block truncate text-slate-600 font-medium cursor-help"
                            title={campaign.cancelledReason}
                          >
                            {campaign.cancelledReason} 
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(campaign._id)}
                            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </button>

                          {/* Reject Campaign */}
                          <button
                            type="button"
                            onClick={() => handleRejectClick(campaign._id)}
                            disabled={
                              campaign.status.toLowerCase() !== "active"
                            }
                            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            title={
                              campaign.status.toLowerCase() === "active"
                                ? "Reject Campaign"
                                : "Only active campaigns can be rejected"
                            }
                          >
                            <Ban className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isTableLoading && !isError && campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 font-semibold"
                  >
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-bold text-slate-400">
              Showing{" "}
              <span className="text-slate-700">
                {(meta.page - 1) * meta.limit + 1}–
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of <span className="text-slate-700">{meta.total}</span> campaigns
              {isFetching && (
                <span className="ml-2 text-slate-400">(updating...)</span>
              )}
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isTableLoading}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                Prev
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce<number[]>((acc, p) => {
                    if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1); // gap marker
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === -1 ? (
                      <span key={`gap-${idx}`} className="px-1 text-slate-300">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        disabled={p === page || isTableLoading}
                        className={`min-w-7 rounded-lg px-2 py-1.5 text-[12px] font-bold transition-colors duration-200 ${
                          p === page
                            ? "bg-indigo-600 text-white"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Loading */}
            {isDetailLoading && !detail && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="mb-2 size-6 animate-spin" />

                <span className="text-sm font-semibold">
                  Loading campaign...
                </span>
              </div>
            )}

            {/* Error */}
            {!isDetailLoading && !detail && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="text-sm font-semibold text-rose-500">
                  Couldn&apos;t load this campaign.
                </span>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            )}

            {/* =========================
          VIEW DETAILS MODAL
      ========================== */}
            {detail && modalType === "details" && (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-400">
                        {detail.campaignCode}
                      </span>

                      <StatusBadge status={detail.status} />
                    </div>

                    <h2 className="mt-1 text-lg font-black leading-tight text-slate-950">
                      {detail.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  {/* Story */}
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Story
                    </h4>

                    <p className="mt-1 line-clamp-6 text-sm font-medium leading-relaxed text-slate-600">
                      {detail.story ||
                        "No description provided for this campaign."}
                    </p>
                  </div>

                  {/* Organizer + Launch Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                        <User className="size-3.5 text-slate-500" />
                        Organizer
                      </div>

                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {detail.organizerName}
                      </div>

                      {detail.organizerEmail && (
                        <div className="mt-0.5 truncate text-[12px] text-slate-500">
                          {detail.organizerEmail}
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                        <Calendar className="size-3.5 text-slate-500" />
                        Launch Date
                      </div>

                      <div className="mt-1 text-sm font-bold text-slate-800">
                        {formatDate(detail.publishedAt ?? detail.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                      <span>Progress Summary</span>

                      <span>{Math.round(detail.progress)}% achieved</span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${Math.min(detail.progress, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                          Raised
                        </div>

                        <div className="text-sm font-black text-emerald-600">
                          ${detail.raisedAmount.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                          Goal
                        </div>

                        <div className="text-sm font-black text-slate-800">
                          ${detail.goalAmount.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                          Orders
                        </div>

                        <div className="text-sm font-black text-indigo-600">
                          {detail.totalOrders ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {detail.status.toLowerCase() === "rejected" &&
                    detail.rejectedReason && (
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-rose-500">
                          Rejection Reason
                        </h4>

                        <p className="mt-1 text-sm font-medium text-rose-700">
                          {detail.rejectedReason}
                        </p>
                      </div>
                    )}

                  {/* Products */}
                  {detail.products && detail.products.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                        <Package className="size-3.5" />
                        Products ({detail.products.length})
                      </h4>

                      <div className="space-y-2">
                        {detail.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-slate-800">
                                {product.name}
                              </div>

                              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {product.productType}
                              </div>
                            </div>

                            <div className="shrink-0 text-sm font-black text-slate-800">
                              ${product.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* =========================
          REJECT MODAL
      ========================== */}
            {detail && modalType === "reject" && (
              <>
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-400">
                        {detail.campaignCode}
                      </span>

                      <StatusBadge status={detail.status} />
                    </div>

                    <h2 className="mt-1 text-lg font-black text-slate-950">
                      Reject Campaign
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isRejecting}
                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  {/* Campaign summary */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Campaign
                    </div>

                    <div className="mt-1 text-base font-black text-slate-900">
                      {detail.name}
                    </div>

                    <div className="mt-1 text-sm font-medium text-slate-500">
                      Organized by {detail.organizerName}
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2">
                      <Ban className="size-4 text-rose-600" />

                      <span className="text-sm font-bold text-rose-700">
                        Reject this campaign?
                      </span>
                    </div>

                    <p className="mt-1 text-[12px] font-medium leading-relaxed text-rose-600">
                      Please provide a reason. This reason will be saved with
                      the campaign rejection.
                    </p>
                  </div>

                  {/* Reason */}
                  <div>
                    <label
                      htmlFor="rejectedReason"
                      className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-slate-500"
                    >
                      Reason for rejection
                    </label>

                    <textarea
                      id="rejectedReason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. This campaign violates our content guidelines..."
                      rows={5}
                      disabled={isRejecting}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Reject Footer */}
                <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isRejecting}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectSubmit}
                    disabled={isRejecting || !rejectReason.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <Ban className="size-4" />
                        Confirm Reject
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignTableSkeleton() {
  const rows = Array.from({ length: LIMIT });

  return (
    <>
      {rows.map((_, index) => (
        <tr
          key={`campaign-skeleton-${index}`}
          className="animate-pulse border-b border-slate-100 last:border-0"
        >
          <td className="px-6 py-5">
            <div className="h-4 w-20 rounded bg-slate-200" />
          </td>

          <td className="px-6 py-5">
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
          </td>

          <td className="px-6 py-5">
            <div className="h-4 w-28 rounded bg-slate-200" />
          </td>

          <td className="px-6 py-5">
            <div className="w-40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-3 w-8 rounded bg-slate-100" />
              </div>

              <div className="h-2 w-full rounded-full bg-slate-200" />
            </div>
          </td>

          <td className="px-6 py-5">
            <div className="h-4 w-10 rounded bg-slate-200" />
          </td>

          <td className="px-6 py-5">
            <div className="h-7 w-20 rounded-full bg-slate-200" />
          </td>

          <td className="px-6 py-5">
            <div className="h-4 w-24 rounded bg-slate-200" />
          </td>

          <td className="px-6 py-5">
            <div className="flex justify-center gap-2">
              <div className="size-8 rounded-lg bg-slate-100" />
              <div className="size-8 rounded-lg bg-slate-100" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

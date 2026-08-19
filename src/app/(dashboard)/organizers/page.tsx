"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  X,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Award,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Users,
  Loader2,
  Ban,
  CheckCircle2,
} from "lucide-react";

import { useToast } from "@/components/ToastProvider";
import { Organizer, useGetAllOrganizersQuery } from "@/store/api/organizerApi";
import {
  AdminStatus,
  useUpdateAdminStatusMutation,
} from "@/store/api/adminApi";

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
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "UN"
  );
}

function getErrorMessage(err: unknown, fallback: string) {
  const message = (err as { data?: { message?: string } })?.data?.message;
  return message || fallback;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return (
      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600">
        Active
      </span>
    );
  }

  if (normalized === "pending") {
    return (
      <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[12px] font-bold text-amber-600">
        Pending
      </span>
    );
  }

  if (
    normalized === "suspended" ||
    normalized === "rejected" ||
    normalized === "blocked"
  ) {
    return (
      <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[12px] font-bold capitalize text-rose-600">
        {status}
      </span>
    );
  }

  return (
    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[12px] font-bold capitalize text-slate-500">
      {status}
    </span>
  );
}

function Avatar({
  organizer,
  size = "size-9",
}: {
  organizer: Organizer;
  size?: string;
}) {
  const imageSrc = organizer.profileImage ?? undefined;

  const [imageLoading, setImageLoading] = useState(Boolean(imageSrc));
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(imageSrc) && !imageError;

  if (!showImage) {
    return (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600`}
      >
        {getInitials(organizer.name)}
      </div>
    );
  }

  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-full bg-slate-100`}
    >
      {imageLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <Loader2 className="size-4 animate-spin text-slate-400" />
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={organizer.name}
        className={`h-full w-full object-cover transition-opacity duration-200 ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageLoading(false);
          setImageError(true);
        }}
      />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 rounded-full bg-slate-100" />
          <div className="h-3.5 w-28 rounded bg-slate-100" />
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="h-3.5 w-36 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3.5 w-6 rounded bg-slate-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3.5 w-16 rounded bg-slate-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-3.5 w-16 rounded bg-slate-100" />
      </td>

      <td className="px-6 py-4">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
      </td>

      <td className="px-6 py-4">
        <div className="mx-auto flex justify-center gap-2">
          <div className="size-8 rounded-lg bg-slate-100" />
          <div className="size-8 rounded-lg bg-slate-100" />
        </div>
      </td>
    </tr>
  );
}

export default function OrganizersPage() {
  const { success, error } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const [updateAdminStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminStatusMutation();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllOrganizersQuery({
      page,
      limit: LIMIT,
      searchTerm: debouncedSearch,
    });

  const organizers = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const isTableLoading = isLoading || isFetching;

  // Details-only modal
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
    null,
  );

  // Separate Block/Activate modal (with reason)
  const [statusTarget, setStatusTarget] = useState<Organizer | null>(null);
  const [statusReason, setStatusReason] = useState("");

  const handleViewDetails = (organizer: Organizer) => {
    setSelectedOrganizer(organizer);
  };

  const closeDetailsModal = () => {
    setSelectedOrganizer(null);
  };

  const openStatusModal = (organizer: Organizer) => {
    setStatusTarget(organizer);
    setStatusReason("");
  };

  const closeStatusModal = () => {
    setStatusTarget(null);
    setStatusReason("");
  };

  const nextStatusFor = (organizer: Organizer): AdminStatus =>
    organizer.status.toLowerCase() === "active" ? "blocked" : "active";

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;

    const trimmedReason = statusReason.trim();

    if (!trimmedReason) {
      error(
        "Reason Required",
        "Please provide a reason for this status change.",
      );
      return;
    }

    const nextStatus = nextStatusFor(statusTarget);
    const actionText = nextStatus === "blocked" ? "block" : "activate";

    try {
      const response = await updateAdminStatus({
        id: statusTarget.userId,
        status: nextStatus,
        reason: trimmedReason,
      }).unwrap();

      success(
        nextStatus === "blocked" ? "Organizer Blocked" : "Organizer Activated",
        response.message ||
          `The organizer has been ${actionText}d successfully.`,
      );

      // Keep details modal in sync if it's open for the same organizer
      setSelectedOrganizer((prev) =>
        prev && prev.userId === statusTarget.userId
          ? { ...prev, status: nextStatus }
          : prev,
      );

      refetch();
      closeStatusModal();
    } catch (err: unknown) {
      error(
        "Status Update Failed",
        getErrorMessage(
          err,
          `Failed to ${actionText} organizer. Please try again.`,
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Organizers
        </h1>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search organizers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Campaigns</th>
                <th className="px-6 py-4">Total Revenue</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {isTableLoading &&
                Array.from({ length: LIMIT }).map((_, i) => (
                  <SkeletonRow key={`skeleton-${i}`} />
                ))}

              {isError && !isTableLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center font-semibold text-rose-500"
                  >
                    Couldn&apos;t load organizers. Please try again.
                  </td>
                </tr>
              )}

              {!isTableLoading &&
                !isError &&
                organizers.map((org) => {
                  const isActive = org.status.toLowerCase() === "active";

                  return (
                    <tr
                      key={org.userId}
                      className="transition-colors duration-200 hover:bg-slate-50/30"
                    >
                      {/* Organizer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar organizer={org} />

                          <div className="font-extrabold leading-tight text-slate-900">
                            {org.name}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="font-extrabold leading-tight text-slate-900">
                          {org.email}
                        </div>

                        <div className="mt-0.5 text-[12px] font-semibold text-slate-400">
                          {org.phoneNumber ?? "—"}
                        </div>
                      </td>

                      {/* Campaigns */}
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {org.totalCampaign}
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${org.totalRevenue.toLocaleString()}
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {formatDate(org.joinedAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={org.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Details — details only, no status buttons inside */}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(org)}
                            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </button>

                          {/* Block / Activate — opens separate reason modal */}
                          <button
                            type="button"
                            onClick={() => openStatusModal(org)}
                            className={`rounded-lg p-2 transition-all duration-200 active:scale-95 ${
                              isActive
                                ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                            title={
                              isActive
                                ? "Block Organizer"
                                : "Activate Organizer"
                            }
                          >
                            {isActive ? (
                              <Ban className="size-4" />
                            ) : (
                              <CheckCircle2 className="size-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isTableLoading && !isError && organizers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center font-semibold text-slate-400"
                  >
                    No organizers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-bold text-slate-400">
              Showing{" "}
              <span className="text-slate-700">
                {(meta.page - 1) * meta.limit + 1}–
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of <span className="text-slate-700">{meta.total}</span> organizers
              {isFetching && !isLoading && (
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
                    if (acc.length && p - acc[acc.length - 1] > 1) {
                      acc.push(-1);
                    }

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
                disabled={page >= totalPages || isTableLoading}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Organizer Details Modal (view only) */}
      {selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeDetailsModal}
          />

          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Avatar organizer={selectedOrganizer} size="size-11" />

                <div>
                  <h2 className="text-base font-black leading-tight text-slate-950">
                    {selectedOrganizer.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[12px] font-bold capitalize text-slate-400">
                      {selectedOrganizer.role}
                    </span>

                    <StatusBadge status={selectedOrganizer.status} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDetailsModal}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Details */}
            <div className="mt-5 space-y-4">
              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Mail className="size-4 text-slate-400" />

                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </div>

                    <div className="font-bold text-slate-800">
                      {selectedOrganizer.email}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Phone className="size-4 text-slate-400" />

                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </div>

                    <div className="font-bold text-slate-800">
                      {selectedOrganizer.phoneNumber ?? "—"}
                    </div>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Calendar className="size-4 text-slate-400" />

                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                      Member Since
                    </div>

                    <div className="font-bold text-slate-800">
                      {formatDate(selectedOrganizer.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                    <Award className="size-3.5 text-slate-500" />
                    Campaigns
                  </div>

                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.totalCampaign}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                    <DollarSign className="size-3.5 text-slate-500" />
                    Total Revenue
                  </div>

                  <div className="mt-1 text-lg font-black text-emerald-600">
                    ${selectedOrganizer.totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                    <Users className="size-3.5 text-slate-500" />
                    Supporters
                  </div>

                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.supporters}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                    <ShoppingBag className="size-3.5 text-slate-500" />
                    Orders
                  </div>

                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.totalOrders}
                  </div>
                </div>
              </div>

              {/* Campaign Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active
                  </div>

                  <div className="mt-0.5 text-sm font-black text-emerald-600">
                    {selectedOrganizer.totalActiveCampaign}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Cancelled
                  </div>

                  <div className="mt-0.5 text-sm font-black text-slate-500">
                    {selectedOrganizer.cancelledCampaign}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Rejected
                  </div>

                  <div className="mt-0.5 text-sm font-black text-rose-500">
                    {selectedOrganizer.rejectedCampaign}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Footer — view only, status change happens in a separate modal */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={closeDetailsModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block / Activate Modal (with reason) */}
      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isUpdatingStatus && closeStatusModal()}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            {(() => {
              const nextStatus = nextStatusFor(statusTarget);
              const isBlockAction = nextStatus === "blocked";

              return (
                <>
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar organizer={statusTarget} size="size-11" />

                      <div>
                        <h2 className="text-base font-black leading-tight text-slate-950">
                          {isBlockAction
                            ? "Block Organizer"
                            : "Activate Organizer"}
                        </h2>

                        <p className="mt-0.5 text-[12px] font-semibold text-slate-400">
                          {statusTarget.name}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeStatusModal}
                      disabled={isUpdatingStatus}
                      className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                      <X className="size-5" />
                    </button>
                  </div>

                  <div className="mt-5 space-y-5">
                    {/* Warning */}
                    <div
                      className={`rounded-xl border p-4 ${
                        isBlockAction
                          ? "border-rose-200 bg-rose-50"
                          : "border-emerald-200 bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isBlockAction ? (
                          <Ban className="size-4 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="size-4 text-emerald-600" />
                        )}

                        <span
                          className={`text-sm font-bold ${
                            isBlockAction ? "text-rose-700" : "text-emerald-700"
                          }`}
                        >
                          {isBlockAction
                            ? "Block this organizer?"
                            : "Activate this organizer?"}
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-[12px] font-medium leading-relaxed ${
                          isBlockAction ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        Please provide a reason. This will be saved along with
                        the status change.
                      </p>
                    </div>

                    {/* Reason */}
                    <div>
                      <label
                        htmlFor="statusReason"
                        className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        Reason
                      </label>

                      <textarea
                        id="statusReason"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        placeholder={
                          isBlockAction
                            ? "e.g. Repeated policy violations..."
                            : "e.g. Issue resolved, reinstating access..."
                        }
                        rows={5}
                        disabled={isUpdatingStatus}
                        className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
                          isBlockAction
                            ? "border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={closeStatusModal}
                      disabled={isUpdatingStatus}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmStatusChange}
                      disabled={isUpdatingStatus || !statusReason.trim()}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isBlockAction
                          ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                          : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                      }`}
                    >
                      {isUpdatingStatus ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {isBlockAction ? "Blocking..." : "Activating..."}
                        </>
                      ) : (
                        <>
                          {isBlockAction ? (
                            <Ban className="size-4" />
                          ) : (
                            <CheckCircle2 className="size-4" />
                          )}
                          {isBlockAction ? "Confirm Block" : "Confirm Activate"}
                        </>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

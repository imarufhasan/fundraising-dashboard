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
} from "lucide-react";
import { Organizer, useGetAllOrganizersQuery } from "@/store/api/organizerApi";

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

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600 border border-emerald-100">
        Active
      </span>
    );
  }
  if (normalized === "pending") {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-[12px] font-bold text-amber-600 border border-amber-100">
        Pending
      </span>
    );
  }
  if (normalized === "suspended" || normalized === "rejected") {
    return (
      <span className="rounded-full bg-rose-50 px-3 py-1 text-[12px] font-bold text-rose-600 border border-rose-100 capitalize">
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

// Skeleton row that matches the table's column layout
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 rounded-full bg-slate-100" />
          <div className="h-3.5 w-28 rounded bg-slate-100" />
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="h-3.5 w-36 rounded bg-slate-100" />
        <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
      </td>
      <td className="py-4 px-6">
        <div className="h-3.5 w-6 rounded bg-slate-100" />
      </td>
      <td className="py-4 px-6">
        <div className="h-3.5 w-16 rounded bg-slate-100" />
      </td>
      <td className="py-4 px-6">
        <div className="h-3.5 w-16 rounded bg-slate-100" />
      </td>
      <td className="py-4 px-6">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
      </td>
      <td className="py-4 px-6">
        <div className="mx-auto h-6 w-16 rounded bg-slate-100" />
      </td>
    </tr>
  );
}

export default function OrganizersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const { data, isLoading, isFetching, isError } = useGetAllOrganizersQuery({
    page,
    limit: LIMIT,
    searchTerm: debouncedSearch,
  });

  const organizers = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const isTableLoading = isLoading || isFetching;

  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(
    null,
  );

  const handleViewDetails = (organizer: Organizer) =>
    setSelectedOrganizer(organizer);

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Organizers
        </h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {/* Add Button */}
          {/* <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
          >
            <UserPlus className="size-4" />
            <span>Add Organizer</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Organizer</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Campaigns</th>
                <th className="py-4 px-6">Total Revenue</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {isTableLoading &&
                Array.from({ length: LIMIT }).map((_, i) => (
                  <SkeletonRow key={`skeleton-${i}`} />
                ))}

              {isError && !isLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-rose-500 font-semibold"
                  >
                    Couldn&apos;t load organizers. Please try again.
                  </td>
                </tr>
              )}

              {!isTableLoading &&
                !isError &&
                organizers.map((org) => (
                  <tr
                    key={org.userId}
                    className="transition-colors duration-200 hover:bg-slate-50/30"
                  >
                    {/* Name with avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar organizer={org} />
                        <div className="font-extrabold text-slate-900 leading-tight">
                          {org.name}
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-6">
                      <div className="text-slate-900 font-extrabold leading-tight">
                        {org.email}
                      </div>
                      <div className="text-[12px] text-slate-400 font-semibold mt-0.5">
                        {org.phoneNumber ?? "—"}
                      </div>
                    </td>

                    {/* Campaigns Count */}
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {org.totalCampaign}
                    </td>

                    {/* Total Revenue */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ${org.totalRevenue.toLocaleString()}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {formatDate(org.joinedAt)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={org.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(org)}
                          className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </button>
                        {/* <button
                          type="button"
                          onClick={() => handleDelete(org)}
                          className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-rose-600 active:scale-95"
                          title="Delete Organizer"
                        >
                          <Trash2 className="size-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}

              {!isTableLoading && !isError && organizers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400 font-semibold"
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
                disabled={page <= 1}
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
                    if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1);
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

      {/* Organizer Details Modal */}
      {selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedOrganizer(null)}
          />
          <div className="relative w-full max-w-md scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar organizer={selectedOrganizer} size="size-11" />
                <div>
                  <h2 className="text-base font-black text-slate-950 leading-tight">
                    {selectedOrganizer.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[12px] text-slate-400 font-bold capitalize">
                      {selectedOrganizer.role}
                    </span>
                    <StatusBadge status={selectedOrganizer.status} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrganizer(null)}
                className="rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="mt-5 space-y-4">
              <div className="space-y-3">
                {/* Email */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Mail className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </div>
                    <div className="text-slate-800 font-bold">
                      {selectedOrganizer.email}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Phone className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </div>
                    <div className="text-slate-800 font-bold">
                      {selectedOrganizer.phoneNumber ?? "—"}
                    </div>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Calendar className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      Member Since
                    </div>
                    <div className="text-slate-800 font-bold">
                      {formatDate(selectedOrganizer.joinedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign / Revenue Stats */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <Award className="size-3.5 text-slate-500" />
                    Campaigns
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.totalCampaign}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <DollarSign className="size-3.5 text-slate-500" />
                    Total Revenue
                  </div>
                  <div className="mt-1 text-lg font-black text-emerald-600">
                    ${selectedOrganizer.totalRevenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <Users className="size-3.5 text-slate-500" />
                    Supporters
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.supporters}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <ShoppingBag className="size-3.5 text-slate-500" />
                    Orders
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-900">
                    {selectedOrganizer.totalOrders}
                  </div>
                </div>
              </div>

              {/* Campaign breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Active
                  </div>
                  <div className="mt-0.5 text-sm font-black text-emerald-600">
                    {selectedOrganizer.totalActiveCampaign}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Cancelled
                  </div>
                  <div className="mt-0.5 text-sm font-black text-slate-500">
                    {selectedOrganizer.cancelledCampaign}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Rejected
                  </div>
                  <div className="mt-0.5 text-sm font-black text-rose-500">
                    {selectedOrganizer.rejectedCampaign}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedOrganizer(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
              >
                Close
              </button>
              <button
                type="button"
                className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 active:scale-95 ${
                  selectedOrganizer.status === "active"
                    ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                    : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                }`}
              >
                {selectedOrganizer.status === "active"
                  ? "Suspend Account"
                  : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

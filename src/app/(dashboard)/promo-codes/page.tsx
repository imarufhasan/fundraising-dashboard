"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Tag,
  X,
  ArrowUpDown,
  Loader2,
  XCircle,
  Calendar,
  Plus,
  Pencil,
  Copy,
  Check,
  Percent,
  DollarSign,
} from "lucide-react";

import {
  PromoCode,
  DiscountType,
  PromoCodeSortBy,
  PromoCodeSortOrder,
  useGetAllPromoCodesQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeMutation,
} from "@/store/api/promoCodeApi";
import Pagination from "@/components/ui/Pagination";
import { useToast } from "@/components/ToastProvider";
import { getErrorMessage } from "@/lib/utils/error-handler";

const LIMIT = 5;

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
  });
}

function isExpired(dateStr?: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}

function formatDiscount(type: DiscountType, value: number) {
  return type === "PERCENTAGE" ? `${value}%` : `$${value.toFixed(2)}`;
}

function DiscountBadge({ type }: { type: DiscountType }) {
  if (type === "PERCENTAGE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
        <Percent className="size-3" />
        Percentage
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
      <DollarSign className="size-3" />
      Fixed
    </span>
  );
}

function StatusBadge({
  isActive,
  expiresAt,
}: {
  isActive: boolean;
  expiresAt?: string;
}) {
  if (isExpired(expiresAt)) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-500 border border-slate-200">
        Expired
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600 border border-emerald-100">
        Active
      </span>
    );
  }

  return (
    <span className="rounded-full bg-rose-50 px-3 py-1 text-[12px] font-bold text-rose-600 border border-rose-100">
      Inactive
    </span>
  );
}

function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy code"
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-black tracking-wide text-slate-700 transition-colors hover:bg-slate-100"
    >
      <Tag className="size-3.5 text-slate-400" />
      {code}
      {copied ? (
        <Check className="size-3 text-emerald-500" />
      ) : (
        <Copy className="size-3 text-slate-400" />
      )}
    </button>
  );
}

type DiscountFilter = "all" | DiscountType;
type StatusFilter = "all" | "active" | "inactive";

type PromoFormState = {
  code: string;
  discountType: DiscountType;
  discountValue: string;
  usageLimit: string;
  expiresAt: string;
};

const emptyForm: PromoFormState = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  usageLimit: "",
  expiresAt: "",
};

function toDateInputValue(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
}

export default function PromoCodesPage() {
  const { success, error: showError } = useToast();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<PromoCodeSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<PromoCodeSortOrder>("desc");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const isActiveParam =
    statusFilter === "all" ? undefined : statusFilter === "active";
  const discountTypeParam =
    discountFilter === "all" ? undefined : discountFilter;

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllPromoCodesQuery({
      page,
      limit: LIMIT,
      searchTerm: debouncedSearch,
      sortBy,
      sortOrder,
    //   discountType: discountTypeParam,
    //   isActive: isActiveParam,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

  const promoCodes = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;

  const isTableLoading = isLoading || isFetching;

  const resetFilters = () => {
    setSearchTerm("");
    setDiscountFilter("all");
    setStatusFilter("all");
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

  // ---------- Create / Edit modal ----------

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [form, setForm] = useState<PromoFormState>(emptyForm);
  const [formError, setFormError] = useState("");

  const [createPromoCode, { isLoading: isCreating }] =
    useCreatePromoCodeMutation();
  const [updatePromoCode, { isLoading: isUpdating }] =
    useUpdatePromoCodeMutation();

  const isSaving = isCreating || isUpdating;

  const openCreateModal = () => {
    setModalMode("create");
    setEditingPromo(null);
    setForm(emptyForm);
    setFormError("");
  };

  const openEditModal = (promo: PromoCode) => {
    setModalMode("edit");
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: String(promo.discountValue),
      usageLimit: String(promo.usageLimit),
      expiresAt: toDateInputValue(promo.expiresAt),
    });
    setFormError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingPromo(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async () => {
    const trimmedCode = form.code.trim();
    const discountValueNum = Number(form.discountValue);
    const usageLimitNum = Number(form.usageLimit);

    if (!trimmedCode) {
      setFormError("Promo code is required.");
      return;
    }

    if (!form.discountValue || Number.isNaN(discountValueNum) || discountValueNum <= 0) {
      setFormError("Enter a valid discount value.");
      return;
    }

    if (form.discountType === "PERCENTAGE" && discountValueNum > 100) {
      setFormError("Percentage discount cannot exceed 100.");
      return;
    }

    if (!form.usageLimit || Number.isNaN(usageLimitNum) || usageLimitNum <= 0) {
      setFormError("Enter a valid usage limit.");
      return;
    }

    if (!form.expiresAt) {
      setFormError("Expiry date is required.");
      return;
    }

    const payload = {
      code: trimmedCode.toUpperCase(),
      discountType: form.discountType,
      discountValue: discountValueNum,
      usageLimit: usageLimitNum,
      expiresAt: new Date(`${form.expiresAt}T23:59:59.000Z`).toISOString(),
    };

    console.log("create promo: ", payload);
    

    try {
      if (modalMode === "create") {
        const res = await createPromoCode(payload).unwrap();
        success(
          "Promo Code Created",
          res.message || "The promo code has been created successfully.",
        );
      } else if (modalMode === "edit" && editingPromo) {
        const res = await updatePromoCode({
          id: editingPromo._id,
          body: payload,
        }).unwrap();
        success(
          "Promo Code Updated",
          res.message || "The promo code has been updated successfully.",
        );
      }

      refetch();
      closeModal();
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save promo code.");
      setFormError(message);
      showError("Save Failed", message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Tag className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Promo Codes
            </h1>

            <p className="text-sm font-medium text-slate-400">
              Manage discount codes and usage limits
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="size-4" />
            New Code
          </button>
        </div>
      </div>

      {/* Stats + Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Promo Codes
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">{total}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Discount type filter */}
          {/* <select
            value={discountFilter}
            onChange={(e) => {
              setDiscountFilter(e.target.value as DiscountFilter);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select> */}

          {/* Status filter */}
          {/* <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}

          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as PromoCodeSortBy);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="createdAt">Sort: Date Created</option>
            <option value="updatedAt">Sort: Date Updated</option>
            <option value="discountValue">Sort: Discount Value</option>
            <option value="usedCount">Sort: Used Count</option>
            <option value="expiresAt">Sort: Expiry Date</option>
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
              className="w-30 border-0 bg-transparent text-[12px] font-bold text-slate-600 outline-none"
            />

            <span className="text-slate-300">–</span>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="w-30 border-0 bg-transparent text-[12px] font-bold text-slate-600 outline-none"
            />
          </div>

          {(searchTerm ||
            discountFilter !== "all" ||
            statusFilter !== "all" ||
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
            Failed to load promo codes.
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
        <PromoCodesSkeleton />
      ) : (
        !isError && (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4">Usage</th>
                      <th className="px-6 py-4">Expires</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                    {promoCodes.map((promo) => (
                      <tr
                        key={promo._id}
                        className="transition-colors duration-200 hover:bg-slate-50/30"
                      >
                        <td className="px-6 py-4">
                          <CodeChip code={promo.code} />
                        </td>

                        <td className="px-6 py-4">
                          <DiscountBadge type={promo.discountType} />
                        </td>

                        <td className="px-6 py-4 font-black text-slate-900">
                          {formatDiscount(promo.discountType, promo.discountValue)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="w-28 space-y-1">
                            <div className="flex items-center justify-between text-[12px] font-bold">
                              <span className="text-slate-800">
                                {promo.usedCount}/{promo.usageLimit}
                              </span>
                            </div>

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-indigo-600"
                                style={{
                                  width: `${Math.min(
                                    (promo.usedCount / promo.usageLimit) * 100,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-[12px] font-bold text-slate-500">
                          {formatDate(promo.expiresAt)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge
                            isActive={promo.isActive}
                            expiresAt={promo.expiresAt}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(promo)}
                              className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                              title="Edit Promo Code"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {promoCodes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <Tag className="mx-auto size-8 text-slate-300" />

                          <p className="mt-3 text-sm font-bold text-slate-700">
                            No promo codes found.
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
                <PromoPagination
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
              {promoCodes.map((promo) => (
                <div
                  key={promo._id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <CodeChip code={promo.code} />

                    <button
                      type="button"
                      onClick={() => openEditModal(promo)}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <DiscountBadge type={promo.discountType} />
                    <StatusBadge
                      isActive={promo.isActive}
                      expiresAt={promo.expiresAt}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Discount
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {formatDiscount(promo.discountType, promo.discountValue)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Usage
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {promo.usedCount}/{promo.usageLimit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Expires
                    </p>

                    <p className="mt-0.5 text-[12px] font-bold text-slate-600">
                      {formatDate(promo.expiresAt)}
                    </p>
                  </div>
                </div>
              ))}

              {promoCodes.length === 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
                  <Tag className="mx-auto size-8 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    No promo codes found.
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              )}

              {meta && meta.total > 0 && (
                <PromoPagination
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

      {/* Create / Edit Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-black text-slate-900">
                {modalMode === "create" ? "New Promo Code" : "Edit Promo Code"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {formError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">
                  Code
                </label>

                <input
                  type="text"
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                  disabled={isSaving}
                  placeholder="e.g. SUMMER25"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-800 outline-none transition-colors placeholder:font-medium placeholder:normal-case placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    Discount Type
                  </label>

                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountType: e.target.value as DiscountType,
                      }))
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    Value {form.discountType === "PERCENTAGE" ? "(%)" : "($)"}
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountValue: e.target.value,
                      }))
                    }
                    disabled={isSaving}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none transition-colors placeholder:font-medium placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        usageLimit: e.target.value,
                      }))
                    }
                    disabled={isSaving}
                    placeholder="100"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none transition-colors placeholder:font-medium placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    Expires On
                  </label>

                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : modalMode === "create" ? (
                  "Create Code"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromoPagination({
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
        of <span className="text-slate-700">{total}</span> promo codes
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

function PromoCodesSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="grid grid-cols-7 gap-6">
            {Array.from({ length: 7 }).map((_, index) => (
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
              className="grid grid-cols-7 items-center gap-6 px-6 py-5"
            >
              <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
              <div className="mx-auto h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="grid gap-4 p-4 lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
            </div>

            <div className="mt-3 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
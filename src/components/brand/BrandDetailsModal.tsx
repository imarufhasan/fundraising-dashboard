// components/brand/BrandDetailsModal.tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, Palette, UserRound } from "lucide-react";

import { Brand } from "@/store/api/brandApi";
import ExpandableTags from "@/components/ui/ExpandableTags";

const formatDate = (date: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: number | string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) return "$0.00";

  return `$${amount.toFixed(2)}`;
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";

    case "pending":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";

    case "completed":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20";

    case "cancelled":
    case "canceled":
    case "failed":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";

    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20";
  }
};

type BrandDetailsModalProps = {
  brand: Brand | null;
  onClose: () => void;
};

export default function BrandDetailsModal({
  brand,
  onClose,
}: BrandDetailsModalProps) {
  useEffect(() => {
    if (!brand) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [brand, onClose]);

  if (!brand) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {brand.brandLogo ? (
                <Image
                  src={brand.brandLogo}
                  alt={brand.businessName}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              ) : brand.brandImage ? (
                <Image
                  src={brand.brandImage}
                  alt={brand.businessName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <Palette className="size-6" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {brand.businessName || "Unnamed Brand"}
              </h2>

              <p className="text-sm text-slate-500">
                {brand.sellingItem || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                brand.status,
              )}`}
            >
              {brand.status || "Unknown"}
            </span>

            <span className="text-xs text-slate-400">ID: {brand._id}</span>
          </div>

          {/* Organizer */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Organizer
            </p>

            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-600">
                {brand.organizerProfileImage ? (
                  <Image
                    src={brand.organizerProfileImage}
                    alt={brand.organizerName}
                    width={44}
                    height={44}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {brand.organizerName || "—"}
                </p>

                <p className="text-xs text-slate-500">
                  {brand.organizerEmail || "—"}
                </p>

                {brand.organizerPhoneNumber && (
                  <p className="text-xs text-slate-500">
                    {brand.organizerPhoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Brand Style</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {brand.brandStyle || "—"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Budget</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatCurrency(brand.budget)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Builder Fee</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatCurrency(brand.brandBuilderFee)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Paid Amount</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatCurrency(brand.paidAmount)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Created</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(brand.createdAt)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Paid At</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(brand.paidAt)}
              </p>
            </div>
          </div>

          {/* Products — expandable */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Products ({brand.products?.length ?? 0})
            </p>

            <ExpandableTags
              items={brand.products ?? []}
              visibleCount={6}
              tagClassName="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600"
            />
          </div>

          {/* Colors */}
          {brand.colors?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Colors
              </p>

              <div className="flex flex-wrap gap-2">
                {brand.colors.map((color) => (
                  <div
                    key={color}
                    className="flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1"
                  >
                    <span
                      className="size-4 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium text-slate-600">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brand image preview */}
          {brand.brandImage && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Brand Image
              </p>

              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <Image
                  src={brand.brandImage}
                  alt={brand.businessName}
                  fill
                  className="object-contain"
                  sizes="600px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer — view only */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

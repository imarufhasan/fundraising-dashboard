// components/brand/BrandCompleteModal.tsx
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X, Palette, CheckCircle2, Loader2 } from "lucide-react";

import { Brand, useCompleteBrandBuilderMutation } from "@/store/api/brandApi";
import { useToast } from "../ToastProvider";

type BrandCompleteModalProps = {
  brand: Brand | null;
  onClose: () => void;
  onCompleted?: () => void;
};

export default function BrandCompleteModal({
  brand,
  onClose,
  onCompleted,
}: BrandCompleteModalProps) {
  const { success, error } = useToast();

  const [completeBrandBuilder, { isLoading: isCompleting }] =
    useCompleteBrandBuilderMutation();

  useEffect(() => {
    if (!brand) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCompleting) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [brand, onClose, isCompleting]);

  if (!brand) return null;

  const isAlreadyCompleted = brand.status?.toLowerCase() === "completed";

  const handleConfirm = async () => {
    if (isAlreadyCompleted) return;

    try {
      const res = await completeBrandBuilder(brand._id).unwrap();

      success(
        "Brand Builder Completed",
        res.message || "Brand builder marked as complete successfully.",
      );

      onCompleted?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to complete brand builder. Please try again.";

      error("Brand Builder Failed", message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={() => !isCompleting && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {brand.brandLogo ? (
                <Image
                  src={brand.brandLogo}
                  alt={brand.businessName}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              ) : brand.brandImage ? (
                <Image
                  src={brand.brandImage}
                  alt={brand.businessName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <Palette className="size-5" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-base font-black leading-tight text-slate-900">
                Complete Brand Builder
              </h2>

              <p className="mt-0.5 text-sm font-medium text-slate-500">
                {brand.businessName || "Unnamed Brand"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCompleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isAlreadyCompleted ? (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <CheckCircle2 className="size-5 shrink-0 text-indigo-600" />
              <p className="text-sm font-semibold text-indigo-700">
                This brand builder request has already been marked as
                completed.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">
                  Mark this brand builder as completed?
                </span>
              </div>

              <p className="mt-1 text-[12px] font-medium leading-relaxed text-emerald-600">
                This will update the status to &quot;Completed&quot; and
                notify the organizer. This action cannot be undone.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isCompleting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAlreadyCompleted ? "Close" : "Cancel"}
          </button>

          {!isAlreadyCompleted && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isCompleting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Confirm Complete
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
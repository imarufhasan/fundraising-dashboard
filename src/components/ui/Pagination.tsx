"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

const getPageList = (
  current: number,
  total: number,
): (number | "ellipsis")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <div className="flex items-center gap-1.5">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={disabled || page === 1}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-3.5" />
        <span>Prev</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 px-1">
        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-[12px] font-bold text-slate-300"
              >
                …
              </span>
            );
          }

          const isActive = item === page;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              disabled={disabled || isActive}
              className={`min-w-7 rounded-lg px-2 py-1.5 text-[12px] font-bold transition-colors duration-200 disabled:cursor-not-allowed ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={disabled || page >= totalPages}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>Next</span>
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

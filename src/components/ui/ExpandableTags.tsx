// components/ui/ExpandableTags.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ExpandableTagsProps = {
  items: string[];
  visibleCount?: number;
  emptyText?: string;
  tagClassName?: string;
};

export default function ExpandableTags({
  items,
  visibleCount = 3,
  emptyText = "—",
  tagClassName = "rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600",
}: ExpandableTagsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!items?.length) {
    return <span className="text-sm text-slate-400">{emptyText}</span>;
  }

  const hasMore = items.length > visibleCount;
  const visibleItems = expanded ? items : items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleCount;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {visibleItems.map((item) => (
          <span key={item} className={tagClassName}>
            {item}
          </span>
        ))}

        {hasMore && !expanded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            +{hiddenCount} more
            <ChevronDown className="size-3" />
          </button>
        )}
      </div>

      {hasMore && expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          className="inline-flex w-fit items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-50"
        >
          Show less
          <ChevronUp className="size-3" />
        </button>
      )}
    </div>
  );
}

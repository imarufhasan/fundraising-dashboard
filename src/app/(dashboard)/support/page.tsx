"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Search,
  Send,
  X,
} from "lucide-react";

import {
  SupportReply,
  SupportStatus,
  SupportTicket,
  useGetSupportTicketsQuery,
  useMarkSupportInProgressMutation,
  useMarkSupportResolvedMutation,
  useSendSupportReplyMutation,
} from "@/store/api/supportApi";

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const STATUS_BADGE_CLASS: Record<SupportStatus, string> = {
  open: "bg-rose-50 text-rose-600 border-rose-100",
  in_progress: "bg-amber-50 text-amber-600 border-amber-100",
  resolved: "bg-slate-50 text-slate-500 border-slate-100",
};

type ConversationMessage = {
  sender: "user" | "admin";
  text: string;
  timestamp: string;
};

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Narrows RTK Query's error union down to a readable message.
function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof (error.data as { message?: unknown }).message === "string"
  ) {
    return (error.data as { message: string }).message;
  }

  if (
    error &&
    typeof error === "object" &&
    "error" in error &&
    typeof (error as { error?: unknown }).error === "string"
  ) {
    return (error as { error: string }).error;
  }

  return fallback;
}

function StatusBadge({
  status,
  size = "md",
}: {
  status: SupportStatus;
  size?: "sm" | "md";
}) {
  const sizeClass =
    size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[12px]";

  return (
    <span
      className={`rounded-full border font-bold ${sizeClass} ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  // Replies aren't returned by GET /support/all, so replies sent during this
  // session are tracked locally and merged with the ticket's original message.
  const [localReplies, setLocalReplies] = useState<
    Record<string, SupportReply[]>
  >({});

  const { data, isLoading, isFetching, isError, refetch } =
    useGetSupportTicketsQuery({
      page,
      limit: PAGE_SIZE,
    });

  const [sendReply, { isLoading: isSendingReply }] =
    useSendSupportReplyMutation();
  const [markInProgress, { isLoading: isMarkingInProgress }] =
    useMarkSupportInProgressMutation();
  const [markResolved, { isLoading: isMarkingResolved }] =
    useMarkSupportResolvedMutation();

  const tickets = data?.data ?? [];
  const meta = data?.meta;

  const filteredTickets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tickets;

    return tickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(term) ||
        t.ticketNo.toLowerCase().includes(term) ||
        (t.userName ?? t.email).toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term),
    );
  }, [tickets, searchTerm]);

  const selectedTicket: SupportTicket | null =
    tickets.find((t) => t.supportId === selectedTicketId) ?? null;

  const conversation: ConversationMessage[] = useMemo(() => {
    if (!selectedTicket) return [];

    const replies = localReplies[selectedTicket.supportId] ?? [];

    return [
      {
        sender: "user" as const,
        text: selectedTicket.message,
        timestamp: formatDateTime(selectedTicket.createdAt),
      },
      ...replies.map((reply) => ({
        sender: "admin" as const,
        text: reply.replyMessage,
        timestamp: formatDateTime(reply.createdAt),
      })),
    ];
  }, [selectedTicket, localReplies]);

  const openTicket = (ticket: SupportTicket) => {
    setSelectedTicketId(ticket.supportId);
    setReplyText("");
    setActionError(null);
  };

  const closeModal = () => {
    setSelectedTicketId(null);
    setReplyText("");
    setActionError(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setActionError(null);

    try {
      const res = await sendReply({
        supportId: selectedTicket.supportId,
        replyMessage: replyText.trim(),
      }).unwrap();

      setLocalReplies((prev) => ({
        ...prev,
        [selectedTicket.supportId]: [
          ...(prev[selectedTicket.supportId] ?? []),
          res.data,
        ],
      }));

      setReplyText("");

      // Sending the first reply moves an open ticket into progress.
      if (selectedTicket.status === "open") {
        await markInProgress(selectedTicket.supportId)
          .unwrap()
          .catch(() => {
            // Reply already succeeded; a failed status bump isn't fatal.
          });
      }
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Failed to send reply. Please try again."),
      );
    }
  };

  const handleMarkInProgress = async (ticketId: string) => {
    setActionError(null);
    try {
      await markInProgress(ticketId).unwrap();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to update ticket status."));
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    setActionError(null);
    try {
      await markResolved(ticketId).unwrap();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to resolve ticket."));
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          Support Tickets
        </h1>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <SupportTableSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Failed to load support tickets
          </h2>
          <p className="max-w-md text-sm text-slate-500">
            Something went wrong while loading tickets.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-1 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.supportId}
                    className="transition-colors duration-200 hover:bg-slate-50/30"
                  >
                    <td className="px-6 py-4 font-bold text-slate-500">
                      {t.ticketNo}
                    </td>

                    <td className="max-w-70 truncate px-6 py-4 font-extrabold leading-tight text-slate-900">
                      {t.subject}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-500">
                      {t.userName ?? t.email}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-500">
                      {t.campaignName ?? "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-400">
                      {formatDateShort(t.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => openTicket(t)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95"
                      >
                        <MessageSquare className="size-3.5" />
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}

                {!filteredTickets.length && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center font-semibold text-slate-400"
                    >
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="divide-y divide-slate-100 sm:hidden">
            {filteredTickets.map((t) => (
              <div key={t.supportId} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-400">
                      {t.ticketNo}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
                      {t.subject}
                    </div>
                    <div className="mt-0.5 truncate text-xs font-medium text-slate-500">
                      {t.userName ?? t.email}
                      {t.campaignName ? ` • ${t.campaignName}` : ""}
                    </div>
                  </div>

                  <StatusBadge status={t.status} size="sm" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {formatDateShort(t.createdAt)}
                  </span>

                  <button
                    type="button"
                    onClick={() => openTicket(t)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95"
                  >
                    <MessageSquare className="size-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            ))}

            {!filteredTickets.length && (
              <div className="py-12 text-center text-sm font-semibold text-slate-400">
                No tickets found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-semibold text-slate-400">
                Page {meta.page} of {meta.totalPages} • {meta.total} tickets
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <button
                  type="button"
                  disabled={page >= meta.totalPages || isFetching}
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          />

          <div className="relative flex max-h-[85vh] w-full max-w-lg scale-100 flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200 sm:p-6">
            {/* Header */}
            <div className="shrink-0 border-b border-slate-100 pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">
                      {selectedTicket.ticketNo}
                    </span>
                    <StatusBadge status={selectedTicket.status} size="sm" />
                  </div>

                  <h2 className="mt-1 truncate text-base font-black leading-tight text-slate-950">
                    {selectedTicket.subject}
                  </h2>

                  <div className="mt-0.5 truncate text-[12px] font-semibold text-slate-500">
                    User:{" "}
                    <b className="text-slate-700">
                      {selectedTicket.userName ?? selectedTicket.email}
                    </b>
                    {selectedTicket.campaignName && (
                      <>
                        {" "}
                        • Campaign:{" "}
                        <b className="text-slate-700">
                          {selectedTicket.campaignName}
                        </b>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="shrink-0 rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {actionError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-600">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Conversation Log (Scrollable) */}
            <div className="my-2 flex-1 space-y-3.5 overflow-y-auto py-4 pr-1 scrollbar-thin">
              {conversation.map((msg, index) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm font-semibold leading-relaxed ${
                        isAdmin
                          ? "rounded-tr-none bg-indigo-600 text-white"
                          : "rounded-tl-none bg-slate-100 text-slate-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 px-1 text-[9px] font-bold text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box / Actions */}
            <div className="shrink-0 space-y-3 border-t border-slate-100 pt-4">
              {selectedTicket.status !== "resolved" ? (
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    disabled={isSendingReply}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim()}
                    className="flex items-center justify-center rounded-xl bg-indigo-600 p-2 px-3.5 text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Send Reply"
                  >
                    {isSendingReply ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-2 text-center text-sm font-bold italic text-slate-400">
                  This ticket has been resolved.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTicket.status === "open" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkInProgress(selectedTicket.supportId)
                      }
                      disabled={isMarkingInProgress}
                      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-600 transition-colors duration-200 hover:bg-amber-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isMarkingInProgress ? "Updating…" : "Mark In Progress"}
                    </button>
                  )}

                  {selectedTicket.status !== "resolved" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleResolveTicket(selectedTicket.supportId)
                      }
                      disabled={isMarkingResolved}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 transition-colors duration-200 hover:bg-emerald-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isMarkingResolved ? "Resolving…" : "Resolve Ticket"}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function SupportTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-16 animate-pulse rounded bg-slate-200"
              />
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: 5 }).map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-7 items-center gap-4 px-6 py-4"
            >
              <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
              <div className="mx-auto h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="divide-y divide-slate-100 sm:hidden">
        {Array.from({ length: 4 }).map((_, row) => (
          <div key={row} className="space-y-3 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
              <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

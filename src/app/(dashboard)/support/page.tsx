"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Search, CheckCircle, Clock, AlertCircle } from "lucide-react";

// Types
type Ticket = {
  id: string;
  subject: string;
  user: string;
  campaign: string;
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  messages: Array<{
    sender: "user" | "admin";
    text: string;
    timestamp: string;
  }>;
};

// Seed Support Tickets matching screenshot exactly
const initialTickets: Ticket[] = [
  {
    id: "TKT-512",
    subject: "Order not delivered",
    user: "Maria Santos",
    campaign: "Lincoln Playground",
    status: "Open",
    date: "Jun 23",
    messages: [
      {
        sender: "user",
        text: "Hello, I placed an order for the Lincoln Playground campaign fundraiser last week but it hasn't arrived yet. Can you please check the shipping status?",
        timestamp: "Jun 23, 9:00am",
      },
    ],
  },
  {
    id: "TKT-511",
    subject: "Wrong size received",
    user: "David Kim",
    campaign: "Lincoln Playground",
    status: "In Progress",
    date: "Jun 22",
    messages: [
      {
        sender: "user",
        text: "I received my shirts but they are size Medium instead of Large. Can I exchange them?",
        timestamp: "Jun 22, 2:15pm",
      },
      {
        sender: "admin",
        text: "Hi David, we are looking into this with the supplier and will send your replacement details shortly.",
        timestamp: "Jun 22, 4:00pm",
      },
    ],
  },
  {
    id: "TKT-510",
    subject: "Refund request",
    user: "James O'Brien",
    campaign: "Youth Soccer Uniforms",
    status: "Open",
    date: "Jun 22",
    messages: [
      {
        sender: "user",
        text: "I accidentally made a double payment. I need a refund of $50 for the second donation.",
        timestamp: "Jun 22, 10:10am",
      },
    ],
  },
  {
    id: "TKT-509",
    subject: "Campaign page not loading",
    user: "Green Roots Org.",
    campaign: "Community Garden",
    status: "Resolved",
    date: "Jun 20",
    messages: [
      {
        sender: "user",
        text: "Our community garden page shows a blank screen when we click the link.",
        timestamp: "Jun 20, 11:00am",
      },
      {
        sender: "admin",
        text: "Hi Green Roots team, this bug has been fixed. The page should load normally now.",
        timestamp: "Jun 20, 11:45am",
      },
    ],
  },
  {
    id: "TKT-508",
    subject: "Payout delay inquiry",
    user: "Jennifer Park",
    campaign: "Lincoln Playground",
    status: "Resolved",
    date: "Jun 18",
    messages: [
      {
        sender: "user",
        text: "When will the funds raised for Lincoln Playground playground campaign be transferred?",
        timestamp: "Jun 18, 9:30am",
      },
      {
        sender: "admin",
        text: "Payout has been processed successfully. Funds should reflect in your registered bank account in 2-3 business days.",
        timestamp: "Jun 18, 2:00pm",
      },
    ],
  },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Reply message text
  const [replyText, setReplyText] = useState("");

  // Search Filter
  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Send Reply Action
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      sender: "admin" as const,
      text: replyText,
      timestamp: "Just Now",
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "In Progress" as const, // Change status to in-progress when admin replies
          messages: [...t.messages, newReply],
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setReplyText("");
    
    // Keep selection updated
    const updatedSelected = updatedTickets.find((t) => t.id === selectedTicket.id);
    if (updatedSelected) {
      setSelectedTicket(updatedSelected);
    }
  };

  // Resolve Ticket Quick Action
  const handleResolveTicket = (ticketId: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: "Resolved" as const };
      }
      return t;
    });
    setTickets(updated);
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: "Resolved" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support Tickets</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tickets List Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Ticket</th>
                <th className="py-4 px-6">Subject</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Campaign</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  className="transition-colors duration-200 hover:bg-slate-50/30"
                >
                  {/* Ticket ID */}
                  <td className="py-4 px-6 font-bold text-slate-500">{t.id}</td>

                  {/* Subject */}
                  <td className="py-4 px-6 font-extrabold text-slate-900 leading-tight">
                    {t.subject}
                  </td>

                  {/* User */}
                  <td className="py-4 px-6 text-slate-500 font-medium">{t.user}</td>

                  {/* Campaign */}
                  <td className="py-4 px-6 text-slate-500 font-medium">{t.campaign}</td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {t.status === "Open" && (
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-600 border border-rose-100">
                        Open
                      </span>
                    )}
                    {t.status === "In Progress" && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600 border border-amber-100">
                        In Progress
                      </span>
                    )}
                    {t.status === "Resolved" && (
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-100">
                        Resolved
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-slate-400 font-medium">{t.date}</td>

                  {/* Reply Button */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95"
                    >
                      <MessageSquare className="size-3.5" />
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedTicket(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{selectedTicket.id}</span>
                  {selectedTicket.status === "Open" && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-100">
                      Open
                    </span>
                  )}
                  {selectedTicket.status === "In Progress" && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-100">
                      In Progress
                    </span>
                  )}
                  {selectedTicket.status === "Resolved" && (
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 border border-slate-100">
                      Resolved
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-base font-black text-slate-950 leading-tight">
                  {selectedTicket.subject}
                </h2>
                <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                  User: <b className="text-slate-700">{selectedTicket.user}</b> • Campaign: <b className="text-slate-700">{selectedTicket.campaign}</b>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Conversation Log (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 my-2 pr-1 scrollbar-thin">
              {selectedTicket.messages.map((msg, index) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs font-semibold leading-relaxed ${
                        isAdmin
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 text-[9px] font-bold text-slate-400 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box / Actions */}
            <div className="border-t border-slate-100 pt-4 shrink-0 space-y-3">
              {selectedTicket.status !== "Resolved" ? (
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response here..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 p-2 px-3.5 text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95 flex items-center justify-center"
                    title="Send Reply"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-2 text-xs font-bold text-slate-400 italic">
                  This ticket has been resolved. You can reopen it by responding below if needed.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2 pt-1">
                {selectedTicket.status !== "Resolved" ? (
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 transition-colors duration-200 hover:bg-emerald-100 active:scale-95"
                  >
                    Resolve Ticket
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = tickets.map((t) => {
                        if (t.id === selectedTicket.id) {
                          return { ...t, status: "Open" as const };
                        }
                        return t;
                      });
                      setTickets(updated);
                      setSelectedTicket({ ...selectedTicket, status: "Open" });
                    }}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition-colors duration-200 hover:bg-rose-100 active:scale-95"
                  >
                    Reopen Ticket
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
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

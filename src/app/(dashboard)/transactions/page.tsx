"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, AlertTriangle, Search, Filter } from "lucide-react";

// Types
type Transaction = {
  id: string;
  type: "Order" | "Donation" | "Payout" | "Chargeback";
  organizer: string;
  amount: number;
  fee: number;
  net: number;
  status: "Success" | "Pending" | "Failed" | "Disputed";
  date: string;
};

// Seed transactions matching screenshot exactly
const initialTransactions: Transaction[] = [
  {
    id: "TXN-8821",
    type: "Order",
    organizer: "Jennifer Park",
    amount: 45.0,
    fee: 1.8,
    net: 43.2,
    status: "Success",
    date: "Jun 23, 9:14am",
  },
  {
    id: "TXN-8820",
    type: "Donation",
    organizer: "Eastside Church",
    amount: 200.0,
    fee: 8.0,
    net: 192.0,
    status: "Success",
    date: "Jun 23, 8:52am",
  },
  {
    id: "TXN-8819",
    type: "Order",
    organizer: "Jennifer Park",
    amount: 28.0,
    fee: 1.12,
    net: 26.88,
    status: "Pending",
    date: "Jun 23, 8:30am",
  },
  {
    id: "TXN-8818",
    type: "Order",
    organizer: "Mike Torres",
    amount: 52.0,
    fee: 2.08,
    net: 49.92,
    status: "Failed",
    date: "Jun 22, 6:44pm",
  },
  {
    id: "TXN-8817",
    type: "Payout",
    organizer: "Jennifer Park",
    amount: 3200.0,
    fee: 0.0,
    net: 3200.0,
    status: "Success",
    date: "Jun 15, 10:00am",
  },
  {
    id: "TXN-8816",
    type: "Chargeback",
    organizer: "Oak Hill HOA",
    amount: 45.0,
    fee: 15.0,
    net: -60.0,
    status: "Disputed",
    date: "Jun 18, 2:30pm",
  },
  {
    id: "TXN-8815",
    type: "Donation",
    organizer: "Green Roots Org.",
    amount: 100.0,
    fee: 4.0,
    net: 96.0,
    status: "Success",
    date: "Jun 17, 11:20am",
  },
];

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [selectedTypeTab, setSelectedTypeTab] = useState<"All" | "Order" | "Donation" | "Payout" | "Chargeback">("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filters logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesTab = selectedTypeTab === "All" || t.type === selectedTypeTab;
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transactions</h1>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Gross Volume */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400">Gross Volume</span>
            <div className="text-2xl font-black text-slate-900">$3,670</div>
            <p className="text-[10px] text-slate-500 font-medium">All transactions</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <DollarSign className="size-5" />
          </div>
        </div>

        {/* Platform Fees */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400">Platform Fees</span>
            <div className="text-2xl font-black text-slate-900">$32.00</div>
            <p className="text-[10px] text-slate-500 font-medium">Earned this period</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <TrendingUp className="size-5" />
          </div>
        </div>

        {/* Disputes */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400">Disputes</span>
            <div className="text-2xl font-black text-slate-900">1</div>
            <p className="text-[10px] text-slate-500 font-medium">$45 chargeback</p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Main Filter Tabs & Search Bar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl w-fit">
            {(["All", "Order", "Donation", "Payout", "Chargeback"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTypeTab(tab)}
                className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all duration-200 ${
                  selectedTypeTab === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search TXN ID, Organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Organizer</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Fee</th>
                <th className="pb-3 pr-4">Net</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="transition-colors duration-200 hover:bg-slate-50/30">
                  {/* ID */}
                  <td className="py-4 pr-4 text-slate-500 font-bold">{tx.id}</td>

                  {/* Type Badge */}
                  <td className="py-4 pr-4">
                    {tx.type === "Order" && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
                        Order
                      </span>
                    )}
                    {tx.type === "Donation" && (
                      <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100">
                        Donation
                      </span>
                    )}
                    {tx.type === "Payout" && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                        Payout
                      </span>
                    )}
                    {tx.type === "Chargeback" && (
                      <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                        Chargeback
                      </span>
                    )}
                  </td>

                  {/* Organizer */}
                  <td className="py-4 pr-4 text-slate-500 font-medium">{tx.organizer}</td>

                  {/* Amount */}
                  <td className="py-4 pr-4 text-slate-900 font-bold">
                    ${tx.amount.toFixed(2)}
                  </td>

                  {/* Fee */}
                  <td className="py-4 pr-4 text-slate-500 font-medium">
                    ${tx.fee.toFixed(2)}
                  </td>

                  {/* Net */}
                  <td className={`py-4 pr-4 font-black ${tx.net < 0 ? "text-rose-600" : "text-slate-900"}`}>
                    {tx.net < 0 ? `$-${Math.abs(tx.net).toFixed(2)}` : `$${tx.net.toFixed(2)}`}
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-4">
                    {tx.status === "Success" && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                        Success
                      </span>
                    )}
                    {tx.status === "Pending" && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                        Pending
                      </span>
                    )}
                    {tx.status === "Failed" && (
                      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-100">
                        Failed
                      </span>
                    )}
                    {tx.status === "Disputed" && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                        Disputed
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-4 text-right text-slate-400 font-medium">{tx.date}</td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Eye, Flag, X, Search, Calendar, User, ShoppingBag, Percent, DollarSign, Award } from "lucide-react";

// Types
type Campaign = {
  id: string;
  name: string;
  date: string;
  organizer: string;
  raised: number;
  goal: number;
  percentage: number;
  orders: number;
  donors: number;
  status: "Active" | "Completed" | "Flagged";
  description?: string;
  email?: string;
};

// Seed campaigns matching the screenshot exactly + details for modal
const initialCampaigns: Campaign[] = [
  {
    id: "C-2841",
    name: "Lincoln Elementary Playground",
    date: "Jun 1",
    organizer: "Jennifer Park",
    raised: 8200,
    goal: 11880,
    percentage: 69,
    orders: 184,
    donors: 240,
    status: "Active",
    email: "jennifer.park@lincolnel.edu",
    description: "Raising funds for modern, safe, and accessible playground equipment at Lincoln Elementary School. This campaign supports slides, climbing frames, and safety surfacing for over 450 active students.",
  },
  {
    id: "C-2840",
    name: "Annual Food Drive 2025",
    date: "May 28",
    organizer: "Eastside Church",
    raised: 15600,
    goal: 20000,
    percentage: 78,
    orders: 342,
    donors: 410,
    status: "Active",
    email: "outreach@eastsidechurch.org",
    description: "Collecting resources to stock the regional community pantry ahead of the winter season. Your contributions support weekly distribution meals for vulnerable local families.",
  },
  {
    id: "C-2839",
    name: "Youth Soccer New Uniforms",
    date: "Jun 10",
    organizer: "Coach Mike Torres",
    raised: 3900,
    goal: 5000,
    percentage: 78,
    orders: 91,
    donors: 115,
    status: "Active",
    email: "m.torres@youthsoccer.org",
    description: "Funding new high-quality jerseys, training gear, and soccer balls for the Under-14 league teams ahead of the state championships this Fall.",
  },
  {
    id: "C-2838",
    name: "Community Garden Expansion",
    date: "Apr 15",
    organizer: "Green Roots Org.",
    raised: 6100,
    goal: 7922,
    percentage: 77,
    orders: 203,
    donors: 260,
    status: "Completed",
    email: "contact@greenroots.org",
    description: "Expanding layout and tools for public urban farming plots, introducing high-yield raised beds, composting bays, and educational workshops.",
  },
  {
    id: "C-2837",
    name: "Senior Center Holiday Party",
    date: "Jun 18",
    organizer: "Oak Hill HOA",
    raised: 2100,
    goal: 3000,
    percentage: 70,
    orders: 47,
    donors: 60,
    status: "Flagged",
    email: "board@oakhillhoa.net",
    description: "Organizing an annual summer social event and holiday party for the senior residents. Support includes catering, live music entertainment, and gift bags.",
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Search Filter
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Campaigns</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Campaign</th>
                <th className="py-4 px-6">Organizer</th>
                <th className="py-4 px-6">Progress</th>
                <th className="py-4 px-6">Orders</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="transition-colors duration-200 hover:bg-slate-50/30"
                >
                  {/* ID */}
                  <td className="py-4 px-6 font-bold text-slate-500">{campaign.id}</td>

                  {/* Campaign Info */}
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-900 leading-tight">
                      {campaign.name}
                    </div>
                    <div className="text-[12px] text-slate-400 font-semibold mt-0.5">
                      {campaign.date}
                    </div>
                  </td>

                  {/* Organizer */}
                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {campaign.organizer}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-4 px-6">
                    <div className="w-40 space-y-1">
                      <div className="flex items-center justify-between text-[12px] font-bold">
                        <span className="text-slate-900">${(campaign.raised / 1000).toFixed(1)}k</span>
                        <span className="text-slate-500">{campaign.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${campaign.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="py-4 px-6 font-bold text-slate-800">{campaign.orders}</td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    {campaign.status === "Active" && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600 border border-emerald-100">
                        Active
                      </span>
                    )}
                    {campaign.status === "Completed" && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-bold text-blue-600 border border-blue-100">
                        Completed
                      </span>
                    )}
                    {campaign.status === "Flagged" && (
                      <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-[12px] font-extrabold text-rose-600 border-2 border-rose-600 leading-normal inline-block uppercase tracking-wider">
                        Flagged
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCampaign(campaign)}
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                        title="View Details"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-rose-600 active:scale-95"
                        title="Flag Campaign"
                      >
                        <Flag className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedCampaign(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-400">{selectedCampaign.id}</span>
                  {selectedCampaign.status === "Active" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                      Active
                    </span>
                  )}
                  {selectedCampaign.status === "Completed" && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 border border-blue-100">
                      Completed
                    </span>
                  )}
                  {selectedCampaign.status === "Flagged" && (
                    <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[9px] font-extrabold text-rose-600 border-2 border-rose-600 uppercase tracking-wider leading-none">
                      Flagged
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-black text-slate-950 leading-tight">
                  {selectedCampaign.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Info Grid */}
            <div className="mt-5 space-y-5">
              {/* Description */}
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 font-medium">
                  {selectedCampaign.description || "No description provided for this campaign."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Organizer */}
                <div className="rounded-xl bg-slate-50/50 p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <User className="size-3.5 text-slate-500" />
                    Organizer
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{selectedCampaign.organizer}</div>
                  {selectedCampaign.email && (
                    <div className="text-[12px] text-slate-500 mt-0.5 truncate">{selectedCampaign.email}</div>
                  )}
                </div>

                {/* Launch Date */}
                <div className="rounded-xl bg-slate-50/50 p-3 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="size-3.5 text-slate-500" />
                    Launch Date
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{selectedCampaign.date}</div>
                </div>
              </div>

              {/* Progress & Financials */}
              <div className="rounded-xl bg-slate-50/50 p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>Progress Summary</span>
                  <span>{selectedCampaign.percentage}% achieved</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${selectedCampaign.percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Raised</div>
                    <div className="text-sm font-black text-emerald-600">${selectedCampaign.raised.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Goal</div>
                    <div className="text-sm font-black text-slate-800">${selectedCampaign.goal.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Orders</div>
                    <div className="text-sm font-black text-indigo-600">{selectedCampaign.orders}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
              >
                Close
              </button>
              {selectedCampaign.status !== "Flagged" && (
                <button
                  type="button"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all duration-200 hover:bg-rose-700 active:scale-95"
                >
                  Flag Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
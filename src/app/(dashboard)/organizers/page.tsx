"use client";

import React, { useState } from "react";
import { Eye, Trash2, Search, X, User, Mail, Phone, Calendar, DollarSign, Award, Plus, UserPlus } from "lucide-react";

// Types
type Organizer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  campaignsCount: number;
  totalRevenue: number;
  joined: string;
  status: "Active" | "Suspended";
  avatarInitials: string;
};

// Seed organizers matching screenshot
const initialOrganizers: Organizer[] = [
  {
    id: "org-1",
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+011 234 5678 9012",
    campaignsCount: 5,
    totalRevenue: 15000,
    joined: "Feb 2023",
    status: "Active",
    avatarInitials: "DK",
  },
  {
    id: "org-2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+011 785 1234 5678",
    campaignsCount: 3,
    totalRevenue: 12500,
    joined: "Jun 2024",
    status: "Active",
    avatarInitials: "MC",
  },
  {
    id: "org-3",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+011 678 1234 5678",
    campaignsCount: 4,
    totalRevenue: 9300,
    joined: "Nov 2024",
    status: "Suspended",
    avatarInitials: "ED",
  },
  {
    id: "org-4",
    name: "Jennifer Park",
    email: "jen.park@gmail.com",
    phone: "+011 985 5948 5299",
    campaignsCount: 2,
    totalRevenue: 8240,
    joined: "Mar 2025",
    status: "Active",
    avatarInitials: "JP",
  },
  {
    id: "org-5",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    phone: "+011 456 7890 1234",
    campaignsCount: 1,
    totalRevenue: 6750,
    joined: "Jan 2025",
    status: "Suspended",
    avatarInitials: "SL",
  },
];

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  
  // Add Organizer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgEmail, setNewOrgEmail] = useState("");
  const [newOrgPhone, setNewOrgPhone] = useState("");

  // Search Filter
  const filteredOrganizers = organizers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete Action
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete organizer "${name}"?`)) {
      setOrganizers(organizers.filter((o) => o.id !== id));
      if (selectedOrganizer?.id === id) {
        setSelectedOrganizer(null);
      }
    }
  };

  // Add Action
  const handleAddOrganizer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName || !newOrgEmail || !newOrgPhone) return;

    const initials = newOrgName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const newOrg: Organizer = {
      id: `org-${Date.now()}`,
      name: newOrgName,
      email: newOrgEmail,
      phone: newOrgPhone,
      campaignsCount: 0,
      totalRevenue: 0,
      joined: new Date().toLocaleString("default", { month: "short", year: "numeric" }),
      status: "Active",
      avatarInitials: initials || "UN",
    };

    setOrganizers([newOrg, ...organizers]);
    setNewOrgName("");
    setNewOrgEmail("");
    setNewOrgPhone("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organizers</h1>
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
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
          >
            <UserPlus className="size-4" />
            <span>Add Organizer</span>
          </button>
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
              {filteredOrganizers.map((org) => (
                <tr
                  key={org.id}
                  className="transition-colors duration-200 hover:bg-slate-50/30"
                >
                  {/* Name with initials avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                        {org.avatarInitials}
                      </div>
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {org.name}
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-extrabold leading-tight">{org.email}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{org.phone}</div>
                  </td>

                  {/* Campaigns Count */}
                  <td className="py-4 px-6 font-bold text-slate-800">{org.campaignsCount}</td>

                  {/* Total Revenue */}
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${org.totalRevenue.toLocaleString()}
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-6 text-slate-500 font-medium">{org.joined}</td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {org.status === "Active" ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-600 border border-rose-100">
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrganizer(org)}
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-indigo-600 active:scale-95"
                        title="View Details"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(org.id, org.name)}
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-rose-600 active:scale-95"
                        title="Delete Organizer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrganizers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No organizers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Organizer Details Modal */}
      {selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedOrganizer(null)}
          />
          <div className="relative w-full max-w-md scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                  {selectedOrganizer.avatarInitials}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-950 leading-tight">
                    {selectedOrganizer.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">{selectedOrganizer.id}</span>
                    {selectedOrganizer.status === "Active" ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-100">
                        Suspended
                      </span>
                    )}
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
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
                    <div className="text-slate-800 font-bold">{selectedOrganizer.email}</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Phone className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</div>
                    <div className="text-slate-800 font-bold">{selectedOrganizer.phone}</div>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                  <Calendar className="size-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</div>
                    <div className="text-slate-800 font-bold">{selectedOrganizer.joined}</div>
                  </div>
                </div>
              </div>

              {/* Campaign Performance Box */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Award className="size-3.5 text-slate-500" />
                    Campaigns
                  </div>
                  <div className="mt-1 text-lg font-black text-slate-900">{selectedOrganizer.campaignsCount}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <DollarSign className="size-3.5 text-slate-500" />
                    Total Revenue
                  </div>
                  <div className="mt-1 text-lg font-black text-emerald-600">
                    ${selectedOrganizer.totalRevenue.toLocaleString()}
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
                onClick={() => {
                  const updatedStatus = selectedOrganizer.status === "Active" ? "Suspended" : "Active";
                  setOrganizers(
                    organizers.map((o) =>
                      o.id === selectedOrganizer.id ? { ...o, status: updatedStatus } : o
                    )
                  );
                  setSelectedOrganizer({ ...selectedOrganizer, status: updatedStatus });
                }}
                className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md transition-all duration-200 active:scale-95 ${
                  selectedOrganizer.status === "Active"
                    ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                    : "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                }`}
              >
                {selectedOrganizer.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Organizer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-950 leading-tight">
                Add New Organizer
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddOrganizer} className="mt-4 space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={newOrgEmail}
                  onChange={(e) => setNewOrgEmail(e.target.value)}
                  placeholder="e.g. john.doe@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newOrgPhone}
                  onChange={(e) => setNewOrgPhone(e.target.value)}
                  placeholder="e.g. +011 234 5678"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Save Organizer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

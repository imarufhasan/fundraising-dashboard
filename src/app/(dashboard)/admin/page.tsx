"use client";

import React, { useState } from "react";
import { Search, Plus, Edit3, Trash2, X, Image as ImageIcon, CheckCircle, Ban } from "lucide-react";

// Types
type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Banned";
  image: string; // URL path or base64 placeholder
};

// Seed Admin Users matching mockup image
const initialAdmins: AdminUser[] = [
  {
    id: 4,
    name: "Sophia",
    email: "sophia.brown@email.com",
    phone: "+880 1764-289301",
    status: "Active",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },
  {
    id: 2,
    name: "Emily",
    email: "emily.smith@email.com",
    phone: "+880 1930-425776",
    status: "Active",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  },
  {
    id: 3,
    name: "Michael",
    email: "michael.jones@email.com",
    phone: "+880 1983-376849",
    status: "Active",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
  },
  {
    id: 1,
    name: "Jacob",
    email: "jacob123@gamil.com",
    phone: "+880 1840-560614",
    status: "Active",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  },
  {
    id: 5,
    name: "Liam",
    email: "liam.williams@email.com",
    phone: "+880 1875-473920",
    status: "Active",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  },
];

export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Banned">("Active");
  const [formImageUrl, setFormImageUrl] = useState("");

  // Search Filter
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAdmin(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormStatus("Active");
    setFormImageUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"); // Standard mock avatar
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (admin: AdminUser) => {
    setModalMode("edit");
    setSelectedAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormPhone(admin.phone);
    setFormStatus(admin.status);
    setFormImageUrl(admin.image);
    setIsModalOpen(true);
  };

  // Submit Action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) return;

    if (modalMode === "create") {
      const nextId = admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1;
      const newAdmin: AdminUser = {
        id: nextId,
        name: formName,
        email: formEmail,
        phone: formPhone,
        status: formStatus,
        image: formImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      };
      setAdmins([newAdmin, ...admins]);
    } else if (modalMode === "edit" && selectedAdmin) {
      const updatedAdmins = admins.map((a) =>
        a.id === selectedAdmin.id
          ? {
              ...a,
              name: formName,
              email: formEmail,
              phone: formPhone,
              status: formStatus,
              image: formImageUrl,
            }
          : a
      );
      setAdmins(updatedAdmins);
    }
    setIsModalOpen(false);
  };

  // Delete Action
  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete administrator "${name}"?`)) {
      setAdmins(admins.filter((a) => a.id !== id));
    }
  };

  // Toggle Ban/Block status icon triggers
  const handleToggleStatus = (admin: AdminUser) => {
    const nextStatus = admin.status === "Active" ? "Banned" : "Active";
    setAdmins(
      admins.map((a) => (a.id === admin.id ? { ...a, status: nextStatus } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] sm:w-auto text-center justify-center"
        >
          Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">email</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center w-24">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="transition-colors duration-200 hover:bg-slate-50/30">
                  {/* ID */}
                  <td className="py-4 px-6 text-slate-400 font-bold">{admin.id}</td>

                  {/* Name with Image */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full border border-slate-100 shadow-sm shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={admin.image}
                          alt={admin.name}
                          className="size-full object-cover"
                          onError={(e) => {
                            // Backup placeholder
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
                          }}
                        />
                      </div>
                      <div className="font-extrabold text-slate-900 leading-tight">
                        {admin.name}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-[#4f46e5]/90 font-medium">{admin.email}</td>

                  {/* Phone */}
                  <td className="py-4 px-6 text-slate-500 font-medium">{admin.phone}</td>

                  {/* Status Block/Ban Toggle Button */}
                  <td className="py-4 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(admin)}
                      className={`rounded-full p-2 transition-all duration-200 active:scale-95 ${
                        admin.status === "Active"
                          ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      }`}
                      title={admin.status === "Active" ? "Ban administrator account" : "Unban account"}
                    >
                      <Ban className="size-4.5" />
                    </button>
                  </td>

                  {/* Edit & Delete Action Buttons */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(admin)}
                        className="rounded-lg p-2 text-indigo-600 transition-all duration-200 hover:bg-indigo-50 active:scale-95"
                        title="Edit Details"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(admin.id, admin.name)}
                        className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-slate-50 hover:text-rose-600 active:scale-95"
                        title="Delete Admin"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create or Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md scale-100 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-950 leading-tight">
                {modalMode === "create" ? "Add New Admin" : "Edit Admin Details"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Liam"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. liam.williams@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. +880 1875-473920"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Image URL</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="Paste URL link..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
                >
                  {modalMode === "create" ? "Create Admin" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

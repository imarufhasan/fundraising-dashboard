"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  X,
  Ban,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  AdminUser,
  useCreateAdminMutation,
  useGetAllAdminQuery,
  useUpdateAdminMutation,
  useUpdateAdminStatusMutation,
} from "@/store/api/allApi";
import { getErrorMessage } from "@/lib/utils/error-handler";
import { formatUSPhone } from "@/lib/utils/phone";
import { useToast } from "@/components/ToastProvider";

type AdminRole = "admin" | "support_admin";
type AdminStatus = "active" | "blocked";

export default function AdminPage() {
  const { success, error } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState<AdminRole>("admin");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    error: fetchError,
    refetch,
  } = useGetAllAdminQuery({
    page,
    limit,
    searchTerm: searchTerm.trim() || undefined,
    role: "admin",
    status: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    fromDate: undefined,
    toDate: undefined,
  });

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [updateAdminStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminStatusMutation();

  const admins = data?.data ?? [];
  const meta = data?.meta;

  const getAdminId = (admin: AdminUser) => {
    return admin.userId;
  };

  const getPhone = (admin: AdminUser) => {
    return admin.phoneNumber || "-";
  };

  const getImage = (admin: AdminUser) => {
    return (
      admin.profileImage ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    );
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const isBlocked = (admin: AdminUser) =>
    admin.status?.toLowerCase() === "blocked";

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedAdmin(null);

    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormPhone("");
    setFormRole("admin");
    setProfileImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setModalMode("edit");
    setSelectedAdmin(admin);

    setFormName(admin.name || "");
    setFormEmail(admin.email || "");
    setFormPhone(formatUSPhone(admin.phoneNumber || ""));

    setFormRole(admin.role === "support_admin" ? "support_admin" : "admin");
    setFormPassword("");
    setProfileImage(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isCreating || isUpdating) return;

    setIsModalOpen(false);
    setFormError("");
  };

  const openStatusModal = (admin: AdminUser) => {
    setStatusTarget(admin);
  };

  const closeStatusModal = () => {
    if (isUpdatingStatus) return;
    setStatusTarget(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return;

    const nextStatus: AdminStatus = isBlocked(statusTarget)
      ? "active"
      : "blocked";

    try {
      const response = await updateAdminStatus({
        id: statusTarget.userId,
        status: nextStatus,
      }).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update admin status.");
      }

      success(
        nextStatus === "blocked" ? "Admin Blocked" : "Admin Unblocked",
        nextStatus === "blocked"
          ? `${statusTarget.name} can no longer sign in.`
          : `${statusTarget.name} has regained access.`,
      );

      setStatusTarget(null);

      await refetch();
    } catch (err: unknown) {
      console.error("UPDATE ADMIN STATUS ERROR:", err);
      const message = getErrorMessage(err, "Failed to update admin status.");
      error("Status Update Failed", message);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAdmin || isUpdating) return;

    setFormError("");

    if (!formName.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!formPhone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    const digits = formPhone.replace(/\D/g, "");

    if (digits.length !== 10) {
      setFormError("Please enter a valid 10-digit US phone number.");
      return;
    }

    const payloadPhone = `+1${digits}`;

    try {
      console.log("UPDATE ADMIN PAYLOAD:", {
        id: selectedAdmin.userId,
        name: formName.trim(),
        phoneNumber: payloadPhone,
      });

      const response = await updateAdmin({
        id: selectedAdmin.userId,
        name: formName.trim(),
        phoneNumber: payloadPhone,
      }).unwrap();

      console.log("UPDATE ADMIN RESPONSE:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update admin.");
      }

      success(
        "Admin Updated",
        "Administrator details have been updated successfully.",
      );

      setIsModalOpen(false);

      resetForm();

      await refetch();
    } catch (err: unknown) {
      console.error("UPDATE ADMIN ERROR:", err);
      const message = getErrorMessage(err, "Failed to update admin.");
      setFormError(message);
      error("Admin Update Failed", message);
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormPhone("");
    setFormRole("admin");
    setProfileImage(null);
    setFormError("");
    setSelectedAdmin(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCreating) return;

    setFormError("");

    if (!formName.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!formEmail.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (modalMode === "create" && !formPassword.trim()) {
      setFormError("Password is required.");
      return;
    }

    if (!formPhone.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    try {
      if (modalMode === "create") {
        const digits = formPhone.replace(/\D/g, "");
        if (digits.length !== 10) {
          setFormError("Please enter a valid 10-digit US phone number.");
          return;
        }
        const payloadPhone = `+1${digits}`;
        console.log("FORM PHONE:", formPhone);
        console.log("FINAL PAYLOAD PHONE:", payloadPhone);

        const formData = new FormData();
        formData.append("name", formName.trim());
        formData.append("email", formEmail.trim());
        formData.append("password", formPassword);
        formData.append("phoneNumber", payloadPhone);
        formData.append("role", formRole);

        if (profileImage) {
          formData.append("profileImage", profileImage);
        }

        const response = await createAdmin(formData).unwrap();

        if (!response?.success) {
          throw new Error(response?.message || "Failed to create admin.");
        }

        success(
          "Admin Created",
          "The administrator account has been created successfully.",
        );

        setIsModalOpen(false);

        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setFormPhone("");
        setFormRole("admin");
        setProfileImage(null);
        setFormError("");

        await refetch();
      }
    } catch (err: unknown) {
      console.error("CREATE ADMIN ERROR:", err);

      const message = getErrorMessage(err, "Failed to create admin.");

      setFormError(message);

      error("Admin Creation Failed", message);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  if (isLoading) {
    return <AdminPageSkeleton />;
  }

  if (fetchError) {
    console.error("GET ADMIN ERROR:", error);

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">
            Failed to load administrators
          </h2>

          <p className="mt-1 max-w-md text-sm text-slate-500">
            Something went wrong while loading the admin list.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search admin..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Add Admin
        </button>
      </div>

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Loader2 className="size-3.5 animate-spin" />
          Updating admin list...
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="w-16 px-6 py-4">#</th>

                <th className="px-6 py-4">Name</th>

                <th className="px-6 py-4">Email</th>

                <th className="px-6 py-4">Phone Number</th>

                <th className="px-6 py-4">Role</th>

                <th className="px-6 py-4 text-center">Status</th>

                <th className="w-24 px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {admins.map((admin, index) => (
                <tr
                  key={getAdminId(admin)}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  {/* ID */}
                  <td className="px-6 py-4 font-bold text-slate-400">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AdminProfileImage
                        src={getImage(admin)}
                        alt={admin.name}
                      />

                      <span className="font-extrabold text-slate-900">
                        {admin.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-indigo-600">
                    {admin.email}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-500">
                    {getPhone(admin)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                      {admin.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        admin.status?.toLowerCase().includes("active")
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {getStatusLabel(admin.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(admin)}
                        className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50"
                        title="Edit Admin"
                      >
                        <Edit3 className="size-4" />
                      </button>

                      {isBlocked(admin) ? (
                        <button
                          type="button"
                          onClick={() => openStatusModal(admin)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                          title="Unblock Admin"
                        >
                          <CheckCircle2 className="size-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openStatusModal(admin)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Block Admin"
                        >
                          <Ban className="size-4" />
                        </button>
                      )}

                      {/* <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-rose-600"
                        title="Delete Admin"
                      >
                        <Trash2 className="size-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}

              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-sm font-semibold text-slate-400"
                  >
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-xs font-semibold text-slate-400">
              Page {meta.page} of {meta.totalPages} • {meta.total} admins
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  {modalMode === "create"
                    ? "Add New Admin"
                    : "Edit Admin Details"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Create an administrator account.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-semibold text-rose-700">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={modalMode === "create" ? handleSubmit : handleUpdate}
              className="mt-5 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Name
                </label>

                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={formEmail}
                  disabled={modalMode === "edit"}
                  onChange={(event) => setFormEmail(event.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              {modalMode === "create" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    value={formPassword}
                    onChange={(event) => setFormPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone Number
                </label>

                <div
                  className={`flex overflow-hidden rounded-xl border bg-white transition-all ${
                    formError?.toLowerCase().includes("phone")
                      ? "border-rose-300 ring-2 ring-rose-100"
                      : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
                  }`}
                >
                  <div className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-4">
                    <span className="text-base">🇺🇸</span>

                    <span className="text-sm font-bold text-slate-700">+1</span>
                  </div>

                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={formPhone}
                    onChange={(event) => {
                      const formatted = formatUSPhone(event.target.value);

                      setFormPhone(formatted);

                      if (formError) {
                        setFormError("");
                      }
                    }}
                    placeholder="(202) 555-0129"
                    maxLength={14}
                    className="min-w-0 flex-1 border-0 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Enter a valid US phone number
                  </p>

                  <p className="text-xs font-medium text-slate-400">
                    {formPhone.replace(/\D/g, "").length}/10
                  </p>
                </div>
              </div>

              {modalMode === "create" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Role
                  </label>

                  <select
                    value={formRole}
                    onChange={(event) =>
                      setFormRole(event.target.value as AdminRole)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="admin">Admin</option>

                    <option value="support_admin">Support Admin</option>
                  </select>
                </div>
              )}

              {modalMode === "create" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setProfileImage(event.target.files?.[0] || null)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-indigo-600"
                  />

                  {profileImage && (
                    <p className="text-xs font-medium text-slate-400">
                      Selected: {profileImage.name}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isCreating || isUpdating}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex min-w-31.25 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="size-4 animate-spin" />
                  )}

                  {modalMode === "create"
                    ? isCreating
                      ? "Creating..."
                      : "Create Admin"
                    : isUpdating
                      ? "Updating..."
                      : "Update Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeStatusModal}
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex size-12 items-center justify-center rounded-full ${
                  isBlocked(statusTarget)
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isBlocked(statusTarget) ? (
                  <ShieldCheck className="size-6" />
                ) : (
                  <ShieldAlert className="size-6" />
                )}
              </div>

              <h2 className="mt-4 text-base font-black text-slate-950">
                {isBlocked(statusTarget)
                  ? "Unblock this admin?"
                  : "Block this admin?"}
              </h2>

              <p className="mt-1.5 text-sm text-slate-500">
                {isBlocked(statusTarget) ? (
                  <>
                    <span className="font-bold text-slate-700">
                      {statusTarget.name}
                    </span>{" "}
                    will regain access and be able to sign in again.
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-700">
                      {statusTarget.name}
                    </span>{" "}
                    will immediately lose access and won&apos;t be able to sign
                    in until unblocked.
                  </>
                )}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                onClick={closeStatusModal}
                disabled={isUpdatingStatus}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={isUpdatingStatus}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isBlocked(statusTarget)
                    ? "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                    : "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                }`}
              >
                {isUpdatingStatus && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {isBlocked(statusTarget)
                  ? isUpdatingStatus
                    ? "Unblocking..."
                    : "Yes, Unblock"
                  : isUpdatingStatus
                    ? "Blocking..."
                    : "Yes, Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminProfileImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  const fallbackImage =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

  return (
    <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-50">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
          <Loader2 className="size-4 animate-spin text-indigo-500" />
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        className={`size-full object-cover transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => {
          setIsLoading(false);
        }}
        onError={() => {
          if (imageSrc !== fallbackImage) {
            setImageSrc(fallbackImage);
          } else {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}

function AdminPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-11 w-full rounded-xl bg-slate-100 sm:w-72" />

        <div className="h-11 w-32 rounded-xl bg-slate-100" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="h-14 border-b border-slate-100 bg-slate-50" />

        <div className="divide-y divide-slate-100">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div key={index} className="flex items-center gap-6 px-6 py-5">
              <div className="h-4 w-5 rounded bg-slate-100" />

              <div className="flex flex-1 items-center gap-3">
                <div className="size-10 rounded-full bg-slate-100" />

                <div className="h-4 w-28 rounded bg-slate-100" />
              </div>

              <div className="hidden h-4 w-40 rounded bg-slate-100 md:block" />

              <div className="hidden h-4 w-28 rounded bg-slate-100 lg:block" />

              <div className="h-6 w-20 rounded-full bg-slate-100" />

              <div className="h-8 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

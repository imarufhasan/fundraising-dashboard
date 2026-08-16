"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/store/api/authApi";
import { getErrorMessage } from "@/lib/utils/error-handler";
import { useToast } from "@/components/ToastProvider";
import imageCompression from "browser-image-compression";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Profile = {
  _id: string;
  name?: string | null;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
};

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function SettingsPage() {
  const { data, isLoading, isError, refetch } = useGetMeQuery();

  const profile = data?.data as Profile | undefined;

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (isError || !profile) {
    return <ProfileLoadError refetch={refetch} />;
  }

  return (
    <div className="max-w-2xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Account Settings
        </h1>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      <ProfileInformation
        key={profile._id}
        profile={profile}
        refetch={refetch}
      />

      <ChangePassword />
    </div>
  );
}

function ProfileInformation({
  profile,
  refetch,
}: {
  profile: Profile;
  refetch: () => Promise<unknown>;
}) {
  const { success, error } = useToast();

  const [updateProfile, { isLoading: isSavingProfile }] =
    useUpdateProfileMutation();

  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phoneNumber ?? "");

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [profileSaved, setProfileSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedImage = imagePreview || profile.profileImage || FALLBACK_IMAGE;

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      error("Invalid Image", "Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // Optional: 5MB frontend limit
    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      error("Image Too Large", "Please select an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    // Create a real File object with the correct MIME type
    const extension = file.type.split("/")[1] || "jpg";

    const properFile = new File(
      [file],
      `profile-image-${Date.now()}.${extension}`,
      {
        type: file.type,
        lastModified: Date.now(),
      },
    );

    console.log("PROFILE IMAGE:", properFile);
    console.log("PROFILE IMAGE NAME:", properFile.name);
    console.log("PROFILE IMAGE TYPE:", properFile.type);
    console.log(
      "PROFILE IMAGE SIZE:",
      (properFile.size / 1024).toFixed(2),
      "KB",
    );

    setProfileImageFile(properFile);
    setImagePreview(URL.createObjectURL(properFile));

    // Allow selecting the same file again
    event.target.value = "";
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("phoneNumber", phone.trim());

      if (profileImageFile) {
        formData.append(
          "profileImage",
          profileImageFile,
          profileImageFile.name,
        );
      }

      console.log("FORM DATA:");

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      const response = await updateProfile(formData).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update profile.");
      }

      setProfileSaved(true);

      setTimeout(() => {
        setProfileSaved(false);
      }, 3000);

      success("Profile Updated", "Your profile has been saved successfully.");

      setProfileImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      await refetch();
    } catch (err: unknown) {
      console.error("PROFILE UPDATE ERROR:", err);

      const message = getErrorMessage(err, "Failed to update profile.");

      error("Profile Update Failed", message);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900">
          Profile Information
        </h3>

        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
          Update your public organizer profile.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <form onSubmit={handleSaveProfile} className="space-y-5 p-5">
        {/* ---------------------------------------------------------------- */}
        {/* Profile Photo                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayedImage}
              alt="Profile"
              className="size-full object-cover"
            />

            <button
              type="button"
              onClick={triggerImageUpload}
              className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700"
              title="Upload Photo"
            >
              <Upload className="size-3" />
            </button>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900">Profile Photo</h4>

            <button
              type="button"
              onClick={triggerImageUpload}
              className="mt-0.5 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-800"
            >
              Upload photo
            </button>

            {profileImageFile && (
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                Selected: {profileImageFile.name}
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Full Name                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-1">
          <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
            Full Name
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Email                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-1">
          <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
            Email Address
          </label>

          <input
            type="email"
            disabled
            value={profile.email ?? ""}
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-400 outline-none"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Phone                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-1">
          <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
            Phone Number
          </label>

          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1XXXXXXXXXX"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between border-t border-slate-50 pt-2">
          {profileSaved && (
            <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
              <CheckCircle className="size-4" />
              Profile saved successfully!
            </span>
          )}

          <button
            type="submit"
            disabled={isSavingProfile}
            className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSavingProfile && <Loader2 className="size-4 animate-spin" />}

            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ChangePassword() {
  const { success, error } = useToast();

  const [changePassword, { isLoading: isSavingPassword }] =
    useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError("");

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: currentPassword,
        newPassword,
      }).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update password.");
      }

      setPasswordSaved(true);

      window.setTimeout(() => {
        setPasswordSaved(false);
      }, 3000);

      success(
        "Password Updated",
        "Your password has been changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update password.");

      setPasswordError(message);

      error("Password Update Failed", message);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900">Change Password</h3>

        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
          Keep your account secure with a strong password.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <form onSubmit={handleUpdatePassword} className="space-y-5 p-5">
        {/* Error */}

        {passwordError && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-semibold text-rose-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />

            <span>{passwordError}</span>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Current Password                                                 */}
        {/* ---------------------------------------------------------------- */}

        <PasswordInput
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          showPassword={showCurrent}
          onToggle={() => setShowCurrent((prev) => !prev)}
        />

        {/* ---------------------------------------------------------------- */}
        {/* New Password                                                     */}
        {/* ---------------------------------------------------------------- */}

        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={setNewPassword}
          showPassword={showNew}
          onToggle={() => setShowNew((prev) => !prev)}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Confirm Password                                                 */}
        {/* ---------------------------------------------------------------- */}

        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showConfirm}
          onToggle={() => setShowConfirm((prev) => !prev)}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center justify-between border-t border-slate-50 pt-2">
          {passwordSaved && (
            <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
              <CheckCircle className="size-4" />
              Password updated successfully!
            </span>
          )}

          <button
            type="submit"
            disabled={isSavingPassword}
            className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSavingPassword && <Loader2 className="size-4 animate-spin" />}

            {isSavingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Password Input                                                    */
/* -------------------------------------------------------------------------- */

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-10 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile Load Error                                                         */
/* -------------------------------------------------------------------------- */

function ProfileLoadError({ refetch }: { refetch: () => Promise<unknown> }) {
  return (
    <div className="max-w-2xl">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="size-5" />
        </div>

        <h2 className="mt-4 text-base font-bold text-slate-900">
          Failed to load your profile
        </h2>

        <p className="mt-1 max-w-md text-sm text-slate-500">
          Something went wrong while loading your account settings.
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

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function SettingsPageSkeleton() {
  return (
    <div className="max-w-2xl animate-pulse space-y-6 pb-12">
      {/* Page Header */}

      <div className="space-y-2">
        <div className="h-7 w-56 rounded bg-slate-100" />
        <div className="h-4 w-80 rounded bg-slate-100" />
      </div>

      {/* Cards */}

      {Array.from({ length: 2 }).map((_, cardIdx) => (
        <div
          key={cardIdx}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
        >
          {/* Card Header */}

          <div className="space-y-2 border-b border-slate-100 p-5">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-3 w-64 rounded bg-slate-100" />
          </div>

          {/* Card Body */}

          <div className="space-y-5 p-5">
            {/* Profile Image */}

            {cardIdx === 0 && (
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-slate-100" />

                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
              </div>
            )}

            {/* Fields */}

            {Array.from({
              length: cardIdx === 0 ? 3 : 3,
            }).map((_, fieldIdx) => (
              <div key={fieldIdx} className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-100" />

                <div className="h-10 w-full rounded-xl bg-slate-100" />
              </div>
            ))}

            {/* Button */}

            <div className="flex justify-end border-t border-slate-50 pt-2">
              <div className="h-10 w-32 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

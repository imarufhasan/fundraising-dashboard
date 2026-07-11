"use client";

import React, { useState } from "react";
import { Upload, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  // Profile state
  const [firstName, setFirstName] = useState("Jennifer");
  const [lastName, setLastName] = useState("Park");
  const [email, setEmail] = useState("jen.park@gmail.com");
  const [phone, setPhone] = useState("+1 (312) 555-0192");
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  );

  // Password state
  const [currentPassword, setCurrentPassword] = useState("********");
  const [newPassword, setNewPassword] = useState("********");
  const [confirmPassword, setConfirmPassword] = useState("********");

  // Show/Hide Password States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Action Success Alerts
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  // Mock Upload image handler
  const triggerImageUpload = () => {
    const newImage = prompt(
      "Enter a new profile image URL link:",
      profileImage
    );
    if (newImage) {
      setProfileImage(newImage);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      {/* Profile Info Section Card */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-900">Profile Information</h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Update your public organizer profile.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="p-5 space-y-5">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profileImage} alt="Profile" className="size-full object-cover" />
              <button
                type="button"
                onClick={triggerImageUpload}
                className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
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
                className="mt-0.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Upload photo
              </button>
            </div>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Save Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            {profileSaved && (
              <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                <CheckCircle className="size-4" />
                Profile saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section Card */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Keep your account secure with a strong password.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-5 space-y-5">
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Footer Save Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            {passwordSaved && (
              <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                <CheckCircle className="size-4" />
                Password updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

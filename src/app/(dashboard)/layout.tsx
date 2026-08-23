"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

import Sidebar from "../../components/Sidebar";
import { useGetMeQuery } from "@/store/api/authApi";

type DashboardLayoutProps = {
  children: ReactNode;
};

type Profile = {
  name?: string | null;
  email?: string | null;
  profileImage?: string | null;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data } = useGetMeQuery();

  const profile = data?.data as Profile | undefined;

  const profileName = profile?.name?.trim() || "Admin";
  const profileImage = profile?.profileImage || FALLBACK_IMAGE;

  const profileInitial = profileName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </button>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back, {profileName}! Here&apos;s what&apos;s happening
              with FunraisingIt today
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50 lg:ml-auto"
          >
            {/* Profile Image */}
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {profile?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt={profileName}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-slate-600">
                  {profileInitial}
                </span>
              )}
            </div>

            {/* Name & Role */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {profileName}
              </p>

              <p className="text-xs font-medium text-slate-500">
                Administrator
              </p>
            </div>
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

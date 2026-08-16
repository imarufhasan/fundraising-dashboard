"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Link from "next/link";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back, Admin! Here&apos;s what&apos;s happening with FunraisingIt today</p>
          </div>

          <div className="flex items-center gap-3 lg:ml-auto">
            <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-orange-300 to-rose-500 text-sm font-bold text-white overflow-hidden">
              <span className="font-bold text-white">A</span>
            </div>
            <Link href="/settings">
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">Admin</p>
              <p className="text-sm text-slate-500">Administrator</p>
            </div>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

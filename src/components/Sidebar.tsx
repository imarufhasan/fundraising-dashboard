"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flag,
  Headphones,
  LayoutDashboard,
  LogOut,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

import logo from "../images/logo.png";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const navigationItems = [
  { href: "/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Flag },
  { href: "/organizers", label: "Organizers", icon: UsersRound },
  { href: "/transactions", label: "Transactions", icon: WalletCards },
  { href: "/support", label: "Support", icon: Headphones },
  { href: "/admin", label: "Admin", icon: UsersRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col bg-[#041533] text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : ""
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <Link href="/home" className="transition-opacity duration-200 hover:opacity-80" onClick={onClose}>
          <Image src={logo} alt="FunRaisingIt" className="h-auto w-32" priority />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close navigation menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Dashboard navigation">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

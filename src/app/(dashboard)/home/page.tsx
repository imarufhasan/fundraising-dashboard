"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Rocket,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  Activity,
  HeartHandshake,
  ShieldCheck,
  Percent,
  Coins,
  Ticket,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* Metrics Row 1 - 6 Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* Card 1: Live Campaigns */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">412</div>
            <div className="text-sm text-slate-500 font-medium">Live Campaigns</div>
          </div>
        </div>

        {/* Card 2: Completed Campaigns */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">287</div>
            <div className="text-sm text-slate-500 font-medium">Completed Campaigns</div>
          </div>
        </div>

        {/* Card 3: Platform Revenue */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <DollarSign className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">$48,765.32</div>
            <div className="text-sm text-slate-500 font-medium">Platform Revenue</div>
          </div>
        </div>

        {/* Card 4: Launch Fee Collected */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Rocket className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">$12,345.00</div>
            <div className="text-sm text-slate-500 font-medium">Launch Fee Collected</div>
          </div>
        </div>

        {/* Card 5: Transaction Fees */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Percent className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">$28,916.22</div>
            <div className="text-sm text-slate-500 font-medium">Transaction Fees (6%)</div>
          </div>
        </div>

        {/* Card 6: Brand Builder Fees */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Coins className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">$3,984.03</div>
            <div className="text-sm text-slate-500 font-medium">Brand Builder Fees</div>
          </div>
        </div>
      </div>

      {/* Metrics Row 2 - 4 Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Pending Payouts */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
            <div className="text-2xl font-black text-slate-900">$21,436.78</div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <DollarSign className="size-6" />
          </div>
        </div>

        {/* Card 2: Failed payments */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Failed payments</span>
            <div className="text-2xl font-black text-slate-900 font-sans">12</div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="size-6" />
          </div>
        </div>

        {/* Card 3: Live Campaigns */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Campaigns</span>
            <div className="text-2xl font-black text-slate-900">412</div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Users className="size-6" />
          </div>
        </div>

        {/* Card 4: Launch Fee Collected */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Launch Fee Collected</span>
            <div className="text-2xl font-black text-slate-900">$12,345.00</div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <Rocket className="size-6" />
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Section: Charts (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Revenue Overview Line Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Revenue Overview</h3>
                </div>
                <div className="flex items-center gap-3 text-[12px] font-semibold">
                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="size-2 rounded-full bg-cyan-400" />
                    Revenue Overview
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="size-2 rounded-full bg-purple-500" />
                    Platform Fees
                  </div>
                </div>
              </div>

              {/* Chart Body */}
              <div className="relative h-48 w-full">
                {/* SVG mock-up lines matching the look in screenshot */}
                <svg className="size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="0.5" />

                  {/* Gradient for Area Fill */}
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Revenue Overview Fill & Line */}
                  <path
                    d="M 0 65 Q 20 60, 40 50 T 80 40 T 100 35 L 100 100 L 0 100 Z"
                    fill="url(#cyanGrad)"
                  />
                  <path
                    d="M 0 65 Q 20 60, 40 50 T 80 40 T 100 35"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Platform Fees Fill & Line */}
                  <path
                    d="M 0 85 Q 20 82, 40 75 T 80 70 T 100 60 L 100 100 L 0 100 Z"
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d="M 0 85 Q 20 82, 40 75 T 80 70 T 100 60"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Animated Dots at peak points */}
                  <circle cx="80" cy="40" r="3.5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="80" cy="70" r="3" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                </svg>

                {/* Y-axis Labels */}
                <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[9px] font-bold text-slate-400">
                  <span>$40K</span>
                  <span>$30K</span>
                  <span>$20K</span>
                  <span>$10K</span>
                  <span>$0</span>
                </div>
              </div>

              {/* X-axis Labels */}
              <div className="mt-2 flex justify-between pl-6 text-[9px] font-bold text-slate-400">
                <span>May 19</span>
                <span>May 20</span>
                <span>May 21</span>
                <span>May 22</span>
                <span>May 23</span>
                <span>May 24</span>
                <span>May 25</span>
              </div>
            </div>

            {/* Platform Revenue Pie/Donut Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800">Platform Revenue Breakdown</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {/* Donut Layout */}
                <div className="relative flex size-36 items-center justify-center">
                  <svg className="size-full -rotate-90">
                    {/* Circle slices mapping matching colors */}
                    <circle cx="72" cy="72" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                    {/* Transaction Fees (59%) */}
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#06b6d4"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="139.1"
                      className="transition-all duration-500"
                    />
                    {/* Launch Fees (25%) */}
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="254.4"
                      className="transition-all duration-500"
                      transform="rotate(212.4 72 72)"
                    />
                    {/* Brand Builder Fees (8%) */}
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="312.1"
                      className="transition-all duration-500"
                      transform="rotate(302.4 72 72)"
                    />
                    {/* Other Revenue (8%) */}
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="312.1"
                      className="transition-all duration-500"
                      transform="rotate(331.2 72 72)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black text-slate-800">$48,765.32</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  </div>
                </div>

                {/* Legends */}
                <div className="space-y-2 text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded bg-[#06b6d4]" />
                    <span>Transaction Fees (6%): <b className="text-slate-800">$28,916.22 (59%)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded bg-[#f59e0b]" />
                    <span>Launch Fees (6%): <b className="text-slate-800">$12,345.00 (25%)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded bg-[#a855f7]" />
                    <span>Brand Builder Fees: <b className="text-slate-800">$3,984.03 (8%)</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded bg-[#10b981]" />
                    <span>Other Revenue: <b className="text-slate-800">$3,520.07 (8%)</b></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Recent Activity (4 cols) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-4">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Activity 1 */}
            <div className="flex items-start justify-between py-4.5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                  R
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">New campaign created</h4>
                  <p className="text-sm text-slate-500 italic mt-0.5">“Jenna&apos;s Banana Pudding”</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-400">2 min ago</span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-start justify-between py-4.5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Rocket className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Brand Builder order received</h4>
                  <p className="text-sm text-slate-500 italic mt-0.5">“Sweet Treats Co.”</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-400">15 min ago</span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-start justify-between py-4.5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <DollarSign className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Payout of $2,350.45 approved</h4>
                  <p className="text-sm text-slate-500 mt-0.5">To: Sweet Treats Co.</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-400">1 hr ago</span>
            </div>

            {/* Activity 4 */}
            <div className="flex items-start justify-between py-4.5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <AlertTriangle className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Campaign flagged</h4>
                  <p className="text-sm text-slate-500 italic mt-0.5">“Help Our Team”</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-400">2 hr ago</span>
            </div>

            {/* Activity 5 */}
            <div className="flex items-start justify-between py-4.5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <HelpCircle className="size-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Support ticket received</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Order not received</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-slate-400">3 hr ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Tables & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Section: Campaign & Submission Tables */}
        <div className="space-y-6 lg:col-span-8">
          {/* Top Campaign by Amount Raised */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">Top Campaign by Amount Raised</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pr-2">#</th>
                    <th className="pb-3">Campaign</th>
                    <th className="pb-3">Organizer</th>
                    <th className="pb-3">Raised</th>
                    <th className="pb-3 text-center">Orders</th>
                    <th className="pb-3 text-center">Donors</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">1</td>
                    <td className="py-3.5">Jenna&apos;s Banana Pudding</td>
                    <td className="py-3.5 text-slate-500">Jenna Smith</td>
                    <td className="py-3.5 text-slate-900">$4,235.00</td>
                    <td className="py-3.5 text-center text-slate-500">125</td>
                    <td className="py-3.5 text-center text-slate-500">189</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">2</td>
                    <td className="py-3.5">Marc&apos;s Chocolate Cake</td>
                    <td className="py-3.5 text-slate-500">Mark Johnson</td>
                    <td className="py-3.5 text-slate-900">$3,820.00</td>
                    <td className="py-3.5 text-center text-slate-500">95</td>
                    <td className="py-3.5 text-center text-slate-500">215</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">3</td>
                    <td className="py-3.5">Sara&apos;s Strawberry</td>
                    <td className="py-3.5 text-slate-500">Sara Lee</td>
                    <td className="py-3.5 text-slate-900">$2,900.00</td>
                    <td className="py-3.5 text-center text-slate-500">87</td>
                    <td className="py-3.5 text-center text-slate-500">102</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                  {/* Row 4 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">4</td>
                    <td className="py-3.5">Tom&apos;s Tiramisu</td>
                    <td className="py-3.5 text-slate-500">Tom Brown</td>
                    <td className="py-3.5 text-slate-900">$2,450.00</td>
                    <td className="py-3.5 text-center text-slate-500">160</td>
                    <td className="py-3.5 text-center text-slate-500">300</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                  {/* Row 5 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">5</td>
                    <td className="py-3.5">Linda&apos;s Lemon Bars</td>
                    <td className="py-3.5 text-slate-500">Linda Green</td>
                    <td className="py-3.5 text-slate-900">$1,750.00</td>
                    <td className="py-3.5 text-center text-slate-500">70</td>
                    <td className="py-3.5 text-center text-slate-500">90</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                  {/* Row 6 */}
                  <tr>
                    <td className="py-3.5 text-slate-400 pr-2">6</td>
                    <td className="py-3.5">Emily&apos;s Eclair</td>
                    <td className="py-3.5 text-slate-500">Emily White</td>
                    <td className="py-3.5 text-slate-900">$4,150.00</td>
                    <td className="py-3.5 text-center text-slate-500">93</td>
                    <td className="py-3.5 text-center text-slate-500">145</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
                        Live
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Brand Builder Submissions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">Recent Brand Builder Submissions</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Business Name</th>
                    <th className="pb-3">Items Requested</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-3.5 text-slate-900">Sweet Treats Co.</td>
                    <td className="py-3.5 text-slate-500">Tent, Shirts, Cups, Bags...</td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[12px] font-bold text-blue-600">
                        New
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">5 min ago</td>
                  </tr>
                  {/* Row 2 */}
                  <tr>
                    <td className="py-3.5 text-slate-900">Gourmet Delights</td>
                    <td className="py-3.5 text-slate-500">Plates, Utensils, Napkins</td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[12px] font-bold text-amber-600">
                        In Design
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">10 min ago</td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="py-3.5 text-slate-900">Beverage Bliss</td>
                    <td className="py-3.5 text-slate-500">Cups, Straws, Coasters</td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[12px] font-bold text-purple-600">
                        Mockups Sent
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">15 min ago</td>
                  </tr>
                  {/* Row 4 */}
                  <tr>
                    <td className="py-3.5 text-slate-900">Savory Snacks Inc.</td>
                    <td className="py-3.5 text-slate-500">Boxes, Bags, Labels, Forks...</td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[12px] font-bold text-rose-600">
                        Quote Sent
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">20 min ago</td>
                  </tr>
                  {/* Row 5 */}
                  <tr>
                    <td className="py-3.5 text-slate-900">Fresh Bakes Co.</td>
                    <td className="py-3.5 text-slate-500">Pans, Wrappers, Boxes, Bags...</td>
                    <td className="py-3.5">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-bold text-emerald-600">
                        Completed
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-slate-400">25 min ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Quick Actions & Support Tickets */}
        <div className="space-y-6 lg:col-span-4">
          {/* Quick Actions Grid */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Action 1 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50/50 active:translate-y-0"
              >
                <MessageSquare className="size-5" />
                <span className="text-[11px] font-bold text-indigo-600">Create Announcement</span>
              </button>

              {/* Action 2 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center text-cyan-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-50/50 active:translate-y-0"
              >
                <Download className="size-5" />
                <span className="text-[11px] font-bold text-cyan-600">Export Revenue Report</span>
              </button>

              {/* Action 3 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50/50 active:translate-y-0"
              >
                <Eye className="size-5" />
                <span className="text-[11px] font-bold text-blue-600">View All Campaigns</span>
              </button>

              {/* Action 4 */}
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center text-amber-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-50/50 active:translate-y-0"
              >
                <DollarSign className="size-5" />
                <span className="text-[11px] font-bold text-amber-600">Review Pending Payouts</span>
              </button>
            </div>
          </div>

          {/* Support Tickets Overview */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">Support Tickets Overview</h3>
            </div>

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="flex items-center justify-between font-semibold text-slate-600 text-sm">
                <div className="flex items-center gap-2">
                  <Ticket className="size-4 text-slate-400" />
                  <span>Open Tickets</span>
                </div>
                <span className="text-slate-900 font-bold">12</span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between font-semibold text-slate-600 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-slate-400" />
                  <span>Waiting on Customer</span>
                </div>
                <span className="text-slate-900 font-bold">7</span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between font-semibold text-rose-600 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-rose-500" />
                  <span className="font-bold">Urgent/ High Priority</span>
                </div>
                <span className="font-black text-rose-600">3</span>
              </div>

              {/* Row 4 */}
              <div className="flex items-center justify-between font-semibold text-slate-600 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-slate-400" />
                  <span>Resolved Today</span>
                </div>
                <span className="text-slate-900 font-bold">9</span>
              </div>

              {/* Row 5 */}
              <div className="flex items-center justify-between font-semibold text-slate-600 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-slate-400" />
                  <span>All Tickets</span>
                </div>
                <span className="text-slate-900 font-bold">31</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Summary Bottom Row */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-base">Final Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Platform Balance */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-0.5">
              <div className="text-base font-extrabold text-slate-900">$17,328.64</div>
              <div className="text-[12px] font-bold text-slate-400">Platform Balance (Available)</div>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <DollarSign className="size-4" />
            </div>
          </div>

          {/* Pending Stripe Payouts */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-0.5">
              <div className="text-base font-extrabold text-slate-900">$21,436.78</div>
              <div className="text-[12px] font-bold text-slate-400">Pending Stripe Payouts</div>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <TrendingUp className="size-4" />
            </div>
          </div>

          {/* This Month's Revenue */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-0.5">
              <div className="text-base font-extrabold text-slate-900">$182,456.21</div>
              <div className="text-[12px] font-bold text-slate-400">This Month&apos;s Revenue</div>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
              <DollarSign className="size-4" />
            </div>
          </div>

          {/* This Month's Fees Earned */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-0.5">
              <div className="text-base font-extrabold text-slate-900">$10,947.35</div>
              <div className="text-[12px] font-bold text-slate-400">This Month&apos;s Fees Earned</div>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <Coins className="size-4" />
            </div>
          </div>

          {/* Chargebacks (This Month) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="space-y-0.5">
              <div className="text-base font-extrabold text-slate-900">$325.00</div>
              <div className="text-[12px] font-bold text-slate-400">Chargebacks (This Month)</div>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
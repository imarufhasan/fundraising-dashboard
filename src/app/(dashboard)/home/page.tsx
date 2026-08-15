"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Rocket,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  ShieldCheck,
  Percent,
  Coins,
  Ticket,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 pb-8 sm:space-y-8 sm:pb-12">
      {/* =========================================================
          TOP METRICS
      ========================================================== */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {/* Live Campaigns */}
        <MetricCard
          icon={<TrendingUp className="size-5" />}
          iconClass="bg-indigo-50 text-indigo-600"
          value="412"
          label="Live Campaigns"
        />

        {/* Completed Campaigns */}
        <MetricCard
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          value="287"
          label="Completed Campaigns"
        />

        {/* Platform Revenue */}
        <MetricCard
          icon={<DollarSign className="size-5" />}
          iconClass="bg-cyan-50 text-cyan-600"
          value="$48,765.32"
          label="Platform Revenue"
        />

        {/* Launch Fee */}
        <MetricCard
          icon={<Rocket className="size-5" />}
          iconClass="bg-amber-50 text-amber-600"
          value="$12,345.00"
          label="Launch Fee Collected"
        />

        {/* Transaction Fees */}
        <MetricCard
          icon={<Percent className="size-5" />}
          iconClass="bg-rose-50 text-rose-600"
          value="$28,916.22"
          label="Transaction Fees (6%)"
        />

        {/* Brand Builder Fees */}
        <MetricCard
          icon={<Coins className="size-5" />}
          iconClass="bg-purple-50 text-purple-600"
          value="$3,984.03"
          label="Brand Builder Fees"
        />
      </div>

      {/* =========================================================
          SECONDARY METRICS
      ========================================================== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SecondaryMetricCard
          label="Pending Payouts"
          value="$21,436.78"
          icon={<DollarSign className="size-6" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SecondaryMetricCard
          label="Failed Payments"
          value="12"
          icon={<AlertTriangle className="size-6" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SecondaryMetricCard
          label="Live Campaigns"
          value="412"
          icon={<Users className="size-6" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SecondaryMetricCard
          label="Launch Fee Collected"
          value="$12,345.00"
          icon={<Rocket className="size-6" />}
          iconClass="bg-violet-50 text-violet-600"
        />
      </div>

      {/* =========================================================
          CHARTS + RECENT ACTIVITY
      ========================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
        {/* Charts */}
        <div className="space-y-4 sm:space-y-6 xl:col-span-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Revenue Overview */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-800">
                  Revenue Overview
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold sm:text-[12px]">
                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="size-2 rounded-full bg-cyan-400" />
                    Revenue
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="size-2 rounded-full bg-purple-500" />
                    Platform Fees
                  </div>
                </div>
              </div>

              <div className="relative h-44 w-full sm:h-48">
                <svg
                  className="size-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Grid */}
                  <line
                    x1="0"
                    y1="20"
                    x2="100"
                    y2="20"
                    stroke="#f1f5f9"
                    strokeWidth="0.5"
                  />

                  <line
                    x1="0"
                    y1="40"
                    x2="100"
                    y2="40"
                    stroke="#f1f5f9"
                    strokeWidth="0.5"
                  />

                  <line
                    x1="0"
                    y1="60"
                    x2="100"
                    y2="60"
                    stroke="#f1f5f9"
                    strokeWidth="0.5"
                  />

                  <line
                    x1="0"
                    y1="80"
                    x2="100"
                    y2="80"
                    stroke="#f1f5f9"
                    strokeWidth="0.5"
                  />

                  <defs>
                    <linearGradient
                      id="cyanGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity="0.15"
                      />
                      <stop
                        offset="100%"
                        stopColor="#22d3ee"
                        stopOpacity="0"
                      />
                    </linearGradient>

                    <linearGradient
                      id="purpleGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#a855f7"
                        stopOpacity="0.1"
                      />
                      <stop
                        offset="100%"
                        stopColor="#a855f7"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Revenue area */}
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

                  {/* Platform fees */}
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

                  <circle
                    cx="80"
                    cy="40"
                    r="3.5"
                    fill="#22d3ee"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  <circle
                    cx="80"
                    cy="70"
                    r="3"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Y-axis */}
                <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-between bg-white/80 pr-1 text-[8px] font-bold text-slate-400 sm:text-[9px]">
                  <span>$40K</span>
                  <span>$30K</span>
                  <span>$20K</span>
                  <span>$10K</span>
                  <span>$0</span>
                </div>
              </div>

              {/* X-axis */}
              <div className="mt-2 flex justify-between gap-2 overflow-hidden pl-6 text-[8px] font-bold text-slate-400 sm:text-[9px]">
                <span>May 19</span>
                <span>May 20</span>
                <span>May 21</span>
                <span>May 22</span>
                <span>May 23</span>
                <span>May 24</span>
                <span>May 25</span>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800">
                  Platform Revenue Breakdown
                </h3>
              </div>

              <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-around">
                {/* Donut */}
                <div className="relative flex size-32 shrink-0 items-center justify-center sm:size-36">
                  <svg
                    className="size-full -rotate-90"
                    viewBox="0 0 144 144"
                  >
                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="18"
                    />

                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#06b6d4"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="139.1"
                    />

                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="254.4"
                      transform="rotate(212.4 72 72)"
                    />

                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#a855f7"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="312.1"
                      transform="rotate(302.4 72 72)"
                    />

                    <circle
                      cx="72"
                      cy="72"
                      r="54"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray="339.29"
                      strokeDashoffset="312.1"
                      transform="rotate(331.2 72 72)"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-black text-slate-800 sm:text-sm">
                      $48,765.32
                    </span>

                    <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400 sm:text-[9px]">
                      Total Revenue
                    </span>
                  </div>
                </div>

                {/* Legends */}
                <div className="w-full max-w-sm space-y-2 text-xs font-semibold text-slate-600 sm:text-sm">
                  <RevenueLegend
                    color="bg-[#06b6d4]"
                    label="Transaction Fees (6%)"
                    value="$28,916.22 (59%)"
                  />

                  <RevenueLegend
                    color="bg-[#f59e0b]"
                    label="Launch Fees (6%)"
                    value="$12,345.00 (25%)"
                  />

                  <RevenueLegend
                    color="bg-[#a855f7]"
                    label="Brand Builder Fees"
                    value="$3,984.03 (8%)"
                  />

                  <RevenueLegend
                    color="bg-[#10b981]"
                    label="Other Revenue"
                    value="$3,520.07 (8%)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-4">
          <div className="mb-3 sm:mb-4">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
          </div>

          <div className="divide-y divide-slate-100">
            <ActivityItem
              avatar="R"
              title="New campaign created"
              description="“Jenna's Banana Pudding”"
              time="2 min ago"
              avatarClass="bg-slate-100 text-slate-600"
            />

            <ActivityItem
              icon={<Rocket className="size-4" />}
              title="Brand Builder order received"
              description="“Sweet Treats Co.”"
              time="15 min ago"
              avatarClass="bg-purple-50 text-purple-600"
            />

            <ActivityItem
              icon={<DollarSign className="size-4" />}
              title="Payout of $2,350.45 approved"
              description="To: Sweet Treats Co."
              time="1 hr ago"
              avatarClass="bg-emerald-50 text-emerald-600"
            />

            <ActivityItem
              icon={<AlertTriangle className="size-4" />}
              title="Campaign flagged"
              description="“Help Our Team”"
              time="2 hr ago"
              avatarClass="bg-amber-50 text-amber-600"
            />

            <ActivityItem
              icon={<HelpCircle className="size-4" />}
              title="Support ticket received"
              description="Order not received"
              time="3 hr ago"
              avatarClass="bg-blue-50 text-blue-600"
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          TABLES + QUICK ACTIONS
      ========================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
        {/* Tables */}
        <div className="space-y-4 sm:space-y-6 xl:col-span-8">
          {/* Top Campaigns */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">
                Top Campaign by Amount Raised
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse text-left">
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
                  <CampaignRow
                    rank="1"
                    campaign="Jenna's Banana Pudding"
                    organizer="Jenna Smith"
                    raised="$4,235.00"
                    orders="125"
                    donors="189"
                  />

                  <CampaignRow
                    rank="2"
                    campaign="Marc's Chocolate Cake"
                    organizer="Mark Johnson"
                    raised="$3,820.00"
                    orders="95"
                    donors="215"
                  />

                  <CampaignRow
                    rank="3"
                    campaign="Sara's Strawberry"
                    organizer="Sara Lee"
                    raised="$2,900.00"
                    orders="87"
                    donors="102"
                  />

                  <CampaignRow
                    rank="4"
                    campaign="Tom's Tiramisu"
                    organizer="Tom Brown"
                    raised="$2,450.00"
                    orders="160"
                    donors="300"
                  />

                  <CampaignRow
                    rank="5"
                    campaign="Linda's Lemon Bars"
                    organizer="Linda Green"
                    raised="$1,750.00"
                    orders="70"
                    donors="90"
                  />

                  <CampaignRow
                    rank="6"
                    campaign="Emily's Eclair"
                    organizer="Emily White"
                    raised="$4,150.00"
                    orders="93"
                    donors="145"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Brand Builder */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">
                Recent Brand Builder Submissions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Business Name</th>
                    <th className="pb-3">Items Requested</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Received</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  <SubmissionRow
                    business="Sweet Treats Co."
                    items="Tent, Shirts, Cups, Bags..."
                    status="New"
                    statusClass="bg-blue-50 text-blue-600"
                    received="5 min ago"
                  />

                  <SubmissionRow
                    business="Gourmet Delights"
                    items="Plates, Utensils, Napkins"
                    status="In Design"
                    statusClass="bg-amber-50 text-amber-600"
                    received="10 min ago"
                  />

                  <SubmissionRow
                    business="Beverage Bliss"
                    items="Cups, Straws, Coasters"
                    status="Mockups Sent"
                    statusClass="bg-purple-50 text-purple-600"
                    received="15 min ago"
                  />

                  <SubmissionRow
                    business="Savory Snacks Inc."
                    items="Boxes, Bags, Labels, Forks..."
                    status="Quote Sent"
                    statusClass="bg-rose-50 text-rose-600"
                    received="20 min ago"
                  />

                  <SubmissionRow
                    business="Fresh Bakes Co."
                    items="Pans, Wrappers, Boxes, Bags..."
                    status="Completed"
                    statusClass="bg-emerald-50 text-emerald-600"
                    received="25 min ago"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 sm:space-y-6 xl:col-span-4">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={<MessageSquare className="size-5" />}
                label="Create Announcement"
                textClass="text-indigo-600"
                hoverClass="hover:bg-indigo-50/50"
              />

              <QuickAction
                icon={<Download className="size-5" />}
                label="Export Revenue Report"
                textClass="text-cyan-600"
                hoverClass="hover:bg-cyan-50/50"
              />

              <QuickAction
                icon={<Eye className="size-5" />}
                label="View All Campaigns"
                textClass="text-blue-600"
                hoverClass="hover:bg-blue-50/50"
              />

              <QuickAction
                icon={<DollarSign className="size-5" />}
                label="Review Pending Payouts"
                textClass="text-amber-600"
                hoverClass="hover:bg-amber-50/50"
              />
            </div>
          </div>

          {/* Support Tickets */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-800">
                Support Tickets Overview
              </h3>
            </div>

            <div className="space-y-4">
              <TicketRow
                icon={<Ticket className="size-4 text-slate-400" />}
                label="Open Tickets"
                value="12"
              />

              <TicketRow
                icon={<Clock className="size-4 text-slate-400" />}
                label="Waiting on Customer"
                value="7"
              />

              <TicketRow
                icon={<AlertTriangle className="size-4 text-rose-500" />}
                label="Urgent / High Priority"
                value="3"
                danger
              />

              <TicketRow
                icon={<CheckCircle2 className="size-4 text-slate-400" />}
                label="Resolved Today"
                value="9"
              />

              <TicketRow
                icon={<ShieldCheck className="size-4 text-slate-400" />}
                label="All Tickets"
                value="31"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FINAL SUMMARY
      ========================================================== */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base font-bold text-slate-800">Final Summary</h3>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <SummaryCard
            value="$17,328.64"
            label="Platform Balance (Available)"
            icon={<DollarSign className="size-4" />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            value="$21,436.78"
            label="Pending Stripe Payouts"
            icon={<TrendingUp className="size-4" />}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            value="$182,456.21"
            label="This Month's Revenue"
            icon={<DollarSign className="size-4" />}
            iconClass="bg-cyan-50 text-cyan-600"
          />

          <SummaryCard
            value="$10,947.35"
            label="This Month's Fees Earned"
            icon={<Coins className="size-4" />}
            iconClass="bg-purple-50 text-purple-600"
          />

          <SummaryCard
            value="$325.00"
            label="Chargebacks (This Month)"
            icon={<AlertTriangle className="size-4" />}
            iconClass="bg-rose-50 text-rose-600"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

type MetricCardProps = {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
};

function MetricCard({
  icon,
  iconClass,
  value,
  label,
}: MetricCardProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl sm:size-11 ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="truncate text-lg font-bold text-slate-900 sm:text-xl">
          {value}
        </div>

        <div className="text-xs font-medium text-slate-500 sm:text-sm">
          {label}
        </div>
      </div>
    </div>
  );
}

type SecondaryMetricCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClass: string;
};

function SecondaryMetricCard({
  label,
  value,
  icon,
  iconClass,
}: SecondaryMetricCardProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="min-w-0 space-y-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
          {label}
        </span>

        <div className="truncate text-xl font-black text-slate-900 sm:text-2xl">
          {value}
        </div>
      </div>

      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-full sm:size-12 ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  );
}

type RevenueLegendProps = {
  color: string;
  label: string;
  value: string;
};

function RevenueLegend({
  color,
  label,
  value,
}: RevenueLegendProps) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-1 size-3 shrink-0 rounded ${color}`} />

      <span className="min-w-0 leading-5">
        {label}:{" "}
        <b className="text-slate-800">{value}</b>
      </span>
    </div>
  );
}

type ActivityItemProps = {
  avatar?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  time: string;
  avatarClass: string;
};

function ActivityItem({
  avatar,
  icon,
  title,
  description,
  time,
  avatarClass,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${avatarClass}`}
      >
        {avatar ? (
          <span className="text-sm font-bold">{avatar}</span>
        ) : (
          icon
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-bold text-slate-900">
          {title}
        </h4>

        <p className="mt-0.5 truncate text-sm text-slate-500">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-[10px] font-bold text-slate-400 sm:text-[12px]">
        {time}
      </span>
    </div>
  );
}

type CampaignRowProps = {
  rank: string;
  campaign: string;
  organizer: string;
  raised: string;
  orders: string;
  donors: string;
};

function CampaignRow({
  rank,
  campaign,
  organizer,
  raised,
  orders,
  donors,
}: CampaignRowProps) {
  return (
    <tr>
      <td className="py-3.5 pr-2 text-slate-400">{rank}</td>

      <td className="py-3.5 text-slate-700">{campaign}</td>

      <td className="py-3.5 text-slate-500">{organizer}</td>

      <td className="py-3.5 text-slate-900">{raised}</td>

      <td className="py-3.5 text-center text-slate-500">
        {orders}
      </td>

      <td className="py-3.5 text-center text-slate-500">
        {donors}
      </td>

      <td className="py-3.5 text-right">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-600">
          Live
        </span>
      </td>
    </tr>
  );
}

type SubmissionRowProps = {
  business: string;
  items: string;
  status: string;
  statusClass: string;
  received: string;
};

function SubmissionRow({
  business,
  items,
  status,
  statusClass,
  received,
}: SubmissionRowProps) {
  return (
    <tr>
      <td className="py-3.5 text-slate-900">{business}</td>

      <td className="py-3.5 text-slate-500">{items}</td>

      <td className="py-3.5">
        <span
          className={`rounded-md px-2 py-0.5 text-[12px] font-bold ${statusClass}`}
        >
          {status}
        </span>
      </td>

      <td className="py-3.5 text-right text-slate-400">
        {received}
      </td>
    </tr>
  );
}

type QuickActionProps = {
  icon: React.ReactNode;
  label: string;
  textClass: string;
  hoverClass: string;
};

function QuickAction({
  icon,
  label,
  textClass,
  hoverClass,
}: QuickActionProps) {
  return (
    <button
      type="button"
      className={`flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:p-4 ${hoverClass}`}
    >
      <span className={textClass}>{icon}</span>

      <span
        className={`text-[10px] font-bold leading-tight sm:text-[11px] ${textClass}`}
      >
        {label}
      </span>
    </button>
  );
}

type TicketRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
};

function TicketRow({
  icon,
  label,
  value,
  danger = false,
}: TicketRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 text-sm font-semibold ${danger ? "text-rose-600" : "text-slate-600"
        }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {icon}

        <span className="truncate">
          {label}
        </span>
      </div>

      <span
        className={`shrink-0 font-bold ${danger ? "text-rose-600" : "text-slate-900"
          }`}
      >
        {value}
      </span>
    </div>
  );
}

type SummaryCardProps = {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconClass: string;
};

function SummaryCard({
  value,
  label,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
      <div className="min-w-0 space-y-0.5">
        <div className="truncate text-base font-extrabold text-slate-900">
          {value}
        </div>

        <div className="text-[11px] font-bold leading-tight text-slate-400 sm:text-[12px]">
          {label}
        </div>
      </div>

      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  );
}
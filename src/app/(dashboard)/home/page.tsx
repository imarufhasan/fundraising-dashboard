"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  DollarSign,
  Loader2,
  Mail,
  Percent,
  Rocket,
  Search,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  useGetDashboardAnalyticsQuery,
  useGetNewsletterSubscribersQuery,
} from "@/store/api/dashboardApi";
import Image from "next/image";

const CIRCUMFERENCE = 2 * Math.PI * 54;
const NEWSLETTER_PREVIEW_LIMIT = 5;
const CAMPAIGNS_PAGE_SIZE = 5;

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function capitalize(text: string) {
  return text
    .split("_")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export default function Home() {
  const { data, isLoading, isError, refetch } = useGetDashboardAnalyticsQuery();

  // Small preview fetch just for the subscriber count + a handful of recent
  // emails; the full searchable/paginated list lives on the /newsletter page.
  const { data: newsletterData } = useGetNewsletterSubscribersQuery({
    page: 1,
    limit: NEWSLETTER_PREVIEW_LIMIT,
  });

  const analytics = data?.data;
  const newsletterMeta = newsletterData?.meta;
  const newsletterPreview = newsletterData?.data ?? [];

  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignPage, setCampaignPage] = useState(1);

  const filteredCampaigns = useMemo(() => {
    const list = analytics?.topCampaigns ?? [];
    const term = campaignSearch.trim().toLowerCase();

    if (!term) return list;

    return list.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(term) ||
        campaign.organizerName.toLowerCase().includes(term) ||
        campaign.campaignStatus.toLowerCase().includes(term),
    );
  }, [analytics, campaignSearch]);

  const campaignTotalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / CAMPAIGNS_PAGE_SIZE),
  );

  const paginatedCampaigns = useMemo(() => {
    const start = (campaignPage - 1) * CAMPAIGNS_PAGE_SIZE;
    return filteredCampaigns.slice(start, start + CAMPAIGNS_PAGE_SIZE);
  }, [filteredCampaigns, campaignPage]);

  const handleCampaignSearchChange = (value: string) => {
    setCampaignSearch(value);
    setCampaignPage(1);
  };

  const donutSegments = useMemo(() => {
    if (!analytics) return [];

    const segments = [
      {
        label: "Transaction Fees",
        value: analytics.transactionFeeRevenue,
        percentage: analytics.transactionFeeRevenuePercentage,
        color: "#06b6d4",
        legendClass: "bg-cyan-500",
      },
      {
        label: "Launch Fees",
        value: analytics.campaignLaunchRevenue,
        percentage: analytics.campaignLaunchRevenuePercentage,
        color: "#f59e0b",
        legendClass: "bg-amber-500",
      },
      {
        label: "Brand Builder Fees",
        value: analytics.brandBuilderRevenue,
        percentage: analytics.brandBuilderRevenuePercentage,
        color: "#a855f7",
        legendClass: "bg-purple-500",
      },
    ];

    const accountedRevenue = segments.reduce(
      (sum, segment) => sum + segment.value,
      0,
    );

    const otherRevenue = analytics.totalPlatformRevenue - accountedRevenue;

    if (otherRevenue > 0.01) {
      const otherPercentage =
        analytics.totalPlatformRevenue > 0
          ? (otherRevenue / analytics.totalPlatformRevenue) * 100
          : 0;

      segments.push({
        label: "Other Revenue",
        value: otherRevenue,
        percentage: otherPercentage,
        color: "#10b981",
        legendClass: "bg-emerald-500",
      });
    }

    let cumulative = 0;

    return segments.map((segment) => {
      const length = CIRCUMFERENCE * (Math.max(segment.percentage, 0) / 100);

      const rotateDeg = cumulative * 3.6;

      cumulative += segment.percentage;

      return {
        ...segment,
        dasharray: `${length} ${CIRCUMFERENCE - length}`,
        rotateDeg,
      };
    });
  }, [analytics]);

  const chart = useMemo(() => {
    const points = analytics?.revenueGraph ?? [];

    if (!points.length) return null;

    const maxValue = Math.max(
      1,
      ...points.map((point) => point.revenue),
      ...points.map((point) => point.platformFees),
    );

    const toXY = (value: number, index: number) => ({
      x: (index / Math.max(points.length - 1, 1)) * 100,
      y: 90 - (value / maxValue) * 70,
    });

    const buildPath = (values: number[]) =>
      values
        .map((value, index) => {
          const { x, y } = toXY(value, index);

          return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");

    const revenueValues = points.map((point) => point.revenue);
    const feeValues = points.map((point) => point.platformFees);

    const revenueLine = buildPath(revenueValues);
    const feeLine = buildPath(feeValues);

    const lastRevenuePoint = toXY(
      revenueValues[revenueValues.length - 1],
      revenueValues.length - 1,
    );

    const lastFeePoint = toXY(
      feeValues[feeValues.length - 1],
      feeValues.length - 1,
    );

    return {
      revenueLine,
      feeLine,
      revenueArea: `${revenueLine} L 100 100 L 0 100 Z`,
      feeArea: `${feeLine} L 100 100 L 0 100 Z`,
      lastRevenuePoint,
      lastFeePoint,
      yAxisLabels: [1, 0.75, 0.5, 0.25, 0].map((factor) =>
        formatCurrency(maxValue * factor),
      ),
      xAxisLabels: points.map((point) => formatDateShort(point.date)),
    };
  }, [analytics]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (isError || !analytics) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
        <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertTriangle className="size-5" />
        </div>

        <h2 className="mt-4 text-base font-bold text-slate-900">
          Failed to load dashboard analytics
        </h2>

        <p className="mt-1 max-w-md text-sm text-slate-500">
          Something went wrong while loading the dashboard.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const recentBrandBuilders = analytics?.recentBrandBuilders ?? [];

  const topCampaigns = analytics?.topCampaigns ?? [];

  return (
    <main className="w-full max-w-none space-y-5 pb-8 sm:space-y-8 sm:pb-12">
      {/* =========================
          TOP METRICS
      ========================== */}
      <section className="grid w-full grid-cols-2 gap-2.5 xs:gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          icon={<TrendingUp className="size-5" />}
          iconClass="bg-indigo-50 text-indigo-600"
          value={analytics.liveCampaign.toLocaleString()}
          label="Live Campaigns"
        />

        <MetricCard
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
          value={analytics.completedCampaign.toLocaleString()}
          label="Completed Campaigns"
        />

        <MetricCard
          icon={<DollarSign className="size-5" />}
          iconClass="bg-cyan-50 text-cyan-600"
          value={formatCurrency(analytics.totalPlatformRevenue)}
          label="Platform Revenue"
        />

        <MetricCard
          icon={<Rocket className="size-5" />}
          iconClass="bg-amber-50 text-amber-600"
          value={formatCurrency(analytics.campaignLaunchRevenue)}
          label="Launch Fee Collected"
        />

        <MetricCard
          icon={<Percent className="size-5" />}
          iconClass="bg-rose-50 text-rose-600"
          value={formatCurrency(analytics.transactionFeeRevenue)}
          label="Transaction Fees"
        />

        <MetricCard
          icon={<Coins className="size-5" />}
          iconClass="bg-purple-50 text-purple-600"
          value={formatCurrency(analytics.brandBuilderRevenue)}
          label="Brand Builder Fees"
        />
      </section>

      {/* =========================
          SECONDARY METRICS
      ========================== */}
      <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SecondaryMetricCard
          label="Failed Payments"
          value={analytics.totalFailedPayments.toLocaleString()}
          icon={<AlertTriangle className="size-6" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SecondaryMetricCard
          label="Live Campaigns"
          value={analytics.liveCampaign.toLocaleString()}
          icon={<Users className="size-6" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SecondaryMetricCard
          label="Launch Fee Collected"
          value={formatCurrency(analytics.campaignLaunchRevenue)}
          icon={<Rocket className="size-6" />}
          iconClass="bg-violet-50 text-violet-600"
        />

        <SecondaryMetricCard
          label="Newsletter Subscribers"
          value={(newsletterMeta?.total ?? 0).toLocaleString()}
          icon={<Mail className="size-6" />}
          iconClass="bg-pink-50 text-pink-600"
        />
      </section>

      {/* =========================
          REVENUE SECTION
      ========================== */}
      <section className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Overview */}
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-bold text-slate-800">Revenue Overview</h3>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="size-2 rounded-full bg-cyan-400" />
                Revenue
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="size-2 rounded-full bg-purple-500" />
                Platform Fees
              </div>
            </div>
          </div>

          {chart ? (
            <>
              <div className="relative h-44 w-full sm:h-48">
                <svg
                  className="size-full overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
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
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient
                      id="feeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {[20, 40, 60, 80].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="0.5"
                    />
                  ))}

                  <path d={chart.revenueArea} fill="url(#revenueGradient)" />

                  <path
                    d={chart.revenueLine}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <path d={chart.feeArea} fill="url(#feeGradient)" />

                  <path
                    d={chart.feeLine}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle
                    cx={chart.lastRevenuePoint.x}
                    cy={chart.lastRevenuePoint.y}
                    r="3.5"
                    fill="#22d3ee"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />

                  <circle
                    cx={chart.lastFeePoint.x}
                    cy={chart.lastFeePoint.y}
                    r="3"
                    fill="#a855f7"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-between bg-white/80 pr-2 text-[9px] font-bold text-slate-400">
                  {chart.yAxisLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex justify-between gap-1 overflow-hidden pl-7 text-[8px] font-bold text-slate-400 sm:gap-2 sm:pl-8 sm:text-[9px]">
                {chart.xAxisLabels.map((label, index) => (
                  <span key={index} className="truncate">
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-44 items-center justify-center text-sm font-semibold text-slate-400 sm:h-48">
              No revenue data for this period yet.
            </div>
          )}
        </div>

        {/* Revenue Breakdown */}
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="mb-5 font-bold text-slate-800">
            Platform Revenue Breakdown
          </h3>

          <div className="flex pb-4 h-full flex-col items-center justify-center gap-6 sm:gap-8 lg:flex-row">
            <div className="relative flex size-32 shrink-0 items-center justify-center sm:size-36">
              <svg className="size-full -rotate-90" viewBox="0 0 144 144">
                <circle
                  cx="72"
                  cy="72"
                  r="54"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                />

                {donutSegments.map((segment) => (
                  <circle
                    key={segment.label}
                    cx="72"
                    cy="72"
                    r="54"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="18"
                    strokeDasharray={segment.dasharray}
                    transform={`rotate(${segment.rotateDeg} 72 72)`}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-slate-800">
                  {formatCurrency(analytics.totalPlatformRevenue)}
                </span>

                <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Total Revenue
                </span>
              </div>
            </div>

            <div className="w-full max-w-md space-y-3">
              {donutSegments.map((segment) => (
                <RevenueLegend
                  key={segment.label}
                  color={segment.legendClass}
                  label={segment.label}
                  value={`${formatCurrency(segment.value)} (${segment.percentage.toFixed(
                    0,
                  )}%)`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TOP CAMPAIGNS + RECENT BRAND BUILDERS
      ========================== */}
      <section className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        {/* Top Campaigns */}

        {/* Top Campaigns */}
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="font-bold text-slate-800">
              Top Campaigns by Amount Raised
            </h3>
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden w-full overflow-x-auto sm:block">
            <table className="w-full min-w-190 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-3">#</th>
                  <th className="pb-3">Campaign</th>
                  <th className="pb-3">Organizer</th>
                  <th className="pb-3">Raised</th>
                  <th className="pb-3 text-center">Orders</th>
                  <th className="pb-3 text-center">Donors</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {topCampaigns.map((campaign, index) => (
                  <CampaignRow
                    key={campaign.campaignId}
                    rank={String(index + 1)}
                    campaign={campaign.name}
                    organizer={campaign.organizerName}
                    raised={formatCurrency(campaign.raisedAmount)}
                    orders={String(campaign.totalOrders)}
                    donors={String(campaign.totalDonations)}
                    status={capitalize(campaign.campaignStatus)}
                  />
                ))}

                {!topCampaigns.length && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-400"
                    >
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 sm:hidden">
            {topCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.campaignId}
                rank={index + 1}
                campaign={campaign.name}
                organizer={campaign.organizerName}
                raised={formatCurrency(campaign.raisedAmount)}
                orders={campaign.totalOrders}
                donors={campaign.totalDonations}
                status={capitalize(campaign.campaignStatus)}
              />
            ))}

            {!topCampaigns.length && (
              <div className="py-10 text-center text-sm font-semibold text-slate-400">
                No campaigns found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Brand Builders */}
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="font-bold text-slate-800">Recent Brand Builders</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Latest merchandise brands created by organizers.
            </p>
          </div>

          {recentBrandBuilders.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {recentBrandBuilders.map((brand) => (
                <div
                  key={brand.brandId}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {brand.brandLogo ? (
                      <BrandLogoImage
                        src={brand.brandLogo}
                        alt={brand.businessName || "Brand"}
                      />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-400">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-slate-800">
                        {brand.businessName}
                      </span>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                        {capitalize(brand.status)}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-slate-500">
                      <Store className="size-3 shrink-0" />
                      {brand.sellingItem}
                    </div>

                    <div className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                      by {brand.organizerName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm font-semibold text-slate-400">
              No brand builders yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

type MetricCardProps = {
  icon: React.ReactNode;
  iconClass: string;
  value: string;
  label: string;
};

function MetricCard({ icon, iconClass, value, label }: MetricCardProps) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-3 sm:p-4">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-2xl sm:size-11 ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="truncate text-base font-bold text-slate-900 sm:text-lg lg:text-xl">
          {value}
        </div>

        <div className="truncate text-[11px] font-medium text-slate-500 sm:text-xs lg:text-sm">
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
    <div className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="min-w-0">
        <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:text-xs">
          {label}
        </span>

        <div className="mt-1 truncate text-lg font-black text-slate-900 sm:text-xl lg:text-2xl">
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

function RevenueLegend({ color, label, value }: RevenueLegendProps) {
  return (
    <div className="flex items-start gap-3 text-sm font-semibold text-slate-600">
      <span className={`mt-1.5 size-3 shrink-0 rounded-full ${color}`} />

      <span className="min-w-0">
        {label}: <strong className="text-slate-800">{value}</strong>
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
  status: string;
};

const CAMPAIGN_STATUS_CLASS: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Completed: "bg-blue-50 text-blue-600",
  Draft: "bg-slate-100 text-slate-500",
  Cancelled: "bg-rose-50 text-rose-600",
  Rejected: "bg-rose-50 text-rose-600",
};

function CampaignRow({
  rank,
  campaign,
  organizer,
  raised,
  orders,
  donors,
  status,
}: CampaignRowProps) {
  const statusClass =
    CAMPAIGN_STATUS_CLASS[status] ?? "bg-slate-100 text-slate-500";

  return (
    <tr>
      <td className="py-4 pr-3 text-slate-400">{rank}</td>

      <td className="py-4 text-slate-700">{campaign}</td>

      <td className="py-4 text-slate-500">{organizer}</td>

      <td className="py-4 font-bold text-slate-900">{raised}</td>

      <td className="py-4 text-center text-slate-500">{orders}</td>

      <td className="py-4 text-center text-slate-500">{donors}</td>

      <td className="py-4 text-right">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}

type CampaignCardProps = {
  rank: number;
  campaign: string;
  organizer: string;
  raised: string;
  orders: number;
  donors: number;
  status: string;
};

function CampaignCard({
  rank,
  campaign,
  organizer,
  raised,
  orders,
  donors,
  status,
}: CampaignCardProps) {
  const statusClass =
    CAMPAIGN_STATUS_CLASS[status] ?? "bg-slate-100 text-slate-500";

  return (
    <div className="rounded-xl border border-slate-100 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 text-xs font-bold text-slate-400">
            #{rank}
          </span>

          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-800">
              {campaign}
            </div>

            <div className="truncate text-xs font-medium text-slate-400">
              {organizer}
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
        <span className="text-sm font-black text-slate-900">{raised}</span>

        <span>{orders} orders</span>

        <span>{donors} donors</span>
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <main className="w-full max-w-none space-y-5 pb-8 sm:space-y-8">
      {/* Metrics */}
      <div className="grid w-full grid-cols-2 gap-2.5 xs:gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonMetric key={index} />
        ))}
      </div>

      {/* Secondary metrics */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex h-24 w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
              <div className="h-7 w-24 animate-pulse rounded bg-slate-100" />
            </div>

            <div className="size-12 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonBreakdown />
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 h-5 w-48 animate-pulse rounded bg-slate-100" />

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-slate-100 pb-4"
            >
              <div className="h-4 w-5 animate-pulse rounded bg-slate-100" />
              <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
              <div className="hidden h-4 w-28 animate-pulse rounded bg-slate-100 sm:block" />
              <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 sm:block" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Brand builders */}
      <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5"
            >
              <div className="size-14 shrink-0 animate-pulse rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 h-5 w-56 animate-pulse rounded bg-slate-100" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function SkeletonMetric() {
  return (
    <div className="flex h-20 w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="size-11 animate-pulse rounded-2xl bg-slate-100" />

      <div className="flex-1 space-y-2">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="h-80 w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-slate-100" />

      <div className="flex h-56 items-end gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 animate-pulse rounded-t bg-slate-100"
            style={{
              height: `${30 + ((index * 17) % 60)}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonBreakdown() {
  return (
    <div className="flex h-80 w-full flex-col items-center justify-center gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row">
      <div className="size-36 animate-pulse rounded-full border-18 border-slate-100" />

      <div className="w-full max-w-xs space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="size-3 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandLogoImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <Loader2 className="size-4 animate-spin text-slate-400" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        className={`object-contain p-1 transition-opacity duration-200 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}

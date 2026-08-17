import { baseApi } from "./baseApi";

export type RevenueGraphPoint = {
  date: string;
  revenue: number;
  platformFees: number;
  brandBuilderRevenue: number;
  launchFeeRevenue: number;
};

export type TopCampaign = {
  name: string;
  raisedAmount: number;
  campaignId: string;
  thumbnail: string | null;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string | null;
  totalOrders: number;
  totalDonations: number;
  campaignStatus: string;
};

export type RecentBrandBuilder = {
  brandId: string;
  businessName: string;
  brandImage: string | null;
  brandLogo: string | null;
  sellingItem: string;
  status: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string | null;
};

export type DashboardAnalytics = {
  liveCampaign: number;
  completedCampaign: number;
  payoutRequestedCampaign: number;
  paidOutCampaign: number;
  cancelledCampaign: number;
  rejectedCampaign: number;
  totalCampaign: number;
  totalPlatformRevenue: number;
  brandBuilderRevenue: number;
  campaignLaunchRevenue: number;
  transactionFeeRevenue: number;
  brandBuilderRevenuePercentage: number;
  campaignLaunchRevenuePercentage: number;
  transactionFeeRevenuePercentage: number;
  brandBuilderTotal: number;
  brandBuilderStripeFee: number;
  brandBuilderTotalExcludingStripeFee: number;
  launchFeeCollectedTotal: number;
  launchFeeCollectedExcludingAllFees: number;
  transactionFees: number;
  failedOrderPayments: number;
  failedDonationPayments: number;
  failedBrandBuilderPayments: number;
  failedCampaignLaunchPayments: number;
  totalFailedPayments: number;
  revenueGraph: RevenueGraphPoint[];
  topCampaigns: TopCampaign[];
  recentBrandBuilders: RecentBrandBuilder[];
};

export type GetDashboardAnalyticsResponse = {
  success: boolean;
  message: string;
  data: DashboardAnalytics;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<GetDashboardAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/admin",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardApi;
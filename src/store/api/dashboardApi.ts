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

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NewsletterListResponse {
  success: boolean;
  message: string;
  meta: NewsletterMeta;
  data: NewsletterSubscriber[];
}

export interface NewsletterQueryArgs {
  page?: number;
  limit?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<GetDashboardAnalyticsResponse, void>({
      query: () => ({
        url: "/analytics/admin",
      }),
    }),

    getNewsletterSubscribers: builder.query<
      NewsletterListResponse,
      NewsletterQueryArgs | void
    >({
      query: (args) => ({
        url: "/newsletter/all",
        params: {
          page: args?.page ?? 1,
          limit: args?.limit ?? 10,
        },
      }),
      providesTags: ["Newsletter"],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery, useGetNewsletterSubscribersQuery } = dashboardApi;

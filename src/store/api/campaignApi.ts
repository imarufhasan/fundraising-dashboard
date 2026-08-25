import { baseApi } from "./baseApi";

// ---------- Shared / list types ----------

export type CampaignSupporter = {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignStatus =
  | "draft"
  | "active"
  | "completed"
  | "cancelled"
  | string;
export type CampaignPaymentStatus = "not_initiated" | "paid" | string;

export type Campaign = {
  _id: string;
  organizer: string;
  name: string;
  campaignCode: string;
  campaignCategory: string;
  thumbnail: string | null;
  story: string;
  fundUsage: string[];
  currency: string;
  goalAmount: number;
  raisedAmount: number;
  raisedAmountWithShipping: number;
  shippingFee?: number;
  launchFee: number;
  finalLaunchFee: number;
  discountAmount: number;
  promoCode: string | null;
  durationDays: number;
  allowLocalPickup: boolean;
  allowLocalDelivery: boolean;
  allowShipping: boolean;
  allowDonation: boolean;
  status: CampaignStatus;
  paymentStatus: CampaignPaymentStatus;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  publishedAt?: string;
  endedAt?: string;
  expectedPayoutDate?: string;
  totalProducts: number;
  organizerName: string;
  organizerEmail: string;
  organizerProfileImage: string | null;
  organizerStatus: string;
  remainingDays: number;
  totalSupporters: number;
  totalDonations?: number;
  totalOrders?: number;
  progress: number;
  orderedAmount: number;
  donationAmount: number;
  subtotal: number;
  totalAmount: number;
  stripeFee: number;
  platformFee: number;
  organizerAmount: number;
  organizerAmountWithoutShipping: number;
  supporters?: CampaignSupporter[];
  rejectedReason?: string | null; 
  cancelledReason?: string | null; 
};

// ---------- Detail-only types ----------

export type CampaignProduct = {
  _id: string;
  campaign: string;
  name: string;
  description: string;
  price: number;
  productImage: string | null;
  productType: "physical" | "digital" | string;
  isUnlimited?: boolean;
  stock?: number | null;
  sku?: string;
  weight?: number;
  digitalFileUrl?: string;
  digitalFileName?: string;
  downloadLimit?: number;
  createdAt: string;
  updatedAt: string;
};

export type CampaignDetail = Campaign & {
  products: CampaignProduct[];
};

// ---------- Response / params ----------

export type CampaignMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetAllCampaignsResponse = {
  success: boolean;
  message: string;
  meta: CampaignMeta;
  data: Campaign[];
};

export type GetAllCampaignsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
};

export type GetCampaignByIdResponse = {
  success: boolean;
  message: string;
  data: CampaignDetail;
};

export type EarlyCompleteCampaignResponse = {
  success: boolean;
  message: string;
  errorSources?: { path: string; message: string }[];
};

export type RejectCampaignResponse = {
  success: boolean;
  message: string;
  errorSources?: { path: string; message: string }[];
};

export type RejectCampaignPayload = {
  id: string;
  rejectedReason: string;
};

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCampaigns: builder.query<
      GetAllCampaignsResponse,
      GetAllCampaignsParams
    >({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        sortBy,
        sortOrder,
        status,
        paymentStatus,
        fromDate,
        toDate,
      }) => {
        // Backend Zod validation rejects empty strings for these fields,
        // so we only attach params that actually have a value.
        const params: Record<string, string | number> = {
          page,
          limit,
        };

        if (searchTerm?.trim()) params.searchTerm = searchTerm.trim();
        if (sortBy?.trim()) params.sortBy = sortBy.trim();
        if (sortOrder?.trim()) params.sortOrder = sortOrder.trim();
        if (status?.trim()) params.status = status.trim();
        if (paymentStatus?.trim()) params.paymentStatus = paymentStatus.trim();
        if (fromDate?.trim()) params.fromDate = fromDate.trim();
        if (toDate?.trim()) params.toDate = toDate.trim();

        return {
          url: "/campaign/all",
          params,
        };
      },

      providesTags: ["Campaign"],
    }),

    getCampaignById: builder.query<GetCampaignByIdResponse, string>({
      query: (id) => ({
        url: `/campaign/${id}`,
      }),

      providesTags: (_result, _error, id) => [{ type: "Campaign", id }],
    }),

    earlyCompleteCampaign: builder.mutation<
      EarlyCompleteCampaignResponse,
      string
    >({
      query: (id) => ({
        url: `/campaign/${id}/early-complete`,
        method: "PATCH",
      }),

      invalidatesTags: (_result, _error, id) => [
        "Campaign",
        { type: "Campaign", id },
      ],
    }),

    rejectCampaign: builder.mutation<
      RejectCampaignResponse,
      RejectCampaignPayload
    >({
      query: ({ id, rejectedReason }) => ({
        url: `/campaign/${id}/reject`,
        method: "PATCH",
        body: { rejectedReason },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Campaign",
        { type: "Campaign", id },
      ],
    }),
  }),
});

export const {
  useGetAllCampaignsQuery,
  useLazyGetCampaignByIdQuery,
  useGetCampaignByIdQuery,
  useEarlyCompleteCampaignMutation,
  useRejectCampaignMutation,
} = campaignApi;

import { baseApi } from "./baseApi";

export type OrganizerStatus = "active" | "pending" | "suspended" | "rejected" | string;

export type Organizer = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  totalCampaign: number;
  totalActiveCampaign: number;
  cancelledCampaign: number;
  rejectedCampaign: number;
  supporters: number;
  totalOrders: number;
  totalDonations: number;
  totalOrderedAmount: number;
  totalDonationAmount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  stripeFee: number;
  platformFee: number;
  organizerAmount: number;
  totalRevenue: number;
  organizerAmountWithoutShipping: number;
  role: string;
  status: OrganizerStatus;
  lastLogin: string | null;
  lastActivity: string | null;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizerMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetAllOrganizersResponse = {
  success: boolean;
  message: string;
  meta: OrganizerMeta;
  data: Organizer[];
};

export type GetAllOrganizersParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export const organizerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrganizers: builder.query<GetAllOrganizersResponse, GetAllOrganizersParams>({
      query: ({
        page = 1,
        limit = 5,
        searchTerm,
        sortBy,
        sortOrder,
        status,
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
        if (fromDate?.trim()) params.fromDate = fromDate.trim();
        if (toDate?.trim()) params.toDate = toDate.trim();

        return {
          url: "/user/all-orgs",
          params,
        };
      },
    }),
  }),
});

export const { useGetAllOrganizersQuery } = organizerApi;
import { baseApi } from "./baseApi";

export type Brand = {
  _id: string;
  organizer: string;

  products: string[];

  businessName: string;
  sellingItem: string;

  brandImage: string;
  brandLogo: string;

  colors: string[];

  brandStyle: string;

  budget: string;
  brandBuilderFee: number;
  paidAmount: number;

  status: string;

  createdAt: string;
  updatedAt: string;
  paidAt: string | null;

  organizerName: string;
  organizerEmail: string;
  organizerPhoneNumber: string | null;
  organizerProfileImage: string | null;
};

export type BrandResponse = {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Brand[];
};

export type GetBrandsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

export type CompleteBrandResponse = {
  success: boolean;
  message: string;
  errorSources?: { path: string; message: string }[];
};

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandResponse, GetBrandsParams>({
      query: ({ page = 1, limit = 10, searchTerm = "" }) => ({
        url: "/brand/all",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),

      providesTags: ["Brand"],
    }),

    completeBrandBuilder: builder.mutation<CompleteBrandResponse, string>({
      query: (id) => ({
        url: `/brand/${id}/complete`,
        method: "PATCH",
      }),

      invalidatesTags: ["Brand"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetBrandsQuery, useCompleteBrandBuilderMutation } = brandApi;

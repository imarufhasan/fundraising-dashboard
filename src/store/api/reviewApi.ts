import { baseApi } from "./baseApi";

export type Review = {
  _id: string;
  organizer: string;
  rating: number;
  message: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReviewMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetReviewsResponse = {
  success: boolean;
  message: string;
  meta: ReviewMeta;
  data: Review[];
};

export type ReviewSortOrder = "asc" | "desc";
export type ReviewSortBy = "createdAt" | "updatedAt";

export type GetReviewsParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: ReviewSortBy;
  sortOrder?: ReviewSortOrder;
  isFeatured?: boolean;
  fromDate?: string;
  toDate?: string;
};

export type ToggleFeaturedResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<GetReviewsResponse, GetReviewsParams>({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        sortBy,
        sortOrder,
        isFeatured,
        fromDate,
        toDate,
      }) => {
        const params: Record<string, string | number | boolean> = {
          page,
          limit,
        };

        if (searchTerm?.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        if (sortBy?.trim()) {
          params.sortBy = sortBy.trim();
        }

        if (sortOrder) {
          params.sortOrder = sortOrder;
        }

        // isFeatured is a tri-state filter (All / Featured / Not Featured),
        // so only attach it to the query when the user actually picked one.
        if (typeof isFeatured === "boolean") {
          params.isFeatured = isFeatured;
        }

        if (fromDate?.trim()) {
          params.fromDate = fromDate.trim();
        }

        if (toDate?.trim()) {
          params.toDate = toDate.trim();
        }

        return {
          url: "/review/all",
          method: "GET",
          params,
        };
      },

      providesTags: ["Review"],
    }),
    toggleReviewFeatured: builder.mutation<
      ToggleFeaturedResponse,
      { id: string; isFeatured: boolean }
    >({
      query: ({ id, isFeatured }) => ({
        url: `/review/${id}`,
        method: "PATCH",
        data: { isFeatured },
      }),

      invalidatesTags: ["Review"],
    }),
  }),

  overrideExisting: false,
});

export const { useGetAllReviewsQuery, useToggleReviewFeaturedMutation } =
  reviewApi;

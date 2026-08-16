import { baseApi } from "./baseApi";

export type ContentType =
  | "acceptable_use_policy"
  | "refund_policy"
  | "seller_agreement"
  | "website_disclaimer"
  | "cookie_policy"
  | "privacy_policy"
  | "buyer_terms_and_condition"
  | "charge_back_and_dispute_resolution_policy"
  | "terms_and_conditions";

export type ContentRecord = {
  _id: string;
  contentType: ContentType;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

type ContentApiResponse = {
  success: boolean;
  message: string;
  data: ContentRecord;
};

type SaveContentRequest = {
  contentType: ContentType;
  content: string;
};

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContent: builder.query<ContentRecord, ContentType>({
      query: (contentType) => `/content/${contentType}`,

      transformResponse: (response: ContentApiResponse) => {
        return response.data;
      },

      providesTags: (_result, _error, contentType) => [
        {
          type: "Content",
          id: contentType,
        },
      ],
    }),

    saveContent: builder.mutation<
      ContentRecord,
      SaveContentRequest
    >({
      query: (body) => ({
        url: "/content",
        method: "PATCH",
        body,
      }),

      transformResponse: (response: ContentApiResponse) => {
        return response.data;
      },

      invalidatesTags: (_result, _error, { contentType }) => [
        {
          type: "Content",
          id: contentType,
        },
      ],
    }),
  }),
});

export const {
  useGetContentQuery,
  useSaveContentMutation,
} = contentApi;
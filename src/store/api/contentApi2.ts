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

export interface ContentResponse {
    contentType: ContentType;
    content: string;
}

export interface SetContentRequest {
    contentType: ContentType;
    content: string;
}

export const contentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getContent: builder.query<ContentResponse, ContentType>({
            query: (contentType) => `/content/${contentType}`,
            providesTags: (_result, _error, contentType) => [
                { type: "Content", id: contentType },
            ],
        }),

        setContent: builder.mutation<ContentResponse, SetContentRequest>({
            query: (body) => ({
                url: "/content",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { contentType }) => [
                { type: "Content", id: contentType },
            ],
        }),
    }),
});

export const {
    useGetContentQuery,
    useSetContentMutation,
} = contentApi;
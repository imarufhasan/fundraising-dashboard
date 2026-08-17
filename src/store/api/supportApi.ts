import { baseApi } from "./baseApi";

export type SupportStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  supportId: string;
  ticketNo: string;
  userId: string | null;
  email: string;
  userName: string | null;
  userEmail: string | null;
  campaignId: string | null;
  campaignName: string | null;
  campaignCode: string | null;
  organizerId: string | null;
  organizerName: string | null;
  organizerEmail: string | null;
  subject: string;
  message: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupportListResponse {
  success: boolean;
  message: string;
  meta: SupportMeta;
  data: SupportTicket[];
}

export interface SupportListArgs {
  page?: number;
  limit?: number;
}

export interface SupportStatusUpdateData {
  _id: string;
  ticketNo: string;
  user: string | null;
  campaign: string | null;
  email: string;
  subject: string;
  message: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportStatusUpdateResponse {
  success: boolean;
  message: string;
  data: SupportStatusUpdateData;
}

export interface SupportReply {
  supportId: string;
  replyMessage: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportReplyResponse {
  success: boolean;
  message: string;
  data: SupportReply;
}

export interface SendSupportReplyArgs {
  supportId: string;
  replyMessage: string;
}

/* =========================================================
   API SLICE
========================================================= */

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportTickets: builder.query<
      SupportListResponse,
      SupportListArgs | void
    >({
      query: (args) => ({
        url: "/support/all",
        params: {
          page: args?.page ?? 1,
          limit: args?.limit ?? 10,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((ticket) => ({
                type: "Support" as const,
                id: ticket.supportId,
              })),
              { type: "Support" as const, id: "LIST" },
            ]
          : [{ type: "Support" as const, id: "LIST" }],
    }),

    markSupportInProgress: builder.mutation<
      SupportStatusUpdateResponse,
      string
    >({
      query: (supportId) => ({
        url: `/support/${supportId}/in-progress`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, supportId) => [
        { type: "Support", id: supportId },
        { type: "Support", id: "LIST" },
      ],
    }),

    markSupportResolved: builder.mutation<SupportStatusUpdateResponse, string>({
      query: (supportId) => ({
        url: `/support/${supportId}/resolved`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, supportId) => [
        { type: "Support", id: supportId },
        { type: "Support", id: "LIST" },
      ],
    }),

    sendSupportReply: builder.mutation<
      SupportReplyResponse,
      SendSupportReplyArgs
    >({
      query: (body) => ({
        url: "/support/reply",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, args) => [
        { type: "Support", id: args.supportId },
        { type: "Support", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useMarkSupportInProgressMutation,
  useMarkSupportResolvedMutation,
  useSendSupportReplyMutation,
} = supportApi;

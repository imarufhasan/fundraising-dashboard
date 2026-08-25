import { baseApi } from "./baseApi";

// ---------- Shared types ----------

export type DiscountType = "FIXED" | "PERCENTAGE";

export type PromoCodeUpdatedByDetail = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PromoCode = {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  // Populated creator/last-updater details
  updatedDetails?: PromoCodeUpdatedByDetail[];
};

// ---------- Response / params ----------

export type PromoCodeMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PromoCodeSortBy =
  | "createdAt"
  | "updatedAt"
  | "discountValue"
  | "usedCount"
  | "expiresAt";

export type PromoCodeSortOrder = "asc" | "desc";

export type GetAllPromoCodesResponse = {
  success: boolean;
  message: string;
  meta: PromoCodeMeta;
  data: PromoCode[];
};

export type GetAllPromoCodesParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: PromoCodeSortBy;
  sortOrder?: PromoCodeSortOrder;
  discountType?: DiscountType;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
};

export type GetPromoCodeByIdResponse = {
  success: boolean;
  message: string;
  data: PromoCode;
};

export type CreatePromoCodePayload = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit: number;
  expiresAt: string;
};

export type CreatePromoCodeResponse = {
  success: boolean;
  message: string;
  data: PromoCode;
};

export type UpdatePromoCodePayload = Partial<CreatePromoCodePayload> & {
  isActive?: boolean;
};

export type UpdatePromoCodeResponse = {
  success: boolean;
  message: string;
  data: PromoCode;
};

export const promoCodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPromoCodes: builder.query<
      GetAllPromoCodesResponse,
      GetAllPromoCodesParams
    >({
      query: ({
        page = 1,
        limit = 10,
        searchTerm,
        sortBy,
        sortOrder,
        discountType,
        isActive,
        fromDate,
        toDate,
      }) => {
        // Backend rejects empty-string params,
        // so only attach real values.
        const params: Record<string, string | number | boolean> = {
          page,
          limit,
        };

        if (searchTerm?.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        if (sortBy) {
          params.sortBy = sortBy;
        }

        if (sortOrder) {
          params.sortOrder = sortOrder;
        }

        if (discountType) {
          params.discountType = discountType;
        }

        if (typeof isActive === "boolean") {
          params.isActive = isActive;
        }

        if (fromDate?.trim()) {
          params.fromDate = fromDate.trim();
        }

        if (toDate?.trim()) {
          params.toDate = toDate.trim();
        }

        return {
          url: "/promo-code/all",
          method: "GET",
          params,
        };
      },

      providesTags: ["PromoCode"],
    }),

    getPromoCodeById: builder.query<GetPromoCodeByIdResponse, string>({
      query: (id) => ({
        url: `/promo-code/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "PromoCode", id }],
    }),

    createPromoCode: builder.mutation<
      CreatePromoCodeResponse,
      CreatePromoCodePayload
    >({
      query: (body) => ({
        url: "/promo-code",
        method: "POST",
        body: body,
      }),

      invalidatesTags: ["PromoCode"],
    }),

    updatePromoCode: builder.mutation<
      UpdatePromoCodeResponse,
      {
        id: string;
        body: UpdatePromoCodePayload;
      }
    >({
      query: ({ id, body }) => ({
        url: `/promo-code/${id}`,
        method: "PATCH",
        body: body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "PromoCode",
        { type: "PromoCode", id },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllPromoCodesQuery,
  useLazyGetPromoCodeByIdQuery,
  useGetPromoCodeByIdQuery,
  useCreatePromoCodeMutation,
  useUpdatePromoCodeMutation,
} = promoCodeApi;

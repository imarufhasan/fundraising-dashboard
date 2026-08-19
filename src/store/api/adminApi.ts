import { baseApi } from "./baseApi";

export type AdminUser = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage: string | null;
  role: "admin" | "support_admin";
  status: string;
  lastLogin: string | null;
  lastActivity: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminStatus = "active" | "blocked";

export type UpdateAdminStatusResponse = {
  success: boolean;
  message: string;
  data?: AdminUser;
};

export type AdminMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetAllAdminResponse = {
  success: boolean;
  message: string;
  meta: AdminMeta;
  data: AdminUser[];
};

export type GetAllAdminParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  role?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export type CreateAdminResponse = {
  success: boolean;
  message: string;
  data?: AdminUser;
};

export type UpdateAdminResponse = {
  success: boolean;
  message: string;
  data?: AdminUser;
};

export const allApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query<GetAllAdminResponse, GetAllAdminParams>({
      query: ({
        page = 1,
        limit = 20,
        searchTerm,
        sortBy,
        sortOrder,
        role,
        status,
        fromDate,
        toDate,
      }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        };

        if (searchTerm?.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        if (sortBy?.trim()) {
          params.sortBy = sortBy.trim();
        }

        if (sortOrder?.trim()) {
          params.sortOrder = sortOrder.trim();
        }

        if (role?.trim()) {
          params.role = role.trim();
        }

        if (status?.trim()) {
          params.status = status.trim();
        }

        if (fromDate?.trim()) {
          params.fromDate = fromDate.trim();
        }

        if (toDate?.trim()) {
          params.toDate = toDate.trim();
        }

        return {
          url: "/user/all",
          params,
        };
      },
    }),

    createAdmin: builder.mutation<CreateAdminResponse, FormData>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
    }),

    updateAdmin: builder.mutation<
      UpdateAdminResponse,
      {
        id: string;
        name: string;
        phoneNumber: string;
      }
    >({
      query: ({ id, name, phoneNumber }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: {
          name,
          phoneNumber,
        },
      }),
    }),

    updateAdminStatus: builder.mutation<
      UpdateAdminStatusResponse,
      {
        id: string;
        status: AdminStatus;
        reason?: string;
      }
    >({
      query: ({ id, status, reason  }) => ({
        url: `/auth/update-status/${id}`,
        method: "PATCH",
        body: {
          status,
          reason,
        },
      }),
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useUpdateAdminStatusMutation,
} = allApi;
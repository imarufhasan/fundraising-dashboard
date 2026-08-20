import { baseApi } from "./baseApi";

export type Profile = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: string;
  role: string;
  profileImage: string;
  isOnboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetMeResponse = {
  success: boolean;
  message: string;
  data: Profile;
};

export type UpdateProfileResponse = {
  success: boolean;
  message: string;
  data?: Profile;
};

export type ChangePasswordParams = {
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginData {
  refreshToken: string;
  accessToken: string;
  role: string;
  email: string;
  isTwoFactorEnabled: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/admin-login",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Auth", "User"],
    }),

    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
      }),
    }),
    // updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
    //   query: (body) => ({
    //     url: "/auth/profile",
    //     method: "PATCH",
    //     body,
    //   }),
    // }),

    updateProfile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: formData,
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordParams
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/auth/changed-password",
        method: "PATCH",
        body: { oldPassword, newPassword },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;

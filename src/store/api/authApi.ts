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

interface BasicResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface VerifyOtpResponse extends BasicResponse {
  data: {
    resetToken: string;
  };
}

interface ResendOtpPayload {
  email: string;
}

interface ResendOtpResponse extends BasicResponse {
  data: {
    geneated: boolean;
  };
}

interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
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
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),

    forgotPassword: builder.mutation<BasicResponse, ForgotPasswordPayload>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpPayload>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpPayload>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<BasicResponse, ResetPasswordPayload>({
      query: ({ resetToken, newPassword }) => ({
        url: `/auth/reset-password?resetToken=${resetToken}`,
        method: "POST",
        body: { newPassword },
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

  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;

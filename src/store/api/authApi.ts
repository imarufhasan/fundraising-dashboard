import { baseApi } from "./baseApi";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    accessToken?: string;
    data?: {
        token?: string;
        accessToken?: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    };
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Auth", "User"],
        }),
    }),

    overrideExisting: false,
});

export const { useLoginMutation } = authApi;
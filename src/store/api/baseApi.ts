import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["PromoCode", "Review", "Auth", "User", "Content", "Admin", "Newsletter", "Support", "Brand", "Campaign"],

  endpoints: () => ({}),
});
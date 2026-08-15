"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import AuthCard from "@/components/auth/AuthCard";
import { useLoginMutation } from "@/store/api/authApi";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("mostafizurrahaman0401@gmail.com");
  const [password, setPassword] = useState("test123@PASS");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      const response = await login({
        email: email.trim(),
        password,
      }).unwrap();

      console.log("Login response:", response);

      const token =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken;

      if (token) {
        if (rememberPassword) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
      }

      router.push("/home");
    } catch (error: unknown) {
      console.error("Login error:", error);

      const apiError = error as FetchBaseQueryError;

      const message =
        typeof apiError.data === "object" &&
        apiError.data !== null &&
        "message" in apiError.data &&
        typeof apiError.data.message === "string"
          ? apiError.data.message
          : "Login failed. Please check your email and password.";

      setError(message);
    }
  };

  return (
    <AuthCard>
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-900">
          Log in to your account
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Please enter your email and password to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your gmail"
            disabled={isLoading}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              disabled={isLoading}
              className="size-4 rounded border-emerald-400 text-indigo-600 focus:ring-indigo-500"
            />
            Remember Password
          </label>

          <Link
            href="/forgot-password"
            className="shrink-0 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </AuthCard>
  );
}

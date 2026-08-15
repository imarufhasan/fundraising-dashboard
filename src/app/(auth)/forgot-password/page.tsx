"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";


export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: call API to send reset code, then pass the email along
        router.push(`/verify-code?email=${encodeURIComponent(email)}`);
    };

    return (
        <AuthCard>
            <div className="text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    Forgot password?
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter your gmail"
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
                >
                    Send Code
                </button>
            </form>
        </AuthCard>
    );
}
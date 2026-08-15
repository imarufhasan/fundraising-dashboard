"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";


export default function ResetPasswordPage() {
    const router = useRouter();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        // TODO: submit the new password to the backend
        router.push("/login");
    };

    return (
        <AuthCard>
            <div className="text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    Set a new password
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Create a new password. Ensure it differs from
                    <br />
                    previous ones for security
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label
                        htmlFor="new-password"
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••••"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="confirm-password"
                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••••"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
                            aria-label={
                                showConfirmPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm font-medium text-rose-500">{error}</p>}

                <button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
                >
                    Update Password
                </button>
            </form>
        </AuthCard>
    );
}
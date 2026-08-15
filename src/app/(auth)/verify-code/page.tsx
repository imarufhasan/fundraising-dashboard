"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";


const CODE_LENGTH = 5;

export default function VerifyCodePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "your email";

    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/[^0-9]/g, "").slice(-1);

        const next = [...digits];
        next[index] = digit;
        setDigits(next);

        if (digit && index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = digits.join("");
        // TODO: verify `code` against the backend
        router.push("/reset-password");
    };

    return (
        <AuthCard>
            <div className="text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    Verification code
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    We sent a reset link to {email}
                    <br />
                    enter 5 digit code that is mentioned in the email
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="flex justify-center gap-2.5">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="size-12 rounded-lg border border-slate-200 text-center text-base font-semibold text-slate-800 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
                >
                    Verify Code
                </button>

                <p className="text-center text-sm text-slate-500">
                    You have not received the email?{" "}
                    <button
                        type="button"
                        className="font-semibold text-emerald-500 transition-colors hover:text-emerald-600"
                    >
                        Resend
                    </button>
                </p>
            </form>
        </AuthCard>
    );
}
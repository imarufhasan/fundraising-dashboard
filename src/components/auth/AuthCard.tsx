import Link from "next/link";

type AuthCardProps = {
    children: React.ReactNode;
};

const footerLinks = [
    { href: "/about-us", label: "About Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

/**
 * Shared shell for every auth screen (login, forgot password, verify code,
 * reset password). Keeps the centered white card consistent with the rest
 * of the dashboard's card styling (rounded corners, hairline border, soft shadow).
 */
export default function AuthCard({ children }: AuthCardProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
                {children}
            </div>

            <nav
                aria-label="Legal links"
                className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-400"
            >
                {footerLinks.map((link, index) => (
                    <span key={link.href} className="flex items-center gap-4">
                        <Link
                            href={link.href}
                            className="transition-colors hover:text-indigo-600"
                        >
                            {link.label}
                        </Link>
                        {index < footerLinks.length - 1 && (
                            <span className="text-slate-300">•</span>
                        )}
                    </span>
                ))}
            </nav>
        </div>
    );
}
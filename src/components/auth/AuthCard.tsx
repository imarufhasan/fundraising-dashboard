type AuthCardProps = {
    children: React.ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
                {children}
            </div>
        </div>
    );
}
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextType = {
  showToast: (toast: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();

      setToasts((current) => [
        ...current,
        {
          ...toast,
          id,
        },
      ]);

      // Auto close after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const success = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "success",
        title,
        message,
      });
    },
    [showToast],
  );

  const error = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "error",
        title,
        message,
      });
    },
    [showToast],
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "warning",
        title,
        message,
      });
    },
    [showToast],
  );

  const info = useCallback(
    (title: string, message?: string) => {
      showToast({
        type: "info",
        title,
        message,
      });
    },
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="pointer-events-none fixed right-4 top-4 z-9999 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const config = {
    success: {
      icon: CheckCircle2,
      iconClass: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    error: {
      icon: XCircle,
      iconClass: "text-rose-600",
      iconBg: "bg-rose-50",
    },
    warning: {
      icon: AlertTriangle,
      iconClass: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    info: {
      icon: Info,
      iconClass: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className="pointer-events-auto w-full animate-in slide-in-from-right-5 fade-in duration-200">
      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
        >
          <Icon className={`size-5 ${config.iconClass}`} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {toast.title}
          </p>

          {toast.message && (
            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
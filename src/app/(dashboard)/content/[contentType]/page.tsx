"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Loader2,
  PenLine,
  RotateCcw,
  Save,
} from "lucide-react";

import {
  ContentType,
  getContentLabel,
  isValidContentType,
} from "../../../../../lib/constants/content-types";

import {
  useGetContentQuery,
  useSaveContentMutation,
} from "@/store/api/contentApi";

type Tab = "write" | "preview";

export default function ContentEditorPage() {
  const params = useParams<{ contentType: string }>();
  const slug = params.contentType;

  if (!isValidContentType(slug)) {
    return <InvalidContentType slug={slug} />;
  }

  return <ContentEditor contentType={slug} />;
}

function ContentEditor({ contentType }: { contentType: ContentType }) {
  const label = getContentLabel(contentType);

  const { data, isLoading, isError, error, refetch } =
    useGetContentQuery(contentType);

  console.log("GET CONTENT:", data);

  const initialContent = data?.content ?? "";
  const updatedAt = data?.updatedAt;

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <BackToDashboard />

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <EditorSkeleton />
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (isError) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? error.status
        : undefined;

    /*
     * 404 means content does not exist yet.
     * We allow the user to create new content.
     */
    if (status !== 404) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <BackToDashboard />

          <div className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle className="size-5" />
              </div>

              <p className="text-sm font-semibold text-slate-700">
                Couldn&apos;t load this content
              </p>

              <p className="max-w-sm text-sm text-slate-500">
                Failed to load {label}. Please try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <ContentEditorForm
      key={contentType}
      contentType={contentType}
      label={label}
      initialContent={initialContent}
      updatedAt={updatedAt}
    />
  );
}

/* ================================================== */
/* Content Editor Form */
/* ================================================== */

function ContentEditorForm({
  contentType,
  label,
  initialContent,
  updatedAt,
}: {
  contentType: ContentType;
  label: string;
  initialContent: string;
  updatedAt?: string;
}) {
  /*
   * Initial API content is used to initialize local draft.
   *
   * No useEffect is required.
   */
  const [draft, setDraft] = useState(initialContent);

  const [tab, setTab] = useState<Tab>("write");

  const [saveError, setSaveError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();

  /*
   * Check whether user changed the content.
   */
  const isDirty = draft !== initialContent;

  /*
   * Save content
   */
  const handleSave = async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setSaveError("");
    setShowSuccess(false);

    try {
      await saveContent({
        contentType,
        content: draft,
      }).unwrap();

      /*
       * Save successful
       */
      setShowSuccess(true);

      /*
       * Hide success message after 2 seconds
       */
      window.setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data &&
        typeof err.data.message === "string"
          ? err.data.message
          : "Failed to save content.";

      setSaveError(message);
    }
  };

  /*
   * Reset draft to API content.
   */
  const handleReset = () => {
    setDraft(initialContent);
    setSaveError("");
    setShowSuccess(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Back */}
      <BackToDashboard />

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Content
          </p>

          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {label}
          </h1>

          {updatedAt && (
            <p className="mt-1 text-xs font-medium text-slate-400">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}

            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success */}
      {showSuccess && (
        <StatusBanner
          tone="success"
          icon={<CheckCircle2 className="size-4" />}
          message="Content saved successfully."
        />
      )}

      {/* Error */}
      {saveError && (
        <StatusBanner
          tone="error"
          icon={<AlertTriangle className="size-4" />}
          message={saveError}
        />
      )}

      {/* Editor */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-100 px-3 pt-3">
          <TabButton
            active={tab === "write"}
            onClick={() => setTab("write")}
            icon={<PenLine className="size-3.5" />}
            label="Write"
          />

          <TabButton
            active={tab === "preview"}
            onClick={() => setTab("preview")}
            icon={<Eye className="size-3.5" />}
            label="Preview"
          />

          {isDirty && (
            <span className="ml-auto mb-2 flex items-center gap-1.5 self-center text-xs font-semibold text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Editor */}
        <div className="p-4 sm:p-6">
          {tab === "write" ? (
            <textarea
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setSaveError("");
                setShowSuccess(false);
              }}
              spellCheck={false}
              placeholder="Write or paste HTML content here..."
              className="h-[480px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-mono text-[13px] leading-6 text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <div className="min-h-[480px] rounded-xl border border-slate-200 bg-white p-6">
              {draft.trim() ? (
                <div
                  className="prose-legal space-y-4 text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-800 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: draft,
                  }}
                />
              ) : (
                <p className="text-sm text-slate-400">
                  Nothing to preview yet — switch to Write to add content.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================== */
/* Back To Dashboard */
/* ================================================== */

function BackToDashboard() {
  return (
    <Link
      href="/home"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600"
    >
      <ArrowLeft className="size-4" />
      Back to Dashboard
    </Link>
  );
}

/* ================================================== */
/* Tab Button */
/* ================================================== */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-b-2 border-indigo-600 text-indigo-600"
          : "border-b-2 border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================================================== */
/* Status Banner */
/* ================================================== */

function StatusBanner({
  tone,
  icon,
  message,
}: {
  tone: "success" | "error";
  icon: React.ReactNode;
  message: string;
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <div
      className={`mt-4 flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold ${toneClass}`}
    >
      {icon}
      {message}
    </div>
  );
}

/* ================================================== */
/* Skeleton */
/* ================================================== */

function EditorSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-4 w-40 rounded bg-slate-100" />

      <div className="mt-5 h-[420px] w-full rounded-xl bg-slate-50" />
    </div>
  );
}

/* ================================================== */
/* Invalid Content Type */
/* ================================================== */

function InvalidContentType({ slug }: { slug: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <AlertTriangle className="size-5" />
      </div>

      <h1 className="text-lg font-bold text-slate-900">Unknown content type</h1>

      <p className="text-sm text-slate-500">
        &ldquo;{slug}&rdquo; isn&apos;t a recognized content type.
      </p>

      <Link
        href="/home"
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
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
} from "../../../../lib/constants/content-types";

import {
  useGetContentQuery,
  useSaveContentMutation,
} from "@/store/api/contentApi";

import RichTextEditor from "@/components/RichTextEditor";
import { getErrorMessage } from "@/lib/utils/error-handler";
import { useToast } from "@/components/ToastProvider";

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

  if (isError) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? error.status
        : undefined;

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
  const { success, error: showError } = useToast();

  const [draft, setDraft] = useState(initialContent);
  const [tab, setTab] = useState<Tab>("write");
  const [saveContent, { isLoading: isSaving }] = useSaveContentMutation();

  const isDirty = draft !== initialContent;

  const handleSave = async () => {
    if (!isDirty || isSaving) return;

    try {
      await saveContent({
        contentType,
        content: draft,
      }).unwrap();

      success("Content Saved", `${label} has been updated successfully.`);
    } catch (err: unknown) {
      console.error("SAVE CONTENT ERROR:", err);
      const messageText = getErrorMessage(err, "Failed to save content.");
      showError("Save Failed", messageText);
    }
  };

  const handleReset = () => {
    setDraft(initialContent);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <BackToDashboard />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>

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

      <div className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
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

        <div className="p-4 sm:p-6">
          {tab === "write" ? (
            <RichTextEditor
              value={draft}
              onChange={(value) => setDraft(value)}
            />
          ) : (
            <div className="min-h-120 rounded-xl border border-slate-200 bg-white p-6">
              {draft.trim() ? (
                <div
                  className="
    prose-legal
    max-w-none
    text-sm
    leading-7
    text-slate-600
    sm:text-[15px]

    [&_h1]:mb-4
    [&_h1]:text-2xl
    [&_h1]:font-bold
    [&_h1]:text-slate-900

    [&_h2]:mb-3
    [&_h2]:mt-7
    [&_h2]:text-xl
    [&_h2]:font-bold
    [&_h2]:text-slate-900

    [&_h3]:mb-2
    [&_h3]:mt-5
    [&_h3]:text-lg
    [&_h3]:font-bold
    [&_h3]:text-slate-800

    [&_p]:mb-4

    [&_ul]:mb-4
    [&_ul]:list-disc
    [&_ul]:pl-6

    [&_ol]:mb-4
    [&_ol]:list-decimal
    [&_ol]:pl-6

    [&_li]:mt-1

    [&_strong]:font-bold
    [&_strong]:text-slate-800

    [&_a]:font-semibold
    [&_a]:text-indigo-600
    [&_a]:underline

    [&_blockquote]:my-5
    [&_blockquote]:border-l-4
    [&_blockquote]:border-indigo-300
    [&_blockquote]:bg-indigo-50
    [&_blockquote]:px-4
    [&_blockquote]:py-3
    [&_blockquote]:italic
    [&_blockquote]:text-slate-600

    [&_pre]:my-5
    [&_pre]:overflow-x-auto
    [&_pre]:rounded-xl
    [&_pre]:bg-slate-900
    [&_pre]:p-4
    [&_pre]:text-sm
    [&_pre]:text-slate-100

    [&_code]:rounded
    [&_code]:bg-slate-100
    [&_code]:px-1
    [&_code]:py-0.5
    [&_code]:text-sm
    [&_code]:text-pink-600

    [&_hr]:my-6
    [&_hr]:border-slate-200
  "
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


function EditorSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-4 w-40 rounded bg-slate-100" />

      <div className="mt-5 h-105 w-full rounded-xl bg-slate-50" />
    </div>
  );
}

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

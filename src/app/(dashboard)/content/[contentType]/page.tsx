"use client";

import { useEffect, useState } from "react";
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
import { ContentType, getContentLabel, isValidContentType } from "../../../../../lib/constants/content-types";
import { ContentApiError, fetchContent, saveContent } from "@/store/api/content";


type LoadState = "loading" | "ready" | "error";
type SaveState = "idle" | "saving" | "saved" | "error";
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

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");

  const [savedContent, setSavedContent] = useState("");
  const [draft, setDraft] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();

  const [tab, setTab] = useState<Tab>("write");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");

  const isDirty = draft !== savedContent;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      setLoadError("");

      try {
        const record = await fetchContent(contentType);
        if (cancelled) return;

        setSavedContent(record.content ?? "");
        setDraft(record.content ?? "");
        setUpdatedAt(record.updatedAt);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;

        // 404 just means this content hasn't been created yet — start blank
        // instead of showing an error.
        if (err instanceof ContentApiError && err.status === 404) {
          setSavedContent("");
          setDraft("");
          setLoadState("ready");
          return;
        }

        setLoadError(
          err instanceof Error ? err.message : "Failed to load content"
        );
        setLoadState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [contentType]);

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError("");

    try {
      const record = await saveContent(contentType, draft);
      setSavedContent(draft);
      setUpdatedAt(record.updatedAt ?? new Date().toISOString());
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      setSaveError(err instanceof Error ? err.message : "Failed to save content");
    }
  };

  const handleReset = () => {
    setDraft(savedContent);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {loadState === "ready" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || saveState === "saving"}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saveState === "saving"}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              {saveState === "saving" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {saveState === "saving" ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {saveState === "saved" && (
        <StatusBanner
          tone="success"
          icon={<CheckCircle2 className="size-4" />}
          message="Content saved successfully."
        />
      )}
      {saveState === "error" && (
        <StatusBanner
          tone="error"
          icon={<AlertTriangle className="size-4" />}
          message={saveError}
        />
      )}

      <div className="mt-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loadState === "loading" && <EditorSkeleton />}

        {loadState === "error" && (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="size-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Couldn&apos;t load this content
            </p>
            <p className="max-w-sm text-sm text-slate-500">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {loadState === "ready" && (
          <>
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
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  spellCheck={false}
                  placeholder="Write or paste HTML content here..."
                  className="h-[480px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-mono text-[13px] leading-6 text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <div className="min-h-[480px] rounded-xl border border-slate-200 bg-white p-6">
                  {draft.trim() ? (
                    <div
                      className="prose-legal space-y-4 text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-6 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-slate-700"
                      dangerouslySetInnerHTML={{ __html: draft }}
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      Nothing to preview yet — switch to Write to add content.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
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

function EditorSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-4 w-40 rounded bg-slate-100" />
      <div className="mt-5 h-[420px] w-full rounded-xl bg-slate-50" />
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
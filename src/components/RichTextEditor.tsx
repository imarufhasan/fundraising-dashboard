"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";

import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Link2Off,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Table as TableIcon,
  Highlighter,
  Palette,
  Minus,
  ChevronDown,
  Check,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Slate", value: "#0f172a" },
  { label: "Red", value: "#dc2626" },
  { label: "Amber", value: "#d97706" },
  { label: "Green", value: "#16a34a" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Fuchsia", value: "#c026d3" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
];

type HeadingOption = {
  label: string;
  level: 0 | 1 | 2 | 3;
};

const HEADING_OPTIONS: HeadingOption[] = [
  { label: "Paragraph", level: 0 },
  { label: "Heading 1", level: 1 },
  { label: "Heading 2", level: 2 },
  { label: "Heading 3", level: 3 },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-indigo-600 underline font-semibold",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none min-h-90 px-4 py-3 focus:outline-none " +
          "prose-headings:font-bold prose-headings:text-slate-900 " +
          "prose-a:text-indigo-600 prose-img:rounded-lg",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
   * Keep the editor in sync when `value` changes from outside
   * (e.g. content finishes loading, or a Reset button restores
   * the original draft). Without this, the editor only ever
   * reflects its very first `content` and ignores later prop
   * updates, since tiptap treats `content` as init-only.
   */
  useEffect(() => {
    if (!editor) return;

    const isSame = editor.getHTML() === value;
    if (isSame) return;

    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageFile = useCallback(
    (file: File) => {
      if (!editor) return;

      // TODO: swap this for a real upload endpoint and insert
      // the returned URL instead of embedding base64.
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result;
        if (typeof src === "string") {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    },
    [editor],
  );

  if (!editor) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="h-11 animate-pulse border-b border-slate-100 bg-slate-50" />
        <div className="min-h-90 animate-pulse bg-slate-50/40" />
      </div>
    );
  }

  const wordCount = editor.storage.characterCount
    ? undefined
    : editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 border-b border-slate-100 bg-white/95 px-2.5 py-2 backdrop-blur">
        <HeadingDropdown editor={editor} />

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="size-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ColorPickerButton editor={editor} />
          <HighlightPickerButton editor={editor} />
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Blockquote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Code block"
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Horizontal rule"
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="size-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            title="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Align center"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="size-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <Divider />

        <ToolbarGroup>
          <ToolbarButton
            title="Add link"
            active={editor.isActive("link")}
            onClick={setLink}
          >
            <Link2 className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Remove link"
            active={false}
            disabled={!editor.isActive("link")}
            onClick={() => editor.chain().focus().unsetLink().run()}
          >
            <Link2Off className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Insert image"
            active={false}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="size-4" />
          </ToolbarButton>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
              e.target.value = "";
            }}
          />

          <ToolbarButton
            title="Insert table"
            active={false}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TableIcon className="size-4" />
          </ToolbarButton>
        </ToolbarGroup>

        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            title="Undo"
            active={false}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="size-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Redo"
            active={false}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="size-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor surface */}
      <EditorContent editor={editor} />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-1.5 text-[11px] font-semibold text-slate-400">
        {wordCount !== undefined && <span>{wordCount} words</span>}
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}

/* ================================================== */
/* Toolbar primitives */
/* ================================================== */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-50/70 p-0.5">
      {children}
    </div>
  );
}

function ToolbarButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-white hover:text-indigo-600"
      } disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-0.5 h-6 w-px shrink-0 bg-slate-200" />;
}

/* ================================================== */
/* Heading dropdown */
/* ================================================== */

function HeadingDropdown({
  editor,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  const current =
    HEADING_OPTIONS.find(
      (option) =>
        option.level > 0 && editor.isActive("heading", { level: option.level }),
    ) ?? HEADING_OPTIONS[0];

  const applyHeading = (option: HeadingOption) => {
    if (option.level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: option.level as 1 | 2 | 3 })
        .run();
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        {current.label}
        <ChevronDown className="size-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
          {HEADING_OPTIONS.map((option) => {
            const isActive = option.label === current.label;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => applyHeading(option)}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {isActive && <Check className="size-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================================== */
/* Color picker */
/* ================================================== */

function ColorPickerButton({
  editor,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <ToolbarButton
        title="Text color"
        active={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Palette className="size-4" />
      </ToolbarButton>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 flex w-44 flex-wrap gap-1.5 rounded-lg border border-slate-100 bg-white p-2.5 shadow-lg">
          {TEXT_COLORS.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              onClick={() => {
                if (color.value) {
                  editor.chain().focus().setColor(color.value).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
                setOpen(false);
              }}
              className="flex size-7 items-center justify-center rounded-full border border-slate-200 transition-transform hover:scale-110"
              style={{
                backgroundColor: color.value || "#ffffff",
              }}
            >
              {!color.value && (
                <span className="text-[9px] font-bold text-slate-400">A</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================== */
/* Highlight picker */
/* ================================================== */

function HighlightPickerButton({
  editor,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <ToolbarButton
        title="Highlight"
        active={editor.isActive("highlight") || open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 flex w-40 flex-wrap gap-1.5 rounded-lg border border-slate-100 bg-white p-2.5 shadow-lg">
          <button
            type="button"
            title="Remove highlight"
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              setOpen(false);
            }}
            className="flex size-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-transform hover:scale-110"
          >
            <Minus className="size-3.5" />
          </button>

          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: color.value })
                  .run();
                setOpen(false);
              }}
              className="size-7 rounded-full border border-slate-200 transition-transform hover:scale-110"
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

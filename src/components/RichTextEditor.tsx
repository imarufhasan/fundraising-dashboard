"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Loader2 } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[480px] w-full px-5 py-4 outline-none text-sm leading-7 text-slate-700 sm:text-[15px]",
      },

      handlePaste(view, event) {
        const html = event.clipboardData?.getData("text/html");

        if (!html) {
          return false;
        }

        event.preventDefault();

        editor?.chain().focus().insertContent(html).run();

        return true;
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
   * Sync external value with Tiptap.
   *
   * Important when content comes from API.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHTML = editor.getHTML();

    if (value !== currentHTML) {
      editor.commands.setContent(value, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="flex min-h-[480px] items-center justify-center rounded-xl border border-slate-200">
        <Loader2 className="size-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          title="Bold"
          className="font-black"
        />

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          title="Italic"
          className="italic"
        />

        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="U"
          title="Underline"
          className="underline"
        />

        <Divider />

        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          label="H1"
          title="Heading 1"
        />

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label="H2"
          title="Heading 2"
        />

        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          label="H3"
          title="Heading 3"
        />

        <Divider />

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="• List"
          title="Bullet List"
        />

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1. List"
          title="Numbered List"
        />

        <Divider />

        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="❝"
          title="Quote"
        />

        <ToolbarButton
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          label="Code"
          title="Code Block"
        />

        <Divider />

        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const currentUrl = editor.getAttributes("link").href;

            const url = window.prompt("Enter URL", currentUrl || "https://");

            if (url === null) {
              return;
            }

            if (!url.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({
                href: url,
              })
              .run();
          }}
          label="Link"
          title="Add Link"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  title,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-bold transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-600"
          : "text-slate-600 hover:bg-slate-200"
      } ${className}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-slate-200" />;
}

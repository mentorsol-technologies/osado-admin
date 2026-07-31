"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Smile, Send, Paperclip, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface RichTextEditorProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
}

/** Keeps a single message's upload batch sane. */
const MAX_ATTACHMENTS = 10;

const ACCEPTED_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
].join(",");

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onSend,
  disabled = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(40);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Send message...",
      }),
    ],
    content: "",
    immediatelyRender: false,
  });

  // Update editor editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  // Auto height adjustment
  useEffect(() => {
    if (!editor) return;
    const updateHeight = () => {
      const element = document.querySelector(".tiptap") as HTMLElement;
      if (element) {
        const newHeight = Math.min(element.scrollHeight, 160);
        setEditorHeight(newHeight);
      }
    };

    editor.on("update", updateHeight);
    updateHeight();
    return () => {
      editor.off("update", updateHeight);
    };
  }, [editor]);

  // Handle Send - wrapped in useCallback
  const handleSend = useCallback(() => {
    if (disabled || !editor) return;
    const html = editor.getHTML().trim();
    if ((!html || html === "<p></p>") && selectedFiles.length === 0) return;

    // Tiptap yields "<p></p>" for an empty document; send a genuinely empty
    // string so attachment-only messages aren't stored with hollow markup.
    const hasText = Boolean(html.replace(/<[^>]*>/g, "").trim());
    onSend(hasText ? html : "", selectedFiles);
    editor.commands.clearContent();
    setEditorHeight(40);
    setSelectedFiles([]);
  }, [disabled, editor, onSend, selectedFiles]);

  // Handle keyboard shortcuts (Enter to send, Shift+Enter for new line)
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey && !disabled) {
        event.preventDefault();
        handleSend();
      }
    };

    const editorElement = document.querySelector(".ProseMirror");
    editorElement?.addEventListener("keydown", handleKeyDown as EventListener);

    return () => {
      editorElement?.removeEventListener(
        "keydown",
        handleKeyDown as EventListener
      );
    };
  }, [editor, disabled, handleSend]);

  // Emoji click - insert emoji and close picker
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    editor?.commands.insertContent(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // File input click
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // File change - append so several picks build up one batch
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length) {
      setSelectedFiles((prev) => [...prev, ...picked].slice(0, MAX_ATTACHMENTS));
    }
    // Reset so picking the same file again still fires onChange.
    e.target.value = "";
  };

  const removeFileAt = (index: number) =>
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div
      className={`relative flex items-center bg-black-400 rounded-xl px-4 py-3 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-1 mr-3">
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-white h-8 w-8"
          onClick={handleAttachClick}
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="relative">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-400 hover:text-white h-8 w-8"
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </Button>

          {showEmojiPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-12 left-0 z-50 border border-[#2a2a2a] rounded-xl shadow-lg overflow-hidden"
              // The picker ships its own palette; these CSS variables pull it
              // onto the app's dark theme instead of its default grey.
              style={
                {
                  "--epr-bg-color": "#1b1b1e",
                  "--epr-category-label-bg-color": "#1b1b1e",
                  "--epr-text-color": "#e5e7eb",
                  "--epr-hover-bg-color": "#2a2a35",
                  "--epr-focus-bg-color": "#2a2a35",
                  "--epr-picker-border-color": "#2a2a2a",
                  "--epr-category-icon-active-color": "#a855f7",
                  "--epr-emoji-hover-color": "#2a2a35",
                } as React.CSSProperties
              }
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
                searchDisabled
                width={300}
                height={350}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className="flex-1 text-sm text-white focus:outline-none overflow-y-auto no-scrollbar transition-all duration-200 ease-in-out"
        style={{
          maxHeight: "160px",
          minHeight: `${editorHeight}px`,
        }}
      >
        <EditorContent
          editor={editor}
          className="focus:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-500 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
        />
      </div>

      <Button
        size="icon"
        onClick={handleSend}
        className="ml-3 bg-transparent text-white hover:bg-transparent hover:text-gray-300 h-8 w-8"
        disabled={disabled}
      >
        <Send className="w-5 h-5" />
      </Button>

      {/* Pending attachments - thumbnails for images, chips for documents */}
      {selectedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 flex flex-wrap gap-2 px-1">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={`${file.name}-${index}`}
                className="relative group rounded-lg overflow-hidden border border-[#2a2a2a] bg-black-400"
              >
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-14 h-14 object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 flex flex-col items-center justify-center px-1">
                    <FileText size={16} className="text-purple-400" />
                    <span className="mt-0.5 text-[9px] text-gray-400 truncate w-full text-center">
                      {file.name.split(".").pop()?.toUpperCase()}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFileAt(index)}
                  className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 text-white hover:bg-black"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

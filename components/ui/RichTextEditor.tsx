"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Smile, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface RichTextEditorProps {
  onSend: (message: string, file?: File | null) => void;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onSend,
  disabled = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if ((!html || html === "<p></p>") && !selectedFile) return;

    onSend(html || "", selectedFile);
    editor.commands.clearContent();
    setEditorHeight(40);
    setSelectedFile(null);
  }, [disabled, editor, onSend, selectedFile]);

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

  // File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div
      className={`relative flex items-center bg-black-400 rounded-xl px-4 py-3 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
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
              className="absolute bottom-12 left-0 z-50 bg-[#1b1b1e] border border-[#2a2a2a] rounded-xl shadow-lg"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
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

      {selectedFile && (
        <div className="absolute -top-7 left-4 text-xs text-gray-400 truncate max-w-[200px]">
          📎 {selectedFile.name}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Smile, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface RichTextEditorProps {
    onSend: (message: string, file?: File | null) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSend }) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState(40);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write a message...",
            }),
        ],
        content: "",
        immediatelyRender: false,
    });

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

    // Handle Send
    const handleSend = () => {
        const html = editor?.getHTML().trim();
        if ((!html || html === "<p></p>") && !selectedFile) return;

        onSend(html || "", selectedFile);
        editor?.commands.clearContent();
        setEditorHeight(40);
        setSelectedFile(null);
    };

    // Emoji click
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        editor?.commands.insertContent(emojiData.emoji);
    };

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
        <div className="relative flex items-end bg-[#1b1b1e] rounded-2xl p-3 shadow-md">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Left Buttons */}
            <div className="flex  justify-end items-center  mb-1">
                <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={handleAttachClick}
                >
                    <Paperclip className="w-4 h-4" />
                </Button>

                <div className="relative">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="text-gray-400 hover:text-white"
                    >
                        <Smile className="w-4 h-4" />
                    </Button>

                    {showEmojiPicker && (
                        <div
                            ref={pickerRef}
                            className="absolute bottom-10 left-0 z-50 bg-[#1b1b1e] border border-[#2a2a2a] rounded-xl shadow-lg"
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

            {/* Editor Area */}
            <div
                className="flex-1  text-sm text-white px-3 py-2 mt-5 rounded-lg focus:outline-none overflow-y-auto no-scrollbar transition-all duration-200 ease-in-out"
                style={{
                    maxHeight: "160px",
                    minHeight: `${editorHeight}px`,
                }}
            >
                <EditorContent
                    editor={editor}
                    className="focus:outline-none"
                />
            </div>

            {/* Right Send Button */}
            <Button
                size="icon"
                onClick={handleSend}
                className="ml-3 bg-transparent text-white rounded-full shadow-sm hover:bg-black-500
                "
            >
                <Send className="w-4 h-4" />
            </Button>

            {/* Attached File Name */}
            {selectedFile && (
                <div className="absolute -top-6 left-3 text-xs text-gray-400 truncate w-1/2">
                    📎 {selectedFile.name}
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;

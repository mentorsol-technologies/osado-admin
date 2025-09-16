"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface UploadProps {
  label?: string;
  onFileSelect?: (file: File | null) => void;
}

export default function Upload({ label, onFileSelect }: UploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setFile(newFile);
    onFileSelect?.(newFile);
  };

  const handleRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
    onFileSelect?.(null);
  };

  return (
    <div className="mt-4">
      {label && <label className="block text-sm mb-1">{label}</label>}

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-red-600 rounded-lg p-3 text-center cursor-pointer hover:bg-red-50"
      >
        <p className="text-sm text-gray-500">
          Click to upload. Supported formats: JPG, PNG, SVG. Max 10MB each
        </p>
        <input
          type="file"
          accept="image/*,.svg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* File name with cross */}
      {file && (
        <div className="flex items-center justify-between mt-3 p-2 border rounded-lg bg-gray-800 text-white text-sm">
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface UploadProps {
  label?: string;
  onFileSelect?: (files: File[] | null) => void;
  multiple?: boolean;
  existingFiles?: { id: string; url: string }[];

}

export default function Upload({ label, onFileSelect, multiple = false, existingFiles = [],
}: UploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    onFileSelect?.(selectedFiles);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    // Update input and notify parent
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect?.(updatedFiles.length ? updatedFiles : null);
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
          Click to upload {multiple ? "images" : "an image"}. Supported formats: JPG, PNG, SVG. Max 10MB each.
        </p>
        <input
          type="file"
          accept="image/*,.svg"
          multiple={multiple}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg bg-gray-800 text-white text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

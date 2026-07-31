"use client";

import { FileText, Download } from "lucide-react";

interface AttachmentMeta {
  url?: string;
  name?: string;
  size?: number;
  fileType?: string;
  isImage?: boolean;
}

const readableSize = (size?: number) => {
  if (typeof size !== "number" || size <= 0) return null;
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`;
};

/** Documents render as a downloadable chip regardless of how many there are. */
function FileChip({ file }: { file: AttachmentMeta }) {
  const size = readableSize(file.size);
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      download={file.name}
      className="flex items-center gap-3 rounded-lg bg-black-400/60 hover:bg-black-400 transition-colors px-3 py-2 max-w-[260px]"
    >
      <FileText size={20} className="text-purple-400 flex-shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-white truncate">
          {file.name || "Attachment"}
        </span>
        {size && <span className="block text-[11px] text-gray-400">{size}</span>}
      </span>
      <Download size={15} className="text-gray-400 flex-shrink-0" />
    </a>
  );
}

/**
 * Attachments carried on an image/file message.
 *
 * Images are laid out like WhatsApp: one fills the bubble width, two sit side
 * by side, three put the first across the top, and four or more form a 2x2
 * with a "+N" overlay on the last tile. Documents always list as chips.
 *
 * Reads `metadata.attachments` (array). `metadata.attachment` is the older
 * single-file shape and is still honoured so existing messages keep rendering.
 */
export default function MessageAttachment({
  metadata,
  messageType,
}: {
  metadata?: any;
  messageType?: string;
}) {
  // metadata can arrive as a JSON string from the DB column.
  let parsed = metadata;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return null;
    }
  }

  const list: AttachmentMeta[] = Array.isArray(parsed?.attachments)
    ? parsed.attachments
    : parsed?.attachment
      ? [parsed.attachment]
      : [];

  const files = list.filter((f) => f?.url);
  if (files.length === 0) return null;

  const images = files.filter(
    (f) => f.isImage ?? (f.fileType || "").startsWith("image/"),
  );
  const documents = files.filter((f) => !images.includes(f));

  // Fall back to the message type when metadata omits isImage.
  const imagesToShow =
    images.length === 0 && messageType === "image" ? files : images;
  const docsToShow = imagesToShow === files ? [] : documents;

  const visible = imagesToShow.slice(0, 4);
  const overflow = imagesToShow.length - visible.length;

  return (
    <div className="mt-1 space-y-2">
      {visible.length === 1 && (
        <a
          href={visible[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visible[0].url}
            alt={visible[0].name || "Attachment"}
            className="rounded-lg max-w-[240px] max-h-[240px] object-cover"
          />
        </a>
      )}

      {visible.length > 1 && (
        <div className="grid grid-cols-2 gap-1 w-[240px]">
          {visible.map((file, index) => {
            // With three images the first spans the full width, matching the
            // familiar messaging-app layout.
            const spanFull = visible.length === 3 && index === 0;
            const isLastWithOverflow = overflow > 0 && index === visible.length - 1;

            return (
              <a
                key={`${file.url}-${index}`}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative block overflow-hidden rounded-lg ${
                  spanFull ? "col-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name || "Attachment"}
                  className={`w-full object-cover ${spanFull ? "h-[120px]" : "h-[110px]"}`}
                />
                {isLastWithOverflow && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                    +{overflow}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}

      {docsToShow.map((file, index) => (
        <FileChip key={`${file.url}-${index}`} file={file} />
      ))}
    </div>
  );
}

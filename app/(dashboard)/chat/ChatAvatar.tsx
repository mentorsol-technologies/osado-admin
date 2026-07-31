"use client";

import Image from "next/image";
import { User } from "lucide-react";

interface ChatAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

/**
 * Avatar for chat participants.
 *
 * Only renders a photo when there actually is one - falling back to a stock
 * portrait would show a stranger's face as the person you're talking to. With
 * no photo we show the name's initial, and a user icon when there's no name
 * either.
 */
export default function ChatAvatar({
  src,
  name,
  size = 40,
  className = "",
}: ChatAvatarProps) {
  const trimmedName = name?.trim();
  const initial = trimmedName ? trimmedName.charAt(0).toUpperCase() : null;

  if (src) {
    return (
      <Image
        src={src}
        alt={trimmedName || "User"}
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`rounded-full bg-black-300 flex items-center justify-center flex-shrink-0 text-white font-semibold uppercase ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.4) }}
      aria-label={trimmedName || "User"}
    >
      {initial ?? <User size={Math.max(12, size * 0.45)} className="text-gray-400" />}
    </span>
  );
}

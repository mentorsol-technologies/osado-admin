import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ensureAbsoluteUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);
  const escapeCell = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const passwordRules: string[] = [
  "At least 8 characters",
  "Include an uppercase letter",
  "Include a number",
  "Include a special character",
];

export const FormatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const capitalizeFirstLetter = (str: string = ""): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return "N/A";

  // Split range if it exists
  const [start, end] = timeString.split(" - ").map((t) => t.trim());

  const formatSingleTime = (t: string) => {
    const date = new Date(`1970-01-01T${t}`);
    if (isNaN(date.getTime())) return t; // fallback if invalid
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Return formatted range
  return end
    ? `${formatSingleTime(start)} - ${formatSingleTime(end)}`
    : formatSingleTime(start);
};

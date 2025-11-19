import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  return end ? `${formatSingleTime(start)} - ${formatSingleTime(end)}` : formatSingleTime(start);
};
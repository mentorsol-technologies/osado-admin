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

export const formatDate = (dateString?: string) => {
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
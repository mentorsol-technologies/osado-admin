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

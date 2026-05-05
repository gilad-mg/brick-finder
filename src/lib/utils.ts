import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US").format(value);
}

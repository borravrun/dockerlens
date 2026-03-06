import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export type View = "containers" | "images";

export function parseImageTag(tag: string): [string, string] {
  const idx = tag.lastIndexOf(":");
  return idx > 0 ? [tag.slice(0, idx), tag.slice(idx + 1)] : [tag, "latest"];
}

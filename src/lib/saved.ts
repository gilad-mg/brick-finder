"use client";

const STORAGE_KEY = "brickfinder:saved";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSaved(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

function persist(list: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("brickfinder:saved-changed"));
}

export function addSaved(setNum: string): string[] {
  const current = getSaved();
  if (current.includes(setNum)) return current;
  const next = [setNum, ...current];
  persist(next);
  return next;
}

export function removeSaved(setNum: string): string[] {
  const current = getSaved();
  const next = current.filter((id) => id !== setNum);
  persist(next);
  return next;
}

export function isSaved(setNum: string): boolean {
  return getSaved().includes(setNum);
}

export function toggleSaved(setNum: string): { saved: boolean; list: string[] } {
  if (isSaved(setNum)) {
    const list = removeSaved(setNum);
    return { saved: false, list };
  }
  const list = addSaved(setNum);
  return { saved: true, list };
}

export const SAVED_STORAGE_KEY = STORAGE_KEY;
export const SAVED_CHANGED_EVENT = "brickfinder:saved-changed";

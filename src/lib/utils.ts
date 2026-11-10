/**
 * utils.ts – shared class-name helpers
 * Re-exports cn(), the standard utility used across the UI to compose
 * conditional Tailwind class lists safely.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn – merges conditional class names: clsx resolves arrays/falsey inputs
 * into one string, then twMerge de-duplicates conflicting Tailwind
 * utilities so a later class (e.g. "p-4") reliably overrides an earlier
 * one (e.g. "p-2") without hand-written ternaries.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

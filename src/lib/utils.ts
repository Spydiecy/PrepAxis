import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge Tailwind CSS classes without conflicts
// Example: cn("px-2", "px-4") → "px-4" (later value wins)
// This is used in components to combine multiple class lists
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

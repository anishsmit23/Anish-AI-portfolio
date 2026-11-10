/**
 * textarea.tsx – Textarea primitive
 * Reusable shadcn/ui-style multi-line input with focus-ring and
 * aria-invalid styling; used in contact forms and message composers.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea – multi-line text input.
 * Mirrors the Input primitive's focus/invalid/disabled styling; the height
 * grows with its content via `field-sizing-content`.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Focus ring and aria-invalid states mirror the Input primitive so
        // forms look consistent across the site.
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

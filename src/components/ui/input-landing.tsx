/**
 * input-landing.tsx – Input primitive
 * Reusable shadcn/ui-style text input used in landing-page and contact
 * forms, with focus-ring, file-button, and aria-invalid states baked in.
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input – text input used in landing-page and contact forms.
 * Focus/invalid rings, file-button styling, and disabled state are all
 * defined in the base class list; `className` is merged via `cn`.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Focus ring and invalid-state rings match the other form
        // primitives, so keyboard focus looks consistent site-wide.
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }

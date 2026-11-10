"use client"

/**
 * separator.tsx – Separator primitive
 * Reusable shadcn/ui-style horizontal/vertical divider built on
 * @radix-ui/react-separator; used to visually split sections, card regions,
 * and menu items.
 */

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Separator – decorative divider line between sections/menus.
 * @param orientation - "horizontal" (1px tall, full width) or "vertical".
 * @param decorative  - Defaults to true, so screen readers skip it.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Size comes from the orientation data attributes, so the same
        // markup works as a horizontal or vertical rule.
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

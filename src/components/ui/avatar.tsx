"use client"

/**
 * avatar.tsx – Avatar primitive
 * Reusable shadcn/ui-style avatar built on @radix-ui/react-avatar: renders an
 * image with a text fallback shown until (or unless) the image loads; used
 * for user and testimonial portraits across the site.
 */

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Avatar – circular image container.
 * Props are forwarded to Radix's Root; pair with AvatarImage/AvatarFallback.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * AvatarImage – image layer of an Avatar; Radix hides it until the image
 * has loaded so the fallback shows through in the meantime.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * AvatarFallback – content shown while the image is missing or still
 * loading (typically initials): a muted, centered circle.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }

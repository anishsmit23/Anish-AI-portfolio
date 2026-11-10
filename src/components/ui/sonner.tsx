"use client"

/**
 * sonner.tsx – Toast toaster
 * Site-wide toast host wrapping sonner's Toaster: follows the active
 * next-themes theme and maps toast colors onto the app's CSS variables;
 * mounted once in the root layout.
 */

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Toaster – sonner toast host.
 * Reads the active next-themes theme (light/dark/system) and remaps the
 * toast's default colors onto the app's popover/border CSS variables so
 * toasts match the site palette. Standard ToasterProps can be passed
 * through to override anything else.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  // "system" keeps toasts in sync with the OS light/dark preference.
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Remap sonner's default toast colors onto the app's theme variables
      // (cast to CSSProperties because they are custom properties).
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

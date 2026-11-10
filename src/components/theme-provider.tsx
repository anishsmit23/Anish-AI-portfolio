'use client';
/**
 * theme-provider.tsx – Theme context wrapper
 * Wraps the app in next-themes' provider so `useTheme()` works anywhere;
 * theme changes toggle the `dark` class on <html> for Tailwind.
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

/**
 * Provides light/dark theme state to the whole tree.
 * - attribute="class": next-themes writes `class="dark"` on <html>, which is
 *   the selector Tailwind's `dark:` variant watches.
 * - defaultTheme="light" + enableSystem=false: always boots light; only the
 *   explicit toggle in SiteControls can switch it.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}

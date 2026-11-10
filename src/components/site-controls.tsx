'use client';
/**
 * site-controls.tsx – Floating site controls
 * Fixed top-left cluster holding the "About" (WelcomeModal) trigger and the
 * light/dark theme toggle. Sits at z-[51] so it stays clickable above the
 * welcome modal and other z-50 overlays.
 */

import WelcomeModal from '@/components/welcome-modal';
import { Info, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/** Info button + theme toggle pinned to the viewport corner. */
export function SiteControls() {
  const { theme, setTheme } = useTheme();
  // next-themes resolves the stored theme only in the browser; gating on
  // `mounted` avoids a hydration mismatch between SSR and the first client paint.
  const [mounted, setMounted] = useState(false);

  // Flip to true after hydration so the icon below can safely read `theme`.
  useEffect(() => setMounted(true), []);

  // Stays false until mounted, keeping the server-rendered markup intact.
  const dark = mounted && theme === 'dark';

  return (
    <div className="fixed left-4 top-4 z-[51] flex items-center gap-2 sm:left-6 sm:top-6">
      <WelcomeModal
        trigger={
          <button
            type="button"
            aria-label="About this portfolio"
            className="border-border bg-background/85 text-foreground hover:bg-accent flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur"
          >
            <Info className="h-5 w-5" aria-hidden="true" />
          </button>
        }
      />
      {/* Toggles the theme via next-themes; the icon mirrors the active theme. */}
      <button
        type="button"
        aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={dark ? 'Light theme' : 'Dark theme'}
        onClick={() => setTheme(dark ? 'light' : 'dark')}
        className="border-border bg-background/85 text-foreground hover:bg-accent flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur"
      >
        {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
}

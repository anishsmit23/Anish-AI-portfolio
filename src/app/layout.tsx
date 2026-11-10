/**
 * layout.tsx – Root layout
 * Sets up <html> metadata, fonts, theme provider, toast and Vercel
 * Analytics wrappers shared by every page.
 */

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Load Inter font for non-Apple devices
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

/**
 * Global metadata for every route: SEO title/description and keyword
 * list, Open Graph + Twitter card previews, and the SVG icon set
 * (favicon, shortcut, and Apple touch icon).
 */
export const metadata: Metadata = {
  title: 'Anish | AI/ML Engineer',
  description:
    'Interactive portfolio for Anish, an AI/ML Engineer building GenAI, agentic systems, and production ML applications.',
  keywords: [
    'Anish',
    'Portfolio',
    'AI/ML Engineer',
    'GenAI',
    'Agentic Systems',
    'Machine Learning',
    'Deep Learning',
    'Python',
    'FastAPI',
    'PyTorch',
    'LangGraph',
    'RAG',
  ],
  authors: [
    {
      name: 'Anish',
    },
  ],
  creator: 'Anish',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Anish | AI/ML Engineer',
    description:
      'Explore Anish’s AI/ML work, skills, and experience.',
    siteName: 'Anish Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anish | AI/ML Engineer',
    description:
      'Explore Anish’s AI/ML work, skills, and experience.',
  },
  icons: {
    icon: [
      {
        url: '/anish-mark.svg',
        sizes: 'any',
      },
    ],
    shortcut: '/anish-mark.svg',
    apple: '/anish-mark.svg',
  },
};

/**
 * RootLayout – App Router root layout rendered for every page.
 * @param children – the matched route's content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning silences the class-mismatch warning
          next-themes triggers when it applies the saved theme after
          hydration. */}
      <head>
        {/* maximum-scale/user-scalable=no disables pinch zoom — keeps
            the animated hero from being zoomed on touch devices, at the
            cost of not being able to magnify the page. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/anish-mark.svg" sizes="any" />
      </head>
      <body
        className={cn(
          'bg-background min-h-screen font-sans antialiased',
          /* expose the font's CSS variable (--font-inter) on <body> so
             descendants can reference the loaded Inter family */
          inter.variable
        )}
      >
        {/* next-themes provider: attribute="class" toggles the `.dark`
            class globals.css keys its palette off (light default,
            system theme disabled). */}
        <ThemeProvider>
          {/* min-h-screen flex column so each page can center its own
              content inside a full-height shell */}
          <main className="flex min-h-screen flex-col">{children}</main>
          {/* sonner toast host — pages call toast() into this */}
          <Toaster />
          {/* Vercel Web Analytics beacon for page-view tracking */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

'use client';

/**
 * chat/page.tsx – Chat route
 * Wraps the chat client in Suspense so it can safely read the `?query=`
 * search param the landing page's quick prompts navigate with.
 */

import { Suspense } from 'react';
import Chat from '@/components/chat/chat';

/**
 * Page – /chat route entry.
 * The Chat client reads the `query` search param, which suspends during
 * prerendering, so it must sit inside a Suspense boundary; the French
 * fallback text shows while it loads.
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Chargement du chat...</div>}>
      {/* useSearchParams() in Chat suspends during prerendering, so this
          boundary is required or the route fails to build. */}
      <Chat />
    </Suspense>
  );
}
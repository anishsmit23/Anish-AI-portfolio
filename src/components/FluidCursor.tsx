'use client';
/**
 * FluidCursor.tsx – Fluid-simulation cursor background
 * Mounts the WebGL fluid simulation from hooks/use-FluidCursor once on the
 * client and paints it into a fixed, full-viewport canvas that sits behind
 * all page content (z-0), giving the site its signature cursor effect.
 */
import { useEffect } from 'react';

import fluidCursor from '@/hooks/use-FluidCursor';

/** Fixed full-screen canvas layer that reacts to pointer movement. */
const FluidCursor = () => {
  // Runs once on mount: fluidCursor() looks up the #fluid canvas, attaches
  // pointer listeners and starts its animation loop (the hook manages its
  // own lifetime, so nothing is returned for cleanup here).
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    // Pinned to the viewport (fixed + top/left 0) so it never affects layout
    // or scrolling; z-0 keeps every other layer stacked above it.
    <div className="fixed top-0 left-0 z-0">
      {/* id="fluid" is the contract the hook uses to locate this canvas. */}
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};
export default FluidCursor;

/**
 * use-outside-click.tsx – outside-click detection hook
 * Listens for mouse/touch presses on the document and fires a callback
 * only when the event target lies outside the referenced element, so
 * overlays (dialogs, dropdowns, expandable cards) can dismiss themselves.
 */
import React, { useEffect } from "react";

/**
 * useOutsideClick – attaches document-level mousedown/touchstart listeners
 * that call `callback` when the press target is outside `ref`'s subtree.
 *
 * @param ref     element considered "inside" (clicks on it or its children are ignored)
 * @param callback invoked once per outside press, with the event
 *
 * Both listeners are registered on mount and removed in the effect cleanup,
 * which also runs whenever `ref` or `callback` identity changes — so the
 * callback is never captured stale and nothing leaks on unmount.
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    // Cover both input types: mouse presses (mousedown) and taps (touchstart).
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup mirrors registration exactly so unmount/re-runs never leak handlers.
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

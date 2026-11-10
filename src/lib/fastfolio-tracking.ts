/**
 * fastfolio-tracking.ts – chat engagement counter & promo gate
 * Persists how many chat messages a visitor has sent and a "popup already
 * shown" flag in localStorage, so the Fastfolio promo (fastfolio-popup.tsx)
 * is offered at most once, and only after real engagement.
 */
// localStorage keys (shared across pages): message counter + one-shot popup flag.
const MESSAGE_COUNT_KEY = 'fastfolio_message_count';
const POPUP_SHOWN_KEY = 'fastfolio_popup_shown';

/**
 * FastfolioTracking – browser-side (localStorage) state behind the promo
 * popup. Every method no-ops during SSR, when `window` is undefined.
 */
export class FastfolioTracking {
  /**
   * Call once per message the visitor sends: bumps
   * `fastfolio_message_count` so shouldShowPopup() can gate on engagement.
   */
  static incrementMessageCount(): void {
    if (typeof window === 'undefined') return;
    const count = Number(localStorage.getItem(MESSAGE_COUNT_KEY) || '0');
    localStorage.setItem(MESSAGE_COUNT_KEY, String(count + 1));
  }

  /**
   * Gate for surfacing the promo: true only after ≥ 2 messages were sent
   * and the popup has not been shown before (count never decrements, so a
   * dismissed popup stays suppressed forever).
   */
  static shouldShowPopup(): boolean {
    if (typeof window === 'undefined') return false;
    const count = Number(localStorage.getItem(MESSAGE_COUNT_KEY) || '0');
    return count >= 2 && localStorage.getItem(POPUP_SHOWN_KEY) !== 'true';
  }

  /**
   * Records the popup as seen (set once when it is displayed) so
   * shouldShowPopup() returns false from then on.
   */
  static markPopupShown(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(POPUP_SHOWN_KEY, 'true');
  }
}

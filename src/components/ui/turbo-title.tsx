/**
 * turbo-title.tsx – TurboTitle display heading
 * Giant clamp-sized heading rendered three times (the real text plus
 * ::before and ::after layers fed by a CSS custom property) to produce an
 * embossed, blend-mode "turbo" text effect in light and dark mode.
 */
import React from 'react';

/**
 * TurboTitleProps.
 * @prop text      - The heading string; also injected into the CSS `--text`
 *                   custom property so the pseudo-elements can repeat it.
 * @prop className - Extra classes appended to the span (e.g. size tweaks).
 */
interface TurboTitleProps {
  text: string;
  className?: string;
}

/**
 * TurboTitle – large display heading that layers the same text three times
 * (real text + ::before + ::after driven by the `--text` custom property)
 * to create an embossed, blend-mode treatment; the gradient and shadow
 * colors flip between light and dark mode.
 */
const TurboTitle: React.FC<TurboTitleProps> = ({ text, className = '' }) => {
  return (
    <div className="flex flex-col">
      <span
        // The same string is fed to ::before/::after through --text, so the
        // decorative pseudo-layers always mirror the visible text.
        style={{ '--text': `'${text}'` } as React.CSSProperties}
        className={`pointer-events-none relative overflow-hidden text-center font-mono text-[clamp(3rem,15vw,10rem)] font-medium tracking-tighter before:bg-gradient-to-b before:from-neutral-300 before:to-neutral-200/70 before:to-80% before:bg-clip-text before:text-transparent before:content-[var(--text)] after:absolute after:inset-0 after:bg-neutral-400/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-[var(--text)] after:[text-shadow:0_1px_0_white] dark:before:from-neutral-700/70 dark:before:to-neutral-800/30 dark:after:bg-neutral-600/70 dark:after:mix-blend-lighten dark:after:[text-shadow:0_1px_0_black] ${className}`}
      ></span>
    </div>
  );
};

export default TurboTitle;
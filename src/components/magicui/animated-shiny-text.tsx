/**
 * animated-shiny-text.tsx – shimmering text
 * A span whose text-clipped gradient carries a bright band that sweeps
 * across repeatedly, produced purely with CSS (background-position
 * transition on a fixed-size gradient window).
 */
import { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

import { cn } from "@/lib/utils";

/**
 * AnimatedShinyTextProps – native span props plus `shimmerWidth`, the
 * width in pixels of the moving highlight band, published to CSS as the
 * `--shiny-width` custom property.
 */
export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number;
}

/**
 * AnimatedShinyText – renders `children` with a gradient clipped to the
 * text (bg-clip-text) and slides it by animating background-position:
 * background-size is pinned to var(--shiny-width) × 100%, so the gradient
 * occupies a narrow window and the infinite 1s cubic-bezier transition
 * moves it from left to right, making the shine appear to travel across
 * the words.
 */
export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          // Exposes the band width to the arbitrary-value classes below.
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        // The mid stop is the visible bright band; dark: swaps it to white
        // so the sweep still reads against dark text backgrounds.
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

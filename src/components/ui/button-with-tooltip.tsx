/**
 * button-with-tooltip.tsx – Button + tooltip wrapper
 * Convenience primitive that wraps any button element in a Radix tooltip,
 * forwarding the ref through the trigger so focus management keeps working;
 * used for icon-only actions that need an accessible text label.
 */
import React, { forwardRef } from "react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Props for ButtonWithTooltip.
 * @prop children     - The single button element to wrap (cloned with a ref).
 * @prop side         - Side of the trigger the tooltip content is placed on.
 * @prop toolTipText  - Plain-text label shown inside the tooltip.
 */
interface ButtonWithTooltipProps {
  children: React.ReactElement;
  side: "top" | "bottom" | "left" | "right";
  toolTipText: string;
}

/**
 * ButtonWithTooltip – button wrapped in a Radix tooltip.
 * Composes TooltipProvider > Tooltip > TooltipTrigger (asChild), so the
 * caller's own button element becomes the trigger and keeps its ref; the
 * tooltip shows with zero hover delay.
 */
const ButtonWithTooltip = forwardRef<HTMLButtonElement, ButtonWithTooltipProps>(
  ({ children, side, toolTipText }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {/* Clone the child to inject the forwarded ref, so the tooltip
                can manage focus on the caller's original button element. */}
            {React.isValidElement(children) &&
            // @ts-ignore 
              React.cloneElement(children, { ref: ref as React.Ref<HTMLElement> })}
          </TooltipTrigger>
          <TooltipContent side={side}>
            <div>{toolTipText}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ButtonWithTooltip.displayName = "ButtonWithTooltip";

export default ButtonWithTooltip;

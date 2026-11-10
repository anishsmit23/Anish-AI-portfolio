"use client"

/**
 * collapsible.tsx – Collapsible primitive
 * Thin reusable wrapper over @radix-ui/react-collapsible that adds the
 * site's data-slot attributes; used for expand/collapse sections such as
 * project details and FAQs.
 */

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible – Radix collapsible root (controls open/closed state).
 * Used for expandable project details and FAQ sections.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * CollapsibleTrigger – the button/element that toggles the collapsible.
 */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/**
 * CollapsibleContent – the region shown/hidden when the trigger toggles.
 */
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

/**
 * getProjects.ts – chat tool: featured project cards
 * Handles "show my projects"-style requests with a short lead-in while the
 * UI opens the detailed project cards driven by this tool's result.
 */

import { tool } from "ai";
import { z } from "zod";


/**
 * getProjects – zero-argument tool that opens the featured-project cards.
 * Input: empty object; Output: a one-line lead-in — the rich details live in
 * the project cards the UI opens from this tool result, which keeps the
 * chat response short regardless of how many projects exist.
 */
export const getProjects = tool({
  description:
    'Shows Anish’s project cards. Each card opens detailed project information, architecture, technologies, results, and links.',
  parameters: z.object({}),
  execute: async () => {
    return "Here are my featured projects. Ask me about the architecture, stack, or results of any of them.";
  },
});

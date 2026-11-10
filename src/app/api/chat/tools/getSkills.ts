/**
 * getSkills.ts – chat tool: skills list
 * Signals the UI to surface the skills card for skill-related questions,
 * keeping the chat answer short while details live in the card.
 */
import { tool } from 'ai';
import { z } from 'zod';

/**
 * getSkills – zero-argument tool for skill questions.
 * Input: empty object; Output: a one-line pointer; the actual skill list is
 * rendered from the skills card the UI opens alongside this result.
 */
export const getSkills = tool({
  description:
    'This tool show a list of my skills.',
  parameters: z.object({}),
  execute: async () => {
    return "You can see all my skills above.";
  },
});

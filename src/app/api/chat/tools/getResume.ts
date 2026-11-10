/**
 * getResume.ts – chat tool: résumé card
 * Answers resume questions by pointing the visitor at the downloadable
 * résumé card instead of pasting the whole CV into the chat.
 */
import { tool } from 'ai';
import { z } from 'zod';

/**
 * getResume – zero-argument tool for résumé questions.
 * Input: empty object; Output: a short pointer to the downloadable résumé
 * card, avoiding pasting the full CV into the conversation.
 */
export const getResume = tool({
  description:
    'This tool show my resume.',
  parameters: z.object({}),
  execute: async () => {
    return 'You can download my résumé from the card above.';
  },
});

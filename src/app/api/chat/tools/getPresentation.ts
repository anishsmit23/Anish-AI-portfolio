/**
 * getPresentation.ts – chat tool: self-introduction
 * Supplies the short "who are you" / "tell me about yourself" blurb that the
 * UI renders as the introduction card.
 */
import { tool } from 'ai';
import { z } from 'zod';

/**
 * getPresentation – zero-argument tool producing the "about me" blurb.
 * Input: empty object; Output: an object `{ presentation }` (instead of a
 * plain string) so the UI can read the named field when rendering the
 * introduction card.
 */
export const getPresentation = tool({
  description:
    'Returns a concise introduction to Anish for questions such as "Who are you?" or "Tell me about yourself".',
  parameters: z.object({}),
  execute: async () => {
    return {
      presentation:
        "I'm Anish, a junior AI/ML engineer and final-year B.Tech student in Hyderabad. I build GenAI and agentic systems, real-time voice agents, RAG workflows, and deep-learning applications with Python, FastAPI, PyTorch, and AWS.",
    };
  },
});

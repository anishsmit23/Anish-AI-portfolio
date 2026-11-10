/**
 * getIntership.ts – chat tool: professional background summary
 * (The file name keeps the original "Intership" spelling; the export is getInternship.)
 * Answers opportunity and professional-experience questions with a compact
 * experience / stack / education summary the visitor can read at a glance.
 */
import { tool } from 'ai';
import { z } from 'zod';

/**
 * getInternship – zero-argument tool summarizing professional background.
 * Input: empty object; Output: a short Markdown string (experience, stack,
 * education, contact). route.ts additionally echoes this text into the data
 * stream so it lands in the chat transcript, not just in the card.
 */
export const getInternship = tool({
  description:
    'Gives a concise summary of Anish’s professional background and focus areas. Use it for opportunity and professional-experience questions.',
  parameters: z.object({}),
  execute: async () =>
    `I am an AI/ML Engineer focused on production GenAI, agentic systems, RAG, real-time voice agents, and deep learning.

- Experience: Junior AI/ML Engineer at ElectraWireless Pvt. Ltd. and AI/ML Subject Matter Expert at House of Couton Pvt. Ltd.
- Stack: Python, FastAPI, PyTorch, TensorFlow, LangGraph, LangChain, Docker, AWS, PostgreSQL, Redis, Terraform, and pytest.
- Education: B.Tech in Artificial Intelligence & Machine Learning, expected 2027.

Contact: anishhyd995@gmail.com | https://www.linkedin.com/in/anish55/ | https://github.com/anishsmit23`,
});

/**
 * getContact.ts – chat tool: contact details
 * Returns Anish's public contact channels when a visitor asks how to reach
 * him, keeping contact info centralized with the other chat tools.
 */
import { tool } from 'ai';
import { z } from 'zod';

/**
 * getContact – zero-argument tool answering "how can I contact you?".
 * Input: empty zod object (no parameters); Output: a plain-text string with
 * email, phone, LinkedIn, and GitHub URLs that the UI shows as the tool
 * result / contact card content.
 */
export const getContact = tool({
  description:
    'Shows Anish’s public contact information.',
  parameters: z.object({}),
  execute: async () => {
    return 'Email: anishhyd995@gmail.com. Phone: +91-8918316281. LinkedIn: https://www.linkedin.com/in/anish55/. GitHub: https://github.com/anishsmit23. Feel free to reach out about AI/ML, GenAI, and engineering opportunities.';
  },
});

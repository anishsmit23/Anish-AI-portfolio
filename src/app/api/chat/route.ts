/**
 * route.ts – POST /api/chat
 * Validates incoming chat messages, resolves intent cards, and streams
 * AI (Groq → Gemini) responses with a graceful fallback to saved answers.
 */
import { chatModel } from '@/lib/chat-model';
import { createDataStreamResponse, formatDataStreamPart, streamText } from 'ai';
import { getPortfolioCard } from '@/lib/portfolio-intents';
import { PROJECTS } from '@/lib/project-catalog';
import { z } from 'zod';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

/**
 * maxDuration – serverless execution cap (seconds) for this route.
 * 30s prevents a stuck provider from running/billing indefinitely, while the
 * 18s client abort inside POST trips first, so visitors get an answer or the
 * saved-answer fallback well within the limit.
 */
export const maxDuration = 30;

// Keep per-message and response size bounds while allowing any number of turns.
const MAX_USER_MESSAGE_CHARS = 1000;
const MAX_OUTPUT_TOKENS = 800;

/**
 * messagesSchema – validates the request body's `messages` array.
 * Requires at least one { role, content } turn; `.passthrough()` tolerates
 * the extra keys the UI replays (tool invocations, ids) instead of rejecting
 * them, and the refinement below caps only user-authored text.
 */
const messagesSchema = z
  .array(
    z
      .object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
      .passthrough()
      // Refinement: limit only user messages — assistant turns are our own
      // output — so oversized payloads are rejected at the schema level
      // before they can inflate token spend on the model.
      .refine(
        (m) => m.role !== 'user' || m.content.length <= MAX_USER_MESSAGE_CHARS
      )
  )
  .min(1);

/**
 * isSameOrigin – lightweight cross-site guard for this chat endpoint.
 * Returns true only when the browser-sent Origin matches the request host;
 * a missing or unparseable Origin means a non-browser caller (bare scripts,
 * other origins) and is rejected with 403 before any work happens.
 */
// Browsers always send Origin on a POST, so the real chat UI passes this check
// on every domain of the site; bare scripts usually don't send it.
function isSameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  // Prefer x-forwarded-host: behind the proxy `host` can be an internal
  // hostname, while the forwarded host is the public domain the browser
  // actually addressed.
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * POST – handles a single chat turn.
 * Input: same-origin JSON body `{ messages: [{ role, content }] }`.
 * Output: an AI data-stream response (start_step → tool/text parts →
 * finish_*) that the client renders incrementally, or 403/400 for
 * cross-origin, malformed, or empty requests.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return new Response('Forbidden', { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid request', { status: 400 });
  }

  const parsed = messagesSchema.safeParse(
    (body as { messages?: unknown } | null)?.messages
  );
  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 });
  }

  // The UI keeps tool invocations for rendering cards, but Gemini requires
  // thought signatures when those invocations are replayed in a later request.
  // Only conversational text is needed for this portfolio's next answer.
  const messages = parsed.data
    .filter((message) => message.content.trim().length > 0)
    .map(({ role, content }) => ({ role, content }));
  if (messages.length === 0) {
    return new Response('Invalid request', { status: 400 });
  }
  // Fast path: the latest question is matched against known portfolio intents
  // before any model call — a hit serves a deterministic card instantly and
  // for free, and works even when both AI providers are down.
  const latestQuestion = [...messages]
    .reverse()
    .find((message) => message.role === 'user')?.content ?? '';
  const card = getPortfolioCard(latestQuestion);
  const tools = { getProjects, getPresentation, getResume, getContact, getSkills, getInternship };

  // Everything below is written in the AI SDK data-stream protocol:
  // start_step opens the message, tool_call/tool_result parts make the UI
  // render portfolio cards, `text` parts stream into the transcript, and the
  // finish_* parts close the response cleanly on every path (card, stream,
  // or fallback).
  return createDataStreamResponse({
    execute: async (writer) => {
      writer.write(formatDataStreamPart('start_step', { messageId: crypto.randomUUID() }));

      // Tool-call / card shortcut: no LLM involved — invoke the matching
      // tool directly and emit the tool_call + tool_result protocol parts the
      // UI already understands for opening the corresponding portfolio card.
      if (card) {
        const toolCallId = crypto.randomUUID();
        // Emit the same card protocol the UI already understands, without an LLM call.
        const result = await tools[card].execute!({}, { toolCallId, messages: [] });
        writer.write(formatDataStreamPart('tool_call', { toolCallId, toolName: card, args: {} }));
        writer.write(formatDataStreamPart('tool_result', { toolCallId, result }));
        if (card === 'getInternship') {
          // Other cards render purely from tool_result; the internship answer
          // is also emitted as chat text so it is readable in the transcript.
          writer.write(formatDataStreamPart('text', String(result)));
        }
      } else {
        // Model path: hasText records whether any prose actually reached the
        // client, so the fallback below can distinguish a full failure from a
        // stream that was cut off mid-answer.
        let hasText = false;
        try {
          const result = streamText({
            model: chatModel,
            system: SYSTEM_PROMPT.content,
            messages,
            // Card selection is handled above; providers only generate prose.
            maxRetries: 0,
            maxTokens: MAX_OUTPUT_TOKENS,
            // Hard 18s cap (inside the 30s maxDuration): a slow provider
            // triggers the saved-answer fallback instead of hanging the turn.
            abortSignal: AbortSignal.any([req.signal, AbortSignal.timeout(18_000)]),
          });
          for await (const part of result.fullStream) {
            if (part.type === 'error') throw part.error;
            if (part.type === 'text-delta' && part.textDelta) {
              hasText = true;
              writer.write(formatDataStreamPart('text', part.textDelta));
            }
          }
          if (!hasText) throw new Error('No text returned');
        } catch (error) {
          // User navigated away / cancelled: the stream is already closed,
          // so exit silently rather than writing into it.
          if (req.signal.aborted) return;
          // Fallback answer: the provider errored, timed out, or returned no
          // prose, so reply with saved portfolio content instead of failing.
          // If partial text already streamed, only a retry notice is added.
          console.warn('[CHAT-API] using saved portfolio information:',
            error instanceof Error ? error.message : 'Provider unavailable');
          writer.write(formatDataStreamPart('text', hasText
            ? '\n\nThe response was interrupted. Please try that question again.'
            : getSavedAnswer(latestQuestion)));
        }
      }

      writer.write(formatDataStreamPart('finish_step', { finishReason: 'stop', isContinued: false }));
      writer.write(formatDataStreamPart('finish_message', { finishReason: 'stop' }));
    },
    onError: () => 'I could not complete that request. Please try again, or use the quick questions below.',
  });
}

/**
 * getSavedAnswer – offline fallback reply used when the model produced no
 * text. Matches the lowercased question against per-project alias regexes
 * positionally (alias i ↔ PROJECTS[i]) so only the relevant project cards are
 * included; generic "project(s)" questions get all cards, and anything else
 * gets a generic outage message pointing at the quick-question cards.
 * Input: the latest user question; Output: ready-to-stream Markdown text.
 */
function getSavedAnswer(question: string): string {
  const text = question.toLowerCase();
  const aliases = [/\blively\b/, /\b(scp|coordinates predictor)\b/, /\b(skin|lesion)\b/, /\brozgaar\b/];
  // Positional pairing: the filter index selects the alias aligned with each
  // entry of PROJECTS (Lively, SCP, Skin Lesion, Rozgaar) — keep both arrays
  // the same length and order.
  const selected = PROJECTS.filter((_, index) => aliases[index].test(text));
  if (selected.length || /\bprojects?\b/.test(text)) {
    return 'The AI service is temporarily unavailable. Here are the saved project details:\n\n' +
      (selected.length ? selected : PROJECTS)
        .map((project) => `### ${project.title}\n${project.explanation}\n\n${project.links.map((link) => `[${link.name}](${link.url})`).join(' · ')}`)
        .join('\n\n');
  }
  return 'The AI service is temporarily unavailable. You can still use the quick questions to view my introduction, experience, skills, project cards, and résumé, or reach me at [anishhyd995@gmail.com](mailto:anishhyd995@gmail.com). Please try your question again in a moment.';
}

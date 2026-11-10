/**
 * chat-model.ts – AI provider selection
 * Builds the Groq model with a middleware that probes the first stream
 * events and falls back to Gemini when Groq is missing or fails.
 */
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import {
  wrapLanguageModel,
  type LanguageModelV1Middleware,
  type LanguageModelV1StreamPart,
} from 'ai';

// Primary provider: fast/cheap Groq endpoint used for every request that has a GROQ_API_KEY.
const groqModel = groq('qwen/qwen3.8-27b');
// Fallback provider: only reached when the Groq key is absent or the Groq stream errors early.
const geminiModel = google('gemini-3.8-flash');

// Check the first meaningful event before sending Groq's stream to the client.
// Failures at this point can safely fall back to Gemini.
const fallbackToGemini: LanguageModelV1Middleware = {
  async wrapStream({ doStream, params }) {
    // Fallback branch 1 – no GROQ_API_KEY at all: skip probing and stream
    // straight from Gemini (or fail fast when neither provider has a key).
    if (!process.env.GROQ_API_KEY) {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('No chat provider API key is configured');
      }
      return geminiModel.doStream(params);
    }

    let reader: ReadableStreamDefaultReader<LanguageModelV1StreamPart> | undefined;
    try {
      const result = await doStream();
      reader = result.stream.getReader();
      // Buffered-reader probe: pull chunks until the first meaningful event
      // (text-delta, tool call, or finish). Every chunk read while probing is
      // stashed in `buffered` so nothing is lost if Groq turns out healthy.
      const buffered: LanguageModelV1StreamPart[] = [];

      while (true) {
        const next = await reader.read();
        // An error part or a stream that ends before any content means Groq
        // failed — throw so the catch below can retry with Gemini.
        if (next.done) throw new Error('Groq returned an empty stream');
        if (next.value.type === 'error') throw next.value.error;
        buffered.push(next.value);
        if (
          next.value.type === 'text-delta' ||
          next.value.type === 'tool-call' ||
          next.value.type === 'tool-call-delta' ||
          next.value.type === 'finish'
        ) {
          break;
        }
      }

      // Success path: hand back a re-wrapped stream that first replays the
      // buffered probe chunks, then continues pulling from the original
      // reader — and forwards cancel() to it so nothing is left dangling.
      const primaryReader = reader;
      return {
        ...result,
        stream: new ReadableStream<LanguageModelV1StreamPart>({
          async pull(controller) {
            if (buffered.length) {
              controller.enqueue(buffered.shift()!);
              return;
            }
            try {
              const next = await primaryReader.read();
              if (next.done) controller.close();
              else controller.enqueue(next.value);
            } catch (error) {
              controller.error(error);
            }
          },
          cancel(reason) {
            return primaryReader.cancel(reason);
          },
        }),
      };
    } catch (error) {
      // Fallback branch 2 – Groq errored while probing (network failure,
      // empty stream, or an 'error' stream part): release the half-read
      // stream, log why, then replay the identical request on Gemini.
      // Without a Gemini key the original Groq error propagates instead.
      await reader?.cancel().catch(() => undefined);
      console.warn('[CHAT-API] Groq unavailable; trying Gemini:',
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message) : 'Provider request failed');
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw error;
      return geminiModel.doStream(params);
    }
  },
};

/**
 * chatModel – the language model handed to streamText() in /api/chat.
 * Wraps the Groq model with the fallbackToGemini middleware, so callers
 * see a single LanguageModelV1 that transparently switches providers when
 * Groq is unconfigured or fails during the opening stream events.
 */
export const chatModel = wrapLanguageModel({
  model: groqModel,
  middleware: fallbackToGemini,
});

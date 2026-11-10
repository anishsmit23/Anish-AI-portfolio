'use client';

/**
 * page.tsx – Landing page (home)
 * Client-side hero: animated logo and greeting, the memoji avatar, a
 * prompt box, and quick-question buttons that deep-link into /chat with
 * a pre-filled query. framer-motion drives the entrance animations and
 * FluidCursor the interactive cursor effect.
 */

import FluidCursor from '@/components/FluidCursor';
import { Button } from '@/components/ui/button';
import { SiteControls } from '@/components/site-controls';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Laugh,
  Layers,
  PartyPopper,
  UserRoundSearch,
} from 'lucide-react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

/* Display face used only for the greeting/headline; loaded from disk so
   it needs no network round-trip, and display:swap keeps text visible
   while the font resolves. */
const samarkan = localFont({
  src: './fonts/samarkan.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

/* ---------- quick-question data ---------- */
/* `questions` holds the exact prompt text pushed into the chat URL;
   `questionConfig` pairs each card with its accent color and icon. */
const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'Show me your project cards.',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Experience: 'Tell me about your AI/ML experience and the systems you build.',
  Contact: 'How can I contact you?',
} as const;

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Experience', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
] as const;

/* ---------- component ---------- */
/**
 * Home – landing page (client component for framer-motion and the
 * router). Three stacked blocks: the animated hero header, the clipped
 * memoji avatar, and the prompt form with its quick-question grid;
 * every entry point navigates to /chat?query=... with a chosen prompt.
 */
export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  /** URL-encodes the prompt and hands it to the chat route, which reads
   *  ?query= on mount to pre-fill and send it. */
  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  /* hero animations (unchanged) */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8 },
    },
  };
  /* Slides up from below with a 0.2s delay so the bottom half of the
     hero lands just after the header (staggered entrance). */
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8, delay: 0.2 },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* fixed top-left controls: welcome/info modal + light-dark toggle */}
      <SiteControls />
      {/* big blurred footer word */}
      {/* Absolute + overflow-hidden crop the giant gradient-filled name
          down to its upper half; the negative margin on the span tucks
          it behind the hero content. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          Anish
        </div>
      </div>

      {/* header */}
      <motion.div
        className="z-1 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="z-100">
          <Image src="/anish-mark.svg" alt="Anish logo" width={64} height={64} className="mx-auto rounded-xl" />
        </div>

        <h2 className={`${samarkan.className} text-secondary-foreground mt-1 text-xl font-normal md:text-2xl`}>
          Hey, I'm Anish 👋
        </h2>
        <h1 className={`${samarkan.className} text-4xl font-normal sm:text-5xl md:text-6xl lg:text-7xl`}>
          AI/ML Engineer
        </h1>
      </motion.div>

      {/* Landing avatar */}
      {/* Fixed-height container clips the tall (354×612) memoji render:
          the image is sized larger than the box and centered with
          translate so it crops evenly at every breakpoint without
          distortion. */}
      <div className="relative z-10 h-52 w-48 overflow-hidden sm:h-72 sm:w-72">
        <Image
          src="/anish-avatar.png"
          alt="Anish's illustrated avatar"
          width={354}
          height={612}
          priority
          className="absolute top-1/2 left-1/2 h-[390px] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain sm:h-[520px]"
        />
      </div>

      {/* input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* free-form question */}
        {/* Enter (or the arrow button) forwards the trimmed prompt;
            whitespace-only input neither enables the button nor
            navigates. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="w-full border-none bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Submit question"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <ArrowRight  className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* quick-question grid */}
        {/* One column on mobile, three on small, five on md+ — each
            card reuses its config entry's accent color and icon and
            pushes the canned prompt straight into the chat URL. */}
        <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              variant="outline"
              className="border-border bg-card/40 hover:bg-accent aspect-square w-full cursor-pointer rounded-2xl border py-8 shadow-none backdrop-blur-lg active:scale-95 md:p-10"
            >
              <div className="text-foreground flex h-full flex-col items-center justify-center gap-1">
                <Icon size={22} strokeWidth={2} color={color} />
                <span className="text-xs font-medium sm:text-sm">{key}</span>
              </div>
            </Button>
          ))}
        </div>
      </motion.div>
      {/* full-screen interactive cursor effect layered above the page */}
      <FluidCursor />
    </div>
  );
}

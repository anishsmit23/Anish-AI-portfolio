'use client';
/**
 * presentation.tsx – Hero introduction section
 * Two-column "who am I" block: portrait on the left, gradient name, meta
 * line, bio paragraph and skill tag pills on the right, all entrance-animated.
 * Doubles as the "getPresentation" chat tool card.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

/** Animated profile introduction shown at the top of the page / in chat. */
export function Presentation() {
  // Personal information
  const profile = {
    name: 'Anish',
    age: 'Final-year B.Tech student',
    location: 'Hyderabad, India',
    // Add a newline character after the emoji
    description:
      "Hey 👋\nI'm Anish, an AI/ML Engineer focused on production-grade GenAI, agentic systems, and deep learning. I build real-time voice agents, RAG workflows, and multimodal ML applications with Python, FastAPI, PyTorch, and AWS.",
    src: '/anish-portrait.png',
  };

  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Animation for the entire paragraph rather than word-by-word
  const paragraphAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Image section */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {/* Portrait reveal: zoom from 92% with an expo-out ease for a snappy finish. */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="h-full w-full"
            >
              <Image
                src={profile.src}
                alt={profile.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
          </div>
        </div>

        {/* Text content section */}
        <div className="flex flex-col space-y">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
              {profile.name}
            </h1>
            <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <p className="text-muted-foreground">{profile.age}</p>
              <div className="bg-border hidden h-1.5 w-1.5 rounded-full md:block" />
              <p className="text-muted-foreground">{profile.location}</p>
            </div>
          </motion.div>

          {/* whitespace-pre-line preserves the \n breaks baked into profile.description. */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={paragraphAnimation}
            className="text-foreground mt-6 leading-relaxed whitespace-pre-line"
          >
            {profile.description}
          </motion.p>

          {/* Tags/Keywords */}
          {/* Delayed fade-in so the tag pills appear after the bio has settled. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {['AI/ML', 'GenAI', 'Agentic Systems', 'Python', 'MLOps'].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Presentation;

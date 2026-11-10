'use client';
/**
 * chat-landing.tsx – Empty-state landing for the chat
 * Holds the suggested-question chips and entrance variants shown before the
 * first message; clicking a chip hands the prompt to chat.tsx via submitQuery.
 */

import { motion } from 'framer-motion';
import { ArrowUpRight, Award, Code, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Message flow: submitQuery comes from chat.tsx, which appends the prompt as a
// user message through useChat's append(). useChat POSTs to /api/chat and
// streams the reply; streamed parts land on the assistant message's `parts`
// array, where chat-message-content.tsx consumes text parts and
// tool-renderer.tsx consumes tool invocations (see SimplifiedChatView).
interface ChatLandingProps {
  submitQuery: (query: string) => void;
}

/** Suggested-prompt landing view rendered while the chat has no messages. */
const ChatLanding: React.FC<ChatLandingProps> = ({
  submitQuery,
}) => {
  // Suggested questions that the user can click on
  // Each entry would call submitQuery(text) to start the streaming flow; note
  // the JSX body below currently renders an empty container, so these chips
  // are defined but not shown yet.
  const suggestedQuestions = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: 'Who are you?',
    },
    {
      icon: <Code className="h-4 w-4" />,
      text: 'What projects have you worked on?',
    },
    {
      icon: <Award className="h-4 w-4" />,
      text: 'What are your skills?',
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: 'How can I contact you?',
    },
  ];

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    // Empty state: entrance variants are kept, but no chips are rendered yet,
    // so the chat page shows this container until content is added.
    <motion.div
      className="flex w-full flex-col items-center px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
     
    </motion.div>
  );
};

export default ChatLanding;

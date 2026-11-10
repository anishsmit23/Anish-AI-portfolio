// src/components/chat/chat-bottombar.tsx
'use client';
/**
 * chat-bottombar.tsx – Message composer
 * Controlled input + send/stop button. All chat state lives in chat.tsx via
 * useChat; this component only reports changes (handleInputChange), submits
 * the form and flips between "send" and "stop streaming" modes.
 */

import { ChatRequestOptions } from 'ai';
import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import React, { useEffect } from 'react';

interface ChatBottombarProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  isLoading: boolean;
  stop: () => void;
  input: string;
  isToolInProgress: boolean;
  disabled?: boolean;
}

/**
 * Composer bar: text input + send/stop button with Enter-to-submit.
 * @param isToolInProgress – while true the input stays disabled so a pending
 *   tool card can finish before the next message is sent.
 */
export default function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  isToolInProgress,
  disabled = false,
}: ChatBottombarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Enter submits, guarded against IME composition (CJK input), an in-flight
  // stream, disabled state, pending tool work and blank input.
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      !isLoading &&
      !disabled &&
      !isToolInProgress &&
      input.trim()
    ) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // Keep the composer focused so visitors can type immediately (inputRef is
  // stable, so this runs once on mount).
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full pb-2 md:pb-5"
    >
      <form onSubmit={handleSubmit} className="relative w-full md:px-4">
        <div className="border-border bg-card focus-within:border-ring/60 mx-auto flex items-center rounded-full border py-2 pr-2 pl-6 transition-colors">
          <input
            ref={inputRef}
            type="text"
            aria-label="Ask Anish a question"
            maxLength={1000}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={
              disabled ? '' : isLoading ? 'Preparing your answer…' : 'Ask me anything'
            }
            className={`text-md w-full border-none bg-transparent placeholder:text-muted-foreground focus:outline-none ${
              disabled ? 'text-muted-foreground font-medium' : 'text-foreground'
            }`}
            disabled={isToolInProgress || isLoading || disabled}
          />

          {/* While streaming the button stops the response; otherwise it submits. */}
          <button
            type={isLoading ? 'button' : 'submit'}
            aria-label={isLoading ? 'Stop response' : 'Send message'}
            disabled={disabled || (!isLoading && (!input.trim() || isToolInProgress))}
            className="flex items-center justify-center rounded-full bg-[#0171E3] p-2 text-white disabled:opacity-50"
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
                stop();
              }
            }}
          >
            {isLoading ? <Square className="h-5 w-5" fill="currentColor" /> : <ArrowUp className="h-6 w-6" />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

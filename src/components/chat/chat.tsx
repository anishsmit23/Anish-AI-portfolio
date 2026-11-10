'use client';
/**
 * chat.tsx – Main chat experience
 * Owns message state via useChat, streams responses from /api/chat, renders
 * tool cards, and handles retry/fallback UI. Also hosts the animated avatar
 * header, the ?query= deep-link auto-submit, and the landing/loading states.
 */
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { SiteControls } from '@/components/site-controls';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
// Renders nothing until after hydration, so children that read browser-only
// APIs never produce a server/client markup mismatch.
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isTalking: boolean;
}

// Dynamic import of Avatar component
// ssr:false keeps the avatar (and its window.navigator sniffing) client-only,
// avoiding hydration mismatches between server and browser user agents.
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, videoRef, isTalking }: AvatarProps) => {
      // This function will only execute on the client
      const isIOS = () => {
        // Multiple detection methods
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const maxTouchPoints = window.navigator.maxTouchPoints || 0;

        // UserAgent-based check
        const isIOSByUA =
          //@ts-ignore
          /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

        // Platform-based check
        const isIOSByPlatform = /iPad|iPhone|iPod/.test(platform);

        // iPad Pro check
        const isIPadOS =
          //@ts-ignore
          platform === 'MacIntel' && maxTouchPoints > 1 && !window.MSStream;

        // Safari check
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);

        return isIOSByUA || isIOSByPlatform || isIPadOS || isSafari;
      };

      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <Link
            href="/"
            aria-label="Return to the main page"
            className={`relative block shrink-0 overflow-hidden rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-24 w-24'}`}
          >
            <Image src="/anish-avatar.png" alt="Anish's avatar" width={354} height={612} priority className="h-full w-full object-cover object-[50%_55%]" />
          </Link>
        </div>
      );
    }),
  { ssr: false }
);

// Shared framer-motion preset: 0.3s fade-and-slide used for every view swap
// (landing ↔ chat ↔ loading bubble) so transitions stay consistent.
const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

/** Root chat page component: state machine over landing / loading / conversation. */
const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchParams = useSearchParams();
  // Deep link: /chat?query=... (set by WelcomeModal's "Contact me" action).
  const initialQuery = searchParams.get('query');
  // Guards the ?query= auto-submit so it fires at most once per mount.
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  // True between "query submitted" and "first token received" → loading bubble.
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // Drives the avatar's talking animation (video play/pause).
  const [isTalking, setIsTalking] = useState(false);
  // Non-null shows the retry banner above the composer.
  const [chatError, setChatError] = useState<string | null>(null);
  // Re-entrancy lock: prevents double submits from rapid clicks or chips.
  const submissionRef = useRef(false);

  // Message flow: useChat keeps the transcript and POSTs each user message to
  // /api/chat. The streamed response is appended to the latest assistant
  // message's `parts` array as it arrives — text parts are consumed by
  // ChatMessageContent and tool-invocation parts by ToolRenderer (via
  // SimplifiedChatView). The callbacks below sync UI state with that stream:
  // onResponse → start the talking avatar, onFinish → settle, onError → banner.
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
        setIsTalking(true);
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('Failed to play video:', error);
          });
        }
      }
    },
    onFinish: () => {
      submissionRef.current = false;
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    onError: (error) => {
      submissionRef.current = false;
      setChatError('I couldn’t load that answer. Please try again.');
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      console.error('Chat error:', error.message, error.cause);
      toast.error('I couldn’t load that answer. You can retry below.');
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  // Derive what to show: the latest assistant message (only when it follows
  // the latest user message — otherwise we're still waiting for a reply), the
  // latest user message (rendered as a sent bubble while waiting), and whether
  // a tool result is present (which shrinks the avatar header).
  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  // True while the newest assistant message has an unfinished tool call
  // ("call"/"partial-call" state): the composer stays disabled until it resolves.
  const isToolInProgress = isLoading && messages.slice(-1).some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  // Shared entry point for chips, the landing view and the ?query= deep link:
  // appends the prompt as a user message, which kicks off the /api/chat stream.
  //@ts-ignore
  const submitQuery = (query) => {
    if (!query.trim() || isLoading || submissionRef.current) return;
    submissionRef.current = true;
    setChatError(null);

    setLoadingSubmit(true);
    void append({
      role: 'user',
      content: query,
    }).catch(() => {
      submissionRef.current = false;
      setLoadingSubmit(false);
    });
  };

  // Mount effect: prepare the avatar video (looped/muted/inline, paused) and
  // auto-submit the ?query= deep-link prompt exactly once.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.pause();
    }

    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted]);

  // Mirror the talking state onto the avatar video: play while the stream is
  // arriving, pause as soon as it finishes or errors.
  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch((error) => {
          console.error('Failed to play video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  // Form submit wrapper: hands the input to submitQuery, then clears the composer.
  //@ts-ignore
  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || submissionRef.current) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    submissionRef.current = false;
    stop();
    setLoadingSubmit(false);
    setIsTalking(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  // Compact header (100px) while a tool card is shown, taller (180px) otherwise.
  const headerHeight = hasActiveTool ? 100 : 180;
  // The project gallery is wider than a normal reply → widen the container.
  const hasProjectGallery = currentAIMessage?.parts?.some(
    (part) => part.type === 'tool-invocation' && part.toolInvocation.toolName === 'getProjects'
  );

  return (
    <div className="relative h-screen overflow-hidden">
      <SiteControls />

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="chat-header-fade fixed top-0 right-0 left-0 z-50"
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
                videoRef={videoRef}
                isTalking={isTalking}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {/* Show the just-sent user bubble at the top while no reply has
                arrived yet; it disappears once the assistant message exists. */}
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`container mx-auto flex h-full flex-col ${hasProjectGallery ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          {/* Three-way view switch: landing (no messages) → simplified
              conversation (assistant reply) → typing bubble while loading. */}
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="bg-background sticky bottom-0 px-2 pt-3 md:px-0 md:pb-4">
          {/* Error banner: clears the message and re-runs the failed request
              via useChat's reload(). */}
          {chatError && (
            <div role="alert" className="bg-secondary text-secondary-foreground mb-3 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm">
              <span>{chatError}</span>
              <button type="button" disabled={isLoading} className="cursor-pointer font-semibold underline disabled:opacity-50" onClick={() => {
                setChatError(null);
                setLoadingSubmit(true);
                void reload().catch(() => setLoadingSubmit(false));
              }}>Retry</button>
            </div>
          )}
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={submitQuery} setInput={setInput} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

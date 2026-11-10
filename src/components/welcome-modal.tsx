'use client';
/**
 * welcome-modal.tsx – "About this portfolio" dialog
 * Explains what the site is and why it's chat-driven. Accepts an optional
 * custom trigger (used by SiteControls) or falls back to an avatar button,
 * and can deep-link into the chat with a ?query= parameter.
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Importation correcte pour Next.js 13+
import { useState } from 'react';

// Added a trigger prop to accept custom triggers
interface WelcomeModalProps {
  trigger?: React.ReactNode;
}

/**
 * Welcome modal explaining the portfolio; opens from a custom trigger or the
 * default avatar button and can navigate into the chat with a prefilled query.
 */
export default function WelcomeModal({ trigger }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialisation du router avec useRouter

  // Use the avatar for the default trigger outside the landing page.
  const defaultTrigger = (
    <Button
      variant="ghost"
      className="bg-card/30 hover:bg-accent h-auto w-auto cursor-pointer rounded-2xl p-3 shadow-lg backdrop-blur-lg focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      onClick={() => setIsOpen(true)}
    >
      <Image
        src="/anish-avatar.png"
        width={100}
        height={100}
        alt="Anish's avatar"
        className="h-10 w-10 rounded-full object-cover object-[50%_55%] md:h-12 md:w-12"
      />
      <span className="sr-only">About Anish</span>
    </Button>
  );

  // Fonction qui utilise window.location pour forcer un rechargement complet
  // Full reload (not client-side nav) so /chat re-mounts and auto-submits the
  // ?query= parameter on load — see chat.tsx's initialQuery effect.
  const handleContactMe = () => {
    setIsOpen(false);
    // Forcer un rechargement complet de la page avec la requête
    window.location.href = '/chat?query=How%20can%20I%20contact%20you%3F';
  };

  return (
    <>
      {/* Use custom trigger if provided, otherwise use default */}
      {/* The wrapper div binds the open handler, so custom triggers need no onClick. */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-background z-52 max-h-[85vh] overflow-auto rounded-2xl border-none p-4 py-6 shadow-xl sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[1000px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col"
          >
            {/* Header */}
            <DialogHeader className="relative flex flex-row items-start justify-between px-8 pt-8 pb-6">
              <div>
                <DialogTitle className="flex items-center gap-2 text-4xl font-bold tracking-tight">
                  Welcome to Anish's AI Portfolio
                </DialogTitle>
                <DialogDescription className="mt-2 text-base">
                  {/*My interactive AI portfolio experience*/}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="sticky top-0 right-0 cursor-pointer rounded-full bg-black p-2 text-white hover:bg-black/90 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>

            {/* Content area */}
            <div className="space-y-6 overflow-y-auto px-2 py-4 md:px-8">
              <section className="bg-accent w-full space-y-8 rounded-2xl p-8">
                {/* What section */}
                <div className="space-y-3">
                  <h3 className="text-primary flex items-center gap-2 text-xl font-semibold">
                    What is this?
                  </h3>
                  <p className="text-accent-foreground text-base leading-relaxed">
                    Explore my <strong>AI/ML portfolio.</strong>
                    <br /> Whether you're a recruiter, a friend, family member,
                    or just curious, feel free to ask anything you want!
                  </p>
                </div>

                {/* Why section */}
                <div className="space-y-3">
                  <h3 className="text-primary flex items-center gap-2 text-xl font-semibold">
                    Why chat?
                  </h3>
                  <p className="text-accent-foreground text-base leading-relaxed">
                    Traditional portfolios can be limiting. <br /> They can't
                    adapt to every visitor's specific needs. <br /> My portfolio
                    becomes{' '}
                    <strong>
                      exactly what you're interested in knowing about me and my
                      work.
                    </strong>
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center px-8 pt-4 pb-0 md:pb-8">
              {/* Dismiss action — closes the dialog without navigating. */}
              <Button
                onClick={() => setIsOpen(false)}
                className="h-auto rounded-full px-4 py-3"
                size="sm"
              >
                Start Chatting
              </Button>
              <div
                className="mt-6 flex cursor-pointer flex-wrap gap-1 text-center text-sm"
                onClick={handleContactMe}
              >
                <p className="text-muted-foreground">
                  If you love it, please share it! Feedback is always welcome.
                </p>
                <div className="flex cursor-pointer items-center text-blue-500 hover:underline">
                  Contact me.
                </div>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}

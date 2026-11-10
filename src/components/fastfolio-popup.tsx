'use client';
/**
 * fastfolio-popup.tsx – "Want to connect?" dialog
 * Small contact popup with two CTAs (mailto + résumé PDF). Fully controlled:
 * visibility and toggle events are owned by the parent component.
 */

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';

// Controlled dialog: `open` decides visibility, `onOpenChange` reports every
// open/close attempt (Esc, overlay click, close button) back to the parent.
interface FastfolioPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Contact popup offering a direct email and a résumé download. */
export function FastfolioPopup({ open, onOpenChange }: FastfolioPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Want to connect?</DialogTitle>
          <DialogDescription>
            I would be glad to discuss AI/ML projects and engineering opportunities.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-3">
          {/* Primary CTA: hands off to the visitor's default mail client. */}
          <Button asChild><a href="mailto:anishhyd995@gmail.com"><Mail className="mr-2 h-4 w-4" />Email Anish</a></Button>
          {/* Résumé opens the hosted PDF in a new tab; rel protects the opener. */}
          <Button asChild variant="outline"><a href="/anish-resume.pdf" target="_blank" rel="noopener noreferrer">View résumé</a></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

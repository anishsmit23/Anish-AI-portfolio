'use client';
/**
 * resume.tsx – Résumé download card
 * Card-style file widget for /anish-resume.pdf: clicking anywhere on it
 * triggers a programmatic download. Used as the "getResume" chat tool card.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, Download, Eye, File } from 'lucide-react';
import Image from 'next/image';

/** Clickable résumé card that downloads the hosted PDF. */
export function Resume() {
  // Resume details
  const resumeDetails = {
    title: "Anish's Resume",
    description: 'AI/ML Engineer • GenAI & Agentic Systems',
    fileType: 'PDF',
    fileSize: '82 KB',
    previewImageSrc: '',
    downloadUrl: '/anish-resume.pdf',
  };

  const handleDownload = () => {
    // Create a link element
    // Programmatic <a> click starts the download without navigating away;
    // the temporary node is removed right after the click.
    const link = document.createElement('a');
    link.href = resumeDetails.downloadUrl;
    link.download = resumeDetails.downloadUrl.split('/').pop() || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      {/* Whole card is the hit area: duration 0 makes the entrance instant,
          while the hover scale provides the click affordance. */}
      <motion.div
        onClick={handleDownload}
        className="border-border bg-card group relative cursor-pointer overflow-hidden rounded-xl border p-0 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Details area (bottom part) */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeDetails.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>

            {/* Download indicator */}
            <motion.div
              className="bg-foreground text-background group-hover:bg-foreground/80 flex h-10 w-10 items-center justify-center rounded-full"
              initial={{ scale: 1 }}
            >
              <Download className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;

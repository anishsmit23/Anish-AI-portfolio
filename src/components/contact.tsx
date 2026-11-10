'use client';
/**
 * contact.tsx – Contact section
 * Renders email, phone and social links from a local contactInfo object;
 * profile links open in a new tab through openLink(), while email/phone use
 * mailto:/tel: handlers. Doubles as the "getContact" chat tool card.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/** Contact card with email, phone number and social profile links. */
export function Contact() {
  // Contact information
  const contactInfo = {
    name: 'Anish',
    email: 'anishhyd995@gmail.com',
    phone: '+91-8918316281',
    handle: '@anishsmit23',
    socials: [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/anish55/',
      },
      {
        name: 'Github',
        url: 'https://github.com/anishsmit23',
      },
    ],
  };

  // Function to handle opening links
  // noopener/noreferrer keeps the new tab from reaching back via window.opener.
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="border-border bg-card w-full overflow-hidden rounded-3xl border px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contacts
          </h2>
          <span className="mt-2 sm:mt-0">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div
            className="group mb-5 cursor-pointer"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* tel: link — strips spaces/dashes but keeps "+" so it stays dialable. */}
          <a className="mb-5 text-sm text-blue-500 hover:underline sm:text-base" href={`tel:${contactInfo.phone.replace(/[^+\d]/g, '')}`}>
            {contactInfo.phone}
          </a>

          {/* Social Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                onClick={() => openLink(social.url)}
                title={social.name}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

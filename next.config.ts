/**
 * next.config.ts – Next.js configuration
 * Whitelists the remote image hosts this site may load through
 * next/image and keeps ESLint failures from blocking production builds.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image refuses any host not whitelisted here — these two
    // cover the Unsplash photos and Aceternity assets used in the UI.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.aceternity.com' },
    ],
  },
  eslint: {
    // Lint stays runnable via `npm run lint`, but a lint error must not
    // fail `next build` or block a deploy.
    // Ne bloque PAS le build en cas d'erreurs eslint
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

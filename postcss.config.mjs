/**
 * postcss.config.mjs – PostCSS pipeline
 * Runs the single Tailwind v4 PostCSS entry point for every CSS file
 * Next.js compiles, replacing the v3 `tailwindcss` + `autoprefixer`
 * pair.
 */

const config = {
  // @tailwindcss/postcss is Tailwind v4's compiler: it expands
  // `@import "tailwindcss"`, `@theme` and `@custom-variant` directives
  // from globals.css into the final utility CSS the app ships.
  plugins: ["@tailwindcss/postcss"],
};

export default config;

/**
 * eslint.config.mjs – ESLint flat config
 * Adapts Next.js's legacy eslintrc-style presets to the flat-config
 * format ESLint 9 expects, using @eslint/eslintrc's FlatCompat.
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Flat ESM modules have no __dirname — rebuild it from import.meta.url
// so FlatCompat can resolve shareable configs relative to this folder.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FlatCompat translates legacy eslintrc-style configs (`extends`,
// `plugins`, …) into the flat `configs` array shape ESLint 9 expects.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // next/core-web-vitals: Next.js React/a11y/perf rules;
  // next/typescript: base TypeScript rules for .ts/.tsx files.
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

/**
 * .eslintrc.js – Legacy ESLint configuration (eslintrc format)
 * Extends Next.js core-web-vitals, Tailwind class-ordering, and Prettier,
 * then relaxes a few TypeScript/React rules for this codebase. ESLint 9
 * reads eslint.config.mjs by default; this file is kept for tools and
 * editors that still expect the eslintrc format.
 */

module.exports = {
  // Stops ESLint from searching parent directories — this file is the
  // definitive config for the project.
  root: true,
  extends: [
    // Next.js core web vitals: React correctness, a11y, and perf rules.
    "next/core-web-vitals",
    // Tailwind plugin: enforces a consistent class ordering.
    "plugin:tailwindcss/recommended",
    // eslint-config-prettier: disables all style rules that would
    // conflict with Prettier's formatting.
    "prettier"
  ],
  // Loads the plugin that reports Prettier violations as lint errors.
  plugins: ["prettier"],
  rules: {
    // Formatting problems surface as lint errors (Prettier run as a rule).
    "prettier/prettier": "error",
    // Unused variables/params are tolerated instead of failing lint.
    "@typescript-eslint/no-unused-vars": "off",
    // `any` is allowed so quick prototypes aren't blocked by lint.
    "@typescript-eslint/no-explicit-any": "off",
    // Missing-dependency warnings for effects are suppressed; hooks in
    // the animation-heavy components manage their deps manually.
    "react-hooks/exhaustive-deps": "off",
    // Allows raw ' and " inside JSX text (e.g. "I'm") without escaping.
    "react/no-unescaped-entities": "off"
  },
  // Parse TS/JS sources with the TypeScript parser so type-aware syntax
  // (generics, enums, …) doesn't trip the default espree parser.
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
  settings: {
    tailwindcss: {
      // Configuration par défaut, vous pouvez personnaliser selon vos besoins
      // Helper functions the Tailwind plugin scans for class strings.
      callees: ["classnames", "clsx", "ctl"],
      // Tailwind config the plugin reads for theme values when linting.
      config: "tailwind.config.js",
      // Collapse duplicate classes and inspect every class attribute.
      removeDuplicates: true,
      skipClassAttribute: false,
      // Classes exempt from the plugin's ordering rules.
      whitelist: [],
      // Si vous utilisez des composants Shadcn, vous pourriez vouloir ajouter leurs classes à la whitelist
    },
  },
};
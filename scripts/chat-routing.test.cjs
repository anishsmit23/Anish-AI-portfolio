/**
 * chat-routing.test.cjs – Intent routing tests
 * Validates getPortfolioCard() from src/lib/portfolio-intents.ts: which
 * landing-page questions must jump to a portfolio card and which should
 * stay in the free-form chat for the model to answer. Runs with
 * `npm run test:chat` via node:test — no build step required.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

// Transpile the TS module to CommonJS and evaluate it in an isolated vm
// context, so the test can read getPortfolioCard's exports without a
// bundler or a TypeScript loader.
const source = fs.readFileSync(path.join(__dirname, '../src/lib/portfolio-intents.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const loaded = { exports: {} };
vm.runInNewContext(compiled, { module: loaded, exports: loaded.exports });
const { getPortfolioCard } = loaded.exports;

// Scenario: career/experience phrasing (including the exact prompt the
// landing page's Experience button sends) must route to the internship
// card instead of a generic answer.
test('experience questions use the local experience card', () => {
  for (const question of [
    'what is your experience',
    'Tell me about your AI/ML experience and the systems you build.',
    'Where are you working now?',
    'What is your professional background?',
  ]) assert.equal(getPortfolioCard(question), 'getInternship', question);
});

// Scenario: each canned landing-page prompt maps to its dedicated card
// (about, contact, résumé, skills, projects).
test('standard navigation selects the intended card', () => {
  const cases = [
    ['Who are you? I want to know more about you.', 'getPresentation'],
    ['How can I contact you?', 'getContact'],
    ['Show me your résumé.', 'getResume'],
    ['What are your soft and hard skills?', 'getSkills'],
    ['Show me the project cards.', 'getProjects'],
  ];
  for (const [question, expected] of cases) assert.equal(getPortfolioCard(question), expected);
});

// Scenario: "explain/compare projects" questions intentionally return
// no card — they need the model's prose answer, not a UI jump.
test('project explanations stay in written chat', () => {
  for (const question of [
    'Explain all your projects: what each does, how it works, and the results.',
    'Tell me about Lively and your experience building it.',
    'What skills did you use in Rozgaar AI?',
    'Compare SCP and Skin Lesion Segmentation.',
    'How does the project architecture work?',
  ]) assert.equal(getPortfolioCard(question), undefined, question);
});

// Scenario: an open-ended follow-up ("why did you choose…") must not be
// captured by the router and keeps flowing through the written chat.
test('follow-up questions remain available to the model', () => {
  assert.equal(getPortfolioCard('Why did you choose that approach?'), undefined);
});

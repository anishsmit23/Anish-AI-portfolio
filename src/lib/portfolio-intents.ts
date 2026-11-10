/**
 * portfolio-intents.ts – rule-based intent matching for the chat route
 * Decides whether a free-form question can be answered with a canned
 * portfolio card using an ordered chain of accent-insensitive regex
 * checks; an undefined result means the question goes to the LLM.
 */
/** Card identifiers — exactly the tool names exposed in /api/chat's `tools` map. */
export type PortfolioCard =
  | 'getPresentation'
  | 'getInternship'
  | 'getProjects'
  | 'getSkills'
  | 'getResume'
  | 'getContact';

// These cards contain local portfolio content and do not need a model to select them.
/**
 * getPortfolioCard – maps the latest user question to a tool name whose
 * card should be emitted without calling the model.
 *
 * The normalizer strips diacritics and lowercases first, then patterns are
 * tested top-down and the first match wins — so the narrow exceptions
 * (named projects, "explain/compare" phrasing) must stay above the generic
 * keywords that would otherwise swallow them.
 *
 * @returns A PortfolioCard tool name, or `undefined` when the question
 *          needs a written answer from the LLM (project-specific and
 *          off-topic questions fall through on purpose).
 */
export function getPortfolioCard(question: string): PortfolioCard | undefined {
  // NFKD + strip combining marks so "résumé"/"RÉSUMÉ" hit the same patterns,
  // then lowercase to make every match case-insensitive.
  const text = question.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // A question about an individual project should receive a written explanation.
  // Returning undefined here hands the question to the LLM instead of a card.
  if (/\b(lively|rozgaar|scp|coordinates predictor|skin lesion)\b/.test(text)) return;
  if (/\bprojects?\b/.test(text)) {
    // "Explain/compare/how" about projects needs prose, not the overview card.
    if (/\b(explain|describe|compare|architecture|how|why|results?|tell me about|walk me through)\b/.test(text)) return;
    return 'getProjects';
  }
  if (/\b(resume|résumé|cv)\b/.test(text)) return 'getResume';
  if (/\b(contact|reach you|email|phone|linkedin|github)\b/.test(text)) return 'getContact';
  if (/\b(experience|professional background|work history|worked|working|internships?|opportunities|hire you)\b/.test(text)) return 'getInternship';
  if (/\b(skills?|tech stack|technologies|soft and hard)\b/.test(text)) return 'getSkills';
  if (/\b(who are you|who is anish|tell me who you are|about yourself|about you|about anish|introduce yourself|introduction|educational background|achievements)\b/.test(text)) return 'getPresentation';
}

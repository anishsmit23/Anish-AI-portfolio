/**
 * github-stars/route.ts – GET /api/github-stars
 * Fetches the public GitHub star count for this portfolio's repository with
 * aggressive caching, and degrades to `stars: null` so the UI can hide the
 * badge instead of failing when GitHub is rate-limited or unreachable.
 */
const REPO = 'anishsmit23/Anish-AI-portfolio';

/**
 * GET – returns `{ stars: number | null }` for REPO.
 * The star count is decorative, so failure paths return a stable JSON shape
 * with `null` (the UI then hides the badge) instead of throwing a 500 that
 * would surface as a broken request on the landing page.
 */
export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      // Only send credentials when they exist: an "undefined" bearer token
      // makes GitHub reject the request even for a public repo.
      headers: process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {},
      // Cache for an hour so the shared Vercel IPs stay well inside
      // GitHub's unauthenticated rate limit.
      next: { revalidate: 3600 },
    });

    // Propagate GitHub's status code but keep the payload shape stable
    // ({ stars }) so the client never has to special-case this branch.
    if (!res.ok) {
      return Response.json({ stars: null }, { status: res.status });
    }

    const data = await res.json();
    return Response.json({ stars: data.stargazers_count });
  } catch {
    // Network/parse failure → 502 with a null count: the star badge hides
    // itself instead of surfacing an error on the landing page.
    return Response.json({ stars: null }, { status: 502 });
  }
}

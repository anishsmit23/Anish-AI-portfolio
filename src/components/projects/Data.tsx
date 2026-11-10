/**
 * Data.tsx – project detail body
 * Renders the sections shared by every project dialog: overview,
 * problem, architecture, results, tech stack, and links — all straight
 * from the PortfolioProject entry in project-catalog.ts.
 */
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { PortfolioProject } from '@/lib/project-catalog';

/**
 * ProjectContent – the body shown inside the AllProjects detail dialog:
 * `explanation` → "What I built", `problem` → "The problem",
 * `architecture` → the ordered "How it works" list (zero-padded 01…NN
 * step badges), `results` → stat cards, `techStack` → chips, and
 * `links` → the CTA buttons at the bottom.
 */
export function ProjectContent({ project }: { project: PortfolioProject }) {
  return (
    <div className="space-y-9">
      <section aria-label="Project overview" className="space-y-3">
        <h3 className="text-lg font-semibold">What I built</h3>
        <p className="text-muted-foreground leading-relaxed">{project.explanation}</p>
      </section>

      <section className="bg-secondary/60 rounded-2xl p-5 sm:p-6">
        <h3 className="mb-3 text-lg font-semibold">The problem</h3>
        <p className="text-secondary-foreground leading-relaxed">{project.problem}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">How it works</h3>
        <ol className="space-y-5">
          {project.architecture.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="border-border bg-secondary text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className="mb-1 font-medium">{step.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />Results and scope</h3>
        <dl className="grid gap-3 sm:grid-cols-3">
          {project.results.map((result) => (
            <div key={result.label} className="border-border bg-card rounded-2xl border p-5">
              <dt className="text-muted-foreground text-sm leading-relaxed">{result.label}</dt>
              <dd className="mt-3 text-2xl font-semibold tracking-tight">{result.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Technologies</h3>
        <ul className="flex flex-wrap gap-2" aria-label="Technology stack">
          {project.techStack.map((tech) => <li key={tech} className="bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-sm">{tech}</li>)}
        </ul>
      </section>

      {/* Links straight from the catalog: the first entry gets the solid
          primary style and its label is rewritten ("Live app" → "Try Lively
          live"), while every other link renders as the bordered GitHub
          source button — all open in a new tab. */}
      <section className="border-border flex flex-wrap gap-3 border-t pt-6" aria-label="Project links">
        {project.links.map((link, index) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${index === 0 ? 'bg-foreground text-background hover:bg-foreground/85' : 'border-border hover:bg-accent border'}`}>
            {link.name === 'Live app' ? 'Try Lively live' : 'View source on GitHub'}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </section>
    </div>
  );
}

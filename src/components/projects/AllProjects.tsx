'use client';

/**
 * AllProjects.tsx – horizontal project showcase
 * Renders a CSS scroll-snap row of the PROJECTS cards; each card opens a
 * Radix dialog filled by ProjectContent, and arrow buttons page the row
 * based on measured scroll edges.
 */
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PROJECTS, type PortfolioProject } from '@/lib/project-catalog';
import { ProjectContent } from './Data';

// Display metadata for each card face; index-aligned with PROJECTS, so
// visuals[i] always describes PROJECTS[i].
const visuals = [
  { title: 'Lively', category: 'Voice AI Agent', background: 'bg-stone-900' },
  { title: 'SCP Predictor', category: 'Trajectory Forecasting', background: 'bg-[radial-gradient(ellipse_at_50%_90%,#164e63_0%,#0c1726_55%,#05080e_100%)]' },
  { title: 'Skin Lesion AI', category: 'Computer Vision', background: 'bg-[radial-gradient(ellipse_at_65%_70%,#713347_0%,#25141e_55%,#100b10_100%)]' },
  { title: 'Rozgaar AI', category: 'Agentic Workflow', background: 'bg-[radial-gradient(ellipse_at_50%_85%,#493580_0%,#201932_55%,#0c0a13_100%)]' },
];

/**
 * ProjectArtwork – decorative SVG chosen by project index: 1 = SCP's
 * trajectory fan, 2 = skin-lesion segmentation, default = Rozgaar's
 * five-agent graph. Index 0 (Lively) always has project.image and therefore
 * never reaches the artwork branch.
 */
function ProjectArtwork({ index }: { index: number }) {
  if (index === 1) return (
    <svg viewBox="0 0 280 270" className="absolute inset-x-0 bottom-0 w-full" fill="none" aria-hidden="true">
      <g stroke="#67e8f9" opacity=".12">
        {[40, 80, 120, 160, 200, 240].map((x) => <path key={x} d={`M${x} 30v240`} />)}
        {[60, 100, 140, 180, 220, 260].map((y) => <path key={y} d={`M0 ${y}h280`} />)}
      </g>
      <path d="M22 250 62 228 96 208 126 185" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round" />
      {[['M126 185Q151 125 249 100', '#67e8f9'], ['M126 185Q176 180 265 153', '#38bdf8'], ['M126 185Q159 90 195 46', '#a5f3fc'], ['M126 185Q184 214 261 210', '#818cf8'], ['M126 185Q117 107 130 65', '#22d3ee'], ['M126 185Q202 155 263 61', '#c4b5fd']].map(([d, color]) => <path key={d} d={d} stroke={color} strokeWidth="2" strokeDasharray="5 6" opacity=".8" />)}
      <circle cx="126" cy="185" r="15" fill="#22d3ee" opacity=".15" /><circle cx="126" cy="185" r="5" fill="#ecfeff" />
      <text x="24" y="32" fill="#a5f3fc" fontSize="10" letterSpacing="2">SIX POSSIBLE FUTURES</text>
    </svg>
  );
  if (index === 2) return (
    <svg viewBox="0 0 280 270" className="absolute inset-x-0 bottom-0 w-full" fill="none" aria-hidden="true">
      <rect x="37" y="36" width="206" height="196" rx="20" fill="#ffffff" fillOpacity=".04" stroke="#fda4af" strokeOpacity=".25" />
      <path d="M72 110c-12-35 30-57 60-43 29-22 79 10 67 45 33 25 12 81-22 77-30 25-74 7-72-12-28-1-45-40-33-67Z" fill="#fb7185" fillOpacity=".15" stroke="#fda4af" strokeWidth="2" strokeDasharray="4 5" />
      <path d="M91 118c-8-24 21-41 45-30 23-15 55 6 47 32 22 20 4 52-18 47-22 20-49 7-49-7-23 1-32-23-25-42Z" fill="#fb7185" fillOpacity=".25" stroke="#fecdd3" strokeOpacity=".6" />
      <path d="M51 80V51h29M200 51h29v29M229 190v28h-29M80 218H51v-28" stroke="#ffe4e6" strokeWidth="2" />
      <path d="M51 135h178" stroke="#fda4af" strokeOpacity=".4" />
      <text x="57" y="253" fill="#fecdd3" fontSize="10" letterSpacing="2">SEGMENT · CLASSIFY</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 280 270" className="absolute inset-x-0 bottom-0 w-full" fill="none" aria-hidden="true">
      <g stroke="#c4b5fd" strokeOpacity=".5" strokeDasharray="4 5"><path d="M140 60 65 125 95 210h90l30-85-75-65ZM65 125h150M140 60l45 150M140 60 95 210" /></g>
      {[[140, 60, 'Discover'], [65, 125, 'Rank'], [215, 125, 'Résumé'], [95, 210, 'Email'], [185, 210, 'Track']].map(([x, y, label]) => <g key={label}><circle cx={x} cy={y} r="25" fill="#201932" stroke="#c4b5fd" strokeOpacity=".6" /><circle cx={x} cy={Number(y) - 3} r="5" fill="#ddd6fe" /><text x={x} y={Number(y) + 39} textAnchor="middle" fill="#ddd6fe" fontSize="10">{label}</text></g>)}
    </svg>
  );
}

/**
 * ProjectCard – card face plus its detail dialog. The face lifts on hover
 * (hover:-translate-y-1, image scales 1.05); the dialog centres itself with
 * the -translate-x-1/2 -translate-y-1/2 trick (the element starts at the
 * viewport centre, then shifts back by half its own size) and caps its
 * scrolling body at 90dvh so long descriptions stay reachable.
 */
function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const visual = visuals[index % visuals.length];

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className={`group relative h-[400px] w-[260px] cursor-pointer overflow-hidden rounded-[28px] text-left text-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:w-[280px] ${visual.background}`} aria-label={`Read about ${project.title}`}>
          {project.image ? <Image src={project.image} alt="Lively voice agent interface" fill sizes="280px" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <ProjectArtwork index={index} />}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-transparent" />
          <div className="relative z-10 px-8 pt-10 sm:px-10 sm:pt-11">
            <p className="mb-2 text-base font-semibold leading-snug text-white/95">{visual.category}</p>
            <h3 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{visual.title}</h3>
          </div>
          <span className="absolute right-5 bottom-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm" />
        <Dialog.Content className="bg-background text-foreground border-border fixed top-1/2 left-1/2 z-[81] flex max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border shadow-2xl focus:outline-none">
          <header className="border-border bg-background shrink-0 border-b px-5 py-5 pr-16 sm:px-8 sm:pr-20">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide">{project.category}</p>
            <Dialog.Title className="text-xl leading-tight font-semibold tracking-tight sm:text-3xl">{project.title}</Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2 text-sm leading-relaxed">{project.tagline}</Dialog.Description>
            <Dialog.Close className="bg-secondary hover:bg-accent absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2" aria-label="Close project details"><X className="h-5 w-5" /></Dialog.Close>
          </header>
          <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
            <ProjectContent project={project} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * AllProjects – scroll-snap carousel of project cards.
 *
 * The row uses snap-x/snap-mandatory with snap-start on every card wrapper,
 * so the browser always rests a card flush against the container's left
 * edge; the arrows page it with scrollBy(±300px) and disable themselves at
 * either end from scrollLeft measurements taken with a 1px tolerance. Edge
 * state is refreshed on every scroll and whenever the row is resized
 * (ResizeObserver).
 */
export default function AllProjects() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  // Edge detection with a 1px tolerance on both sides so the arrows toggle
  // exactly when the row can (or cannot) scroll further, ignoring sub-pixel
  // rounding left over from smooth scrolling.
  const updateEdges = () => {
    const row = rowRef.current;
    if (row) setEdges({ start: row.scrollLeft <= 1, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 1 });
  };
  // Re-measure the scroll edges whenever the row itself changes size
  // (viewport/orientation change, fonts loading) and disconnect on unmount.
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    if (rowRef.current) observer.observe(rowRef.current);
    updateEdges();
    return () => observer.disconnect();
  }, []);
  return (
    <section className="w-full pt-5 pb-2" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mb-10 text-3xl font-bold tracking-tight sm:mb-12 sm:text-4xl">My Projects</h2>
      {/* Scroll-snap row: snap-x/snap-mandatory forces the browser to align a
          card on every scroll rest, scroll-smooth animates the arrow pages,
          overflow-x-auto enables touch/trackpad scrolling, and each card
          wrapper's snap-start marks it as a snap position (shrink-0 stops
          the cards from compressing inside the flex row). */}
      <div ref={rowRef} onScroll={updateEdges} className="custom-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pt-1 pb-4" role="region" aria-label="Browse projects" tabIndex={0}>
        {PROJECTS.map((project, index) => <div key={project.title} className="shrink-0 snap-start"><ProjectCard project={project} index={index} /></div>)}
      </div>
      {/* Paging buttons: each click nudges the row by a fixed 300px (about
          one card + gap at sm and up), and the disabled state mirrors the
          measured start/end edges. */}
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" aria-label="Previous project" disabled={edges.start} onClick={() => rowRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} className="bg-secondary text-secondary-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-full disabled:cursor-default disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
        <button type="button" aria-label="Next project" disabled={edges.end} onClick={() => rowRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} className="bg-secondary text-secondary-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-full disabled:cursor-default disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SectionTitle, TextLinks } from "@/components/LinkLine";

/** @typedef {import("@/lib/api").Section} Section @typedef {import("@/lib/api").Line} Line */

/** @param {{ tags: string[] }} props Tags as the site gives them, joined: "7 GB · English · WEB-DL" */
function Tags({ tags }) {
  return tags.length ? <span className="text-sm text-muted-foreground">{tags.join(" · ")}</span> : null;
}

/**
 * A file: a movie or a season pack. Its title, its tags, its file's name, then its servers.
 *
 * @param {{ line: Line }} props
 */
function FileRow({ line }) {
  return (
    <li className="flex flex-col gap-1 py-3">
      {line.title && <span className="font-medium">{line.title}</span>}
      <Tags tags={line.tags} />
      {line.file && <span className="break-all text-xs text-muted-foreground/80">{line.file}</span>}
      <TextLinks links={line.links} />
    </li>
  );
}

/**
 * An episode of a season's group, as every line of links (LinkLine): its number and its size on
 * the left ("Episode-01 · 4.01 GB"), its servers on the right; on a phone, under them. Its file's
 * name on hover.
 *
 * @param {{ line: Line }} props
 */
function EpisodeRow({ line }) {
  return (
    <li className="flex min-h-11 flex-col gap-y-1 py-2 text-sm sm:grid sm:grid-cols-[minmax(12rem,1fr)_auto] sm:items-baseline sm:gap-x-6" title={line.file ?? undefined}>
      <span className="min-w-0 break-words">
        {line.title ?? "Episode"}
        {line.tags.length > 0 && <span className="text-muted-foreground"> · {line.tags.join(" · ")}</span>}
      </span>
      <TextLinks links={line.links} className="sm:justify-end" />
    </li>
  );
}

/**
 * A section as 4KHDHub shows it. A season's group of episodes (`episodes`, as the engine reads it)
 * opens and closes, as on the site, its tags under its title ("Episodes 8 · English"); the first
 * is open. Any other (a movie's "Download Links", a series' packs) is a list of files under its
 * title.
 *
 * @param {{ section: Section, open: boolean }} props
 */
function Section({ section, open }) {
  const rows = (
    <ul className="divide-y divide-border/60" aria-label={section.title ?? "Files"}>
      {section.lines.map((line, index) => (section.episodes ? <EpisodeRow key={index} line={line} /> : <FileRow key={index} line={line} />))}
    </ul>
  );
  if (section.episodes) {
    return (
      <details open={open} className="group border-b border-border/60">
        <summary className="flex cursor-pointer list-none items-start gap-3 py-3 outline-none [&::-webkit-details-marker]:hidden">
          <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium">{section.title}</span>
            <Tags tags={section.tags} />
          </span>
        </summary>
        <div className="pb-3 pl-7">{rows}</div>
      </details>
    );
  }
  return (
    <section className="flex flex-col gap-1 not-first:mt-8">
      {section.title && <SectionTitle>{section.title}</SectionTitle>}
      {rows}
    </section>
  );
}

/**
 * A 4KHDHub post's files, laid out as the site's structure gives them: a series' two tabs (packs,
 * single episodes), with the site's labels; a movie has none.
 *
 * @param {{ sections: Section[] }} props
 */
export function FourKHDHubLinks({ sections }) {
  const tabs = [...new Set(sections.map(({ tab }) => tab).filter(Boolean))];
  const [active, setActive] = useState(tabs[0] ?? null);
  const shown = tabs.length > 1 ? sections.filter(({ tab }) => tab === active) : sections;
  const firstGroup = shown.findIndex(({ episodes }) => episodes);

  return (
    <div className="flex flex-col gap-6">
      {tabs.length > 1 && (
        <div className="flex gap-6 border-b border-border/60" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={tab === active}
              onClick={() => setActive(tab)}
              className={`-mb-px border-b-2 pb-2 text-sm font-medium outline-none transition-colors focus-visible:text-foreground ${tab === active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      {/* Groups of a season's episodes follow one another as one list; another section has room above. */}
      <div className="flex flex-col" role={tabs.length > 1 ? "tabpanel" : undefined}>
        {/* A post can link one URL twice: both are shown, as the site shows them; so keys are positions. */}
        {shown.map((section, index) => (
          <Section key={`${active}:${index}`} section={section} open={index === firstGroup} />
        ))}
      </div>
    </div>
  );
}

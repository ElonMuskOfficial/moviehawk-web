import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkPending } from "@/components/LinkPending";
import { linkHref } from "@/lib/sites";

// A link as text, not a box: a post's, a page of files', a download's. Its padding keeps it easy to tap.
export const TEXT_LINK = "py-1 font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline";

/** @typedef {import("@/lib/api").Link} ApiLink @typedef {{ title: string | null, tags: string[], links: ApiLink[] }} ApiLine */

// A URL as a page writes it out, without its scheme and "www.", in lower case: "https://www.Gofile.io/d/abc"
// is "gofile.io/d/abc".
const bare = (text) => text.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

/**
 * What a link is called: its own text; or its host, for a logo (no text) or a mirror whose text is
 * its URL, written out with or without its scheme ("gofile.io/d/abc": the URL says no more than its
 * host).
 *
 * @param {ApiLink} link
 */
export const nameOf = (link) => (link.label && !bare(link.url).startsWith(bare(link.label)) ? link.label : link.host);

/**
 * A line's links, as text: "Drive · Instant · Direct".
 *
 * @param {{ links: ApiLink[], className?: string }} props
 */
export function TextLinks({ links, className = "" }) {
  return (
    <span className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {/* A line can link one URL twice: both are shown, as the site shows them; so keys are positions. */}
      {links.map((link, index) => (
        <Fragment key={`${index}:${link.name}`}>
          {index > 0 && <span className="text-muted-foreground" aria-hidden>·</span>}
          <Link href={linkHref(link.name)} className={TEXT_LINK}><LinkPending>{nameOf(link)}</LinkPending></Link>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * One line of links, as every page lays it out (a post's, a page of files'). A link alone that
 * names itself ("720p x264 [850MB]", "Instant⚡Download", a logo) is the whole row, as a link. A
 * line with a title is two columns from `sm` up, whatever the title's length: the title on the
 * left, wrapping in its own column ("Season 8 [ORG 2.0 Hindi + 5.1 English] 1080p BluRay x264
 * [1.6GB/E]"), the links on the right, at the row's right edge on every line; many links (a page's
 * mirrors) wrap in their column, at most 28rem, so the title keeps its room. On a phone, too narrow
 * for both, every such line is its title, then its links under it. A line of links alone (mirrors)
 * wraps from the left.
 *
 * @param {{ line: ApiLine, showHost?: boolean }} props showHost: beside a link alone, the site it is
 *   on ("hubcdn"): on a page of files, where the hosts differ; not on a post, where it is a gateway
 */
export function LinkLine({ line, showHost = false }) {
  const [only] = line.links;
  if (line.links.length === 1 && (line.title === null || line.title === only.label)) {
    const name = nameOf(only);
    return (
      <li>
        <Link href={linkHref(only.name)} className="group flex min-h-11 items-center gap-3 py-2 text-sm outline-none">
          <LinkPending className="flex min-w-0 flex-1 flex-col">
            <span className="break-words group-hover:text-primary group-focus-visible:text-primary">{name}</span>
            {/* What the page states of its file beside it, a second line: a pack's size. */}
            {line.tags.length > 0 && <span className="text-muted-foreground">{line.tags.join(" · ")}</span>}
          </LinkPending>
          {showHost && name !== only.host && <span className="shrink-0 text-muted-foreground">{only.host}</span>}
          <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
      </li>
    );
  }
  if (!line.title) {
    return (
      <li className="flex min-h-11 items-center py-2 text-sm">
        <TextLinks links={line.links} />
      </li>
    );
  }
  return (
    <li className="flex min-h-11 flex-col gap-y-1 py-2 text-sm sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-6">
      <span className="min-w-0 break-words">{line.title}</span>
      <TextLinks links={line.links} className="sm:max-w-md sm:justify-end" />
    </li>
  );
}

/** A section's title, as every page shows it: small, in capitals, muted. @param {{ children: React.ReactNode }} props */
export function SectionTitle({ children }) {
  return <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

/**
 * A section of lines of links: its title, if the site gives one, then its lines, under faint rules.
 *
 * @param {{ title: string | null, lines: ApiLine[], showHost?: boolean }} props showHost: as LinkLine's
 */
export function LinkSection({ title, lines, showHost = false }) {
  return (
    <section className="flex flex-col gap-1">
      {title && <SectionTitle>{title}</SectionTitle>}
      <ul className="divide-y divide-border/60" aria-label={title ?? "Links"}>
        {/* Keys are positions: a page can repeat a line. */}
        {lines.map((line, index) => (
          <LinkLine key={index} line={line} showHost={showHost} />
        ))}
      </ul>
    </section>
  );
}

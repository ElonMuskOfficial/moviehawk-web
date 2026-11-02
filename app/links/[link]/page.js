import { Fragment } from "react";
import { redirect } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { LinkSection, TEXT_LINK } from "@/components/LinkLine";
import { SourceLink } from "@/components/SourceLink";
import { getLink } from "@/lib/api";
import { formatSize, hostLabel, postHref } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { link } = await params;
  const { data } = await getLink(link);
  if (data?.kind === "file") return { title: data.filename ?? "Download" };
  return { title: data?.kind === "files" ? data.title ?? "Files" : "Link" };
}

// A link opens what the site would show next: a list of files to choose from, a file's downloads,
// a post the app reads (HDHub4u's link to the title on 4KHDHub: the app's own post page), or
// another site's page, where the user goes straight on. The API opens the pages on the way that
// lead to one place.
export default async function LinkPage({ params }) {
  const { link } = await params;
  const { data, error } = await getLink(link);
  if (error) return <ApiError error={error} />;
  if (data.kind === "post") redirect(postHref(data.post));
  if (data.kind === "external") redirect(data.url);
  if (data.kind === "files") return <FileList page={data} />;
  return <Downloads file={data} />;
}

/**
 * A page where the user chooses (HUBLinks, a HubDrive pack): its title, as the site gives it (it
 * names the file), its source, then its groups and lines, as the post page lays out its own.
 *
 * @param {{ page: import("@/lib/api").FilesLink }} props
 */
function FileList({ page }) {
  // A group without a title that follows another reads as the same list: HUBLinks puts each line of
  // an episode's page, and each logo, between <hr>s of its own.
  const groups = [];
  for (const section of page.sections) {
    const last = groups.at(-1);
    if (section.title === null && last) last.lines.push(...section.lines);
    else groups.push({ title: section.title, lines: [...section.lines] });
  }
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="break-words text-lg font-semibold leading-snug sm:text-2xl">{page.title ?? "Files"}</h1>
        {/* What the page states of itself (a pack's "Includes 9 files", "Total Size: 23.61 GB"), then its source. */}
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {page.tags.map((tag) => (
            <Fragment key={tag}>
              <span>{tag}</span>
              <span aria-hidden>·</span>
            </Fragment>
          ))}
          <SourceLink label={hostLabel(page.host)} url={page.url} />
        </p>
      </header>
      {groups.length ? (
        // On a page of files the hosts differ, so a link alone shows its own beside it.
        groups.map((group, index) => <LinkSection key={index} title={group.title} lines={group.lines} showHost />)
      ) : (
        <EmptyState title="This link leads to no file">The site may have taken it down. Try another link of the post.</EmptyState>
      )}
    </section>
  );
}

/**
 * One way to download, as a line of text: its server on the left, its actions on the right. A
 * direct download (the file itself): Download · Copy · VLC; a page that leads to the file: Open ↗.
 *
 * @param {{ download: import("@/lib/api").Download }} props
 */
function DownloadLine({ download }) {
  return (
    <li className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2 text-sm">
      <span className="min-w-0 break-words">{download.label ?? download.server}</span>
      {download.kind === "direct" ? (
        <span className="flex items-baseline gap-x-2">
          <a href={download.url} rel="noreferrer" className={TEXT_LINK}>
            Download
          </a>
          <span className="text-muted-foreground" aria-hidden>·</span>
          <CopyButton text={download.url} className={TEXT_LINK} />
          <span className="text-muted-foreground" aria-hidden>·</span>
          <a href={`vlc://${download.url}`} className={TEXT_LINK}>VLC</a>
        </span>
      ) : (
        <a href={download.url} target="_blank" rel="noreferrer" className={TEXT_LINK}>Open ↗</a>
      )}
    </li>
  );
}

/**
 * A file's downloads, in one column of text as the post page: its name, its size and its source,
 * how long its links last, then its downloads in one list: the direct ones first, then the
 * servers whose pages lead to it.
 *
 * @param {{ file: import("@/lib/api").FileLink }} props
 */
function Downloads({ file }) {
  // A direct download answers with the file; a page leads to it.
  const direct = file.downloads.filter(({ kind }) => kind === "direct");
  const pages = file.downloads.filter(({ kind }) => kind !== "direct");
  const size = formatSize(file.sizeBytes);
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        {/* null for a HubCDN file whose storage did not state its name */}
        <h1 className="break-all text-lg font-semibold leading-snug sm:text-2xl">{file.filename ?? "File"}</h1>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {size && <span>{size}</span>}
          {size && <span aria-hidden>·</span>}
          <SourceLink label={hostLabel(file.host)} url={file.url} />
        </p>
        <p className="text-sm text-muted-foreground">Links expire within hours: come back here for fresh ones.</p>
      </header>

      {file.downloads.length ? (
        // One list: direct downloads first, then the servers whose pages lead to the file; each
        // line's actions say which it is (Download · Copy · VLC, or Open ↗). Keys are positions: a
        // server can give one URL twice.
        <ul className="divide-y divide-border/60" aria-label="Downloads">
          {[...direct, ...pages].map((download, index) => <DownloadLine key={index} download={download} />)}
        </ul>
      ) : (
        <EmptyState title="No download for this file right now">Try again in a while, or another file of the post.</EmptyState>
      )}
    </section>
  );
}

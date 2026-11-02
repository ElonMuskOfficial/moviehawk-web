import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { Poster } from "@/components/PostGrid";
import { ROW, ROW_LINK, RowList } from "@/components/RowList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPost } from "@/lib/api";
import { findSite, linkHref, safeDecode } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { site, post } = await params;
  const { data } = await getPost(site, safeDecode(post));
  return { title: data?.title, openGraph: data?.posterUrl ? { images: [data.posterUrl] } : undefined };
}

/**
 * One line of a post's buttons, as its site lays it out. A button alone that names its own file
 * ("720p x264 [850MB]") is the whole row, as a link; any other line is its title ("720p", a file),
 * then its buttons ("Drive", "Instant", "WATCH").
 *
 * @param {{ line: import("@/lib/api").Line }} props
 */
function LineRow({ line }) {
  const [only] = line.links;
  if (line.links.length === 1 && (line.title === null || line.title === only.label)) {
    return (
      <li className="flex">
        <Link href={linkHref(only.name)} className={`${ROW_LINK} w-full`}>
          <span className="min-w-0 flex-1 break-words text-sm">{only.label ?? "Link"}</span>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </li>
    );
  }
  return (
    <li className={`${ROW} flex-wrap`}>
      {line.title && <span className="min-w-0 flex-1 basis-32 break-words text-sm">{line.title}</span>}
      <div className="flex flex-wrap gap-2">
        {/* A line can link one URL twice: both are shown, as the site shows them. */}
        {line.links.map((link, index) => (
          <Button key={`${index}:${link.name}`} asChild variant="secondary" size="sm">
            <Link href={linkHref(link.name)}>{link.label ?? "Link"}</Link>
          </Button>
        ))}
      </div>
    </li>
  );
}

// Step 1: a post and its download links, in its site's sections and lines.
export default async function PostPage({ params }) {
  const { site, post } = await params;
  const { data, error } = await getPost(site, safeDecode(post));
  if (error) return <ApiError error={error} />;

  const published = data.publishTime && new Date(data.publishTime).toLocaleDateString("en-GB", { dateStyle: "medium" });
  return (
    <article className="flex flex-col gap-6">
      <div className="grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
        <Poster url={data.posterUrl} eager />
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="text-lg font-semibold leading-snug sm:text-2xl">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {data.year && <Badge variant="secondary">{data.year}</Badge>}
            {data.imdbId && (
              <Badge variant="outline" asChild>
                <a href={`https://www.imdb.com/title/${data.imdbId}/`} target="_blank" rel="noreferrer">
                  IMDb <ExternalLink aria-hidden />
                </a>
              </Badge>
            )}
            {published && <span className="text-sm text-muted-foreground">Posted {published}</span>}
          </div>
          <a href={data.url} target="_blank" rel="noreferrer" className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Open on {findSite(site).label}
          </a>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Links</h2>
        {data.sections.length ? (
          <div className="flex flex-col gap-6">
            {/* A post can link one URL twice (4KHDHub's MobLand: one file under its 2160p and its
                1080p episode 6): both are shown, as the site shows them; so keys are positions. */}
            {data.sections.map((section, index) => (
              <div key={index} className="flex flex-col gap-2">
                {section.title && <h3 className="text-sm font-medium text-muted-foreground">{section.title}</h3>}
                <RowList label={section.title ?? "Links"} className="grid sm:grid-cols-2 lg:grid-cols-3">
                  {section.lines.map((line, lineIndex) => (
                    <LineRow key={lineIndex} line={line} />
                  ))}
                </RowList>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="This post has no links yet">A series often gets its episodes later.</EmptyState>
        )}
      </section>
    </article>
  );
}

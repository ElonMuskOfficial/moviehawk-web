import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { Poster } from "@/components/PostGrid";
import { ROW, RowList } from "@/components/RowList";
import { Badge } from "@/components/ui/badge";
import { getPost } from "@/lib/api";
import { findSite, resourceHref, safeDecode } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { site, post } = await params;
  const { data } = await getPost(site, safeDecode(post));
  return { title: data?.title, openGraph: data?.posterUrl ? { images: [data.posterUrl] } : undefined };
}

// Step 1: a post and its links.
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
        {data.links.length ? (
          <RowList label="Links" className="grid sm:grid-cols-2 lg:grid-cols-3">
            {/* A post can link one URL twice (4KHDHub's MobLand: one file under its 2160p and its
                1080p episode 6): both are shown, as the site shows them. */}
            {data.links.map((link, index) => (
              <li key={`${index}:${link.name}`} className="flex">
                <Link href={resourceHref(link.name)} className={`${ROW} w-full transition hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}>
                  <span className="min-w-0 flex-1 break-words text-sm">{link.label ?? "Link"}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </RowList>
        ) : (
          <EmptyState title="This post has no links yet">A series often gets its episodes later.</EmptyState>
        )}
      </section>
    </article>
  );
}

import { Fragment } from "react";
import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { FourKHDHubLinks } from "@/components/FourKHDHubLinks";
import { LinkSection } from "@/components/LinkLine";
import { Poster } from "@/components/PostGrid";
import { SourceLink } from "@/components/SourceLink";
import { getPost } from "@/lib/api";
import { hostLabel, safeDecode } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { site, post } = await params;
  const { data } = await getPost(site, safeDecode(post));
  return { title: data?.title, openGraph: data?.posterUrl ? { images: [data.posterUrl] } : undefined };
}

// A post and its download links, in its site's sections and lines. On a wide screen, two columns:
// the poster on the left, kept in view; the post on the right, a column of text that the eye reads
// straight down. On a narrow one, a small poster beside the title, the links under both.
export default async function PostPage({ params }) {
  const { site, post } = await params;
  const { data, error } = await getPost(site, safeDecode(post));
  if (error) return <ApiError error={error} />;

  const published = data.publishTime && new Date(data.publishTime).toLocaleDateString("en-GB", { dateStyle: "medium" });
  const meta = [
    data.year && <span key="year">{data.year}</span>,
    data.imdbId && <SourceLink key="imdb" label="IMDb" url={`https://www.imdb.com/title/${data.imdbId}/`} />,
    published && <span key="published">Posted {published}</span>,
    <SourceLink key="site" label={hostLabel(site)} url={data.url} />,
  ].filter(Boolean);

  return (
    <article className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-10 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
      <div className="lg:sticky lg:top-6 lg:row-span-2 lg:self-start">
        <Poster url={data.posterUrl} eager />
      </div>
      <header className="flex min-w-0 flex-col gap-2">
        <h1 className="text-lg font-semibold leading-snug sm:text-2xl">{data.title}</h1>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {meta.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <span aria-hidden>·</span>}
              {item}
            </Fragment>
          ))}
        </p>
      </header>

      {data.sections.length ? (
        <div className="col-span-2 flex min-w-0 max-w-3xl flex-col gap-8 lg:col-span-1 lg:col-start-2">
          {/* Each site's links as its own page lays them out: 4KHDHub's files in its tabs and its
              seasons' groups; HDHub4u's lines of buttons under its headings. A post can link one URL
              twice (4KHDHub's MobLand: one file under its 2160p and its 1080p episode 6): both are
              shown, as the site shows them; so keys are positions. */}
          {site === "4khdhub" ? (
            <FourKHDHubLinks sections={data.sections} />
          ) : (
            data.sections.map((section, index) => <LinkSection key={index} title={section.title} lines={section.lines} />)
          )}
        </div>
      ) : (
        <div className="col-span-2 lg:col-span-1 lg:col-start-2">
          <EmptyState title="This post has no links yet">A series often gets its episodes later.</EmptyState>
        </div>
      )}
    </article>
  );
}

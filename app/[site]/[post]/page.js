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

  // On a phone, one column: the title, the post's details, the poster, then the links. From lg: the
  // poster on the left, the rest on the right.
  return (
    <article className="grid grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12">
      <h1 className="min-w-0 text-lg font-semibold leading-snug sm:text-2xl lg:col-start-2 lg:row-start-1">{data.title}</h1>
      <p className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 text-sm text-muted-foreground lg:col-start-2 lg:row-start-2">
        {meta.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <span aria-hidden>·</span>}
            {item}
          </Fragment>
        ))}
      </p>
      <div className="mt-4 w-full max-w-64 lg:sticky lg:top-6 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-start">
        <Poster url={data.posterUrl} eager />
      </div>

      {data.sections.length ? (
        <div className="mt-8 flex min-w-0 max-w-3xl flex-col gap-8 lg:col-start-2 lg:row-start-3 lg:mt-10">
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
        <div className="mt-8 lg:col-start-2 lg:row-start-3 lg:mt-10">
          <EmptyState title="This post has no links yet">A series often gets its episodes later.</EmptyState>
        </div>
      )}
    </article>
  );
}

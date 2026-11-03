import { redirect } from "next/navigation";
import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { Pager } from "@/components/Pager";
import { PostGrid } from "@/components/PostGrid";
import { searchPosts } from "@/lib/api";
import { first, pageOf } from "@/lib/params";
import { SITES, findSite } from "@/lib/sites";

export async function generateMetadata({ params, searchParams }) {
  const { site } = await params;
  const q = first((await searchParams).q)?.trim();
  return { title: q ? `${q} on ${findSite(site)?.label}` : "Search" };
}

// Step 0: a site's search, as the site's own search box finds and orders it.
export default async function SearchPage({ params, searchParams }) {
  const { site } = await params;
  const search = await searchParams;
  const q = first(search.q)?.trim();
  if (!q) redirect(`/${site}`);

  const page = pageOf(search);
  const { data, error } = await searchPosts(site, q, page > 1 ? String(page) : undefined);
  if (error) return <ApiError error={error} />;

  const label = findSite(site).label;
  const others = SITES.filter((other) => other.id !== site);
  return (
    <>
      <h1 className="text-lg font-medium">
        Results for “{q}” <span className="text-muted-foreground">on {label}</span>
      </h1>
      {data.posts.length ? (
        <PostGrid posts={data.posts} />
      ) : (
        <EmptyState title={`Nothing on ${label} matches “${q}”`}>
          Try other words, or search{" "}
          {others.map((other, index) => (
            <span key={other.id}>
              {index > 0 && ", "}
              <a className="text-primary underline-offset-4 hover:underline" href={`/${other.id}/search?${new URLSearchParams({ q })}`}>
                {other.label}
              </a>
            </span>
          ))}
          .
        </EmptyState>
      )}
      <Pager path={`/${site}/search`} page={page} nextPageToken={data.nextPageToken} query={{ q }} />
    </>
  );
}

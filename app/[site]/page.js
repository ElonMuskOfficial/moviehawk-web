import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { Pager } from "@/components/Pager";
import { PostGrid } from "@/components/PostGrid";
import { listPosts } from "@/lib/api";
import { pageOf } from "@/lib/params";
import { findSite } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { site } = await params;
  return { title: findSite(site)?.label };
}

// Step 0: a site's latest posts.
export default async function ListingPage({ params, searchParams }) {
  const { site } = await params;
  const page = pageOf(await searchParams);
  const { data, error } = await listPosts(site, page > 1 ? String(page) : undefined);
  if (error) return <ApiError error={error} />;

  return (
    <>
      {data.posts.length ? <PostGrid posts={data.posts} /> : <EmptyState title="No posts on this page" />}
      <Pager path={`/${site}`} page={page} nextPageToken={data.nextPageToken} />
    </>
  );
}

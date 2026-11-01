import { notFound } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import { SiteTabs } from "@/components/SiteTabs";
import { findSite } from "@/lib/sites";

// A site's pages (its listing, search and posts) have the site tabs and its search box.
export default async function SiteLayout({ children, params }) {
  const { site } = await params;
  if (!findSite(site)) notFound();

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SiteTabs active={site} />
        <SearchBox site={site} />
      </div>
      {children}
    </>
  );
}

import { Search } from "lucide-react";
import { findSite } from "@/lib/sites";

/**
 * A plain GET form to the site's search: it needs no JavaScript.
 * @param {{ site: string }} props
 */
export function SearchBox({ site }) {
  return (
    <form action={`/${site}/search`} role="search" className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        name="q"
        type="search"
        required
        placeholder={`Search ${findSite(site)?.label ?? ""}`}
        aria-label="Search"
        className="h-10 w-full rounded-md border border-input bg-input/30 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </form>
  );
}

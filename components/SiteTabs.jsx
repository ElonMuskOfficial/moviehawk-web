import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITES } from "@/lib/sites";

/**
 * The sites, one tab each. On a phone they are wider than the screen (four: 378 px in 358), so the
 * row scrolls sideways, edge to edge, its scrollbar hidden; no tab is squeezed or cut.
 *
 * @param {{ active: string }} props the site whose pages these are
 */
export function SiteTabs({ active }) {
  return (
    <nav aria-label="Sites" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {SITES.map((site) => (
        <Button
          key={site.id}
          asChild
          size="lg"
          className="shrink-0"
          variant={site.id === active ? "secondary" : "ghost"}
          aria-current={site.id === active ? "page" : undefined}
        >
          <Link href={`/${site.id}`}>{site.label}</Link>
        </Button>
      ))}
    </nav>
  );
}

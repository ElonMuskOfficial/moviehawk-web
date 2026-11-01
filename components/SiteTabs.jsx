import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITES } from "@/lib/sites";

/** @param {{ active: string }} props the site whose pages these are */
export function SiteTabs({ active }) {
  return (
    <nav aria-label="Sites" className="flex gap-1">
      {SITES.map((site) => (
        <Button
          key={site.id}
          asChild
          size="lg"
          variant={site.id === active ? "secondary" : "ghost"}
          aria-current={site.id === active ? "page" : undefined}
        >
          <Link href={`/${site.id}`}>{site.label}</Link>
        </Button>
      ))}
    </nav>
  );
}

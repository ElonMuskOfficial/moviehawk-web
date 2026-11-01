import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Previous and next pages of a listing or a search. The sites number their pages; the next one is
 * only the API's nextPageToken, so the last page has no next.
 * @param {{ path: string, page: number, nextPageToken?: string, query?: Record<string, string> }} props
 */
export function Pager({ path, page, nextPageToken, query = {} }) {
  const href = (target) => {
    const search = new URLSearchParams(query);
    if (target > 1) search.set("page", String(target));
    const text = search.toString();
    return text ? `${path}?${text}` : path;
  };

  if (page <= 1 && !nextPageToken) return null;
  return (
    <nav aria-label="Pages" className="flex items-center justify-center gap-2">
      {page > 1 && (
        <Button asChild variant="outline" size="lg">
          <Link href={href(page - 1)}>
            <ChevronLeft aria-hidden /> Previous
          </Link>
        </Button>
      )}
      <span className="px-2 text-sm text-muted-foreground">Page {page}</span>
      {nextPageToken && (
        <Button asChild variant="outline" size="lg">
          <Link href={href(Number(nextPageToken))}>
            Next <ChevronRight aria-hidden />
          </Link>
        </Button>
      )}
    </nav>
  );
}

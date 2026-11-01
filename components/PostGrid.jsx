import Link from "next/link";
import { Film } from "lucide-react";
import { postHref } from "@/lib/sites";

export const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

/** @param {{ posts: import("@/lib/api").PostCard[] }} props */
export function PostGrid({ posts }) {
  return (
    <ul className={GRID}>
      {posts.map((post) => (
        <li key={post.name}>
          <Link href={postHref(post.name)} className="group flex flex-col gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Poster url={post.posterUrl} className="transition group-hover:ring-2 group-hover:ring-primary" />
            <span className="break-words text-sm leading-snug">{post.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A poster, as a plain <img>: posters come from many hosts (tmdb, imgshare, ...), which
 * next/image would need each listed, and would count against Vercel's image optimization.
 * @param {{ url: string | null, className?: string, eager?: boolean }} props
 */
export function Poster({ url, className = "", eager = false }) {
  const box = `aspect-2/3 w-full rounded-lg bg-muted ${className}`;
  if (!url) {
    return (
      <div className={`${box} flex items-center justify-center`}>
        <Film className="size-8 text-muted-foreground" aria-hidden />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see above
    <img src={url} alt="" loading={eager ? "eager" : "lazy"} referrerPolicy="no-referrer" className={`${box} object-cover`} />
  );
}

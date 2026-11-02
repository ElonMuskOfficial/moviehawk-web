"use client";

import { useLinkStatus } from "next/link";

/**
 * What a <Link> shows, pulsing while the page it opens has not appeared yet: a link clicked before
 * Next prefetched its loading shape (a slow network, a tap right after a scroll) gives no other sign
 * until the server answers. It pulses only after 100 ms (globals.css, `.link-pending`), so a quick
 * navigation does not flash. Must be inside the Link.
 *
 * @param {{ children: React.ReactNode, className?: string }} props className: its own layout
 */
export function LinkPending({ children, className = "" }) {
  const { pending } = useLinkStatus();
  return <span className={`${className} ${pending ? "link-pending" : ""}`}>{children}</span>;
}

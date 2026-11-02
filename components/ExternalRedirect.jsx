"use client";

import { useEffect } from "react";
import { TEXT_LINK } from "@/components/LinkLine";

/**
 * A link to another site's page (a player, a host the app does not open): the browser goes there at
 * once, and until that site answers, the page says where it is going, with the link itself in case
 * the browser stays. `replace`, so Back returns to the post, not to this page.
 *
 * @param {{ url: string, label: string }} props label: the site's name (hostLabel)
 */
export function ExternalRedirect({ url, label }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-2" aria-live="polite">
      <h1 className="text-lg font-semibold leading-snug sm:text-2xl">Opening {label}…</h1>
      <p className="break-all text-sm text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
      <p className="text-sm text-muted-foreground">
        Not opening?{" "}
        <a href={url} rel="noreferrer" className={TEXT_LINK}>
          Open {label} ↗
        </a>
      </p>
    </section>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// What a user can do about each code (the API's README, Errors). Only a site that was not
// available (no answer, or an HTTP error such as 403 or 503), or a page it could not read, may pass on
// a second try. A page the site removed (a file V-Cloud deleted) sends the user back, to the page
// that listed it, to choose another server. The detail under the title says which site.
const MESSAGES = {
  notFound: { title: "It's no longer on the site", back: true },
  transient: { title: "The site isn't available right now", retry: true },
  unrecognized: { title: "The site's page couldn't be read", retry: true },
  invalidArgument: { title: "This link is broken", retry: false },
};

/** @param {{ error: import("@/lib/api").ApiProblem }} props */
export function ApiError({ error }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const message = MESSAGES[error.code] ?? { title: "Something went wrong", retry: true };

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <TriangleAlert className="size-8 text-destructive" aria-hidden />
      <h2 className="text-lg font-medium">{message.title}</h2>
      <p className="text-sm text-muted-foreground break-words">{error.detail}</p>
      {message.back && <BackButton />}
      {message.retry && (
        <Button variant="outline" size="lg" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
          <RotateCw className={pending ? "animate-spin" : undefined} aria-hidden />
          Try again
        </Button>
      )}
    </div>
  );
}

/**
 * The page before, where the user chose this: a link home, which goes back instead when there is a
 * page before (one opened on its own has none).
 */
function BackButton() {
  const back = (event) => {
    if (window.history.length < 2) return;
    event.preventDefault();
    window.history.back();
  };
  return (
    <Button asChild variant="outline" size="lg">
      <a href="/" onClick={back}>
        <ArrowLeft aria-hidden />
        Back
      </a>
    </Button>
  );
}

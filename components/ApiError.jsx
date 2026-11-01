"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// What a user can do about each code (the API's README, Errors). Only a site that did not answer,
// or a page it could not read, may pass on a second try.
const MESSAGES = {
  transient: { title: "The site didn't answer", retry: true },
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
      {message.retry && (
        <Button variant="outline" size="lg" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
          <RotateCw className={pending ? "animate-spin" : undefined} aria-hidden />
          Try again
        </Button>
      )}
    </div>
  );
}

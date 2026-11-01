"use client"; // Error boundaries must be Client Components

import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

// A bug, not an API error (those are ApiError on their page): in production its message is
// hidden, so only error.digest names it in the server's log.
export default function Error({ error, retry }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <TriangleAlert className="size-8 text-destructive" aria-hidden />
      <h2 className="text-lg font-medium">Something went wrong</h2>
      {error?.digest && <p className="text-xs text-muted-foreground">Error {error.digest}</p>}
      <Button variant="outline" size="lg" onClick={() => retry()}>
        <RotateCw aria-hidden /> Try again
      </Button>
    </div>
  );
}

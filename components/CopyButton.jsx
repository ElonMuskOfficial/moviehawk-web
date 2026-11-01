"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

/** @param {{ text: string }} props */
export function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" onClick={copy} aria-live="polite">
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {copied ? (
        "Copied"
      ) : (
        <>
          <span className="sm:hidden">Copy</span>
          <span className="hidden sm:inline">Copy link</span>
        </>
      )}
    </Button>
  );
}

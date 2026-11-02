"use client";

import { useState } from "react";

/**
 * Copies a text, as a text action like the page's links: "Copy", then "Copied" for 2 s.
 *
 * @param {{ text: string, className?: string }} props className: its look, as the page's links
 */
export function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={copy} aria-live="polite" className={`cursor-pointer ${className}`}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

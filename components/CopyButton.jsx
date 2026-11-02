"use client";

import { useState } from "react";

const LABELS = { idle: "Copy", copied: "Copied", failed: "Couldn't copy" };

/**
 * Copies a text, as a text action like the page's links: "Copy", then for 2 s "Copied", or
 * "Couldn't copy" when the browser refuses (no clipboard outside HTTPS, a denied permission).
 *
 * @param {{ text: string, className?: string }} props className: its look, as the page's links
 */
export function CopyButton({ text, className = "" }) {
  const [state, setState] = useState("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button type="button" onClick={copy} aria-live="polite" className={`cursor-pointer ${className}`}>
      {LABELS[state]}
    </button>
  );
}

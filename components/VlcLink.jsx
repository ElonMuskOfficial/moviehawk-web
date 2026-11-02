"use client";

import { useSyncExternalStore } from "react";

// VLC's Android package (VideoLAN wiki, Android Player Intents).
const ANDROID_PACKAGE = "org.videolan.vlc";

/**
 * How this device's VLC opens a URL, or null where no link opens it:
 * - Android: Chrome's intent: URL to VLC's package, with the file's type. VLC does not read
 *   vlc://https://... there (the browser drops the second colon, and VLC takes vlc:// for its own
 *   commands); without VLC installed, Chrome opens its Play Store page.
 * - iPhone, iPad: vlc://, which VLC for iOS registers.
 * - Anything else (a desktop): none. VLC registers no URL scheme there; Copy, then paste into VLC.
 *
 * @param {string} url
 * @returns {string | null}
 */
function vlcHrefOf(url) {
  const agent = navigator.userAgent;
  if (/Android/i.test(agent)) {
    const { protocol, host, pathname, search } = new URL(url);
    return `intent://${host}${pathname}${search}#Intent;scheme=${protocol.slice(0, -1)};package=${ANDROID_PACKAGE};type=video/*;end`;
  }
  if (/iPhone|iPad|iPod/i.test(agent)) return `vlc://${url}`;
  return null;
}

// The device does not change while the page is open: nothing to subscribe to.
const subscribe = () => () => {};

/**
 * "· VLC", a download's action to play it in VLC (most files are MKV with DD5.1 audio, which
 * browsers do not play), on a device where a link can open VLC; nothing elsewhere. The server
 * cannot tell the device, so it renders nothing, and the browser adds it.
 *
 * @param {{ url: string, className?: string }} props url: the download's; className: the link's look
 */
export function VlcLink({ url, className = "" }) {
  const href = useSyncExternalStore(subscribe, () => vlcHrefOf(url), () => null);
  if (!href) return null;
  return (
    <>
      <span className="text-muted-foreground" aria-hidden>·</span>
      <a href={href} className={className}>VLC</a>
    </>
  );
}

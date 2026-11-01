/**
 * The sites, and the app's URL for each API name: an API name is the app's path, without
 * `sites/` and `posts/` for a post (sites/hdhub4u/posts/slug → /hdhub4u/slug).
 */

export const SITES = [
  { id: "hdhub4u", label: "HDHub4u" },
  { id: "4khdhub", label: "4KHDHub" },
];

/** @param {string} id */
export function findSite(id) {
  return SITES.find((site) => site.id === id);
}

/** @param {string} name sites/{site}/posts/{post} */
export function postHref(name) {
  const [, site, , post] = name.split("/");
  return `/${site}/${encodeURIComponent(post)}`;
}

/** @param {string} name links/{link} or files/{file}: the app's path is the name */
export function resourceHref(name) {
  return `/${name}`;
}

/**
 * A route param, decoded once: a slug can have characters such as `·` (WALL·E).
 * @param {string} value
 */
export function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** @param {number | null} bytes */
export function formatSize(bytes) {
  if (bytes == null) return null;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(unit >= 3 ? 2 : 0)} ${units[unit]}`;
}

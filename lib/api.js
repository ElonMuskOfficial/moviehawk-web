/**
 * The MovieHawk API, read on the server only (MOVIEHAWK_API_URL is not sent to the browser).
 *
 * Every call is `cache: "no-store"`: the API keeps its own answers as long as they stay true, and
 * Next must not keep a page whose downloads expire. A 404 is the page's not-found (notFound());
 * any other failure is returned as `{ error }`, for the page to show (ApiError), because
 * Next hides a thrown error's message in production.
 */
import { cache } from "react";
import { notFound } from "next/navigation";

/**
 * @typedef {{ name: string, title: string, posterUrl: string | null }} PostCard
 * @typedef {{ posts: PostCard[], nextPageToken?: string }} PostList
 * @typedef {{ name: string, url: string, label: string | null, host: string }} Link
 *   A link as every answer gives it; host: the API's id of its site ("hubcloud"), or its hostname
 * @typedef {{ title: string | null, file: string | null, tags: string[], links: Link[] }} Line
 *   A line of buttons: "720p", then Drive, Instant; its file's name and tags where the site states them
 * @typedef {{ title: string | null, tab: string | null, tags: string[], episodes: boolean, lines: Line[] }} Section
 *   As the site groups a post's links: "EPiSODE 1"; its tab ("Zip/Pack") and tags where it states them
 * @typedef {{
 *   name: string, url: string, title: string, year: number | null, imdbId: string | null,
 *   posterUrl: string | null, publishTime: string | null, sections: Section[],
 * }} Post
 * @typedef {{ server: string, kind: "direct" | "page", url: string, label: string }} Download
 * @typedef {{ title: string | null, tags: string[], links: Link[] }} FilesLine A line of a page's links: "480p", then Drive, Instant; a pack's file, its size its tag
 * @typedef {{ title: string | null, lines: FilesLine[] }} FilesSection A group of a page's links: "Watch Online"
 * @typedef {{ name: string, kind: "files", host: string, url: string, title: string | null, tags: string[], sections: FilesSection[] }} FilesLink
 * @typedef {{ name: string, kind: "file", host: string, url: string, filename: string | null, sizeBytes: number | null, downloads: Download[] }} FileLink
 * @typedef {{ name: string, kind: "external", host: string, url: string }} ExternalLink
 * @typedef {{ name: string, kind: "post", post: string }} PostLink A post the app reads: sites/{site}/posts/{post}
 * @typedef {FilesLink | FileLink | PostLink | ExternalLink} LinkPage What a link opens, by its `kind`
 * @typedef {{ status: number, code: string, detail: string }} ApiProblem
 */

// The API gives up on a request after 30 s; a cold start adds a few more.
const TIMEOUT_MS = 40_000;

/**
 * @template T
 * @param {string} path after /v1/
 * @returns {Promise<{ data: T, error?: undefined } | { data?: undefined, error: ApiProblem }>}
 */
async function apiGet(path) {
  const base = process.env.MOVIEHAWK_API_URL;
  if (!base) throw new Error("MOVIEHAWK_API_URL is not set: see .env.example");

  let response;
  try {
    response = await fetch(`${base.replace(/\/$/, "")}/v1/${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return { error: { status: 504, code: "transient", detail: "The MovieHawk API did not answer." } };
  }

  if (response.status === 404) notFound();
  const body = await response.json().catch(() => null);
  if (response.ok && body) return { data: body };
  return {
    error: {
      status: response.status,
      code: body?.code ?? "internal",
      detail: body?.detail ?? `The MovieHawk API answered HTTP ${response.status}.`,
    },
  };
}

/** @param {string} site @param {string} [pageToken] @returns {Promise<{ data: PostList } | { error: ApiProblem }>} */
export function listPosts(site, pageToken) {
  return apiGet(`sites/${site}/posts${query({ pageToken })}`);
}

/** @param {string} site @param {string} q @param {string} [pageToken] @returns {Promise<{ data: PostList } | { error: ApiProblem }>} */
export function searchPosts(site, q, pageToken) {
  return apiGet(`sites/${site}/search${query({ q, pageToken })}`);
}

// getPost and getLink are read by a page and its generateMetadata: cache() reads them once a render.

/** @type {(site: string, post: string) => Promise<{ data: Post } | { error: ApiProblem }>} post: the slug */
export const getPost = cache((site, post) => apiGet(`sites/${site}/posts/${encodeURIComponent(post)}`));

/** @type {(link: string) => Promise<{ data: LinkPage } | { error: ApiProblem }>} link: the id after links/ */
export const getLink = cache((link) => apiGet(`links/${encodeURIComponent(link)}`));

/** @param {Record<string, string | undefined>} params */
function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const text = search.toString();
  return text ? `?${text}` : "";
}

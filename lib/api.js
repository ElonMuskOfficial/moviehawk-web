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
 * @typedef {{ name: string, label: string | null }} Link
 * @typedef {{
 *   name: string, url: string, title: string, year: number | null, imdbId: string | null,
 *   posterUrl: string | null, publishTime: string | null, links: Link[],
 * }} Post
 * @typedef {{ name: string, host: string, url: string, label: string | null }} HostFile
 * @typedef {{ code: string, url: string, detail: string }} Failure
 * @typedef {{ files: HostFile[], failures: Failure[] }} FileList
 * @typedef {{ server: string, kind: "direct" | "page", url: string, label: string | null }} Download
 * @typedef {{ name: string, filename: string | null, sizeBytes: number | null, downloads: Download[] }} ResolvedFile
 * @typedef {{ status: number, code: string, detail: string }} ApiProblem
 */

// The API gives up on a request after 30 s; a cold start on Wasmer adds a few more.
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

// getPost and getFile are read by a page and its generateMetadata: cache() reads them once a render.

/** @type {(site: string, post: string) => Promise<{ data: Post } | { error: ApiProblem }>} post: the slug */
export const getPost = cache((site, post) => apiGet(`sites/${site}/posts/${encodeURIComponent(post)}`));

/** @param {string} link the id after links/ @returns {Promise<{ data: FileList } | { error: ApiProblem }>} */
export function listFiles(link) {
  return apiGet(`links/${encodeURIComponent(link)}/files`);
}

/** @type {(file: string) => Promise<{ data: ResolvedFile } | { error: ApiProblem }>} file: the id after files/ */
export const getFile = cache((file) => apiGet(`files/${encodeURIComponent(file)}`));

/** @param {Record<string, string | undefined>} params */
function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  const text = search.toString();
  return text ? `?${text}` : "";
}

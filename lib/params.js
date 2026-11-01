/**
 * Reads a page's search params. The sites number their pages from 1; anything else is page 1.
 * @param {Record<string, string | string[] | undefined>} searchParams
 */
export function pageOf(searchParams) {
  const page = Number(first(searchParams.page));
  return Number.isInteger(page) && page > 1 ? page : 1;
}

/** @param {string | string[] | undefined} value */
export function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

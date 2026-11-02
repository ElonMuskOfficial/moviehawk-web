/**
 * The page a thing comes from, on its own site: a post on HDHub4u, its title on IMDb, a page of
 * files on HUBLinks, a file on HubCloud. "HDHub4u ↗", opened in a new tab.
 *
 * @param {{ label: string, url: string }} props label: the site's name (hostLabel, or "IMDb")
 */
export function SourceLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="w-fit underline-offset-4 hover:text-foreground hover:underline">
      {label} ↗
    </a>
  );
}

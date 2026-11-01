import Link from "next/link";
import { ChevronRight, Clock, Download, ExternalLink, Play } from "lucide-react";
import { ApiError } from "@/components/ApiError";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { ROW, RowList } from "@/components/RowList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLink } from "@/lib/api";
import { formatSize, resourceHref } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { link } = await params;
  const { data } = await getLink(link);
  if (data?.kind === "file") return { title: data.filename ?? "Download" };
  return { title: data?.kind === "files" ? "Files" : "Link" };
}

// A link opens what the site would show next: a list of files to choose from, a file's downloads,
// or another site's page. The API opens the pages on the way that lead to one place.
export default async function LinkPage({ params }) {
  const { link } = await params;
  const { data, error } = await getLink(link);
  if (error) return <ApiError error={error} />;
  if (data.kind === "files") return <Files files={data.files} />;
  if (data.kind === "file") return <File file={data} />;
  return <External link={data} />;
}

const OPENS = "transition hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none";

/** @param {{ files: import("@/lib/api").LinkFile[] }} props */
function Files({ files }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-lg font-medium">Files</h1>
      {files.length ? (
        <RowList label="Files">
          {files.map((file) => (
            <li key={file.name}>
              <Link href={resourceHref(file.name)} className={`${ROW} ${OPENS}`}>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <Badge variant="secondary">{file.host}</Badge>
                  {/* null on a page of one file's hosts, shown as logos */}
                  <span className="break-words text-sm">{file.label ?? "File"}</span>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </RowList>
      ) : (
        <EmptyState title="This link leads to no file">The site may have taken it down. Try another link of the post.</EmptyState>
      )}
    </section>
  );
}

/** @param {{ file: import("@/lib/api").LinkToFile }} props */
function File({ file }) {
  // A direct download answers with the file; a page leads to it. Direct ones first, and only the
  // first is the page's main action.
  const downloads = [...file.downloads].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "direct" ? -1 : 1));
  const size = formatSize(file.sizeBytes);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {/* null for a HubCDN file whose storage did not state its name */}
        <h1 className="break-all text-lg font-medium">{file.filename ?? "File"}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {size && <Badge variant="secondary">{size}</Badge>}
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden /> Links expire within hours: come back here for fresh ones.
          </span>
        </div>
      </div>

      {downloads.length ? (
        <RowList label="Downloads">
          {downloads.map((download, index) => (
            <li key={`${index}:${download.url}`} className={`${ROW} flex-col items-stretch sm:flex-row sm:items-center`}>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{download.label ?? download.server}</span>
                <Badge variant="outline">{download.kind === "direct" ? "direct" : "page"}</Badge>
              </div>
              <div className="flex gap-2 *:flex-1 sm:*:flex-none">
                {download.kind === "direct" ? (
                  <>
                    <Button asChild variant={index === 0 ? "default" : "outline"}>
                      <a href={download.url} rel="noreferrer">
                        <Download aria-hidden /> Download
                      </a>
                    </Button>
                    <CopyButton text={download.url} />
                    <Button asChild variant="outline">
                      <a href={`vlc://${download.url}`}>
                        <Play aria-hidden /> <span className="sm:hidden">VLC</span>
                        <span className="hidden sm:inline">Open in VLC</span>
                      </a>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline">
                    <a href={download.url} target="_blank" rel="noreferrer">
                      Open <ExternalLink aria-hidden />
                    </a>
                  </Button>
                )}
              </div>
            </li>
          ))}
        </RowList>
      ) : (
        <EmptyState title="No download for this file right now">Try again in a while, or another file of the post.</EmptyState>
      )}
    </section>
  );
}

/** @param {{ link: import("@/lib/api").LinkToPage }} props */
function External({ link }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-lg font-medium">Opens on {link.host ?? "another site"}</h1>
      <div className={ROW}>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {link.host && <Badge variant="secondary">{link.host}</Badge>}
          <span className="break-all text-sm text-muted-foreground">{link.url}</span>
        </div>
        <Button asChild variant="outline">
          <a href={link.url} target="_blank" rel="noreferrer">
            Open <ExternalLink aria-hidden />
          </a>
        </Button>
      </div>
    </section>
  );
}

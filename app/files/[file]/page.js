import { Clock, Download, ExternalLink, Play } from "lucide-react";
import { ApiError } from "@/components/ApiError";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { ROW, RowList } from "@/components/RowList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFile } from "@/lib/api";
import { formatSize } from "@/lib/sites";

export async function generateMetadata({ params }) {
  const { file } = await params;
  const { data } = await getFile(file);
  return { title: data?.filename ?? "Download" };
}

// Step 3: a file's downloads, read live: they expire.
export default async function FilePage({ params }) {
  const { file } = await params;
  const { data, error } = await getFile(file);
  if (error) return <ApiError error={error} />;

  // A direct download answers with the file; a page leads to it. Direct ones first, and only the
  // first is the page's main action.
  const downloads = [...data.downloads].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "direct" ? -1 : 1));
  const size = formatSize(data.sizeBytes);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="break-all text-lg font-medium">{data.filename}</h1>
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

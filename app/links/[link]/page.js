import Link from "next/link";
import { ChevronRight, ExternalLink, TriangleAlert } from "lucide-react";
import { ApiError } from "@/components/ApiError";
import { EmptyState } from "@/components/EmptyState";
import { ROW, RowList } from "@/components/RowList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listFiles } from "@/lib/api";
import { resourceHref } from "@/lib/sites";

export const metadata = { title: "Files" };

// The hosts whose files the API resolves to downloads; another host's file opens on its page.
const RESOLVED_HOSTS = ["hubcloud", "hubcdn"];

// Step 2: the files a link leads to.
export default async function LinkPage({ params }) {
  const { link } = await params;
  const { data, error } = await listFiles(link);
  if (error) return <ApiError error={error} />;

  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-lg font-medium">Files</h1>
      {data.files.length ? (
        <RowList label="Files">
          {data.files.map((file) => (
            <li key={file.name}>
              {RESOLVED_HOSTS.includes(file.host) ? (
                <Link href={resourceHref(file.name)} className={`${ROW} transition hover:border-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none`}>
                  <FileLabel file={file} />
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div className={ROW}>
                  <FileLabel file={file} />
                  <Button asChild variant="outline">
                    <a href={file.url} target="_blank" rel="noreferrer">
                      Open <ExternalLink aria-hidden />
                    </a>
                  </Button>
                </div>
              )}
            </li>
          ))}
        </RowList>
      ) : (
        <EmptyState title="This link leads to no file">The site may have taken it down. Try another link of the post.</EmptyState>
      )}
      {data.failures.length > 0 && (
        <div role="note" className="flex gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            Some pages on the way could not be read, so there may be more files:
            <ul className="mt-1 list-disc pl-5">
              {data.failures.map((failure) => (
                <li key={failure.url} className="break-words">
                  {failure.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/** @param {{ file: import("@/lib/api").HostFile }} props */
function FileLabel({ file }) {
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <Badge variant="secondary">{file.host}</Badge>
      <span className="break-words text-sm">{file.label ?? "File"}</span>
    </div>
  );
}

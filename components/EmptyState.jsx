import { SearchX } from "lucide-react";

/** @param {{ title: string, children?: React.ReactNode }} props children: the next thing to try */
export function EmptyState({ title, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <SearchX className="size-8 text-muted-foreground" aria-hidden />
      <h2 className="text-lg font-medium">{title}</h2>
      {children && <div className="text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

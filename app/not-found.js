import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState title="Not found">
      <p className="mb-4">The site may have removed it, or the address is wrong.</p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </EmptyState>
  );
}

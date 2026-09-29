"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[var(--radius-card)] border border-brand/20 bg-white p-8 text-center shadow-card">
      <h1 className="font-display text-xl font-extrabold">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-steel">
        This section could not be loaded. Check that MONGODB_URI is configured and the database is reachable, then try again.
      </p>
      <Button className="mt-6" onClick={reset} icon={<RefreshCw className="size-4" aria-hidden="true" />}>
        Try Again
      </Button>
    </div>
  );
}

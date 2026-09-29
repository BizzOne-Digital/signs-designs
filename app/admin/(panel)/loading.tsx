import { LoaderCircle } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-sm text-steel" role="status">
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      Loading…
    </div>
  );
}

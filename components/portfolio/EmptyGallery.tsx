import { Images } from "lucide-react";

export function EmptyGallery() {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-ink/20 bg-white px-6 py-16 text-center">
      <Images className="size-10 text-steel/60" aria-hidden="true" />
      <p className="mt-4 font-display text-lg font-bold text-ink">New project photos are on the way</p>
      <p className="mt-1 max-w-md text-sm text-steel">Check back soon to see recent signs, vehicle graphics and installations.</p>
    </div>
  );
}

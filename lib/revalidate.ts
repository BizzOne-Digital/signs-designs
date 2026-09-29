import "server-only";
import { revalidatePath } from "next/cache";

/** Purges cached public pages after admin content changes. */
export function revalidateSite(): void {
  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("[revalidate] failed:", error);
  }
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiriesManager } from "@/components/admin/InquiriesManager";
import { Spinner } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Quote Requests" };

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<Spinner label="Loading quote requests" />}>
      <InquiriesManager />
    </Suspense>
  );
}

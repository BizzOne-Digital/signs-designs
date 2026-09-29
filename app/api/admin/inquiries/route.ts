import type { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { QUOTE_STATUSES, type QuoteStatus } from "@/lib/constants";
import { toQuoteRequestDTO } from "@/lib/serializers";
import QuoteRequest from "@/models/QuoteRequest";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const status = request.nextUrl.searchParams.get("status");
  const filter = status && (QUOTE_STATUSES as readonly string[]).includes(status) ? { status: status as QuoteStatus } : {};

  try {
    await dbConnect();
    const [docs, grouped] = await Promise.all([
      QuoteRequest.find(filter).sort({ createdAt: -1 }).limit(500).lean(),
      QuoteRequest.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const counts = Object.fromEntries(QUOTE_STATUSES.map((s) => [s, 0])) as Record<string, number>;
    grouped.forEach((g) => (counts[g._id] = g.count));
    return ok({ items: docs.map(toQuoteRequestDTO), counts });
  } catch (error) {
    return serverError("list inquiries", error);
  }
}

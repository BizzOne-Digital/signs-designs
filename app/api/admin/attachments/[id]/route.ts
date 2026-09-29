import type { NextRequest } from "next/server";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import QuoteAttachment from "@/models/QuoteAttachment";

export const runtime = "nodejs";

function safeDownloadName(name: string): string {
  return name.replace(/[^A-Za-z0-9._ -]/g, "_").slice(0, 120) || "attachment";
}

/** Customer quote files — only served to an authenticated admin, never cached publicly. */
export async function GET(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return new Response("Invalid id", { status: 400 });

  try {
    await dbConnect();
    const attachment = await QuoteAttachment.findById(id);
    if (!attachment || !attachment.quoteRequest) return new Response("Not found", { status: 404 });

    const download = request.nextUrl.searchParams.get("download") === "1";
    const body = new Uint8Array(attachment.data);
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": attachment.mimeType,
        "Content-Length": String(body.byteLength),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeDownloadName(attachment.originalName)}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[attachments] delivery failed:", error);
    return new Response("Unable to load file", { status: 500 });
  }
}

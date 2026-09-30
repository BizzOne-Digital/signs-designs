import crypto from "crypto";
import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { dbConnect } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { quoteSchema } from "@/lib/validation";
import QuoteRequest from "@/models/QuoteRequest";
import QuoteAttachment from "@/models/QuoteAttachment";

export const runtime = "nodejs";

const MIN_FILL_TIME_MS = 3000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = await rateLimit("quote-submit", ip, 6, 60 * 60);
  if (!limit.allowed) {
    return fail("You have sent several requests recently. Please call Eric at 226-246-7697 or try again later.", 429);
  }

  const raw = await readJson(request);
  if (!raw || typeof raw !== "object") return fail("Invalid request.", 400);

  // Honeypot or instant submission: respond as if successful so bots learn nothing.
  const probe = raw as { website?: unknown; startedAt?: unknown };
  const tooFast = typeof probe.startedAt === "number" && Date.now() - probe.startedAt < MIN_FILL_TIME_MS;
  if ((typeof probe.website === "string" && probe.website.trim() !== "") || tooFast) {
    return ok({ received: true }, 201);
  }

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) return validationFailure(parsed.error);

  const { attachments: attachmentRefs, website: _website, startedAt: _startedAt, ...fields } = parsed.data;
  void _website;
  void _startedAt;

  try {
    await dbConnect();

    // Only files uploaded by this visitor (matching token) and not yet linked can be attached.
    const pending =
      attachmentRefs.length > 0
        ? await QuoteAttachment.find({
            $or: attachmentRefs.map((ref) => ({
              _id: ref.id,
              quoteRequest: null,
              uploadToken: crypto.createHash("sha256").update(ref.token).digest("hex"),
            })),
          })
            .select({ data: 0 })
            .lean()
        : [];

    const quote = await QuoteRequest.create({
      ...fields,
      status: "new",
      attachments: pending.map((a) => ({
        attachmentId: a._id,
        name: a.originalName,
        url: `/api/admin/attachments/${String(a._id)}`,
        mimeType: a.mimeType,
        size: a.size,
      })),
      ipAddress: ip,
      userAgent: (request.headers.get("user-agent") || "").slice(0, 300),
    });

    if (pending.length > 0) {
      await QuoteAttachment.updateMany(
        { _id: { $in: pending.map((a) => a._id) } },
        { $set: { quoteRequest: quote._id }, $unset: { uploadToken: 1, expiresAt: 1 } },
      );
    }

    return ok({ received: true, id: String(quote._id) }, 201);
  } catch (error) {
    return serverError("quote submit", error);
  }
}

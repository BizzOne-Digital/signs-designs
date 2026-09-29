import crypto from "crypto";
import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError } from "@/lib/api";
import { dbConnect } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { matchesFileSignature } from "@/lib/file-signature";
import { ATTACHMENT_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/constants";
import { attachmentDeleteSchema } from "@/lib/validation";
import QuoteAttachment from "@/models/QuoteAttachment";

export const runtime = "nodejs";

const PENDING_TTL_MS = 3 * 60 * 60 * 1000;

function sanitizeOriginalName(name: string, mimeType: string): string {
  const ext = mimeType === "application/pdf" ? "pdf" : mimeType.split("/")[1].replace("jpeg", "jpg");
  const base = name
    .replace(/\.[^.]*$/, "")
    .replace(/[^A-Za-z0-9 _-]/g, "")
    .trim()
    .slice(0, 80);
  return `${base || "attachment"}.${ext}`;
}

/** Public, rate-limited upload for quote-form files. Files stay private until an admin opens them. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = await rateLimit("quote-upload", ip, 20, 60 * 60);
  if (!limit.allowed) return fail("Too many uploads. Please try again later.", 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("The upload could not be read. Please try again.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return fail("No file was provided.", 400);
  if (!(ATTACHMENT_MIME_TYPES as readonly string[]).includes(file.type)) {
    return fail("Only PNG, JPG, WEBP and PDF files are accepted.", 415);
  }
  if (file.size === 0) return fail("The selected file is empty.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return fail("Files must be 8 MB or smaller.", 413);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesFileSignature(buffer, file.type)) {
      return fail("The file contents do not match its file type.", 415);
    }

    const token = crypto.randomBytes(16).toString("hex");
    await dbConnect();
    const attachment = await QuoteAttachment.create({
      originalName: sanitizeOriginalName(file.name, file.type),
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
      uploadToken: crypto.createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + PENDING_TTL_MS),
    });

    return ok(
      { id: String(attachment._id), token, name: attachment.originalName, size: attachment.size, mimeType: attachment.mimeType },
      201,
    );
  } catch (error) {
    return serverError("quote attachment upload", error);
  }
}

/** Lets the visitor remove a file they uploaded but have not submitted yet. */
export async function DELETE(request: NextRequest) {
  const parsed = attachmentDeleteSchema.safeParse(await readJson(request));
  if (!parsed.success) return fail("Invalid attachment.", 400);

  try {
    await dbConnect();
    await QuoteAttachment.deleteOne({
      _id: parsed.data.id,
      quoteRequest: null,
      uploadToken: crypto.createHash("sha256").update(parsed.data.token).digest("hex"),
    });
    return ok({ removed: true });
  } catch (error) {
    return serverError("quote attachment delete", error);
  }
}

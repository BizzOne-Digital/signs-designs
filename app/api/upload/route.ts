import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson, serverError } from "@/lib/api";
import { dbConnect } from "@/lib/mongodb";
import { MAX_UPLOAD_BYTES } from "@/lib/constants";
import { matchesFileSignature } from "@/lib/file-signature";
import { buildStoredUploadUrl, deleteStoredUpload, generateUploadFilename, isAllowedFolder, isImageMimeType, parseStoredUploadUrl } from "@/lib/uploads";
import { collectReferencedUploadUrls } from "@/lib/upload-references";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return fail("Unauthorized. Please sign in.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("The upload could not be read. Please try again.", 400);
  }

  const folder = form.get("folder");
  const file = form.get("file");

  if (!isAllowedFolder(folder)) {
    return fail("Invalid upload folder.", 400);
  }
  if (!(file instanceof File)) {
    return fail("No file was provided.", 400);
  }
  if (!isImageMimeType(file.type)) {
    return fail("Only PNG, JPG, WEBP and GIF images are allowed.", 415);
  }
  if (file.size === 0) {
    return fail("The selected file is empty.", 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return fail("Images must be 8 MB or smaller.", 413);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesFileSignature(buffer, file.type)) {
      return fail("The file contents do not match its image type.", 415);
    }

    // The extension comes from the validated MIME type, never from the original filename.
    const filename = generateUploadFilename(file.type);

    await dbConnect();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    });

    const url = buildStoredUploadUrl(folder, filename);
    return NextResponse.json(
      { success: true, url, filename, size: buffer.length, folder, data: { url, filename, size: buffer.length, folder } },
      { status: 201 },
    );
  } catch (error) {
    return serverError("upload", error);
  }
}

/**
 * Removes an upload that was never saved to content (for example an image replaced before the
 * form was saved). Images still referenced by any content document are never deleted here.
 */
export async function DELETE(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return fail("Unauthorized. Please sign in.", 401);

  const body = (await readJson(request)) as { url?: unknown } | null;
  const url = body?.url;
  if (!parseStoredUploadUrl(url)) return fail("Invalid upload URL.", 400);

  try {
    const referenced = await collectReferencedUploadUrls();
    if (referenced.has(url as string)) {
      return fail("This image is in use on the website and was kept.", 409);
    }
    const deleted = await deleteStoredUpload(url);
    return ok({ deleted });
  } catch (error) {
    return serverError("delete upload", error);
  }
}

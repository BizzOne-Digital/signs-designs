import type { NextRequest } from "next/server";
import { fail, ok, serverError } from "@/lib/api";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { buildStoredUploadUrl } from "@/lib/uploads";
import { collectReferencedUploadUrls } from "@/lib/upload-references";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid media id.", 400);

  try {
    await dbConnect();
    const upload = await StoredUpload.findById(id).select({ data: 0 }).lean();
    if (!upload) return fail("Image not found.", 404);

    const url = buildStoredUploadUrl(upload.folder, upload.filename);
    const referenced = await collectReferencedUploadUrls();
    if (referenced.has(url)) {
      return fail("This image is used on the website. Replace or remove it there first, then delete it here.", 409);
    }

    await StoredUpload.deleteOne({ _id: upload._id });
    return ok({ id });
  } catch (error) {
    return serverError("delete media", error);
  }
}

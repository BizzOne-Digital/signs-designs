import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { portfolioPatchSchema, portfolioSchema } from "@/lib/validation";
import { pickProvided, resolveSlugForUpdate } from "@/lib/patch";
import { toPortfolioDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import { cleanupReplacedUploads } from "@/lib/upload-references";
import PortfolioProject from "@/models/PortfolioProject";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid project id.", 400);
  try {
    await dbConnect();
    const doc = await PortfolioProject.findById(id).lean();
    if (!doc) return fail("Project not found.", 404);
    return ok(toPortfolioDTO(doc));
  } catch (error) {
    return serverError("get portfolio", error);
  }
}

async function update(request: NextRequest, context: IdContext, partial: boolean) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid project id.", 400);

  const raw = await readJson(request);
  const parsed = (partial ? portfolioPatchSchema : portfolioSchema).safeParse(raw);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const existing = await PortfolioProject.findById(id).lean();
    if (!existing) return fail("Project not found.", 404);

    const input = partial ? pickProvided(parsed.data, raw) : { ...parsed.data };
    input.slug = await resolveSlugForUpdate(PortfolioProject, input.slug, existing.slug, id);

    const updated = await PortfolioProject.findByIdAndUpdate(id, { $set: input }, { returnDocument: "after", runValidators: true }).lean();
    if (!updated) return fail("Project not found.", 404);

    // Only after the update succeeded: remove images that were replaced or taken out of the gallery.
    await cleanupReplacedUploads([existing.image, ...existing.galleryImages], [updated.image, ...updated.galleryImages]);
    revalidateSite();
    return ok(toPortfolioDTO(updated));
  } catch (error) {
    return serverError("update portfolio", error);
  }
}

export async function PUT(request: NextRequest, context: IdContext) {
  return update(request, context, false);
}

export async function PATCH(request: NextRequest, context: IdContext) {
  return update(request, context, true);
}

export async function DELETE(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid project id.", 400);
  try {
    await dbConnect();
    const deleted = await PortfolioProject.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Project not found.", 404);
    await cleanupReplacedUploads([deleted.image, ...deleted.galleryImages]);
    revalidateSite();
    return ok({ id });
  } catch (error) {
    return serverError("delete portfolio", error);
  }
}

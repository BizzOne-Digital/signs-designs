import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { servicePatchSchema, serviceSchema } from "@/lib/validation";
import { pickProvided, resolveSlugForUpdate } from "@/lib/patch";
import { toServiceDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import { cleanupReplacedUploads } from "@/lib/upload-references";
import Service from "@/models/Service";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid service id.", 400);
  try {
    await dbConnect();
    const doc = await Service.findById(id).lean();
    if (!doc) return fail("Service not found.", 404);
    return ok(toServiceDTO(doc));
  } catch (error) {
    return serverError("get service", error);
  }
}

async function update(request: NextRequest, context: IdContext, partial: boolean) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid service id.", 400);

  const raw = await readJson(request);
  const parsed = (partial ? servicePatchSchema : serviceSchema).safeParse(raw);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const existing = await Service.findById(id).lean();
    if (!existing) return fail("Service not found.", 404);

    const input = partial ? pickProvided(parsed.data, raw) : { ...parsed.data };
    input.slug = await resolveSlugForUpdate(Service, input.slug, existing.slug, id);

    const updated = await Service.findByIdAndUpdate(id, { $set: input }, { returnDocument: "after", runValidators: true }).lean();
    if (!updated) return fail("Service not found.", 404);

    await cleanupReplacedUploads([existing.image], [updated.image]);
    revalidateSite();
    return ok(toServiceDTO(updated));
  } catch (error) {
    return serverError("update service", error);
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
  if (!id) return fail("Invalid service id.", 400);
  try {
    await dbConnect();
    const deleted = await Service.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Service not found.", 404);
    await cleanupReplacedUploads([deleted.image]);
    revalidateSite();
    return ok({ id });
  } catch (error) {
    return serverError("delete service", error);
  }
}

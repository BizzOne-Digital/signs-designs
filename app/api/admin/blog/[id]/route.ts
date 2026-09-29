import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { blogPatchSchema, blogSchema } from "@/lib/validation";
import { pickProvided, resolveSlugForUpdate } from "@/lib/patch";
import { toBlogPostDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import { cleanupReplacedUploads } from "@/lib/upload-references";
import { resolvePublishedAt } from "@/lib/blog";
import BlogPost from "@/models/BlogPost";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid post id.", 400);
  try {
    await dbConnect();
    const doc = await BlogPost.findById(id).lean();
    if (!doc) return fail("Post not found.", 404);
    return ok(toBlogPostDTO(doc));
  } catch (error) {
    return serverError("get post", error);
  }
}

async function update(request: NextRequest, context: IdContext, partial: boolean) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid post id.", 400);

  const raw = await readJson(request);
  const parsed = (partial ? blogPatchSchema : blogSchema).safeParse(raw);
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const existing = await BlogPost.findById(id).lean();
    if (!existing) return fail("Post not found.", 404);

    const { publishedAt, ...input } = partial ? pickProvided(parsed.data, raw) : { ...parsed.data };
    const changes: Record<string, unknown> = { ...input };
    changes.slug = await resolveSlugForUpdate(BlogPost, input.slug, existing.slug, id);
    changes.publishedAt = resolvePublishedAt(input.status ?? existing.status, publishedAt, existing.publishedAt);

    const updated = await BlogPost.findByIdAndUpdate(id, { $set: changes }, { returnDocument: "after", runValidators: true }).lean();
    if (!updated) return fail("Post not found.", 404);

    await cleanupReplacedUploads([existing.featuredImage], [updated.featuredImage]);
    revalidateSite();
    return ok(toBlogPostDTO(updated));
  } catch (error) {
    return serverError("update post", error);
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
  if (!id) return fail("Invalid post id.", 400);
  try {
    await dbConnect();
    const deleted = await BlogPost.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Post not found.", 404);
    await cleanupReplacedUploads([deleted.featuredImage]);
    revalidateSite();
    return ok({ id });
  } catch (error) {
    return serverError("delete post", error);
  }
}

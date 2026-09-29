import type { NextRequest } from "next/server";
import { ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { blogSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";
import { toBlogPostDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import { resolvePublishedAt } from "@/lib/blog";
import BlogPost from "@/models/BlogPost";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  try {
    await dbConnect();
    await ensureSeeded();
    const docs = await BlogPost.find().sort({ updatedAt: -1 }).lean();
    return ok(docs.map(toBlogPostDTO));
  } catch (error) {
    return serverError("list posts", error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const parsed = blogSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const { publishedAt, ...input } = parsed.data;
    const slug = await uniqueSlug(BlogPost, input.slug || input.title);
    const doc = await BlogPost.create({
      ...input,
      slug,
      publishedAt: resolvePublishedAt(input.status, publishedAt, null),
    });
    revalidateSite();
    return ok(toBlogPostDTO(doc.toObject()), 201);
  } catch (error) {
    return serverError("create post", error);
  }
}

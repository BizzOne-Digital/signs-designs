import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { pageContentUpdateSchema, imageUrlSchema } from "@/lib/validation";
import { getContentField, getPageDefaults, isPageKey, PAGE_CONTENT } from "@/lib/content-definitions";
import { revalidateSite } from "@/lib/revalidate";
import { cleanupReplacedUploads } from "@/lib/upload-references";
import PageContent, { type PageContentType } from "@/models/PageContent";
import type { PageContentValues } from "@/lib/types";

export const runtime = "nodejs";

async function loadValues(page: keyof typeof PAGE_CONTENT): Promise<PageContentValues> {
  const values = getPageDefaults(page);
  const docs = await PageContent.find({ page }).lean();
  for (const doc of docs) {
    const path = `${doc.section}.${doc.key}`;
    if (path in values && doc.value !== undefined && doc.value !== null) {
      values[path] = Array.isArray(doc.value) ? doc.value.map(String) : String(doc.value);
    }
  }
  return values;
}

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const page = request.nextUrl.searchParams.get("page") ?? "home";
  if (!isPageKey(page)) return fail("Unknown page.", 400);

  try {
    await dbConnect();
    await ensureSeeded();
    return ok({ page, values: await loadValues(page) });
  } catch (error) {
    return serverError("get page content", error);
  }
}

export async function PUT(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const parsed = pageContentUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  const { page, values } = parsed.data;
  if (!isPageKey(page)) return fail("Unknown page.", 400);

  // Only fields declared in the content definitions can be written, with type-appropriate values.
  const operations: { section: string; key: string; value: string | string[]; type: PageContentType }[] = [];
  for (const [path, value] of Object.entries(values)) {
    const field = getContentField(page, path);
    if (!field) return fail(`Unknown field "${path}".`, 400);
    const [section, key] = path.split(".");

    if (field.type === "json") {
      const list = Array.isArray(value) ? value : value.split("\n");
      operations.push({ section, key, type: field.type, value: list.map((v) => v.trim()).filter(Boolean).slice(0, 20) });
    } else if (typeof value !== "string") {
      return fail(`"${field.label}" must be text.`, 422);
    } else if (field.type === "image") {
      const image = imageUrlSchema.safeParse(value);
      if (!image.success) return fail(`${field.label}: ${image.error.issues[0]?.message ?? "invalid image"}`, 422);
      operations.push({ section, key, type: field.type, value: image.data });
    } else {
      const limit = field.type === "text" ? 300 : 6000;
      if (value.length > limit) return fail(`"${field.label}" must be under ${limit} characters.`, 422);
      operations.push({ section, key, type: field.type, value: value.trim() });
    }
  }

  try {
    await dbConnect();
    const previous = await loadValues(page);

    if (operations.length > 0) {
      await PageContent.bulkWrite(
        operations.map((op) => ({
          updateOne: {
            filter: { page, section: op.section, key: op.key },
            update: { $set: { value: op.value, type: op.type } },
            upsert: true,
          },
        })),
      );
    }

    const current = await loadValues(page);
    const imagePaths = operations.filter((op) => op.type === "image").map((op) => `${op.section}.${op.key}`);
    await cleanupReplacedUploads(
      imagePaths.map((p) => previous[p]),
      imagePaths.map((p) => current[p]),
    );

    revalidateSite();
    return ok({ page, values: current });
  } catch (error) {
    return serverError("update page content", error);
  }
}

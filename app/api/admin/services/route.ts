import type { NextRequest } from "next/server";
import { ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { serviceSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";
import { toServiceDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import Service from "@/models/Service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  try {
    await dbConnect();
    await ensureSeeded();
    const docs = await Service.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return ok(docs.map(toServiceDTO));
  } catch (error) {
    return serverError("list services", error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const parsed = serviceSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const input = parsed.data;
    const slug = await uniqueSlug(Service, input.slug || input.title);
    const doc = await Service.create({ ...input, slug });
    revalidateSite();
    return ok(toServiceDTO(doc.toObject()), 201);
  } catch (error) {
    return serverError("create service", error);
  }
}

import type { NextRequest } from "next/server";
import { ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { portfolioSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";
import { toPortfolioDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import PortfolioProject from "@/models/PortfolioProject";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  try {
    await dbConnect();
    await ensureSeeded();
    const docs = await PortfolioProject.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return ok(docs.map(toPortfolioDTO));
  } catch (error) {
    return serverError("list portfolio", error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const parsed = portfolioSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const input = parsed.data;
    const slug = await uniqueSlug(PortfolioProject, input.slug || input.title);
    const doc = await PortfolioProject.create({ ...input, slug });
    revalidateSite();
    return ok(toPortfolioDTO(doc.toObject()), 201);
  } catch (error) {
    return serverError("create portfolio", error);
  }
}

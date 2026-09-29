import type { NextRequest } from "next/server";
import { ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { ensureSeeded } from "@/lib/seed";
import { settingsSchema } from "@/lib/validation";
import { toSettingsDTO } from "@/lib/serializers";
import { revalidateSite } from "@/lib/revalidate";
import { cleanupReplacedUploads } from "@/lib/upload-references";
import SiteSettings from "@/models/SiteSettings";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  try {
    await dbConnect();
    await ensureSeeded();
    return ok(toSettingsDTO(await SiteSettings.findOne({ key: "site" }).lean()));
  } catch (error) {
    return serverError("get settings", error);
  }
}

export async function PUT(request: NextRequest) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;

  const parsed = settingsSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);

  try {
    await dbConnect();
    const previous = await SiteSettings.findOne({ key: "site" }).lean();
    const updated = await SiteSettings.findOneAndUpdate(
      { key: "site" },
      { $set: parsed.data, $setOnInsert: { key: "site" } },
      { upsert: true, returnDocument: "after", runValidators: true },
    ).lean();

    await cleanupReplacedUploads([previous?.logo, previous?.favicon], [updated?.logo, updated?.favicon]);
    revalidateSite();
    return ok(toSettingsDTO(updated));
  } catch (error) {
    return serverError("update settings", error);
  }
}

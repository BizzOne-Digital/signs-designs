import type { NextRequest } from "next/server";
import { fail, ok, readJson, serverError, validationFailure } from "@/lib/api";
import { denyUnlessAdmin, readId, type IdContext } from "@/lib/admin-route";
import { dbConnect } from "@/lib/mongodb";
import { inquiryUpdateSchema } from "@/lib/validation";
import { toQuoteRequestDTO } from "@/lib/serializers";
import QuoteRequest from "@/models/QuoteRequest";
import QuoteAttachment from "@/models/QuoteAttachment";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid inquiry id.", 400);
  try {
    await dbConnect();
    const doc = await QuoteRequest.findById(id).lean();
    if (!doc) return fail("Inquiry not found.", 404);
    return ok(toQuoteRequestDTO(doc));
  } catch (error) {
    return serverError("get inquiry", error);
  }
}

export async function PATCH(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid inquiry id.", 400);

  const parsed = inquiryUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailure(parsed.error);
  if (parsed.data.status === undefined && parsed.data.adminNotes === undefined) return fail("Nothing to update.", 400);

  try {
    await dbConnect();
    const updated = await QuoteRequest.findByIdAndUpdate(id, { $set: parsed.data }, { returnDocument: "after", runValidators: true }).lean();
    if (!updated) return fail("Inquiry not found.", 404);
    return ok(toQuoteRequestDTO(updated));
  } catch (error) {
    return serverError("update inquiry", error);
  }
}

export async function DELETE(request: NextRequest, context: IdContext) {
  const denied = await denyUnlessAdmin(request);
  if (denied) return denied;
  const id = await readId(context);
  if (!id) return fail("Invalid inquiry id.", 400);
  try {
    await dbConnect();
    const deleted = await QuoteRequest.findByIdAndDelete(id).lean();
    if (!deleted) return fail("Inquiry not found.", 404);
    await QuoteAttachment.deleteMany({ quoteRequest: deleted._id });
    return ok({ id });
  } catch (error) {
    return serverError("delete inquiry", error);
  }
}

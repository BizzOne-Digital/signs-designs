import { dbConnect } from "@/lib/mongodb";
import { isAllowedFolder, isSafeFilename } from "@/lib/uploads";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" },
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;

  if (!isAllowedFolder(folder) || !isSafeFilename(filename)) {
    return textResponse("Invalid path", 400);
  }

  try {
    await dbConnect();
    const upload = await StoredUpload.findOne({ folder, filename });
    if (!upload) return textResponse("Not found", 404);

    const body = new Uint8Array(upload.data);
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
        "Content-Disposition": `inline; filename="${filename}"`,
        ETag: `"${filename}"`,
      },
    });
  } catch (error) {
    console.error("[uploads] delivery failed:", error);
    return textResponse("Unable to load file", 500);
  }
}

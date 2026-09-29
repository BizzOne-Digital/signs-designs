import "server-only";

/**
 * Checks the file's magic bytes so a renamed or mislabelled file cannot pass as an image or PDF.
 * The declared MIME type from the browser is never trusted on its own.
 */
export function matchesFileSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;
  switch (mimeType) {
    case "image/jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif": {
      const header = buffer.subarray(0, 6).toString("ascii");
      return header === "GIF87a" || header === "GIF89a";
    }
    case "image/webp":
      return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    case "application/pdf":
      return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    default:
      return false;
  }
}

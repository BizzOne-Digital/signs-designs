"use client";

import { TRANSPORT_SAFE_BYTES } from "@/lib/constants";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be read. Try a different file."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Vercel limits a serverless request body to ~4.5 MB. Images above the transport-safe size are
 * resized and re-encoded to WebP in the browser so files up to the 8 MB limit still upload.
 * Animated GIFs cannot be re-encoded without losing animation, so they are returned unchanged.
 */
export async function prepareImageForUpload(file: File, maxBytes = TRANSPORT_SAFE_BYTES): Promise<File> {
  if (file.size <= maxBytes || file.type === "image/gif" || file.type === "application/pdf") return file;

  const image = await loadImage(file);
  const attempts: Array<{ maxSide: number; quality: number }> = [
    { maxSide: 3200, quality: 0.88 },
    { maxSide: 2560, quality: 0.85 },
    { maxSide: 2048, quality: 0.8 },
    { maxSide: 1600, quality: 0.75 },
  ];

  for (const attempt of attempts) {
    const scale = Math.min(1, attempt.maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) break;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToBlob(canvas, "image/webp", attempt.quality);
    if (blob && blob.type === "image/webp" && blob.size <= maxBytes) {
      const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
      return new File([blob], `${baseName}.webp`, { type: "image/webp" });
    }
  }

  throw new Error("This image is too large to upload. Please use an image under 4 MB.");
}

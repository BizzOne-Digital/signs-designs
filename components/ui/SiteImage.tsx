import Image, { type ImageProps } from "next/image";
import { normalizeImageUrl } from "@/lib/images";

type SiteImageProps = Omit<ImageProps, "src"> & { src?: string | null };

/** next/image with legacy-URL normalization and a safe placeholder fallback. */
export function SiteImage({ src, alt, ...props }: SiteImageProps) {
  return <Image src={normalizeImageUrl(src)} alt={alt} {...props} />;
}

import Image from "next/image";
import { normalizeImageUrl } from "@/lib/images";
import logoImage from "@/public/logo.png";

/** Geometric leaf mark echoing the brand logo's angular maple-leaf points. */
export function LeafMark({ className = "size-10", cut = true }: { className?: string; cut?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <polygon
        fill="currentColor"
        points="50,4 57,17 65,12 62,35 73,24 75,31 87,28 83,41 90,45 69,60 72,69 54,66 55,88 45,88 46,66 28,69 31,60 10,45 17,41 13,28 25,31 27,24 38,35 35,12 43,17"
      />
      {cut ? <polygon fill="#080808" points="8,62 92,34 92,39 8,67" opacity="0.9" /> : null}
    </svg>
  );
}

type LogoProps = {
  /** Logo uploaded in Admin > Settings. Falls back to public/logo.png. */
  logoUrl?: string;
  /** Tailwind height classes; width follows the image's aspect ratio. */
  className?: string;
};

export function Logo({ logoUrl, className = "h-12 sm:h-14" }: LogoProps) {
  const uploaded = logoUrl && logoUrl.startsWith("/api/uploads/") ? normalizeImageUrl(logoUrl) : null;

  if (uploaded) {
    return (
      <span className={`relative block aspect-[2.09/1] ${className}`}>
        <Image src={uploaded} alt="Signs & Designs by Eric" fill sizes="240px" className="object-contain object-left" priority />
      </span>
    );
  }

  return <Image src={logoImage} alt="Signs & Designs by Eric" priority sizes="240px" className={`w-auto ${className}`} />;
}

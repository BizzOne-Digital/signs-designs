import type { PageContentType } from "@/models/PageContent";
import type { PageContentValues } from "@/lib/types";
import { img } from "@/lib/placeholder-images";

export interface ContentField {
  key: string;
  label: string;
  type: PageContentType;
  default: string | string[];
  help?: string;
}

export interface ContentSection {
  id: string;
  label: string;
  fields: ContentField[];
}

export interface ContentPage {
  label: string;
  path: string;
  sections: ContentSection[];
}

/**
 * Single source of truth for admin-editable page content.
 * Defaults are used until the admin saves a value, so the site always renders complete copy.
 */
export const PAGE_CONTENT = {
  home: {
    label: "Home",
    path: "/",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "eyebrow", label: "Location label", type: "text", default: "Windsor • Tecumseh • Essex County" },
          { key: "title", label: "Headline", type: "text", default: "Custom Signage That Gets Your" },
          { key: "highlight", label: "Highlighted words (red)", type: "text", default: "Business Noticed." },
          {
            key: "subtitle",
            label: "Sub-headline",
            type: "textarea",
            default:
              "From expert graphic design to high-impact storefront signs and vehicle graphics, we design, fabricate, and install durable visual solutions that make your business stand out across Windsor, Tecumseh and Essex County.",
          },
          { key: "primaryCta", label: "Primary button", type: "text", default: "Request a Free Quote" },
          { key: "secondaryCta", label: "Secondary button", type: "text", default: "Explore Services" },
          { key: "image", label: "Hero image", type: "image", default: "/hero.png" },
          {
            key: "trust",
            label: "Trust indicators",
            type: "json",
            default: ["32+ Years Experience", "12+ Years in Business", "Local Windsor-Essex Service", "Design • Fabrication • Installation"],
            help: "One per line. Keep each short.",
          },
        ],
      },
      {
        id: "about",
        label: "About intro",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "32 Years of Experience" },
          { key: "title", label: "Heading", type: "text", default: "Your Local Signage & Graphics Experts" },
          {
            key: "text",
            label: "Paragraph 1",
            type: "textarea",
            default:
              "With 32 years of experience and 12 years in business, Signs & Designs by Eric is a full-service signage, graphic design and installation company serving Windsor and Essex County.",
          },
          {
            key: "text2",
            label: "Paragraph 2",
            type: "textarea",
            default: "Our goal is to help local businesses stand out with high-quality, custom visual solutions.",
          },
          { key: "image", label: "Section image", type: "image", default: img("streetStorefront", 1400) },
        ],
      },
      {
        id: "services",
        label: "Services section",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "What We Do" },
          { key: "title", label: "Heading", type: "text", default: "Signage Solutions Built for Business" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default:
              "Every project is designed, produced and installed with one goal: making your business easier to find, easier to remember and easier to choose.",
          },
        ],
      },
      {
        id: "portfolio",
        label: "Featured work",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Featured Work" },
          { key: "title", label: "Heading", type: "text", default: "Built to Get Businesses Noticed" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default: "A look at the storefronts, vehicles and interiors we have helped local businesses brand across Windsor-Essex.",
          },
        ],
      },
      {
        id: "process",
        label: "Process",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "From Idea to Installation" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default: "One team handles your project from the first conversation to the final installed sign, so nothing gets lost between steps.",
          },
        ],
      },
      {
        id: "stats",
        label: "Why choose us",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Experience You Can See From the Street" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default: "Local businesses trust us because we know the materials, the installs and the region — and we stand behind the work.",
          },
          { key: "image", label: "Background image", type: "image", default: img("fabrication", 1800) },
        ],
      },
      {
        id: "cta",
        label: "Closing call to action",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Ready to Make Your Business Stand Out?" },
          { key: "text", label: "Text", type: "textarea", default: "Tell us about your signage project and we'll prepare a custom quote." },
        ],
      },
    ],
  },
  about: {
    label: "About",
    path: "/about",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "About Signs & Designs by Eric" },
          { key: "subtitle", label: "Subtitle", type: "text", default: "Local experience. Professional craftsmanship. Built to last." },
          { key: "image", label: "Hero image", type: "image", default: img("storefrontWindow", 1800) },
        ],
      },
      {
        id: "story",
        label: "Our story",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Our Story" },
          { key: "title", label: "Heading", type: "text", default: "Three Decades of Helping Local Businesses Get Seen" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default:
              "Signs & Designs by Eric was built on a simple idea: a local business deserves signage that looks professional, lasts for years and is handled by someone who picks up the phone.",
          },
          {
            key: "body",
            label: "Story",
            type: "textarea",
            default:
              "Eric Marmus brings 32 years of hands-on experience in the sign industry, and for the last 12 years has run Signs & Designs by Eric out of Tecumseh, Ontario. Over that time we have designed, fabricated and installed storefront signs, vehicle graphics, window vinyl and promotional displays for businesses throughout Windsor and Essex County.\n\nBecause design, production and installation are handled by one team, you get one point of contact, clear pricing and a finished result that matches what was approved.",
          },
          { key: "image", label: "Story image", type: "image", default: "/ourstory.png" },
        ],
      },
      {
        id: "experience",
        label: "Experience",
        fields: [
          {
            key: "text",
            label: "Experience text",
            type: "textarea",
            default: "Experience matters in signage. It shows in material choices that survive Ontario winters, clean vinyl application and installs that stay level and secure for years.",
          },
        ],
      },
      {
        id: "approach",
        label: "Our approach",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Practical Advice. Precise Work." },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default:
              "We start by understanding your business, your location and your budget. Then we recommend the signage that will do the most work for you — not the most expensive option. Every proof is reviewed with you before anything goes into production.",
          },
          { key: "image", label: "Section image", type: "image", default: "/ourapproach.png" },
        ],
      },
      {
        id: "serviceArea",
        label: "Service area",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Proudly Serving Windsor-Essex" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default:
              "Based in Tecumseh, we work with businesses across Windsor, Tecumseh, Lakeshore, LaSalle, Amherstburg, Belle River, Kingsville, Leamington and the rest of Essex County.",
          },
        ],
      },
    ],
  },
  services: {
    label: "Services",
    path: "/services",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Commercial Signage & Graphics Services" },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            default: "Complete design, production and installation solutions for businesses across Windsor and Essex County.",
          },
          { key: "image", label: "Hero image", type: "image", default: img("retailArcade", 1800) },
        ],
      },
      {
        id: "cta",
        label: "Closing call to action",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Have a Custom Project?" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default: "If you can picture it, we can help design, build and install it. Send us the details and we will prepare a custom quote.",
          },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    path: "/contact",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Headline", type: "text", default: "Get a Free Quote" },
          {
            key: "subtitle",
            label: "Description",
            type: "textarea",
            default: "Tell us about your project and we'll get back to you with a custom quote.",
          },
        ],
      },
      {
        id: "details",
        label: "Contact details panel",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Talk to a Local Sign Expert" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default: "Prefer to talk it through? Call or email and we will help you figure out the right signage for your space and budget.",
          },
        ],
      },
    ],
  },
  blog: {
    label: "Blog",
    path: "/blog",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Signage Tips & Business Branding Insights" },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            default: "Practical advice on signs, vehicle graphics and local branding from a Windsor-Essex sign shop with 32 years of experience.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, ContentPage>;

export type PageKey = keyof typeof PAGE_CONTENT;
export const PAGE_KEYS = Object.keys(PAGE_CONTENT) as PageKey[];

export function isPageKey(value: string): value is PageKey {
  return Object.prototype.hasOwnProperty.call(PAGE_CONTENT, value);
}

export function getContentField(page: PageKey, path: string): ContentField | undefined {
  const [sectionId, key] = path.split(".");
  const section = (PAGE_CONTENT[page].sections as ContentSection[]).find((s) => s.id === sectionId);
  return section?.fields.find((f) => f.key === key);
}

export function getPageDefaults(page: PageKey): PageContentValues {
  const values: PageContentValues = {};
  for (const section of PAGE_CONTENT[page].sections as ContentSection[]) {
    for (const field of section.fields) values[`${section.id}.${field.key}`] = field.default;
  }
  return values;
}

/** Reads a text value with a guaranteed string result. */
export function contentText(values: PageContentValues, path: string): string {
  const value = values[path];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return "";
}

export function contentList(values: PageContentValues, path: string): string[] {
  const value = values[path];
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim() !== "");
  if (typeof value === "string" && value.trim()) return value.split("\n").map((v) => v.trim()).filter(Boolean);
  return [];
}

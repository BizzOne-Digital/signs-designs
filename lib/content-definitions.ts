import type { PageContentType } from "@/models/PageContent";
import type { PageContentValues } from "@/lib/types";

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
          { key: "title", label: "Headline", type: "text", default: "Custom Signage Built by a" },
          { key: "highlight", label: "Highlighted words (red)", type: "text", default: "Local Expert." },
          {
            key: "subtitle",
            label: "Sub-headline",
            type: "textarea",
            default:
              "Get regular sign-shop capabilities with the dedicated attention of an owner-operator. With over 32 years of hands-on experience, I personally design, build, and install durable visual solutions that get your Windsor-Essex business noticed.",
          },
          { key: "primaryCta", label: "Primary button", type: "text", default: "Request a Free Quote" },
          { key: "secondaryCta", label: "Secondary button", type: "text", default: "Explore Services" },
          { key: "image", label: "Hero image", type: "image", default: "/hero.png" },
          {
            key: "trust",
            label: "Trust indicators",
            type: "json",
            default: ["32+ Years Hands-On Experience", "Owner-Operated Tecumseh Shop", "Deal Directly With Eric", "Design • Build • Install"],
            help: "One per line. Keep each short.",
          },
        ],
      },
      {
        id: "about",
        label: "About intro",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "32 Years of Experience" },
          { key: "title", label: "Heading", type: "text", default: "Your Local, Owner-Operated Sign Shop" },
          {
            key: "text",
            label: "Paragraph 1",
            type: "textarea",
            default:
              "I'm Eric Marmus. I've spent more than 32 years in the sign trade, and for the last 12 I've run Signs & Designs by Eric from my home-based shop in Tecumseh, serving businesses across Windsor and Essex County.",
          },
          {
            key: "text2",
            label: "Paragraph 2",
            type: "textarea",
            default: "When you call, you talk to me. I design your sign, build it and install it myself, so you get sign-shop quality with one person accountable from start to finish.",
          },
          { key: "image", label: "Section image", type: "image", default: "/home1.png" },
        ],
      },
      {
        id: "services",
        label: "Services section",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "What I Do" },
          { key: "title", label: "Heading", type: "text", default: "Signage Solutions Built for Business" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default:
              "I personally design, build and install every project with one goal: making your business easier to find, easier to remember and easier to choose.",
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
            default: "A look at signs, vehicles and interiors I've designed, built and installed for businesses across Windsor-Essex.",
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
            default: "You work with one person, from the first conversation to the final installed sign, so nothing gets lost between steps.",
          },
        ],
      },
      {
        id: "stats",
        label: "Why choose Eric",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Experience You Can See From the Street" },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default: "Local businesses work with me because I know the materials, the installs and the region, and I personally stand behind every sign I put up.",
          },
          { key: "image", label: "Background image", type: "image", default: "/ourstory.png" },
        ],
      },
      {
        id: "cta",
        label: "Closing call to action",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Ready to Make Your Business Stand Out?" },
          { key: "text", label: "Text", type: "textarea", default: "Tell me about your signage project and I'll prepare a custom quote for you personally." },
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
          { key: "subtitle", label: "Subtitle", type: "text", default: "An owner-operated sign shop in Tecumseh. 32+ years of experience, and one person from design to installation." },
          { key: "image", label: "Hero image", type: "image", default: "/ser1.png" },
        ],
      },
      {
        id: "story",
        label: "About Eric",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "text", default: "Meet Eric" },
          { key: "title", label: "Heading", type: "text", default: "32+ Years of Sign Work. One Owner. Every Job." },
          {
            key: "intro",
            label: "Intro",
            type: "textarea",
            default:
              "I'm Eric Marmus, and Signs & Designs by Eric is my owner-operated sign shop. When you hire me, I'm the person you talk to, the person who designs your sign and the person who installs it.",
          },
          {
            key: "body",
            label: "Story",
            type: "textarea",
            default:
              "I've been in the sign trade for more than 32 years. For the last 12, I've run my own business from a home-based shop in Tecumseh, building storefront signs, vehicle graphics, window graphics, site signs and interior signage for businesses throughout Windsor and Essex County.\n\nYou deal directly with me from the first call. There's no salesperson and no hand-off to a crew. I'm personally involved in every step, from design to installation.\n\nRunning a home-based, owner-operated shop keeps my overhead low. That means fair pricing, quick answers, and a finished sign that matches exactly what you approved.",
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
            default: "After 32+ years, I know what lasts. It shows in material choices that survive Ontario winters, clean vinyl application, and installs I personally measure, mount and align so they stay level and secure for years.",
          },
        ],
      },
      {
        id: "approach",
        label: "My approach",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Practical Advice. Precise Work." },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default:
              "I start by understanding your business, your location and your budget. Then I recommend the signage that will do the most work for you, not the most expensive option. I review every proof with you personally before anything goes into production.",
          },
          { key: "image", label: "Section image", type: "image", default: "/ourapproach.png" },
        ],
      },
      {
        id: "serviceArea",
        label: "Service area",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "A Tecumseh Shop, Serving All of Windsor-Essex" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default:
              "My shop is home-based in Tecumseh. That means direct communication with the owner and low overhead that keeps pricing fair. I work with businesses across Windsor, Tecumseh, Lakeshore, LaSalle, Amherstburg, Belle River, Kingsville, Leamington and the rest of Essex County.",
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
            default: "Design, production and installation, personally handled by Eric for businesses across Windsor and Essex County.",
          },
          { key: "image", label: "Hero image", type: "image", default: "/ser6.png" },
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
            default: "If you can picture it, I can help design, build and install it. Send me the details and I'll prepare a custom quote.",
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
            default: "Tell me about your project and I'll get back to you personally with a custom quote.",
          },
        ],
      },
      {
        id: "details",
        label: "Contact details panel",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Talk Directly With Eric" },
          {
            key: "text",
            label: "Text",
            type: "textarea",
            default: "Prefer to talk it through? Call or email me directly. You'll reach the owner, not a call centre, and I'll help you figure out the right signage for your space and budget.",
          },
        ],
      },
    ],
  },
  portfolio: {
    label: "Portfolio",
    path: "/portfolio",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "title", label: "Heading", type: "text", default: "Portfolio & Gallery" },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            default: "Completed work across every service: storefront and site signs, vehicle graphics, window and interior signage, displays and installations.",
          },
          { key: "image", label: "Hero image", type: "image", default: "/hero.png" },
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
            default: "Practical advice on signs, vehicle graphics and local branding from Eric, a Windsor-Essex sign maker with 32+ years of experience.",
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

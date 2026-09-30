import { BUSINESS } from "@/lib/constants";
import { img } from "@/lib/placeholder-images";
import type { BlogPostDTO, PortfolioDTO, ServiceDTO, SiteSettingsDTO } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettingsDTO = {
  businessName: BUSINESS.name,
  phone: BUSINESS.phone,
  email: BUSINESS.email,
  address: `${BUSINESS.street}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`,
  facebook: BUSINESS.facebook,
  logo: "",
  favicon: "",
  seoTitle: "Custom Signs Windsor & Tecumseh | Signs & Designs by Eric",
  seoDescription:
    "Owner-operated sign shop in Tecumseh. Eric personally designs, builds and installs storefront signs, vehicle graphics, site signs and interior signage for Windsor-Essex businesses. 32+ years of experience. Request a free quote.",
};

type SeedService = Omit<ServiceDTO, "id" | "updatedAt">;

export const DEFAULT_SERVICES: SeedService[] = [
  {
    title: "Storefront & Commercial Signage",
    slug: "storefront-commercial-signage",
    shortDescription:
      "Eye-catching outdoor business signs, storefront fascia, dimensional lettering, and illuminated building signs designed to maximize visibility.",
    description:
      "Your storefront sign is often the first impression a customer has of your business. I design and build exterior signage sized for the viewing distance, readable from the road and made to handle Windsor-Essex weather year after year.\n\nFrom a clean fascia panel to dimensional lettering and illuminated building signs, I use commercial-grade materials and install every sign myself, so the finished result matches exactly what you approved.",
    image: "/ser1.png",
    icon: "store",
    features: ["Outdoor business signs", "Storefront fascia", "Dimensional lettering", "Illuminated signage", "Building signs"],
    sortOrder: 1,
    active: true,
  },
  {
    title: "Custom Graphic & Sign Design",
    slug: "custom-graphic-sign-design",
    shortDescription:
      "Professional layout design, vector logo optimization, and branding services created specifically for large-format sign manufacturing.",
    description:
      "Great signage starts with artwork built for production. Send me your existing logo, a rough idea or even a phone photo, and I'll turn it into clean, production-ready graphics.\n\nThat includes rebuilding low-resolution logos as vector artwork, setting up large-format layouts, matching your brand colours and preparing a proof you can approve before anything is printed or cut.",
    image: "/ser2.png",
    icon: "pen-tool",
    features: ["Graphic layout", "Logo vectorization", "Brand preparation", "Large-format artwork", "Production-ready graphics"],
    sortOrder: 2,
    active: true,
  },
  {
    title: "Vehicle Graphics & Fleet Lettering",
    slug: "vehicle-graphics-fleet-lettering",
    shortDescription:
      "High-durability vinyl lettering, partial wraps, magnetic signs, and fleet graphics that turn your work vehicles into mobile advertising.",
    description:
      "Your vehicles are on the road every day, so they should be working for your business. I design and apply vehicle lettering, partial wraps and fleet branding using durable vinyl made for real-world wear.\n\nNeed flexibility? Magnetic signs let you brand a personal vehicle without a permanent install. For fleets, I keep every truck and van consistent so your business is recognized wherever it's parked.",
    image: "/ser3.png",
    icon: "truck",
    features: ["Vehicle lettering", "Partial wraps", "Fleet branding", "Magnetic vehicle signs", "Commercial decals"],
    sortOrder: 3,
    active: true,
  },
  {
    title: "Window, Wall & Floor Graphics",
    slug: "window-wall-floor-graphics",
    shortDescription:
      "Custom frosted privacy vinyl, full-color retail window graphics, branded wall murals, and professional floor graphics.",
    description:
      "Windows, walls and floors are some of the most valuable branding space you have. I produce frosted privacy vinyl for offices and clinics, full-colour window displays for retail, interior wall graphics and murals, and floor graphics for wayfinding and promotions.\n\nI measure every space in person and apply the graphics myself for a clean, bubble-free finish.",
    image: "/ser4.png",
    icon: "panels",
    features: ["Frosted privacy vinyl", "Window displays", "Interior wall graphics", "Murals", "Floor graphics"],
    sortOrder: 4,
    active: true,
  },
  {
    title: "Promotional Prints & Event Displays",
    slug: "promotional-prints-event-displays",
    shortDescription: "Coroplast lawn signs, outdoor banners, A-frame boards, event displays and retractable trade show banners.",
    description:
      "When you need visibility fast, promotional signage delivers. I print outdoor vinyl banners, coroplast lawn signs, A-frame sidewalk boards and retractable banners for trade shows and events.\n\nThey're ideal for grand openings, sponsorships, seasonal sales and community events, and because you deal with me directly, quick turnarounds are easy to arrange.",
    image: "/ser5.png",
    icon: "megaphone",
    features: ["Coroplast lawn signs", "Outdoor banners", "A-frame boards", "Event displays", "Retractable banners"],
    sortOrder: 5,
    active: true,
  },
  {
    title: "Development, Real Estate & Site Signs",
    slug: "development-real-estate-site-signs",
    shortDescription:
      "Coming-soon boards, development and construction site signs, real estate signs and property signage built to stand up on site.",
    description:
      "A job site or property should tell people what's coming and who to call. I build development and coming-soon boards, construction site signs, real estate and for-lease signs, and post-and-panel property signage.\n\nThese signs are made for outdoor exposure and installed securely, whether it's a single sign for a listing or a set of signs for a new development.",
    image: img("constructionSite", 1400),
    icon: "building",
    features: ["Development & coming-soon boards", "Construction site signs", "Real estate & for-lease signs", "Post & panel signs", "Property signage"],
    sortOrder: 6,
    active: true,
  },
  {
    title: "Interior Signage",
    slug: "interior-signage",
    shortDescription:
      "Lobby and reception signs, dimensional wall logos, office door and room signs, and wayfinding that helps visitors find their way.",
    description:
      "The inside of your business deserves the same attention as the outside. I make reception and lobby signs, dimensional wall logos, door and room identification signs, and directional wayfinding signage.\n\nInterior signs make a strong first impression on customers and help visitors move through your space without asking for directions.",
    image: img("officeCorridor", 1400),
    icon: "signpost",
    features: ["Lobby & reception signs", "Dimensional wall logos", "Door & room signs", "Wayfinding & directional signs", "Office branding"],
    sortOrder: 7,
    active: true,
  },
  {
    title: "Professional Site Installation",
    slug: "professional-site-installation",
    shortDescription: "Personally measured, mounted, and aligned by Eric for a durable, clean and professional finish.",
    description:
      "A well-made sign still needs a proper install. I handle every installation myself: exterior signs, dimensional lettering, panels and vinyl graphics.\n\nEvery sign is personally measured, mounted, and aligned by Eric. Because I install the work I build, there's no hand-off to a crew who hasn't seen your project, and the finished result matches the approved design.",
    image: "/ser6.png",
    icon: "wrench",
    features: ["On-site installation", "Sign mounting", "Vinyl application", "Precise alignment", "Commercial installation"],
    sortOrder: 8,
    active: true,
  },
];

type SeedProject = Omit<PortfolioDTO, "id" | "createdAt" | "updatedAt">;

/**
 * Starter gallery covering every service. Replace these with real completed-job photos
 * from Admin > Portfolio before launch.
 */
export const DEFAULT_PORTFOLIO: SeedProject[] = [
  {
    title: "Illuminated Storefront Signage",
    slug: "illuminated-storefront-signage",
    category: "Storefront Signs",
    description: "LED-lit fascia and accent lighting that keeps a storefront visible long after dark.",
    location: "Windsor-Essex",
    image: "/hero.png",
    galleryImages: [],
    featured: true,
    sortOrder: 1,
    published: true,
  },
  {
    title: "Retail Storefront Fascia",
    slug: "retail-storefront-fascia",
    category: "Storefront Signs",
    description: "Clean fascia signage and window branding for a street-front retailer.",
    location: "Windsor-Essex",
    image: "/ser1.png",
    galleryImages: [],
    featured: true,
    sortOrder: 2,
    published: true,
  },
  {
    title: "Fleet Van Graphics",
    slug: "fleet-van-graphics",
    category: "Vehicle Graphics",
    description: "Bold partial-wrap graphics designed to be read at a glance from the road.",
    location: "Windsor-Essex",
    image: "/ser3.png",
    galleryImages: [],
    featured: true,
    sortOrder: 3,
    published: true,
  },
  {
    title: "Office Glass & Wall Graphics",
    slug: "office-glass-wall-graphics",
    category: "Window Graphics",
    description: "Frosted privacy vinyl and a branded feature wall for a professional office.",
    location: "Windsor-Essex",
    image: "/ser4.png",
    galleryImages: [],
    featured: true,
    sortOrder: 4,
    published: true,
  },
  {
    title: "Menu Boards & Interior Graphics",
    slug: "menu-boards-interior-graphics",
    category: "Commercial Graphics",
    description: "Menu boards and a large wall mural that make ordering easy and reinforce the brand.",
    location: "Windsor-Essex",
    image: "/home2.png",
    galleryImages: [],
    featured: true,
    sortOrder: 5,
    published: true,
  },
  {
    title: "Trade Show Booth Display",
    slug: "trade-show-booth-display",
    category: "Promotional Displays",
    description: "Retractable banners, a printed table throw and display graphics for an event booth.",
    location: "Windsor-Essex",
    image: "/ser5.png",
    galleryImages: [],
    featured: true,
    sortOrder: 6,
    published: true,
  },
  {
    title: "Development Site Signage",
    slug: "development-site-signage",
    category: "Site & Real Estate Signs",
    description: "Coming-soon and project information signage built for outdoor job-site exposure.",
    location: "Windsor-Essex",
    image: img("constructionSite", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 7,
    published: true,
  },
  {
    title: "Interior Wayfinding Signs",
    slug: "interior-wayfinding-signs",
    category: "Interior Signage",
    description: "Directional and room identification signs that help visitors find their way.",
    location: "Windsor-Essex",
    image: img("officeCorridor", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 8,
    published: true,
  },
  {
    title: "Commercial Sign Installation",
    slug: "commercial-sign-installation",
    category: "Installation",
    description: "An exterior sign personally measured, mounted and aligned by Eric.",
    location: "Windsor-Essex",
    image: "/ser6.png",
    galleryImages: [],
    featured: true,
    sortOrder: 9,
    published: true,
  },
  {
    title: "Street-Front Blade Sign",
    slug: "street-front-blade-sign",
    category: "Storefront Signs",
    description: "A projecting blade sign that catches foot traffic from both directions.",
    location: "Windsor-Essex",
    image: "/home1.png",
    galleryImages: [],
    featured: false,
    sortOrder: 10,
    published: true,
  },
  {
    title: "Custom Sign Design & Proofing",
    slug: "custom-sign-design-proofing",
    category: "Commercial Graphics",
    description: "Artwork, colour matching and production proofs prepared before fabrication.",
    location: "Windsor-Essex",
    image: "/ser2.png",
    galleryImages: [],
    featured: false,
    sortOrder: 11,
    published: true,
  },
  {
    title: "Dimensional Letter Fabrication",
    slug: "dimensional-letter-fabrication",
    category: "Storefront Signs",
    description: "Metal dimensional letters cut, finished and prepared in the shop before install.",
    location: "Tecumseh, ON",
    image: "/ourstory.png",
    galleryImages: [],
    featured: false,
    sortOrder: 12,
    published: true,
  },
];

type SeedPost = Omit<BlogPostDTO, "id" | "createdAt" | "updatedAt">;

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

export const DEFAULT_POSTS: SeedPost[] = [
  {
    title: "The Benefits of Investing in Professional Signage",
    slug: "benefits-of-investing-in-professional-signage",
    excerpt:
      "Your sign works 24 hours a day. After 32 years in the trade, here's why I believe a professionally made sign is one of the best-value investments a local business can make.",
    featuredImage: "/home1.png",
    category: "Signage Tips",
    author: "Eric Marmus",
    status: "published",
    featured: true,
    publishedAt: daysAgo(6),
    content: `Most marketing costs you money every month. A well-made sign is different: you pay for it once, and it keeps working every hour your business is open, and every hour it's closed.

## Your sign is your first impression

Before a customer reads a review or visits your website, many of them see your building. A faded, hard-to-read or homemade sign quietly tells people the business might be the same. A clean, professional sign tells them you take your work seriously.

## Visibility you don't pay for twice

- **Always on:** a storefront sign advertises to every car and pedestrian that passes.
- **Local reach:** it reaches the people most likely to buy, the ones already near you.
- **Long life:** quality materials and a proper install mean years of use before replacement.

## What "professional" actually means

It isn't just a nicer logo. It's the right **size for the viewing distance**, the right **contrast** so it reads in daylight and at night, and the right **materials** for Ontario weather. It's also installed level, secure and sealed, so it still looks sharp years later.

## Getting the most from your budget

Start with the sign customers see first, usually your main storefront or building sign. Then add window graphics, vehicle lettering or promotional signs to carry the same look everywhere your business shows up.

If you're planning a new sign or replacing an old one, [request a free quote](/contact) and I'll help you choose the option that gives you the most visibility for your budget.`,
  },
  {
    title: "Why Vehicle Graphics Are a Smart Marketing Tool",
    slug: "why-vehicle-graphics-are-a-smart-marketing-tool",
    excerpt:
      "Your work vehicles travel all over Windsor-Essex every day. Vehicle graphics turn that time on the road into steady, local brand exposure.",
    featuredImage: "/ser3.png",
    category: "Vehicle Graphics",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(18),
    content: `If your business uses a truck, van or car for work, you already own an advertising space. Vehicle graphics simply put it to use.

## Advertising that goes where your customers are

Contractors, trades and service businesses spend the day driving to job sites and parking in front of customers' homes. Every stop is a chance for the neighbours to see your name, your service and your phone number.

## Choosing the right option

- **Vinyl lettering:** clean and cost-effective, with your name, logo, phone and website.
- **Partial wraps:** bold printed graphics on part of the vehicle for more impact at a moderate budget.
- **Fleet branding:** one consistent design across every vehicle so your fleet is instantly recognizable.
- **Magnetic signs:** a flexible option for personal vehicles used for work.

## Keep the design simple

People see a moving vehicle for only a few seconds. The best vehicle graphics focus on three things: **who you are, what you do and how to reach you.** Large, high-contrast text beats a crowded layout every time.

## Built to last

I use durable vinyl designed for vehicles and prep every surface properly before applying it. That keeps graphics looking sharp through road salt, sun and car washes.

Ready to put your vehicles to work? [Request a free quote](/contact) with your vehicle's make and model and I'll recommend the best approach.`,
  },
  {
    title: "From Concept to Installation: How I Handle Every Sign Project",
    slug: "from-concept-to-installation-our-signage-process",
    excerpt:
      "What happens after you ask for a sign quote? A step-by-step look at how I take a project from the first conversation to the finished install, personally.",
    featuredImage: "/ourapproach.png",
    category: "How I Work",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(32),
    content: `A sign project should feel simple for you. Because I run an owner-operated shop, you deal with the same person from the first call to the final install. Here's how that works.

## 1. Consultation

I start by learning about your business, your location and what you want the sign to do. If it helps, I'll visit the site myself to measure and look at visibility, mounting surfaces and anything that could affect the install. You get honest advice on what will work best for your budget.

## 2. Design

I prepare a design proof based on your brand. If your logo is low resolution, I rebuild it as clean vector artwork. You review the proof and request changes until it's right. **Nothing goes into production until you approve it.**

## 3. Production

Once you approve it, I build your sign with commercial-grade materials suited to the location, whether that's an exterior fascia, dimensional letters, printed vinyl or a coroplast sign.

## 4. Installation

I install the finished work on site myself. Every sign is personally measured, mounted and aligned, and I clean up before I leave.

## You work with one person

There are no hand-offs between a salesperson, a designer and an install crew. The person who quotes your job is the person who designs, builds and installs it, so nothing gets lost along the way.

Have a project in mind? [Request a free quote](/contact) and I'll start with a quick conversation.`,
  },
  {
    title: "How Storefront Signs Improve Local Visibility",
    slug: "how-storefront-signs-improve-local-visibility",
    excerpt:
      "Local customers make fast decisions. A clear storefront sign helps them find you, remember you and choose you over the business next door.",
    featuredImage: "/ser1.png",
    category: "Local Marketing",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(47),
    content: `For a storefront business, being easy to find is half the battle. Your sign is the tool that makes that happen.

## Help people find you

A customer searching for your business on their phone still has to spot your building when they arrive. A clear, well-lit sign cuts down on missed turns and frustrated first visits.

## Stand out on a busy street

Plazas and main streets are crowded with signs. The ones that get noticed use:

- **Strong contrast** between the letters and background
- **Simple wording**: your name and what you do
- **Proper sizing** for the distance people view it from
- **Lighting** where evening visibility matters

## Build recognition over time

People who drive past your location every day start to recognize your name before they ever need you. When they do need your service, you're already familiar.

## Extend the look to your windows

Window graphics can share your hours, services and branding at eye level for people walking by, while the main sign stays focused on your name.

Want to see what a new storefront sign could do for your location? [Request a free quote](/contact).`,
  },
  {
    title: "Choosing the Right Materials for Outdoor Signs",
    slug: "choosing-the-right-materials-for-outdoor-signs",
    excerpt:
      "Aluminum, acrylic, coroplast or vinyl? A practical guide to outdoor sign materials that fit your budget and survive Windsor-Essex weather.",
    featuredImage: "/ourstory.png",
    category: "Materials",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(63),
    content: `The right material depends on how long the sign needs to last, where it's mounted and how it will be seen. Here's the practical overview I give customers.

## Aluminum composite panels

A popular choice for permanent exterior signs. Rigid, weather-resistant and clean-looking, aluminum composite works well for fascia signs, post-and-panel signs and building signage.

## Acrylic and dimensional letters

Acrylic and other dimensional materials add depth and a premium look. They're often used for lettering on building fronts and interior feature walls, and can be combined with lighting.

## Coroplast

Lightweight and affordable, coroplast is ideal for **short-term and temporary signs**: lawn signs, real estate signs, construction site signs and event directions.

## Vinyl banners

Outdoor banners are cost-effective for grand openings, promotions and events. A properly hemmed and grommeted banner holds up well outdoors for temporary use.

## Vinyl graphics

Cut and printed vinyl goes on windows, walls, vehicles and sign faces. The grade of vinyl makes a big difference in how long graphics last outdoors.

## Things to consider

- **Lifespan:** is this a permanent sign or a seasonal promotion?
- **Exposure:** full sun, wind and road spray all affect the choice.
- **Visibility:** will the sign need lighting for evening hours?
- **Budget:** I'll always explain the trade-offs honestly.

Not sure which material fits your project? [Request a free quote](/contact) and I'll recommend the right option.`,
  },
];

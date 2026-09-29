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
    "Custom storefront signs, vehicle graphics, window vinyl and professional sign installation for businesses in Windsor, Tecumseh and Essex County. 32+ years of experience. Request a free quote.",
};

type SeedService = Omit<ServiceDTO, "id" | "updatedAt">;

export const DEFAULT_SERVICES: SeedService[] = [
  {
    title: "Storefront & Commercial Signage",
    slug: "storefront-commercial-signage",
    shortDescription:
      "Eye-catching outdoor business signs, storefront fascia, dimensional lettering, and illuminated building signs designed to maximize visibility.",
    description:
      "Your storefront sign is often the first impression a customer has of your business. We design and build exterior signage that is sized for the viewing distance, readable from the road and built to handle Windsor-Essex weather year after year. From a clean fascia panel to dimensional lettering and illuminated building signs, every sign is produced with commercial-grade materials and installed by our own team.",
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
      "Great signage starts with artwork that is built for production. We take your existing logo, rough idea or reference photo and turn it into clean, production-ready graphics. That includes vectorizing low-resolution logos, setting up large-format layouts, matching brand colours and preparing proofs you can approve before anything is printed or cut.",
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
      "High-durability vinyl lettering, partial wraps, magnetic signs, and fleet graphics that turn company vehicles into mobile advertising.",
    description:
      "Your vehicles are on the road every day — they should be working for your business. We design and apply vehicle lettering, partial wraps and fleet branding using durable cast vinyl made for real-world wear. Need flexibility? Magnetic vehicle signs let you brand a personal vehicle without a permanent install. Fleet programs keep every truck and van consistent.",
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
      "Windows, walls and floors are some of the most valuable branding space you have. We produce frosted privacy vinyl for offices and clinics, full-colour window displays for retail, large interior wall graphics and murals, and slip-resistant floor graphics for wayfinding and promotions. Everything is measured on site and applied cleanly for a professional finish.",
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
      "When you need visibility fast, promotional signage delivers. We print coroplast lawn signs, real estate and construction site signs, outdoor vinyl banners, A-frame sidewalk boards and retractable banners for trade shows and events. Ideal for grand openings, open houses, job sites, sponsorships and seasonal promotions.",
    image: "/ser5.png",
    icon: "megaphone",
    features: ["Coroplast lawn signs", "Real estate signs", "Construction signage", "Outdoor banners", "A-frame boards", "Retractable banners"],
    sortOrder: 5,
    active: true,
  },
  {
    title: "Professional Site Installation",
    slug: "professional-site-installation",
    shortDescription: "Complete on-site sign and graphics installation for a durable, clean and professional finish.",
    description:
      "A well-made sign still needs a proper install. Our team handles on-site installation for exterior signs, dimensional lettering, panels and vinyl graphics, with careful measuring, secure mounting and precise alignment. We install the work we produce, so the finished result matches the approved design and holds up for the long term.",
    image: "/ser6.png",
    icon: "wrench",
    features: ["On-site installation", "Sign mounting", "Vinyl application", "Alignment", "Commercial installation"],
    sortOrder: 6,
    active: true,
  },
];

type SeedProject = Omit<PortfolioDTO, "id" | "createdAt" | "updatedAt">;

/** Placeholder entries. Replace them with real client project photos from Admin > Portfolio. */
export const DEFAULT_PORTFOLIO: SeedProject[] = [
  {
    title: "Illuminated Interior Lettering",
    slug: "illuminated-interior-lettering",
    category: "Storefront Signs",
    description: "Dimensional lettering with integrated lighting to create a bold focal point for a hospitality space.",
    location: "Windsor, ON",
    image: img("illuminatedLettering", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 1,
    published: true,
  },
  {
    title: "Retail Storefront Signage",
    slug: "retail-storefront-signage",
    category: "Storefront Signs",
    description: "Fascia signage and window graphics that give a street-front retailer a clean, recognizable presence.",
    location: "Tecumseh, ON",
    image: img("storefrontWindow", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 2,
    published: true,
  },
  {
    title: "Full-Coverage Vehicle Graphics",
    slug: "full-coverage-vehicle-graphics",
    category: "Vehicle Graphics",
    description: "High-impact printed vinyl graphics designed to be read at a glance from the road.",
    location: "Essex County, ON",
    image: img("wrappedBus", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 3,
    published: true,
  },
  {
    title: "Frosted Office Privacy Film",
    slug: "frosted-office-privacy-film",
    category: "Window Graphics",
    description: "Frosted privacy vinyl on glass partitions — privacy for meeting rooms without losing natural light.",
    location: "Windsor, ON",
    image: img("officeGlass", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 4,
    published: true,
  },
  {
    title: "Menu Boards & Interior Graphics",
    slug: "menu-boards-interior-graphics",
    category: "Commercial Graphics",
    description: "Branded menu boards and interior graphics that make ordering easy and reinforce the brand.",
    location: "Lakeshore, ON",
    image: "/home2.png",
    galleryImages: [],
    featured: true,
    sortOrder: 5,
    published: true,
  },
  {
    title: "Event & Conference Displays",
    slug: "event-conference-displays",
    category: "Promotional Displays",
    description: "Retractable banners and printed displays prepared for a corporate event and speaker stage.",
    location: "Windsor, ON",
    image: img("conferenceHall", 1200),
    galleryImages: [],
    featured: true,
    sortOrder: 6,
    published: true,
  },
  {
    title: "Commercial Sign Installation",
    slug: "commercial-sign-installation",
    category: "Installation",
    description: "On-site mounting and wiring coordination for a commercial exterior sign.",
    location: "LaSalle, ON",
    image: img("installer", 1200),
    galleryImages: [],
    featured: false,
    sortOrder: 7,
    published: true,
  },
  {
    title: "Fleet Truck Lettering",
    slug: "fleet-truck-lettering",
    category: "Vehicle Graphics",
    description: "Consistent fleet lettering and DOT-style identification applied across a commercial truck fleet.",
    location: "Essex County, ON",
    image: img("fleetTruck", 1200),
    galleryImages: [],
    featured: false,
    sortOrder: 8,
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
      "Your sign works 24 hours a day. Here is why a professionally designed and installed sign is one of the best-value marketing investments a local business can make.",
    featuredImage: img("streetStorefront", 1600),
    category: "Signage Tips",
    author: "Eric Marmus",
    status: "published",
    featured: true,
    publishedAt: daysAgo(6),
    content: `Most marketing costs you money every month. A well-made sign is different: you pay for it once, and it keeps working every hour your business is open — and every hour it is closed.

## Your sign is your first impression

Before a customer reads a review or visits your website, many of them see your building. A faded, hard-to-read or homemade sign quietly tells people the business might be the same. A clean, professional sign tells them you take your work seriously.

## Visibility you do not pay for twice

- **Always on:** a storefront sign advertises to every car and pedestrian that passes.
- **Local reach:** it reaches the people most likely to buy — the ones already near you.
- **Long life:** quality materials and proper installation mean years of use before replacement.

## What "professional" actually means

Professional signage is not just a nicer logo. It is the right **size for the viewing distance**, the right **contrast** so it reads in daylight and at night, and the right **materials** for Ontario weather. It is also installed level, secure and sealed, so it still looks sharp years later.

## Getting the most from your budget

Start with the sign that customers see first — usually your main storefront or building sign. Then add window graphics, vehicle lettering or promotional signs to extend the same look everywhere your business shows up.

If you are planning a new sign or updating an old one, [request a free quote](/contact) and we will help you choose the option that gives you the most visibility for your budget.`,
  },
  {
    title: "Why Vehicle Graphics Are a Smart Marketing Tool",
    slug: "why-vehicle-graphics-are-a-smart-marketing-tool",
    excerpt:
      "Company vehicles travel all over Windsor-Essex every day. Vehicle graphics turn that time on the road into consistent, local brand exposure.",
    featuredImage: img("wrappedBus", 1600),
    category: "Vehicle Graphics",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(18),
    content: `If your business uses a truck, van or car for work, you already own an advertising space. Vehicle graphics simply put it to use.

## Advertising that goes where your customers are

Contractors, trades and service businesses spend their day driving to job sites and parking in front of customers' homes. Every stop is a chance for neighbours to see your name, your service and your phone number.

## Choosing the right option

- **Vinyl lettering:** clean and cost-effective — your name, logo, phone and website.
- **Partial wraps:** bold printed graphics on part of the vehicle for more impact at a moderate budget.
- **Fleet branding:** a consistent design applied across every vehicle so your fleet is instantly recognizable.
- **Magnetic signs:** a flexible option for personal vehicles used for work.

## Keep the design simple

People see a moving vehicle for only a few seconds. The best vehicle graphics focus on three things: **who you are, what you do and how to reach you.** Large, high-contrast text beats a crowded layout every time.

## Built to last

We use durable vinyl designed for vehicles, and we prepare surfaces properly before application. That helps graphics stay looking sharp through road salt, sun and car washes.

Ready to put your vehicles to work? [Request a free quote](/contact) with your vehicle's make and model and we will recommend the best approach.`,
  },
  {
    title: "From Concept to Installation: Our Signage Process",
    slug: "from-concept-to-installation-our-signage-process",
    excerpt:
      "What actually happens after you ask for a sign quote? A step-by-step look at how we take a project from the first conversation to a finished install.",
    featuredImage: img("blueprint", 1600),
    category: "Our Process",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(32),
    content: `A good sign project should feel simple for the customer. Here is how we keep it that way, from the first call to the final install.

## 1. Consultation

We start by learning about your business, your location and what you want the sign to do. If it helps, we visit the site to measure and look at visibility, mounting surfaces and any restrictions. You get honest advice on what will work best for your budget.

## 2. Design

Our team prepares a design proof based on your brand. If your logo is low resolution, we rebuild it as clean vector artwork. You review the proof and request changes until it is right. **Nothing goes into production until you approve it.**

## 3. Production

Once approved, your sign is produced with commercial-grade materials suited to the location — whether that is an exterior fascia, dimensional letters, printed vinyl or a coroplast sign.

## 4. Installation

Our team installs the finished work on site. We check alignment, mount securely and clean up afterward, so you are left with a professional result.

## One team, start to finish

Because design, production and installation are handled together, there are no hand-offs between different companies and fewer chances for something to get missed.

Have a project in mind? [Request a free quote](/contact) and we will start with a quick conversation.`,
  },
  {
    title: "How Storefront Signs Improve Local Visibility",
    slug: "how-storefront-signs-improve-local-visibility",
    excerpt:
      "Local customers make fast decisions. A clear storefront sign helps them find you, remember you and choose you over the business next door.",
    featuredImage: img("storefrontWindow", 1600),
    category: "Local Marketing",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(47),
    content: `For a storefront business, being easy to find is half the battle. Your sign is the tool that makes that happen.

## Help people find you

A customer searching for your business on their phone still has to spot your building when they arrive. A clear, well-lit sign reduces missed turns and frustrated first visits.

## Stand out on a busy street

Plazas and main streets are crowded with signs. The ones that get noticed use:

- **Strong contrast** between the letters and background
- **Simple wording** — your name and what you do
- **Proper sizing** for the distance people view it from
- **Lighting** where evening visibility matters

## Build recognition over time

People who drive past your location every day start to recognize your name, even before they need you. When they do need your service, you are already familiar.

## Extend the look to your windows

Window graphics can share your hours, services and branding at eye level for people walking by, while keeping the main sign focused on your name.

Want to see what a new storefront sign could do for your location? [Request a free quote](/contact).`,
  },
  {
    title: "Choosing the Right Materials for Outdoor Signs",
    slug: "choosing-the-right-materials-for-outdoor-signs",
    excerpt:
      "Aluminum, acrylic, coroplast or vinyl? A practical guide to choosing outdoor sign materials that fit your budget and survive Windsor-Essex weather.",
    featuredImage: img("fabrication", 1600),
    category: "Materials",
    author: "Eric Marmus",
    status: "published",
    featured: false,
    publishedAt: daysAgo(63),
    content: `The right material depends on how long the sign needs to last, where it is mounted and how it will be seen. Here is a practical overview.

## Aluminum composite panels

A popular choice for permanent exterior signs. Rigid, weather-resistant and clean-looking, aluminum composite panels work well for fascia signs, post-and-panel signs and building signage.

## Acrylic and dimensional letters

Acrylic and other dimensional materials add depth and a premium look. They are often used for lettering on building fronts and interior feature walls, and can be combined with lighting.

## Coroplast

Lightweight and affordable, coroplast is ideal for **short-term and temporary signs** — lawn signs, real estate signs, construction site signs and event directions.

## Vinyl banners

Outdoor banners are cost-effective for grand openings, promotions and events. Properly hemmed and grommeted banners hold up well outdoors for temporary use.

## Vinyl graphics

Cut and printed vinyl is used on windows, walls, vehicles and sign faces. Choosing the right grade of vinyl makes a big difference in how long graphics last outdoors.

## Things to consider

- **Lifespan:** is this a permanent sign or a seasonal promotion?
- **Exposure:** full sun, wind and road spray all affect material choice.
- **Visibility:** will the sign need lighting for evening hours?
- **Budget:** we will always explain the trade-offs honestly.

Not sure which material fits your project? [Request a free quote](/contact) and we will recommend the right option.`,
  },
];

# Signs & Designs by Eric — Website + Admin

Lead-generation website and content admin for Signs & Designs by Eric (Tecumseh / Windsor / Essex County).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · MongoDB Atlas + Mongoose · JWT session cookies (jose) · lucide-react icons. Built for Vercel serverless.

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local
npm run hash-password -- "YourStrongPassword"   # copy the escaped line into .env.local
npm run dev
```

Fill `.env.local`:

| Variable | What it is |
| --- | --- |
| `MONGODB_URI` | Atlas connection string (include the database name, e.g. `.../signs-designs`) |
| `ADMIN_EMAIL` | The admin login email |
| `ADMIN_PASSWORD_HASH` | bcrypt hash from `npm run hash-password`. In `.env.local`, every `$` must be written as `\$` (the script prints this form) |
| `SESSION_SECRET` | Random string, 32+ characters |
| `NEXT_PUBLIC_SITE_URL` | Public URL, e.g. `https://www.example.com` |

> **Windows note:** the npm scripts call the tools through `node` directly, because the `&` in this folder name breaks npm's Windows command shims. This works the same on Vercel.

On first connection the database is seeded **once** (6 services, placeholder portfolio projects, 5 blog posts, page content and site settings). The seed never runs again, so admin edits and deletions are never overwritten by a deploy.

## 2. Deploy to Vercel

1. In MongoDB Atlas > Network Access, allow `0.0.0.0/0` (Vercel uses dynamic IPs).
2. Import the repo in Vercel (framework: Next.js, defaults are fine).
3. Add the five environment variables. **Paste the raw password hash (no backslashes) in the Vercel dashboard.**
4. Deploy. Admin is at `/admin`.

## 3. Admin panel

| Section | What it does |
| --- | --- |
| Dashboard | Quote-request counts, new inquiries, portfolio and blog totals, recent requests |
| Portfolio | Add / edit / delete projects, main image + gallery, category, location, featured, sort order, publish |
| Services | Edit title, descriptions, image, icon, features, display order, active/inactive |
| Blog | Draft, publish, unpublish, feature, Markdown editor with preview |
| Pages | Edit Home, About, Services, Contact and Blog headlines, copy and images |
| Quote Requests | Table with status filters, detail view, status updates, private notes, attachment view/download |
| Media | All stored images, folder / usage filters, copy URL, delete unused images, upload to library |
| Settings | Business name, phone, email, address, Facebook, logo, favicon, homepage SEO |

**Before launch:** replace the placeholder portfolio projects with real client photos (Admin > Portfolio), and optionally upload the official logo (Admin > Settings). A built-in SVG wordmark is used until then.

## 4. How images are stored (Vercel-safe)

- Admin uploads go to `POST /api/upload` and are saved as binary in the `StoredUpload` MongoDB collection. Nothing is written to disk.
- Content documents store only the URL, e.g. `/api/uploads/gallery/1760000000000-a91f2c9d.webp`, served by `GET /api/uploads/[folder]/[filename]` with immutable caching. URLs keep working across redeploys.
- Replaced or removed images are deleted **only after** the content update succeeds, and never while another record still uses them.
- Vercel limits request bodies to about 4.5 MB. Images up to the 8 MB limit are resized and converted to WebP in the browser before upload. GIFs (animation) and customer PDFs must be under 4 MB; larger PDFs can be emailed.
- Customer quote attachments are stored separately (`QuoteAttachment`) and are only viewable by a signed-in admin. Unsubmitted uploads expire automatically after 3 hours.

## 5. Security

- HTTP-only, `SameSite=Lax`, `Secure` (production) session cookie, 8-hour expiry. Changing `ADMIN_EMAIL` or `SESSION_SECRET` signs everyone out.
- `proxy.ts` protects `/admin/**`, `/api/admin/**` and `/api/upload`; every route handler re-checks the session. Cross-origin write requests are rejected.
- Login and quote endpoints are rate limited (MongoDB-backed, so limits apply across serverless instances).
- Uploads: folder whitelist, MIME whitelist, file-signature (magic byte) check, 8 MB cap, generated filenames, traversal-safe paths. SVG uploads are rejected.
- Quote form: client and server validation, honeypot field, minimum fill time.
- Blog Markdown renders to React elements, so HTML/script in content is never executed. Only `http(s)`, `mailto`, `tel` and relative links are allowed.

## 6. Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run hash-password -- "pw"` | Generate `ADMIN_PASSWORD_HASH` |

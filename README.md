# Fantastic Stays

Luxury villa rental website for Goa — rebuilt in **Next.js + Tailwind CSS** from the client’s live design references.

## Run locally

```bash
npm install
npm run build
npx next start --hostname 127.0.0.1 --port 3000
```

Or for development:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home (hero search, featured villas, locations, occasions, FAQ, CTAs) |
| `/villas` | Listing with filters, sorting, neighbourhood browse |
| `/villas/[slug]` | Villa detail (gallery, amenities, reviews, sticky booking card) |
| `/locations` | Locations grid |
| `/experiences` | Experiences |
| `/about` | About |
| `/contact` | Enquiry form (+ WhatsApp) |

## Design system

- Brand: **Fantastic Stays**
- Colors: forest `#172c23`, gold `#c49a5a`, ivory `#fcfaf8`, beige
- Fonts: Cormorant Garamond (display) + Inter (body)
- Scroll reveal animations + hover image zooms

## Note on images

Exact images from the client demo sites are saved locally in `public/images/demo/` (Base44 CDN blocks hotlinking, so files are downloaded into the project).

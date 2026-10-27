import { cache } from "react";
import {
  BRAND_ADDRESS_LINES,
  BRAND_EMAIL,
  BRAND_PHONE_DISPLAY,
  BRAND_TAGLINE,
  BRAND_WA_HREF,
} from "@/lib/brand";
import {
  AMENITY_FILTERS,
  getVilla as getStaticVilla,
  images,
  locations as staticLocations,
  occasions as staticOccasions,
  villas as staticVillas,
  type GoaLocation,
  type GuestReview,
  type PublicReview,
  type Villa,
  type VillaAttraction,
  type VillaFaq,
  type VillaRoom,
  type VillaVideo,
} from "@/data/villas";

const API_BASE = process.env.VILLA_API_URL || "http://127.0.0.1:8000/api/v1";
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

function mediaUrl(path: string) {
  if (!path) return path;
  if (path.startsWith("/storage/")) return `${API_ORIGIN}${path}`;
  try {
    const url = new URL(path);
    if (url.pathname.startsWith("/storage/")) return `${API_ORIGIN}${url.pathname}`;
  } catch {
    /* relative site images stay as they are */
  }
  return path;
}

type RawRecord = Record<string, unknown>;

export type VillaCatalog = {
  villas: Villa[];
  amenityCounts: Record<string, number>;
  total: number;
  priceMin: number;
  priceMax: number;
};

export type HomeOccasion = {
  title: string;
  desc: string;
  image: string;
};

export type WhyChoosePoint = {
  title: string;
  desc: string;
  icon: string;
};

export type HomeStat = {
  value: string;
  label: string;
  source: "manual" | "villas" | "locations" | "rating";
};

export type HomepageSections = {
  experiences: {
    eyebrow: string;
    heading: string;
    note: string;
    items: { title: string; desc: string }[];
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
    image: string;
    ratingCaption: string;
    stats: HomeStat[];
  };
  inspiration: {
    eyebrow: string;
    heading: string;
    items: { date: string; title: string; excerpt: string }[];
  };
  faqs: {
    eyebrow: string;
    heading: string;
    items: { q: string; a: string }[];
  };
};

export type HomeVillaData = {
  featured: Villa[];
  locations: GoaLocation[];
  occasions: HomeOccasion[];
  whyChoose: WhyChoosePoint[];
  amenities: string[];
  reviews: PublicReview[];
  homepage: HomepageSections;
  total: number;
  averageRating: number;
};

function num(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function str(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function strOrNull(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function discountLabel(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return String(value);
  return strOrNull(value);
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function asRecord(value: unknown): RawRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as RawRecord;
}

const DESCRIPTION_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "br",
  "hr",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "a",
  "img",
  "blockquote",
  "span",
  "div",
  "figure",
  "figcaption",
]);

function htmlAttr(source: string, name: string) {
  const match = source.match(
    new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i")
  );
  return (match?.[2] ?? match?.[3] ?? match?.[4] ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function safeDescriptionUrl(value: string) {
  const url = value.trim();
  if (!url || /^javascript:/i.test(url) || /^data:/i.test(url)) return "";
  if (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return mediaUrl(url);
  }
  return "";
}

export function villaDescriptionHtml(input: string) {
  if (!/<[a-z][\s\S]*>/i.test(input)) return "";
  const withoutDanger = input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  return withoutDanger.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!DESCRIPTION_TAGS.has(tag)) return "";
    if (match.startsWith("</")) return tag === "br" || tag === "hr" || tag === "img" ? "" : `</${tag}>`;
    if (tag === "br" || tag === "hr") return `<${tag} />`;

    let attrs = "";
    if (tag === "a") {
      const href = safeDescriptionUrl(htmlAttr(rawAttrs, "href"));
      if (href) attrs += ` href="${escapeAttr(href)}"`;
      if (htmlAttr(rawAttrs, "target") === "_blank") {
        attrs += ` target="_blank" rel="noopener noreferrer"`;
      }
    }
    if (tag === "img") {
      const src = safeDescriptionUrl(htmlAttr(rawAttrs, "src"));
      if (!src) return "";
      attrs += ` src="${escapeAttr(src)}" alt="${escapeAttr(htmlAttr(rawAttrs, "alt"))}"`;
    }
    if (tag === "td" || tag === "th") {
      const colspan = htmlAttr(rawAttrs, "colspan");
      const rowspan = htmlAttr(rawAttrs, "rowspan");
      if (/^\d+$/.test(colspan)) attrs += ` colspan="${colspan}"`;
      if (/^\d+$/.test(rowspan)) attrs += ` rowspan="${rowspan}"`;
    }
    return `<${tag}${attrs}>`;
  });
}

export function descriptionParagraphs(input: string): string[] {
  const text = input
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  const parts = text
    .split(/\n{2,}/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return parts;
}

export function houseRuleLabel(key: string) {
  const labels: Record<string, string> = {
    check_in: "Check-in",
    check_out: "Check-out",
    cancellation: "Cancellation",
    deposit: "Security Deposit",
    pets: "Pet Policy",
    parties: "Parties & Events",
    smoking: "Smoking",
    quiet_hours: "Quiet Hours",
    child_policy: "Child Policy",
    identification: "Identification",
  };
  return (
    labels[key] ||
    key
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

export function villaHasPool(villa: Pick<Villa, "amenities" | "amenityKeys">) {
  return (
    villa.amenityKeys?.includes("pool") ||
    villa.amenities.some((item) => /pool/i.test(item))
  );
}

function normalizeRoom(raw: unknown): VillaRoom | null {
  const row = asRecord(raw);
  if (!row) return null;
  const name = str(row.room_name);
  if (!name) return null;
  return {
    id: num(row.id),
    room_name: name,
    bed_type: str(row.bed_type, "Bed"),
    image: str(row.image) ? mediaUrl(str(row.image)) : null,
    ensuite_bath: Boolean(row.ensuite_bath),
    description: strOrNull(row.description),
  };
}

function locationProfile(raw: unknown) {
  const row = asRecord(raw);
  if (!row || !str(row.name)) return null;
  const image = str(row.image);
  return {
    name: str(row.name),
    region: str(row.region),
    heading: strOrNull(row.heading),
    description: strOrNull(row.description),
    image: image ? mediaUrl(image) : null,
    places: Array.isArray(row.places)
      ? row.places.map(normalizeAttraction).filter((item): item is VillaAttraction => Boolean(item))
      : [],
  };
}

function normalizeAttraction(raw: unknown): VillaAttraction | null {
  const row = asRecord(raw);
  if (!row || !str(row.name)) return null;
  return {
    id: num(row.id),
    name: str(row.name),
    distance: str(row.distance),
    category: str(row.category),
  };
}

function normalizeReview(raw: unknown): GuestReview | null {
  const row = asRecord(raw);
  if (!row || !str(row.comment) || !str(row.guest_name)) return null;
  return {
    id: num(row.id),
    guest_name: str(row.guest_name),
    guest_location: strOrNull(row.guest_location),
    rating: num(row.rating),
    comment: str(row.comment),
    stay_date: strOrNull(row.stay_date),
    cleanliness_rating: row.cleanliness_rating == null ? null : num(row.cleanliness_rating),
    accuracy_rating: row.accuracy_rating == null ? null : num(row.accuracy_rating),
    communication_rating:
      row.communication_rating == null ? null : num(row.communication_rating),
    location_rating: row.location_rating == null ? null : num(row.location_rating),
    value_rating: row.value_rating == null ? null : num(row.value_rating),
  };
}

function normalizeFaq(raw: unknown): VillaFaq | null {
  const row = asRecord(raw);
  if (!row || !str(row.question) || !str(row.answer)) return null;
  return {
    id: num(row.id),
    villa_id: row.villa_id == null ? null : num(row.villa_id),
    question: str(row.question),
    answer: str(row.answer),
  };
}

function normalizeVideo(raw: unknown): VillaVideo | null {
  const row = asRecord(raw);
  if (!row) return null;
  const embed = str(row.embed || row.url);
  if (!embed) return null;
  const source = str(row.source);
  const thumb = str(row.thumb || row.image);
  return {
    id: String(row.id ?? embed),
    title: str(row.title, "Villa video"),
    thumb: thumb ? mediaUrl(thumb) : "",
    embed,
    source:
      source === "instagram" || source === "youtube" || source === "tour"
        ? source
        : undefined,
  };
}

function amenityGroups(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = asRecord(item);
      const title = str(row?.title);
      if (!title) return null;
      return { title, items: strList(row?.items) };
    })
    .filter((item): item is { title: string; items: string[] } => Boolean(item));
}

function villaServices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = asRecord(item);
      const name = str(row?.name);
      if (!name) return null;
      return { name, included: Boolean(row?.included) };
    })
    .filter((item): item is { name: string; included: boolean } => Boolean(item));
}

function normalizeVilla(raw: unknown, includeSimilar = true): Villa | null {
  const row = asRecord(raw);
  if (!row || !str(row.slug) || !str(row.name)) return null;

  const gallery = strList(row.gallery).map((item) => mediaUrl(item));
  const image = mediaUrl(str(row.image) || gallery[0] || images.hero);
  const rules = asRecord(row.houseRules);
  const houseRules = rules
    ? Object.fromEntries(
        Object.entries(rules)
          .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0)
          .map(([key, value]) => [key, value])
      )
    : null;

  const similarRaw = includeSimilar && Array.isArray(row.similarVillas) ? row.similarVillas : [];

  return {
    id: String(row.id ?? row.slug),
    slug: str(row.slug),
    name: str(row.name),
    location: str(row.location),
    locationSlug: strOrNull(row.locationSlug ?? row.location_slug),
    region: str(row.region, "North Goa"),
    price: num(row.price),
    discountPercent: discountLabel(row.discountPercent ?? row.discount_percent),
    bedrooms: num(row.bedrooms),
    bathrooms: num(row.bathrooms),
    guests: num(row.guests),
    beds: num(row.beds),
    sleepHeading: strOrNull(row.sleepHeading ?? row.sleep_heading),
    sleepIntro: strOrNull(row.sleepIntro ?? row.sleep_intro),
    amenityEyebrow: strOrNull(row.amenityEyebrow ?? row.amenity_eyebrow),
    amenityHeading: strOrNull(row.amenityHeading ?? row.amenity_heading),
    amenityGroups: amenityGroups(row.amenityGroups ?? row.amenity_groups),
    servicesEyebrow: strOrNull(row.servicesEyebrow ?? row.services_eyebrow),
    servicesHeading: strOrNull(row.servicesHeading ?? row.services_heading),
    servicesIntro: strOrNull(row.servicesIntro ?? row.services_intro),
    services: villaServices(row.services),
    rating: num(row.rating),
    reviews: num(row.reviews),
    badge: strOrNull(row.badge) ?? undefined,
    listingBadges: strList(row.listingBadges),
    amenityKeys: strList(row.amenityKeys),
    propertyType: strOrNull(row.propertyType ?? row.property_type),
    instantBooking: Boolean(row.instantBooking),
    amenities: strList(row.amenities),
    tags: strList(row.tags),
    image,
    gallery: gallery.length ? gallery : [image],
    videos: Array.isArray(row.videos)
      ? row.videos.map(normalizeVideo).filter((video): video is VillaVideo => Boolean(video))
      : [],
    shortDescription: str(row.shortDescription),
    description: str(row.description),
    featured: Boolean(row.featured),
    checkInTime: strOrNull(row.checkInTime),
    checkOutTime: strOrNull(row.checkOutTime),
    address: strOrNull(row.address),
    locationProfile: locationProfile(row.locationProfile),
    houseRules,
    rooms: Array.isArray(row.rooms)
      ? row.rooms.map(normalizeRoom).filter((room): room is VillaRoom => Boolean(room))
      : [],
    attractions: Array.isArray(row.attractions)
      ? row.attractions
          .map(normalizeAttraction)
          .filter((item): item is VillaAttraction => Boolean(item))
      : [],
    guestReviews: Array.isArray(row.guestReviews)
      ? row.guestReviews
          .map(normalizeReview)
          .filter((item): item is GuestReview => Boolean(item))
      : [],
    faqs: Array.isArray(row.faqs)
      ? row.faqs.map(normalizeFaq).filter((item): item is VillaFaq => Boolean(item))
      : [],
    similar: similarRaw
      .map((item) => normalizeVilla(item, false))
      .filter((item): item is Villa => Boolean(item)),
    metaTitle: strOrNull(row.metaTitle ?? row.meta_title),
    metaDescription: strOrNull(row.metaDescription ?? row.meta_description),
  };
}

function countAmenities(list: Villa[]) {
  const counts: Record<string, number> = {};
  for (const filter of AMENITY_FILTERS) {
    counts[filter.key] = list.filter((villa) => {
      if (filter.key === "instant") return Boolean(villa.instantBooking);
      if (villa.amenityKeys?.includes(filter.key)) return true;
      const blob = `${villa.amenities.join(" ")} ${villa.tags.join(" ")}`.toLowerCase();
      if (filter.key === "pool") return /pool/.test(blob);
      if (filter.key === "beach") return /beach/.test(blob);
      if (filter.key === "pet") return /pet/.test(blob);
      if (filter.key === "chef") return /chef/.test(blob);
      if (filter.key === "hk") return /housekeep/.test(blob);
      if (filter.key === "family") return /family/.test(blob);
      if (filter.key === "event") return /event|celebration|wedding/.test(blob);
      if (filter.key === "sea") return /sea/.test(blob);
      return false;
    }).length;
  }
  return counts;
}

function priceBounds(list: Villa[]) {
  if (!list.length) return { priceMin: 15000, priceMax: 90000 };
  const prices = list.map((villa) => villa.price).filter((price) => price > 0);
  if (!prices.length) return { priceMin: 15000, priceMax: 90000 };
  const min = Math.floor(Math.min(...prices) / 100) * 100;
  const max = Math.ceil(Math.max(...prices) / 100) * 100;
  return {
    priceMin: min,
    priceMax: max <= min ? min + 1000 : max,
  };
}

function staticCatalog(): VillaCatalog {
  const bounds = priceBounds(staticVillas);
  return {
    villas: staticVillas,
    amenityCounts: countAmenities(staticVillas),
    total: staticVillas.length,
    ...bounds,
  };
}

async function readJson(path: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Villa API ${path} returned ${response.status}`);
  }
  return (await response.json()) as RawRecord;
}

function toPublicReview(raw: unknown): PublicReview | null {
  const review = normalizeReview(raw);
  if (!review) return null;
  const row = asRecord(raw);
  const villa = asRecord(row?.villa);
  const stayName = str(villa?.name);
  const stayPlace = str(villa?.location);
  return {
    id: review.id,
    quote: review.comment,
    name: review.guest_name,
    place: review.guest_location || "Guest",
    stay: stayName
      ? `Stayed at ${stayName}${stayPlace ? `, ${stayPlace}` : ""}`
      : review.stay_date || "Verified stay",
    initial: review.guest_name.trim().charAt(0).toUpperCase() || "G",
    rating: review.rating,
    tag: review.rating >= 4.8 ? "GUEST FAVOURITE" : "VERIFIED",
  };
}

export const getVillaCatalog = cache(async (): Promise<VillaCatalog> => {
  try {
    const json = await readJson("/villas?per_page=100");
    const villas = Array.isArray(json.data)
      ? json.data
          .map((item) => normalizeVilla(item, false))
          .filter((villa): villa is Villa => Boolean(villa))
      : [];
    if (!villas.length) return staticCatalog();
    const counts = asRecord(json.amenityCounts);
    const amenityCounts = counts
      ? Object.fromEntries(
          AMENITY_FILTERS.map((filter) => [filter.key, num(counts[filter.key])])
        )
      : countAmenities(villas);
    const meta = asRecord(json.meta);
    const bounds = priceBounds(villas);
    return {
      villas,
      amenityCounts,
      total: meta ? num(meta.total, villas.length) : villas.length,
      ...bounds,
    };
  } catch {
    return staticCatalog();
  }
});

export const getPlacementVillas = cache(async (placement: "sale" | "list"): Promise<Villa[]> => {
  const query = placement === "sale" ? "for_sale=1" : "for_list=1";
  try {
    const json = await readJson(`/villas?per_page=100&${query}`);
    return Array.isArray(json.data)
      ? json.data
          .map((item) => normalizeVilla(item, false))
          .filter((villa): villa is Villa => Boolean(villa))
      : [];
  } catch {
    return [];
  }
});

export const getFeaturedVillas = cache(async (): Promise<Villa[]> => {
  try {
    const json = await readJson("/featured-villas");
    const villas = Array.isArray(json.data)
      ? json.data
          .map((item) => normalizeVilla(item, false))
          .filter((villa): villa is Villa => Boolean(villa))
      : [];
    if (villas.length) return villas.slice(0, 6);
  } catch {
    /* fall through to the published catalog */
  }
  const catalog = await getVillaCatalog();
  return catalog.villas.filter((villa) => villa.featured).slice(0, 6);
});

export const getVillaBySlug = cache(async (slug: string): Promise<Villa | null> => {
  try {
    const response = await fetch(`${API_BASE}/villas/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Villa API detail returned ${response.status}`);
    const json = (await response.json()) as RawRecord;
    return normalizeVilla(json.data);
  } catch {
    return getStaticVilla(slug) ?? null;
  }
});

export const getLocations = cache(async (): Promise<GoaLocation[]> => {
  try {
    const json = await readJson("/locations");
    const locations = Array.isArray(json.data)
      ? json.data
          .map((item): GoaLocation | null => {
            const row = asRecord(item);
            if (!row || !str(row.name)) return null;
            const image = str(row.image);
            return {
              name: str(row.name),
              slug: str(row.slug, str(row.name).toLowerCase()),
              region: str(row.region),
              image: mediaUrl(image) || images.listingHeroSmall,
              description: str(row.description),
              count: num(row.villas_count),
              pageType: str(row.pageType || row.page_type, "listing"),
              href: str(row.href),
              detailHeading: str(row.detail_heading || row.detailHeading),
              metaTitle: str(row.metaTitle || row.meta_title),
              metaDescription: str(row.metaDescription || row.meta_description),
              metaKeywords: str(row.metaKeywords || row.meta_keywords),
            } satisfies GoaLocation;
          })
          .filter((item): item is GoaLocation => item !== null)
      : [];
    if (locations.length) return locations;
  } catch {
    /* static neighbourhood cards keep the homepage usable */
  }
  return staticLocations.map((location) => ({
    name: location.name,
    slug: location.name.toLowerCase().replace(/\s+/g, "-"),
    region: location.name === "South Goa" ? "South Goa" : "North Goa",
    image: location.image,
    description: "",
    count: location.count,
  }));
});

export const getPublicReviews = cache(async (): Promise<PublicReview[]> => {
  try {
    const json = await readJson("/reviews");
    if (!Array.isArray(json.data)) return [];
    return json.data
      .map(toPublicReview)
      .filter((review): review is PublicReview => Boolean(review));
  } catch {
    return [];
  }
});

export const getOccasions = cache(async (): Promise<HomeOccasion[]> => {
  try {
    const json = await readJson("/occasions");
    const occasions = Array.isArray(json.data)
      ? json.data
          .map((item) => {
            const row = asRecord(item);
            const title = str(row?.title);
            if (!row || !title) return null;
            const image = mediaUrl(str(row.image));
            return {
              title,
              desc: str(row.description),
              image: image || images.listingHeroSmall,
            } satisfies HomeOccasion;
          })
          .filter((item): item is HomeOccasion => Boolean(item))
      : [];
    if (occasions.length) return occasions;
  } catch {
    /* static occasion cards keep the homepage usable */
  }
  return staticOccasions.map((item) => ({
    title: item.title,
    desc: item.desc,
    image: item.image,
  }));
});

const fallbackWhyChoose: WhyChoosePoint[] = [
  {
    title: "Carefully test Selected Properties",
    desc: "Every villa is reviewed for comfort, quality, location and guest experience.",
    icon: "sparkles",
  },
  {
    title: "Private and Spacious Stays",
    desc: "Enjoy complete privacy, generous living spaces and amenities designed for groups and families.",
    icon: "waves",
  },
  {
    title: "Personalised Villa Recommendations",
    desc: "Our team helps you choose a villa that suits your group size, occasion, location and budget.",
    icon: "map",
  },
  {
    title: "Dedicated Guest Assistance",
    desc: "Receive reliable support before arrival and throughout your stay.",
    icon: "headphones",
  },
  {
    title: "Transparent Booking Process",
    desc: "Get clear information about pricing, inclusions, policies and additional services.",
    icon: "shield",
  },
  {
    title: "Local Goa Expertise",
    desc: "Benefit from local knowledge when planning transportation, dining, activities and special experiences.",
    icon: "chef",
  },
];

export const getWhyChoose = cache(async (): Promise<WhyChoosePoint[]> => {
  try {
    const json = await readJson("/why-choose");
    const points = Array.isArray(json.data)
      ? json.data
          .map((item) => {
            const row = asRecord(item);
            const title = str(row?.title);
            if (!row || !title) return null;
            return {
              title,
              desc: str(row.description),
              icon: str(row.icon, "sparkles"),
            } satisfies WhyChoosePoint;
          })
          .filter((item): item is WhyChoosePoint => Boolean(item))
      : [];
    if (points.length) return points;
  } catch {
    /* static points keep the homepage usable */
  }
  return fallbackWhyChoose;
});

const fallbackAmenities = [
  "Private Swimming Pool",
  "Fully Equipped Kitchen",
  "Air-Conditioned Bedrooms",
  "Wi-Fi Connectivity",
  "Housekeeping",
  "Caretaker Assistance",
  "Power Backup",
  "Parking",
  "Outdoor Seating",
  "Entertainment Facilities",
  "Chef Service on Request",
  "Airport Transfers on Request",
];

export const getHomeAmenities = cache(async (): Promise<string[]> => {
  try {
    const json = await readJson("/amenities");
    const payload = asRecord(json.data);
    const rows = Array.isArray(payload?.all) ? payload.all : [];
    const names = rows
      .map((item) => str(asRecord(item)?.name))
      .filter((name) => name.length > 0);
    if (names.length) return names;
  } catch {
    /* static amenity list keeps the homepage usable */
  }
  return fallbackAmenities;
});

export const getFaqs = cache(async (): Promise<VillaFaq[]> => {
  try {
    const json = await readJson("/faqs");
    if (!Array.isArray(json.data)) return [];
    return json.data
      .map(normalizeFaq)
      .filter((faq): faq is VillaFaq => Boolean(faq));
  } catch {
    return [];
  }
});

const fallbackHomepage: HomepageSections = {
  experiences: {
    eyebrow: "Goa Experiences",
    heading: "Make Your Goa Holiday Even More Memorable",
    note: "Services are subject to availability and may involve additional charges.",
    items: [
      { title: "Private Chef Experiences", desc: "Bespoke menus crafted in your villa by skilled private chefs." },
      { title: "Airport & Local Transfers", desc: "Comfortable, reliable transfers arranged on request." },
      { title: "Yacht & Sunset Cruises", desc: "Sail along the Goan coastline for an unforgettable evening." },
      { title: "Beach Club Reservations", desc: "Premium sunbeds and access at Goa's finest beach clubs." },
      { title: "Birthday & Anniversary Setups", desc: "Thoughtful decor to celebrate your special moments." },
      { title: "Wedding & Event Assistance", desc: "End-to-end planning support for villa celebrations." },
      { title: "Wellness & Spa Sessions", desc: "In-villa spa, yoga and wellness experiences." },
      { title: "Local Sightseeing Experiences", desc: "Curated days out with trusted local guides." },
    ],
  },
  about: {
    eyebrow: "About the Company",
    heading: "Your Trusted Partner for Luxury Villa Rentals in Goa",
    body: "fantastic stays helps guests discover private villas in Goa suited to their travel requirements. We focus on carefully selected properties, responsive communication, genuine local knowledge and personalised booking support — so every stay feels considered, comfortable and entirely your own.",
    image: images.about,
    ratingCaption: "Average guest rating across verified stays",
    stats: [
      { value: "10+", label: "Years of Local Experience", source: "manual" },
      { value: "", label: "Villas Curated", source: "villas" },
      { value: "5,000+", label: "Happy Guests", source: "manual" },
      { value: "", label: "Goa Locations Covered", source: "locations" },
      { value: "", label: "Average Guest Rating", source: "rating" },
    ],
  },
  inspiration: {
    eyebrow: "Goa Travel Inspiration",
    heading: "Plan a Better Villa Holiday in Goa",
    items: [
      {
        date: "12 Jul 2025",
        title: "Best Areas to Rent a Luxury Villa in Goa",
        excerpt: "A neighbourhood-by-neighbourhood guide to choosing the right villa location for your trip.",
      },
      {
        date: "28 Jun 2025",
        title: "North Goa vs South Goa for a Villa Holiday",
        excerpt: "Comparing vibe, beaches and villa options to help you decide where to stay.",
      },
      {
        date: "15 Jun 2025",
        title: "How to Choose the Right Goa Villa for a Large Group",
        excerpt: "Bedrooms, privacy, amenities and layout — what matters most for group stays.",
      },
      {
        date: "02 Jun 2025",
        title: "Best Time to Visit Goa for a Villa Stay",
        excerpt: "Seasons, weather and pricing windows to plan the perfect villa holiday.",
      },
    ],
  },
  faqs: {
    eyebrow: "Frequently Asked Questions",
    heading: "Everything You Should Know Before You Book",
    items: [
      {
        q: "How can I book a luxury villa in Goa?",
        a: "Submit your dates, group size and preferred location via our enquiry form or WhatsApp. Our villa specialists will share curated options, confirm pricing and guide you through a simple booking process.",
      },
      {
        q: "Are the villas suitable for families and large groups?",
        a: "Yes. Many of our villas are ideal for families and large groups, with multiple bedrooms, spacious living areas, private pools and outdoor spaces designed for shared time together.",
      },
      {
        q: "Do all villas have private swimming pools?",
        a: "Most properties in our collection feature a private swimming pool. Pool size and style vary by villa — we will confirm the details for your shortlisted options.",
      },
      {
        q: "Is housekeeping included?",
        a: "Daily housekeeping is included with every stay. Frequency and any additional services can be confirmed at the time of booking.",
      },
      {
        q: "Can meals or private chef services be arranged?",
        a: "Yes. Private chef and catering services can be arranged on request for most villas, subject to availability.",
      },
      {
        q: "Are parties and events allowed at the villas?",
        a: "Many villas permit small celebrations and gatherings. Larger parties or events may require prior approval and additional charges. Please share your plans when you enquire.",
      },
      {
        q: "Is a security deposit required?",
        a: "A refundable security deposit is standard for most villas and is typically collected before check-in. The amount and refund timeline are confirmed at booking.",
      },
      {
        q: "Can airport transfers be organised?",
        a: "Yes. Airport and local transfers can be arranged on request for most stays.",
      },
      {
        q: "What is the cancellation policy?",
        a: "Policies vary by property. Many offer free cancellation up to a set number of days before check-in. Full details are shared before you confirm.",
      },
      {
        q: "How do I check villa availability and final pricing?",
        a: "Send us your travel dates, guest count and preferred location. Our team will confirm availability and share final pricing for suitable villas.",
      },
    ],
  },
};

function statSource(value: string): HomeStat["source"] {
  if (value === "villas" || value === "locations" || value === "rating") return value;
  return "manual";
}

export const getHomepageSections = cache(async (): Promise<HomepageSections> => {
  try {
    const json = await readJson("/homepage-sections");
    const data = asRecord(json.data);
    if (!data) return fallbackHomepage;

    const experiences = asRecord(data.experiences);
    const about = asRecord(data.about);
    const inspiration = asRecord(data.inspiration);
    const faqs = asRecord(data.faqs);

    const experienceItems = Array.isArray(experiences?.items)
      ? experiences.items
          .map((item) => {
            const row = asRecord(item);
            const title = str(row?.title);
            if (!title) return null;
            return { title, desc: str(row?.description) };
          })
          .filter((item): item is { title: string; desc: string } => Boolean(item))
      : [];

    const stats = Array.isArray(about?.stats)
      ? about.stats
          .map((item) => {
            const row = asRecord(item);
            const label = str(row?.label);
            if (!label) return null;
            return {
              value: str(row?.value),
              label,
              source: statSource(str(row?.source)),
            } satisfies HomeStat;
          })
          .filter((item): item is HomeStat => Boolean(item))
      : [];

    const posts = Array.isArray(inspiration?.items)
      ? inspiration.items
          .map((item) => {
            const row = asRecord(item);
            const title = str(row?.title);
            if (!title) return null;
            return {
              date: str(row?.published_label),
              title,
              excerpt: str(row?.excerpt),
            };
          })
          .filter((item): item is { date: string; title: string; excerpt: string } => Boolean(item))
      : [];

    const faqItems = Array.isArray(faqs?.items)
      ? faqs.items
          .map((item) => {
            const row = asRecord(item);
            const question = str(row?.question);
            const answer = str(row?.answer);
            if (!question || !answer) return null;
            return { q: question, a: answer };
          })
          .filter((item): item is { q: string; a: string } => Boolean(item))
      : [];

    return {
      experiences: {
        eyebrow: str(experiences?.eyebrow, fallbackHomepage.experiences.eyebrow),
        heading: str(experiences?.heading, fallbackHomepage.experiences.heading),
        note: str(experiences?.note, fallbackHomepage.experiences.note),
        items: experienceItems.length ? experienceItems : fallbackHomepage.experiences.items,
      },
      about: {
        eyebrow: str(about?.eyebrow, fallbackHomepage.about.eyebrow),
        heading: str(about?.heading, fallbackHomepage.about.heading),
        body: str(about?.body, fallbackHomepage.about.body),
        image: mediaUrl(str(about?.image, fallbackHomepage.about.image)),
        ratingCaption: str(about?.rating_caption, fallbackHomepage.about.ratingCaption),
        stats: stats.length ? stats : fallbackHomepage.about.stats,
      },
      inspiration: {
        eyebrow: str(inspiration?.eyebrow, fallbackHomepage.inspiration.eyebrow),
        heading: str(inspiration?.heading, fallbackHomepage.inspiration.heading),
        items: posts.length ? posts : fallbackHomepage.inspiration.items,
      },
      faqs: {
        eyebrow: str(faqs?.eyebrow, fallbackHomepage.faqs.eyebrow),
        heading: str(faqs?.heading, fallbackHomepage.faqs.heading),
        items: faqItems.length ? faqItems : fallbackHomepage.faqs.items,
      },
    };
  } catch {
    return fallbackHomepage;
  }
});

export async function loadHomePage(): Promise<HomeVillaData> {
  const [featured, locations, occasions, whyChoose, amenities, reviews, homepage, catalog] =
    await Promise.all([
    getFeaturedVillas(),
    getLocations(),
    getOccasions(),
    getWhyChoose(),
    getHomeAmenities(),
    getPublicReviews(),
    getHomepageSections(),
    getVillaCatalog(),
  ]);
  const averageRating = catalog.villas.length
    ? Math.round(
        (catalog.villas.reduce((sum, villa) => sum + villa.rating, 0) /
          catalog.villas.length) *
          10
      ) / 10
    : 4.9;
  return {
    featured,
    locations,
    occasions,
    whyChoose,
    amenities,
    reviews,
    homepage,
    total: catalog.total,
    averageRating,
  };
}

export async function loadListingPage() {
  const [catalog, locations, reviews] = await Promise.all([
    getVillaCatalog(),
    getLocations(),
    getPublicReviews(),
  ]);
  return { ...catalog, locations, reviews };
}

export type SiteFooter = {
  kicker: string;
  about: string;
  phone: string;
  phoneTel: string;
  email: string;
  whatsappHref: string;
  addressLines: string[];
  location: string;
  contactNumber: string;
  heading: string;
  intro: string;
  socials: { label: "Instagram" | "Facebook" | "YouTube"; href: string }[];
};

const footerFallback: SiteFooter = {
  kicker: BRAND_TAGLINE,
  about:
    "Handpicked private villas in Goa for families, couples, groups, weddings and corporate retreats — with personalised booking support and dedicated guest assistance.",
  phone: BRAND_PHONE_DISPLAY,
  phoneTel: "+918860331188",
  email: BRAND_EMAIL,
  whatsappHref: BRAND_WA_HREF,
  addressLines: [...BRAND_ADDRESS_LINES, "Contact: 8860331188"],
  location: "House No. 4/1635 Probavaddo, Calangute, Bardez, Goa-403516",
  contactNumber: "8860331188",
  heading: "Speak with a Villa Specialist",
  intro:
    "Share your travel dates and requirements. Our team typically responds within 2 hours between 9 am and 9 pm IST.",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return footerFallback.whatsappHref;
  return `https://wa.me/${digits}?text=${encodeURIComponent("Hi, I'd like to enquire about a villa in Goa.")}`;
}

export type HomeHero = {
  image: string;
  eyebrow: string;
  titleLead: string;
  titleMain: string;
  titleEnd: string;
  subtitle: string;
};

const heroFallback: HomeHero = {
  image: images.hero,
  eyebrow: "Goa · Private Estates",
  titleLead: "Experience",
  titleMain: "Luxury Villa Living",
  titleEnd: "in Goa",
  subtitle:
    "Discover handpicked private villas in Goa for relaxing family holidays, romantic escapes, group getaways, weddings and memorable celebrations.",
};

export type ListingHero = {
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  villasLabel: string;
  ratingLabel: string;
  response: string;
  responseLabel: string;
  badge: string;
  image: string;
  imageSmall: string;
};

const listingHeroFallback: ListingHero = {
  eyebrow: "Handpicked Villas · Goa, India",
  heading: "Luxury Villas in Goa for an Exceptional Private Stay",
  paragraph1:
    "Explore our handpicked collection of <strong>luxury villas in Goa</strong>, featuring private pools, stylish interiors and carefully selected locations. Whether you are planning a family holiday, a group getaway or a special celebration, find a villa that gives you privacy, comfort and easy access to Goa's beaches, restaurants and attractions.",
  paragraph2:
    "From <strong>private pool villas</strong> in the leafy lanes of Assagao to <strong>holiday villas</strong> along the quiet southern coast, every <strong>Goa villa for rent</strong> in our portfolio is visited in person before it joins the collection.",
  villasLabel: "Curated Villas",
  ratingLabel: "Guest Rating",
  response: "30 min",
  responseLabel: "Specialist Response",
  badge: "Assagao · North Goa",
  image: images.listingHero,
  imageSmall: images.listingHeroSmall,
};

export const getListingHero = cache(async (): Promise<ListingHero> => {
  try {
    const json = await readJson("/settings");
    const data = asRecord(json.data);
    if (!data) return listingHeroFallback;
    const setting = (key: string, fallback: string) => {
      const value = str(data[key]).trim();
      return value || fallback;
    };
    return {
      eyebrow: setting("listing_eyebrow", listingHeroFallback.eyebrow),
      heading: setting("listing_heading", listingHeroFallback.heading),
      paragraph1: setting("listing_paragraph_1", listingHeroFallback.paragraph1),
      paragraph2: setting("listing_paragraph_2", listingHeroFallback.paragraph2),
      villasLabel: setting("listing_stat_villas_label", listingHeroFallback.villasLabel),
      ratingLabel: setting("listing_stat_rating_label", listingHeroFallback.ratingLabel),
      response: setting("listing_response", listingHeroFallback.response),
      responseLabel: setting("listing_response_label", listingHeroFallback.responseLabel),
      badge: setting("listing_badge", listingHeroFallback.badge),
      image: mediaUrl(setting("listing_image", listingHeroFallback.image)),
      imageSmall: mediaUrl(setting("listing_image_small", listingHeroFallback.imageSmall)),
    };
  } catch {
    return listingHeroFallback;
  }
});

export type ServicePages = {
  sale: {
    eyebrow: string;
    heading: string;
    intro: string;
    points: string[];
    formHeading: string;
    listTitle: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  list: {
    eyebrow: string;
    heading: string;
    intro: string;
    stats: { value: string; label: string }[];
    benefits: { title: string; text: string }[];
    formHeading: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
};

const servicePagesFallback: ServicePages = {
  sale: {
    eyebrow: "Private Ownership · Goa",
    heading: "Villas available to buy in Goa",
    intro:
      "Looking for a home you can keep, not just a week away. Tell us the location, size, and budget you have in mind.",
    points: [
      "We shortlist villas that match how you want to live in Goa.",
      "You hear about price, condition, and what is included before you travel.",
      "One person stays with you from the first call to the viewing.",
    ],
    formHeading: "Tell us what you are looking for",
    listTitle: "Villas for sale",
    metaTitle: "Villas for Sale in Goa | Fantastic Stays",
    metaDescription:
      "Looking for a private villa to buy in Goa. Share the location, size, and budget, and a specialist will shortlist homes that are on the market.",
    metaKeywords:
      "villas for sale in goa, buy villa goa, luxury villa for sale assagao, north goa villa purchase",
  },
  list: {
    eyebrow: "Owners · Goa",
    heading: "Let us look after your villa",
    intro:
      "If you own a private villa in Goa and want it let to the right guests, send a few details. We will tell you honestly whether it fits the collection.",
    stats: [
      { value: "Visited in person", label: "Every home" },
      { value: "North & South", label: "Goa" },
      { value: "One desk", label: "Enquiry to stay" },
      { value: "Your terms", label: "Agreed up front" },
    ],
    benefits: [
      {
        title: "A named contact",
        text: "You are not passed between departments. One specialist knows the house.",
      },
      {
        title: "Guests who fit the house",
        text: "We match group size and the way the villa is meant to be used.",
      },
      {
        title: "Care between stays",
        text: "Housekeeping, checks, and upkeep are agreed before the first booking.",
      },
      {
        title: "Clear reporting",
        text: "You see what was booked and what is still open.",
      },
    ],
    formHeading: "Send your villa details",
    metaTitle: "List Your Villa in Goa | Fantastic Stays",
    metaDescription:
      "Own a private villa in Goa? Share a few details and Fantastic Stays will tell you whether it fits the collection.",
    metaKeywords:
      "list your villa goa, villa management goa, rent out villa goa, holiday home owners goa",
  },
};

export const getServicePages = cache(async (): Promise<ServicePages> => {
  try {
    const json = await readJson("/settings");
    const data = asRecord(json.data);
    if (!data) return servicePagesFallback;
    const setting = (key: string, fallback: string) => {
      const value = str(data[key]).trim();
      return value || fallback;
    };
    const sale = servicePagesFallback.sale;
    const list = servicePagesFallback.list;
    return {
      sale: {
        eyebrow: setting("sale_eyebrow", sale.eyebrow),
        heading: setting("sale_heading", sale.heading),
        intro: setting("sale_intro", sale.intro),
        points: [1, 2, 3].map((index) =>
          setting(`sale_point_${index}`, sale.points[index - 1])
        ),
        formHeading: setting("sale_form_heading", sale.formHeading),
        listTitle: setting("sale_list_title", sale.listTitle),
        metaTitle: setting("sale_meta_title", sale.metaTitle),
        metaDescription: setting("sale_meta_description", sale.metaDescription),
        metaKeywords: setting("sale_meta_keywords", sale.metaKeywords),
      },
      list: {
        eyebrow: setting("list_eyebrow", list.eyebrow),
        heading: setting("list_heading", list.heading),
        intro: setting("list_intro", list.intro),
        stats: [1, 2, 3, 4].map((index) => ({
          value: setting(`list_stat_${index}_value`, list.stats[index - 1].value),
          label: setting(`list_stat_${index}_label`, list.stats[index - 1].label),
        })),
        benefits: [1, 2, 3, 4].map((index) => ({
          title: setting(
            `list_benefit_${index}_title`,
            list.benefits[index - 1].title
          ),
          text: setting(
            `list_benefit_${index}_text`,
            list.benefits[index - 1].text
          ),
        })),
        formHeading: setting("list_form_heading", list.formHeading),
        metaTitle: setting("list_meta_title", list.metaTitle),
        metaDescription: setting("list_meta_description", list.metaDescription),
        metaKeywords: setting("list_meta_keywords", list.metaKeywords),
      },
    };
  } catch {
    return servicePagesFallback;
  }
});

export const getHomeHero = cache(async (): Promise<HomeHero> => {
  try {
    const json = await readJson("/settings");
    const data = asRecord(json.data);
    if (!data) return heroFallback;
    const setting = (key: string, fallback: string) => {
      const value = str(data[key]).trim();
      return value || fallback;
    };
    return {
      image: mediaUrl(setting("hero_image", heroFallback.image)),
      eyebrow: setting("hero_eyebrow", heroFallback.eyebrow),
      titleLead: setting("hero_title_lead", heroFallback.titleLead),
      titleMain: setting("hero_title_main", heroFallback.titleMain),
      titleEnd: setting("hero_title_end", heroFallback.titleEnd),
      subtitle: setting("hero_subtitle", heroFallback.subtitle),
    };
  } catch {
    return heroFallback;
  }
});

export const getSiteFooter = cache(async (): Promise<SiteFooter> => {
  try {
    const json = await readJson("/settings");
    const data = asRecord(json.data);
    if (!data) return footerFallback;
    const setting = (key: string, fallback: string) => {
      const value = str(data[key]).trim();
      return value || fallback;
    };
    const address = setting("office_address", footerFallback.addressLines.join("\n"));
    const addressLines = address
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const locationLines: string[] = [];
    let contactNumber = "";
    for (const line of addressLines) {
      const contactLine = line.match(/^contact\s*:\s*(.+)$/i);
      if (contactLine) contactNumber = contactLine[1].trim();
      else locationLines.push(line);
    }
    const phone = setting("contact_phone", footerFallback.phone);
    const socials = (
      [
        ["Instagram", "social_instagram"],
        ["Facebook", "social_facebook"],
        ["YouTube", "social_youtube"],
      ] as const
    )
      .map(([label, key]) => ({ label, href: setting(key, "") }))
      .filter((item) => item.href.startsWith("http"));

    return {
      kicker: setting("footer_kicker", footerFallback.kicker),
      about: setting("footer_about", footerFallback.about),
      phone,
      phoneTel: phone.replace(/[^\d+]/g, "") || footerFallback.phoneTel,
      email: setting("contact_email", footerFallback.email),
      whatsappHref: whatsappHref(setting("whatsapp_number", "")),
      addressLines: addressLines.length ? addressLines : footerFallback.addressLines,
      location: locationLines.join(", ") || footerFallback.location,
      contactNumber: contactNumber || footerFallback.contactNumber,
      heading: setting("contact_heading", footerFallback.heading),
      intro: setting("contact_intro", footerFallback.intro),
      socials: socials.length ? socials : footerFallback.socials,
    };
  } catch {
    return footerFallback;
  }
});

export async function loadVillaPage(slug: string) {
  const [villa, faqs] = await Promise.all([getVillaBySlug(slug), getFaqs()]);
  if (!villa) return { villa: null, faqs: [] as VillaFaq[] };

  const own = villa.faqs ?? [];
  const villaId = Number(villa.id);
  const matched = faqs.filter((faq) => faq.villa_id === villaId);
  const general = faqs.filter((faq) => faq.villa_id == null);
  const combined = own.length ? own : [...matched, ...general];
  const seen = new Set<number>();
  return {
    villa,
    faqs: combined.filter((faq) => {
      if (seen.has(faq.id)) return false;
      seen.add(faq.id);
      return true;
    }),
  };
}

export type VillaVideo = {
  id: string;
  title: string;
  thumb: string;
  /** YouTube / Instagram / hosted embed URL */
  embed: string;
  source?: "instagram" | "youtube" | "tour";
};

export type VillaRoom = {
  id: number;
  room_name: string;
  bed_type: string;
  image: string | null;
  ensuite_bath: boolean;
  description: string | null;
};

export type VillaAttraction = {
  id: number;
  name: string;
  distance: string;
  category: string;
};

export type GuestReview = {
  id: number;
  guest_name: string;
  guest_location: string | null;
  rating: number;
  comment: string;
  stay_date: string | null;
  cleanliness_rating?: number | null;
  accuracy_rating?: number | null;
  communication_rating?: number | null;
  location_rating?: number | null;
  value_rating?: number | null;
};

export type VillaFaq = {
  id: number;
  villa_id?: number | null;
  question: string;
  answer: string;
};

export type Villa = {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  beds: number;
  sleepHeading?: string | null;
  sleepIntro?: string | null;
  amenityEyebrow?: string | null;
  amenityHeading?: string | null;
  amenityGroups?: { title: string; items: string[] }[];
  servicesEyebrow?: string | null;
  servicesHeading?: string | null;
  servicesIntro?: string | null;
  services?: { name: string; included: boolean }[];
  rating: number;
  reviews: number;
  badge?: string;
  listingBadges?: string[];
  amenityKeys?: string[];
  propertyType?: string | null;
  instantBooking?: boolean;
  amenities: string[];
  tags: string[];
  image: string;
  gallery: string[];
  /** Optional — section only renders when this has 1+ items */
  videos?: VillaVideo[];
  shortDescription: string;
  description: string;
  featured?: boolean;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  address?: string | null;
  locationProfile?: {
    name: string;
    region: string;
    heading: string | null;
    description: string | null;
    image: string | null;
    places: VillaAttraction[];
  } | null;
  houseRules?: Record<string, string> | null;
  rooms?: VillaRoom[];
  attractions?: VillaAttraction[];
  guestReviews?: GuestReview[];
  faqs?: VillaFaq[];
  similar?: Villa[];
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type GoaLocation = {
  name: string;
  slug: string;
  region: string;
  image: string;
  description: string;
  count: number;
};

export type PublicReview = {
  id: number;
  quote: string;
  name: string;
  place: string;
  stay: string;
  initial: string;
  rating: number;
  tag: string;
};

export const AMENITY_FILTERS: { key: string; label: string }[] = [
  { key: "pool", label: "Private swimming pool" },
  { key: "beach", label: "Beachfront or near the beach" },
  { key: "pet", label: "Pet-friendly villas" },
  { key: "chef", label: "Chef service" },
  { key: "hk", label: "Housekeeping" },
  { key: "family", label: "Family-friendly stays" },
  { key: "event", label: "Event-friendly villas" },
  { key: "sea", label: "Sea view" },
  { key: "instant", label: "Instant booking" },
];

const d = "/images/demo";

export const images = {
  hero: `${d}/hero-cover.webp`,
  offer: `${d}/offer.webp`,
  cta: `${d}/guests-relaxing-beside-a-private-villa-pool-in-goa.webp`,
  about: `${d}/about.webp`,
  listingHero: `${d}/home-villa-specialist-welcoming-guests-at-a-luxury-goa-.webp`,
  listingHeroSmall: `${d}/loc-assagao.webp`,
  detailHero: `${d}/detail-casa-serenity-villa-exterior-at-dusk-with-glowing-pri.jpg`,
  living: `${d}/detail-sunlit-open-plan-living-room-with-cream-linen-sofas-a.jpg`,
  poolDeck: `${d}/guests-relaxing-beside-a-private-villa-pool-in-goa.webp`,
  dining: `${d}/detail-indoor-outdoor-dining-pavilion-with-teak-table-and-br.jpg`,
  bedroom: `${d}/detail-primary-bedroom-with-four-poster-teak-bed-and-sheer-d.jpg`,
  master: `${d}/detail-master.jpg`,
  poolRoom: `${d}/detail-pool-room.jpg`,
  gardenRoom: `${d}/detail-garden-room.jpg`,
  azure: `${d}/detail-villa-azure-contemporary-north-goa-villa-with-large-p.jpg`,
  maris: `${d}/detail-casa-maris-beachfront-goa-villa-with-infinity-pool-ov.jpg`,
  laterite: `${d}/detail-the-laterite-house-heritage-indo-portuguese-villa-wit.jpg`,
  aerial: `${d}/detail-aerial-view-of-the-goa-coastline-at-golden-hour-with-.jpg`,
  duskPool: `${d}/home-luxury-goa-villa-with-private-pool-at-dusk.webp`,
};

/** Shared 5-shot gallery filler so every villa fills the detail grid */
export function buildGallery(primary: string, extras: string[] = []): string[] {
  const pool = [
    primary,
    ...extras,
    images.living,
    images.poolDeck,
    images.dining,
    images.bedroom,
    images.master,
    images.gardenRoom,
    images.aerial,
  ];
  const out: string[] = [];
  for (const src of pool) {
    if (src && !out.includes(src)) out.push(src);
    if (out.length >= 5) break;
  }
  return out;
}

export const villas: Villa[] = [
  {
    id: "1",
    slug: "casa-serenity",
    name: "Casa Serenity",
    location: "Assagao",
    region: "North Goa",
    price: 38500,
    bedrooms: 5,
    bathrooms: 5,
    guests: 10,
    beds: 6,
    rating: 4.9,
    reviews: 127,
    badge: "FEATURED",
    listingBadges: ["Guest Favourite", "Available This Weekend"],
    amenities: ["Private Pool", "Chef on Request", "Housekeeping"],
    tags: ["Private Pool", "Family-Friendly"],
    image: `${d}/casa-serenity.webp`,
    gallery: buildGallery(images.detailHero, [images.living, images.poolDeck, images.dining, images.bedroom]),
    videos: [
      {
        id: "cs-1",
        title: "Poolside sunset at the villa",
        thumb: images.detailHero,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
      {
        id: "cs-2",
        title: "Morning coffee in the courtyard",
        thumb: images.living,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
      {
        id: "cs-3",
        title: "Dinner under the frangipani",
        thumb: images.dining,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
      {
        id: "cs-4",
        title: "A day in Assagao",
        thumb: images.hero,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "youtube",
      },
    ],
    shortDescription:
      "A serene Indo-Portuguese sanctuary tucked into the leafy lanes of Assagao — where laterite walls, linen drapes and a glowing private pool frame the art of unhurried Goan living.",
    description:
      "Casa Serenity is a five-bedroom private-pool villa set within a walled tropical garden in Assagao, one of North Goa's most coveted villages. Designed as a quiet counterpoint to the bustle of the coast, the property blends restored Indo-Portuguese architecture — laterite stone walls, arched openings and hand-carved teak — with the easy comfort of contemporary linen-and-light living.",
    featured: true,
  },
  {
    id: "2",
    slug: "villa-palmar",
    name: "Villa Palmar",
    location: "Anjuna",
    region: "North Goa",
    price: 14500,
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    beds: 3,
    rating: 4.88,
    reviews: 96,
    badge: "BEST SELLER",
    listingBadges: ["Near the Beach", "Guest Favourite"],
    amenities: ["Private Pool", "Wi-Fi", "Caretaker"],
    tags: ["Private Pool", "Near Beach", "Sea View"],
    instantBooking: true,
    image: `${d}/villa-palmar.webp`,
    gallery: buildGallery(`${d}/villa-palmar.webp`, [images.living, images.dining]),
    videos: [
      {
        id: "vp-1",
        title: "Villa Palmar walkthrough",
        thumb: `${d}/villa-palmar.webp`,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "youtube",
      },
    ],
    shortDescription: "Stylish three-bedroom villa near Anjuna's beaches and cafes.",
    description:
      "Villa Palmar offers a peaceful private pool retreat minutes from Anjuna Beach.",
    featured: true,
  },
  {
    id: "3",
    slug: "the-leaf-pavilion",
    name: "The Leaf Pavilion",
    location: "Assagao",
    region: "North Goa",
    price: 24000,
    bedrooms: 5,
    bathrooms: 5,
    guests: 10,
    beds: 5,
    rating: 4.91,
    reviews: 87,
    badge: "FEATURED",
    listingBadges: ["Exclusive", "Sea View"],
    amenities: ["Private Pool", "Garden", "Housekeeping"],
    tags: ["Private Pool", "Family-Friendly", "Sea View"],
    image: `${d}/the-leaf-pavilion.webp`,
    gallery: buildGallery(`${d}/the-leaf-pavilion.webp`, [images.gardenRoom, images.dining]),
    videos: [
      {
        id: "lp-1",
        title: "Garden & pool reel",
        thumb: `${d}/the-leaf-pavilion.webp`,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
      {
        id: "lp-2",
        title: "Living pavilion tour",
        thumb: images.dining,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
    ],
    shortDescription: "Five-bedroom pavilion villa with lush garden and private pool.",
    description:
      "The Leaf Pavilion combines spacious living with Assagao's quiet garden village character.",
    featured: true,
  },
  {
    id: "4",
    slug: "sol-e-mar",
    name: "Sol e Mar",
    location: "Siolim",
    region: "North Goa",
    price: 19800,
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    beds: 4,
    rating: 4.85,
    reviews: 74,
    amenities: ["Private Pool", "Kitchen", "Parking"],
    tags: ["Private Pool"],
    image: `${d}/sol-e-mar.webp`,
    gallery: buildGallery(`${d}/sol-e-mar.webp`, [images.living, images.poolRoom]),
    shortDescription: "Sunlit four-bedroom villa in riverside Siolim.",
    description:
      "Sol e Mar is a bright private-pool villa ideal for families and small groups.",
    featured: true,
  },
  {
    id: "5",
    slug: "azure-retreat",
    name: "Azure Retreat",
    location: "Vagator",
    region: "North Goa",
    price: 16200,
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    beds: 3,
    rating: 4.8,
    reviews: 64,
    badge: "BEST SELLER",
    listingBadges: ["Exclusive", "Sea View"],
    amenities: ["Infinity Pool", "Outdoor Seating", "Power Backup", "Chef on Request"],
    tags: ["Private Pool", "Sea View"],
    instantBooking: true,
    image: `${d}/azure-retreat.webp`,
    gallery: buildGallery(`${d}/azure-retreat.webp`, [images.azure]),
    shortDescription: "Contemporary villa with large private pool near Vagator cliffs.",
    description:
      "Azure Retreat pairs contemporary design with easy access to Vagator's sunset spots.",
    featured: true,
  },
  {
    id: "6",
    slug: "casa-morjim",
    name: "Casa Morjim",
    location: "Morjim",
    region: "North Goa",
    price: 32000,
    bedrooms: 6,
    bathrooms: 6,
    guests: 12,
    beds: 7,
    rating: 4.92,
    reviews: 52,
    badge: "FEATURED",
    amenities: ["Beachfront", "Private Pool", "Chef on Request"],
    tags: ["Beachfront", "Private Pool"],
    image: `${d}/casa-morjim.webp`,
    gallery: buildGallery(`${d}/casa-morjim.webp`, [images.maris]),
    videos: [
      {
        id: "cm-1",
        title: "Beachfront sunrise at Casa Morjim",
        thumb: `${d}/casa-morjim.webp`,
        embed: "https://www.youtube.com/embed/ScMzIvxBSi4",
        source: "instagram",
      },
    ],
    shortDescription: "Six-bedroom beachfront estate on Morjim's quiet shoreline.",
    description:
      "Casa Morjim is a spacious beachfront villa designed for large groups and celebrations.",
    featured: true,
  },
  {
    id: "7",
    slug: "villa-azure",
    name: "Villa Azure",
    location: "Vagator",
    region: "North Goa",
    price: 32000,
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    beds: 4,
    rating: 4.8,
    reviews: 88,
    amenities: ["Private Pool", "Wi-Fi", "Chef on Request"],
    tags: ["Private Pool"],
    image: images.azure,
    gallery: buildGallery(images.azure, [images.living]),
    shortDescription: "Contemporary North Goa villa with large private pool.",
    description: "Villa Azure offers modern comfort minutes from Vagator Beach.",
  },
  {
    id: "8",
    slug: "casa-maris",
    name: "Casa Maris",
    location: "Morjim",
    region: "North Goa",
    price: 48000,
    bedrooms: 6,
    bathrooms: 6,
    guests: 12,
    beds: 6,
    rating: 4.9,
    reviews: 41,
    amenities: ["Infinity Pool", "Beachfront", "Housekeeping"],
    tags: ["Beachfront", "Sea View"],
    image: images.maris,
    gallery: buildGallery(images.maris, [images.aerial]),
    shortDescription: "Beachfront villa with infinity pool overlooking the sea.",
    description: "Casa Maris sits above Morjim with sweeping Arabian Sea views.",
  },
  {
    id: "9",
    slug: "the-laterite-house",
    name: "The Laterite House",
    location: "Siolim",
    region: "North Goa",
    price: 26000,
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    beds: 3,
    rating: 4.7,
    reviews: 58,
    amenities: ["Private Pool", "Heritage Courtyard", "Wi-Fi"],
    tags: ["Private Pool", "Pet-Friendly"],
    image: images.laterite,
    gallery: buildGallery(images.laterite, [images.gardenRoom]),
    shortDescription: "Heritage Indo-Portuguese villa with courtyard and pool.",
    description:
      "The Laterite House wraps restored Portuguese architecture around a green courtyard.",
  },
  {
    id: "10",
    slug: "palolem-peach-house",
    name: "Palolem Peach House",
    location: "Palolem",
    region: "South Goa",
    price: 19500,
    bedrooms: 2,
    bathrooms: 2,
    guests: 5,
    beds: 2,
    rating: 4.83,
    reviews: 58,
    badge: "NEW",
    listingBadges: ["Near the Beach", "New Villa"],
    amenities: ["Beachfront", "Veranda", "Kitchen"],
    tags: ["Beachfront", "Near Beach", "Pet-Friendly"],
    image: `${d}/loc-south-goa.webp`,
    gallery: buildGallery(`${d}/loc-south-goa.webp`, [images.aerial]),
    shortDescription: "Laid-back beach house five minutes from Palolem bay.",
    description:
      "Palolem Peach House is a relaxed South Goa beach house with a veranda swing.",
  },
  {
    id: "11",
    slug: "sernabatim-sands",
    name: "Sernabatim Sands",
    location: "Cavelossim",
    region: "South Goa",
    price: 38000,
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    beds: 4,
    rating: 4.86,
    reviews: 64,
    amenities: ["Private Pool", "Housekeeping", "Garden"],
    tags: ["Near Beach", "Private Pool"],
    image: `${d}/occ-weekend.webp`,
    gallery: buildGallery(`${d}/occ-weekend.webp`, [images.dining]),
    shortDescription: "Beachside comfort with walled garden and poolside dining.",
    description:
      "Sernabatim Sands offers South Goa calm with poolside dining and twice-daily housekeeping.",
  },
  {
    id: "12",
    slug: "cabo-serene",
    name: "Cabo Serene",
    location: "Galgibaga",
    region: "South Goa",
    price: 85000,
    bedrooms: 5,
    bathrooms: 6,
    guests: 10,
    beds: 5,
    rating: 4.94,
    reviews: 41,
    badge: "EXCLUSIVE",
    amenities: ["Sea-View Pool", "Chef", "Butler"],
    tags: ["Sea View", "Private Pool"],
    image: `${d}/occ-group.webp`,
    gallery: buildGallery(`${d}/occ-group.webp`, [images.aerial]),
    shortDescription: "Secluded five-bedroom hideaway above Galgibaga beach.",
    description:
      "Cabo Serene is a quiet South Goa sanctuary with a sea-view pool and full staffing.",
  },
];

export const locations = [
  { name: "Candolim", count: 12, image: `${d}/loc-candolim.webp` },
  { name: "Calangute", count: 9, image: `${d}/loc-calangute.webp` },
  { name: "Anjuna", count: 14, image: `${d}/loc-anjuna.webp` },
  { name: "Assagao", count: 11, image: `${d}/loc-assagao.webp` },
  { name: "Vagator", count: 8, image: `${d}/loc-vagator.webp` },
  { name: "Morjim", count: 7, image: `${d}/loc-morjim.webp` },
  { name: "Siolim", count: 13, image: `${d}/loc-siolim.webp` },
  { name: "Saligao", count: 6, image: `${d}/loc-saligao.webp` },
  { name: "Baga", count: 10, image: `${d}/loc-baga.webp` },
  { name: "South Goa", count: 15, image: `${d}/loc-south-goa.webp` },
];

export const occasions = [
  { title: "Family Holidays", desc: "Space, comfort and private pools for unforgettable family time.", image: `${d}/occ-family.webp` },
  { title: "Romantic Getaways", desc: "Intimate villas for couples seeking privacy and quiet luxury.", image: `${d}/occ-romantic.webp` },
  { title: "Group Vacations", desc: "Large villas with generous living areas for friends to gather.", image: `${d}/occ-group.webp` },
  { title: "Destination Weddings", desc: "Picture-perfect settings for your celebration by the pool.", image: `${d}/occ-wedding.webp` },
  { title: "Birthday Celebrations", desc: "Festive setups and decor to mark the occasion in style.", image: `${d}/occ-birthday.webp` },
  { title: "Corporate Retreats", desc: "Comfortable villas for offsites, bonding and focused work.", image: `${d}/occ-corporate.webp` },
  { title: "Long Weekend Escapes", desc: "Quick getaways to recharge by your own private pool.", image: `${d}/occ-weekend.webp` },
  { title: "Extended Villa Stays", desc: "Work-from-villa and longer stays with full home comforts.", image: `${d}/occ-extended.webp` },
];

export function getVilla(slug: string) {
  return villas.find((v) => v.slug === slug);
}

export function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

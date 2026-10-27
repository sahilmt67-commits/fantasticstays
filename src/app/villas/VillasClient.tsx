"use client";

import { useMemo, useState } from "react";
import { OptImage } from "@/components/OptImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LayoutGrid,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { ListingVillaCard } from "@/components/ListingVillaCard";
import { Reveal } from "@/components/Reveal";
import {
  AMENITY_FILTERS,
  images,
  type GoaLocation,
  type PublicReview,
  type Villa,
} from "@/data/villas";
import { locationHref } from "@/data/villas";
import { imageAlt } from "@/lib/image-alt";
import type { ListingHero } from "@/lib/villa-api";
import { BRAND } from "@/lib/brand";
import { clsx } from "clsx";

const VILLA_TYPES = [
  "Private Pool Villas",
  "Beach Villas",
  "Villas for Large Groups",
  "Family Villas",
  "Pet-Friendly Villas",
  "Villas for Celebrations",
  "Romantic Villas for Couples",
  "Luxury Villas with Chef Service",
];

const STANDARDS = [
  {
    title: "Handpicked Luxury Villas",
    desc: "Every property is visited and approved before it joins the collection.",
    icon: Sparkles,
  },
  {
    title: "Verified Property Details",
    desc: "Bedrooms, amenities and inclusions are confirmed with the villa team.",
    icon: ShieldCheck,
  },
  {
    title: "Personal Villa Specialists",
    desc: "A dedicated specialist helps you shortlist and book the right stay.",
    icon: CheckCircle2,
  },
  {
    title: "Transparent Pricing",
    desc: "Clear rates with taxes and fees shown before you confirm.",
    icon: CheckCircle2,
  },
  {
    title: "Dedicated Guest Support",
    desc: "Support before arrival and throughout your stay in Goa.",
    icon: CheckCircle2,
  },
  {
    title: "Local Goa Expertise",
    desc: "Trusted recommendations for dining, transfers and experiences.",
    icon: CheckCircle2,
  },
];

const GUIDE = [
  {
    id: "north-south",
    title: "North Goa or South Goa?",
    heading: "Choosing Between North Goa and South Goa",
    body: "North Goa suits guests who want lively beaches, cafes and nightlife within a short drive. South Goa is quieter, with longer beaches and a slower pace — ideal for families and longer stays. Many guests begin with Assagao or Anjuna for convenience, then explore luxury stays in South Goa for a more secluded holiday.",
  },
  {
    id: "families",
    title: "Families and Groups",
    heading: "Finding Space for Families and Groups",
    body: "Look for villas with four or more bedrooms, enclosed gardens and a private pool. Properties in Assagao, Siolim and Candolim work well for families, while larger estates near Morjim or Cavelossim suit celebrations and reunions.",
  },
  {
    id: "included",
    title: "What Is Included?",
    heading: "What Is Typically Included",
    body: `Most ${BRAND} villas include daily housekeeping, linen, Wi-Fi and pool maintenance. Chef service, transfers and grocery stocking can be arranged on request. Exact inclusions are confirmed before you book.`,
  },
  {
    id: "when",
    title: "When to Book",
    heading: "When to Book Your Goa Villa",
    body: "Peak season runs from November to February. Book early for Christmas, New Year and long weekends. Shoulder months (October, March) often offer better availability and rates with excellent weather.",
  },
];

const FAQS = [
  {
    q: "How much does a luxury villa in Goa cost?",
    a: "Nightly rates typically start around ₹15,000 for smaller villas and can exceed ₹80,000 for large estates. Final pricing depends on dates, bedrooms and inclusions.",
  },
  {
    q: "Which areas are best for a villa stay?",
    a: "Assagao and Anjuna are popular for convenience. Candolim and Calangute suit beach lovers. South Goa destinations like Palolem and Cavelossim are quieter.",
  },
  {
    q: "Do all villas have private swimming pools?",
    a: "Most properties in our collection feature a private pool. Beachfront homes may offer direct beach access instead — check each listing.",
  },
  {
    q: "Is housekeeping or a private chef included?",
    a: "Daily housekeeping is included at most villas. Private chef and catering can be arranged on request.",
  },
  {
    q: "Can I book a villa for a large group?",
    a: "Yes. We offer estates sleeping 10–14+ guests. Filter by bedrooms and guests to find suitable options.",
  },
  {
    q: "Are the villas suitable for children?",
    a: "Many villas are family-friendly with enclosed gardens and safe pool areas. Ask our specialists about child-friendly properties.",
  },
  {
    q: "Can I host a private event or celebration?",
    a: "Selected villas allow celebrations and small gatherings. Share your plans and we will recommend event-friendly homes.",
  },
  {
    q: "How do I check availability?",
    a: "Use the search bar with your dates, or send an enquiry. Our specialists typically respond within 30 minutes during working hours.",
  },
];

const PER_PAGE = 6;

function RichText({ html }: { html: string }) {
  const safe = html.replace(/<(?!\/?(strong|em|b|br)\b)[^>]*>/gi, "");
  return <span dangerouslySetInnerHTML={{ __html: safe }} />;
}

export default function VillasListingPage({
  villas,
  locations,
  amenityCounts,
  priceBounds,
  reviews,
  hero,
  placeName = "Goa",
  presetLocation = "",
  singleHeroImage = false,
  hideHeroStats = false,
}: {
  villas: Villa[];
  locations: GoaLocation[];
  amenityCounts: Record<string, number>;
  priceBounds: { min: number; max: number };
  reviews: PublicReview[];
  hero: ListingHero;
  placeName?: string;
  presetLocation?: string;
  singleHeroImage?: boolean;
  hideHeroStats?: boolean;
}) {
  const areaNames = locations
    .map((location) => location.name)
    .filter((name) => name !== "North Goa" && name !== "South Goa");
  const priceStep = priceBounds.max - priceBounds.min > 20000 ? 500 : 100;
  const searchParams = useSearchParams();
  const initialLocation = presetLocation || searchParams.get("location") || "";
  const initialGuests = Number(searchParams.get("guests") || 0);
  const initialBedrooms = Number(
    String(searchParams.get("bedrooms") || "0").replace("+", "")
  );

  const [region, setRegion] = useState<"all" | "north" | "south">("all");
  const [areas, setAreas] = useState<string[]>(
    initialLocation ? [initialLocation] : []
  );
  const [priceMin, setPriceMin] = useState(priceBounds.min);
  const [priceMax, setPriceMax] = useState(priceBounds.max);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [guests, setGuests] = useState(initialGuests);
  const [amenityKeys, setAmenityKeys] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [guideTab, setGuideTab] = useState(GUIDE[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testimonial, setTestimonial] = useState(0);

  const [dest, setDest] = useState(initialLocation || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [barGuests, setBarGuests] = useState(String(initialGuests || ""));
  const [barBeds, setBarBeds] = useState(String(initialBedrooms || ""));

  const filtered = useMemo(() => {
    let list = [...villas];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((v) =>
        [v.name, v.slug, v.location, v.region, v.shortDescription, v.id]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (propertyType) {
      list = list.filter((v) => v.propertyType === propertyType);
    }
    if (region === "north") list = list.filter((v) => v.region === "North Goa");
    if (region === "south") list = list.filter((v) => v.region === "South Goa");
    if (areas.length) {
      list = list.filter((v) =>
        areas.some((a) =>
          a === "South Goa" || a === "North Goa"
            ? v.region === a
            : v.location === a
        )
      );
    }
    list = list.filter((v) => v.price >= priceMin && v.price <= priceMax);
    if (bedrooms >= 10) list = list.filter((v) => v.bedrooms >= 10);
    else if (bedrooms > 0) list = list.filter((v) => v.bedrooms === bedrooms);
    if (guests) list = list.filter((v) => v.guests >= guests);
    for (const key of amenityKeys) {
      list = list.filter((v) => matchAmenity(v, key));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [
    query,
    propertyType,
    region,
    areas,
    priceMin,
    priceMax,
    bedrooms,
    guests,
    amenityKeys,
    sort,
    villas,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleArea(a: string) {
    setPage(1);
    setAreas((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }
  function toggleAmenity(k: string) {
    setPage(1);
    setAmenityKeys((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }
  function clearAll() {
    setRegion("all");
    setAreas([]);
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
    setBedrooms(0);
    setGuests(0);
    setAmenityKeys([]);
    setQuery("");
    setPropertyType(null);
    setDest("");
    setCheckIn("");
    setCheckOut("");
    setBarGuests("");
    setBarBeds("");
    setPage(1);
  }
  function applySearchBar() {
    setPage(1);
    if (dest === "North Goa") setRegion("north");
    else if (dest === "South Goa") setRegion("south");
    else if (dest && dest !== "Anywhere in Goa") {
      setAreas([dest]);
      setRegion("all");
    } else {
      setAreas([]);
      setRegion("all");
    }
    setGuests(Number(barGuests) || 0);
    setBedrooms(barBeds ? Number(barBeds) : 0);
  }

  const displayHero = useMemo(() => {
    const selectedName = areas.length === 1 ? areas[0] : "";
    const selected = selectedName
      ? locations.find(
          (location) => location.name.toLowerCase() === selectedName.toLowerCase()
        )
      : undefined;
    if (!selected) return hero;
    return {
      ...hero,
      eyebrow: `Handpicked Villas · ${selected.region || selected.name}`,
      heading:
        selected.detailHeading?.trim() ||
        `Luxury Villas in ${selected.name} for an Exceptional Private Stay`,
      paragraph1:
        selected.description?.trim() ||
        `Explore our handpicked collection of luxury villas in ${selected.name}.`,
      paragraph2: "",
      badge: [selected.name, selected.region].filter(Boolean).join(" · ").toUpperCase(),
      image: selected.image || hero.image,
      imageSmall: selected.image || hero.imageSmall,
    };
  }, [areas, hero, locations]);

  const activeGuide = GUIDE.find((g) => g.id === guideTab) || GUIDE[0];
  const fallbackTestimonials = [
    {
      quote:
        "Casa Azure felt like our own Goan home by day two. The housekeeping team remembered how the children liked their breakfast laid out, and the pool was cleaned before we woke each morning. We have already booked again.",
      name: "Ananya Sharma",
      place: "Mumbai, India",
      tag: "FAMILY",
      stay: "Stayed at Casa Azure, Assagao",
    },
    {
      quote:
        "From recommendation to check-in, everything was seamless. The villa was exactly as described and the local tips made our anniversary weekend special.",
      name: "James Whitfield",
      place: "London, UK",
      tag: "COUPLE",
      stay: "Stayed at Villa Palmar, Anjuna",
    },
    {
      quote:
        `We booked for a family reunion of twelve. Spacious, private, and the chef dinners were outstanding. ${BRAND} handled every detail.`,
      name: "Priya & Rohan",
      place: "Bengaluru, India",
      tag: "GROUP",
      stay: "Stayed at Casa Morjim, Morjim",
    },
  ];
  const testimonials = reviews.length
    ? reviews.map((review) => ({
        quote: review.quote,
        name: review.name,
        place: review.place,
        tag: review.tag,
        stay: review.stay,
      }))
    : fallbackTestimonials;
  const t = testimonials[testimonial % testimonials.length];
  const reviewTotal = villas.reduce((sum, villa) => sum + villa.reviews, 0);
  const averageRating = villas.length
    ? (
        villas.reduce((sum, villa) => sum + villa.rating, 0) / villas.length
      ).toFixed(1)
    : "4.9";

  const PROPERTY_TYPES = [
    { id: "apartments", label: "Apartments", Icon: Building2 },
    { id: "classic", label: "Classic", Icon: Home },
    { id: "budgeted", label: "Budgeted", Icon: Clock },
    { id: "luxe", label: "Luxe", Icon: Star },
  ] as const;

  const BHK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

  const LOCATION_FILTERS = ["North Goa", "South Goa", ...areaNames];

  const FiltersPanel = (
    <aside className="bg-[#FCFAF4] border border-[#E4DBC5] rounded-2xl p-5 md:p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-[#A9853C]">
            Refine
          </p>
          <b className="font-display text-xl md:text-2xl text-[#1F3528] font-medium">
            Filter Villas
          </b>
        </div>
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setShowFilters(false)}
          className="lg:hidden p-1 text-[#5C6152]"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A9853C]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or area..."
            className="w-full rounded-full border border-[#D3C7A8] bg-[#F6F1E6]/80 pl-10 pr-4 py-2.5 text-sm text-[#1F3528] placeholder:text-[#8A8F7E] outline-none focus:border-[#A9853C] focus:bg-white transition"
          />
        </label>
      </div>

      {/* Property type — compact chips */}
      <div className="pb-5 mb-5 border-b border-[#E4DBC5]">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Property type
        </p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(({ id, label, Icon }) => {
            const active = propertyType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPropertyType(active ? null : id);
                  setPage(1);
                }}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[0.75rem] font-semibold transition",
                  active
                    ? "bg-[#1F3528] border-[#1F3528] text-[#F6F1E6]"
                    : "bg-transparent border-[#D3C7A8] text-[#5C6152] hover:border-[#A9853C] hover:text-[#1F3528]"
                )}
              >
                <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* BHK — circular buttons */}
      <div className="pb-5 mb-5 border-b border-[#E4DBC5]">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Bedrooms (BHK)
        </p>
        <div className="grid grid-cols-5 gap-2">
          {BHK_OPTIONS.map((n) => {
            const active = bedrooms === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setBedrooms(active ? 0 : n);
                  setPage(1);
                }}
                className={clsx(
                  "aspect-square w-full max-w-[2.75rem] mx-auto rounded-full text-[0.8rem] font-bold transition border",
                  active
                    ? "bg-[#1F3528] border-[#1F3528] text-[#F6F1E6]"
                    : "bg-transparent border-[#D3C7A8] text-[#5C6152] hover:border-[#A9853C]"
                )}
              >
                {n === 10 ? "10+" : n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guests */}
      <div className="pb-5 mb-5 border-b border-[#E4DBC5]">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Guests
        </p>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 6, 8, 10, 12].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setGuests(n);
                setPage(1);
              }}
              className={clsx(
                "px-3.5 h-9 rounded-full text-[0.78rem] font-bold transition border",
                guests === n
                  ? "bg-[#1F3528] border-[#1F3528] text-[#F6F1E6]"
                  : "bg-transparent border-[#D3C7A8] text-[#5C6152] hover:border-[#A9853C]"
              )}
            >
              {n === 0 ? "Any" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Location — fully open, no nested scroll */}
      <div className="pb-5 mb-5 border-b border-[#E4DBC5]">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Location
        </p>
        <div className="flex flex-col gap-0.5">
          {LOCATION_FILTERS.map((loc) => {
            const checked =
              loc === "North Goa"
                ? region === "north"
                : loc === "South Goa"
                  ? region === "south"
                  : areas.includes(loc);
            return (
              <label
                key={loc}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer text-[0.88rem] font-medium text-[#1F3528]"
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={checked}
                  onChange={() => {
                    setPage(1);
                    if (loc === "North Goa") {
                      setRegion((r) => (r === "north" ? "all" : "north"));
                      return;
                    }
                    if (loc === "South Goa") {
                      setRegion((r) => (r === "south" ? "all" : "south"));
                      return;
                    }
                    toggleArea(loc);
                  }}
                />
                <span className="size-[18px] rounded-[5px] border-[1.5px] border-[#D3C7A8] bg-white peer-checked:bg-[#1F3528] peer-checked:border-[#1F3528] relative shrink-0 after:content-[''] after:absolute after:left-[4px] after:top-[3px] after:w-[8px] after:h-[5px] after:border-l-2 after:border-b-2 after:border-[#F6F1E6] after:-rotate-45 after:opacity-0 peer-checked:after:opacity-100" />
                {loc}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="pb-5 mb-5 border-b border-[#E4DBC5]">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Price per night
        </p>
        <div className="flex justify-between text-sm text-[#5C6152] mb-3">
          <span>₹{priceMin.toLocaleString("en-IN")}</span>
          <span>₹{priceMax.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={priceStep}
          value={priceMin}
          onChange={(e) => {
            setPriceMin(Math.min(Number(e.target.value), priceMax - priceStep));
            setPage(1);
          }}
          className="w-full accent-[#A9853C]"
        />
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={priceStep}
          value={priceMax}
          onChange={(e) => {
            setPriceMax(Math.max(Number(e.target.value), priceMin + priceStep));
            setPage(1);
          }}
          className="w-full accent-[#A9853C] mt-1"
        />
      </div>

      {/* Amenities */}
      <div className="pb-2">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#1F3528] mb-3">
          Amenities
        </p>
        <div className="flex flex-col gap-0.5">
          {AMENITY_FILTERS.map((a) => (
            <label
              key={a.key}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer text-[0.88rem] font-medium text-[#1F3528]"
            >
              <input
                type="checkbox"
                className="sr-only peer"
                checked={amenityKeys.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
              />
              <span className="size-[18px] rounded-[5px] border-[1.5px] border-[#D3C7A8] bg-white peer-checked:bg-[#1F3528] peer-checked:border-[#1F3528] relative shrink-0 after:content-[''] after:absolute after:left-[4px] after:top-[3px] after:w-[8px] after:h-[5px] after:border-l-2 after:border-b-2 after:border-[#F6F1E6] after:-rotate-45 after:opacity-0 peer-checked:after:opacity-100" />
              <span className="flex-1">{a.label}</span>
              <small className="text-[0.72rem] text-[#8A8F7E]">
                {amenityCounts[a.key] || 0}
              </small>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowFilters(false)}
        className="lg:hidden w-full mt-4 bg-[#1F3528] text-[#F6F1E6] rounded-full py-3 text-xs font-bold tracking-[0.1em] uppercase"
      >
        Show {filtered.length} Villas
      </button>
      <button
        type="button"
        onClick={clearAll}
        className="mt-4 text-sm text-[#8A6C2D] underline underline-offset-4 hover:text-[#1F3528]"
      >
        Clear all filters
      </button>
    </aside>
  );

  return (
    <>
      <div className="bg-[#F6F1E6] min-h-screen pt-[6.5rem] md:pt-[7.25rem]">
        {placeName === "Goa" ? null : (
        <div className="mx-auto w-[min(1240px,92%)] pt-6 pb-2">
          <p className="text-sm text-[#5C6152]">
            <Link href="/" className="hover:text-[#1F3528]">
              Home
            </Link>{" "}
            <span className="mx-1">&gt;</span>{" "}
            <span className="text-[#1F3528]">Villas in {placeName}</span>
          </p>
        </div>
        )}

        {/* Hero */}
        <section className="mx-auto w-[min(1240px,92%)] pb-14 md:pb-16 pt-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
              <span className="w-[30px] h-px bg-[#A9853C]" />
              {displayHero.eyebrow}
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,4.6vw,3.75rem)] leading-[1.06] text-[#1F3528] font-medium">
              {displayHero.heading}
            </h1>
            <p className="mt-6 text-[#5C6152] leading-relaxed [&_strong]:font-semibold [&_strong]:text-[#1F3528]">
              <RichText html={displayHero.paragraph1} />
            </p>
            {displayHero.paragraph2 ? (
              <p className="mt-4 text-[#5C6152] leading-relaxed [&_strong]:font-semibold [&_strong]:text-[#1F3528]">
                <RichText html={displayHero.paragraph2} />
              </p>
            ) : null}
            {hideHeroStats ? null : (
            <div className="mt-9 flex flex-wrap divide-x divide-[#D3C7A8]">
              {[
                [String(villas.length), displayHero.villasLabel],
                [`${averageRating} ★`, displayHero.ratingLabel],
                [displayHero.response, displayHero.responseLabel],
              ].map(([stat, label]) => (
                <div key={label} className="px-6 first:pl-0">
                  <p className="font-display text-3xl text-[#1F3528]">{stat}</p>
                  <p className="text-[0.68rem] tracking-[0.14em] uppercase text-[#5C6152] mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            )}
          </Reveal>

          <Reveal delay={80}>
            <div className="relative max-w-lg ml-auto">
              <div className={`absolute -right-3 top-8 ${singleHeroImage ? "bottom-8" : "bottom-12"} w-[90%] border border-[#A9853C]/45 rounded-[1.5rem] pointer-events-none`} />
              <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-[0_22px_55px_-24px_rgba(35,40,31,.28)]">
                <OptImage
                  src={displayHero.image}
                  alt={imageAlt(displayHero.image, displayHero.heading)}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
                <div className="absolute top-5 right-5 rounded-full bg-[#FCFAF4] px-4 py-2 text-[0.68rem] tracking-[0.12em] uppercase text-[#1F3528] shadow flex items-center gap-2 border border-[#E4DBC5]">
                  <MapPin className="size-3.5 text-[#A9853C]" />
                  {displayHero.badge}
                </div>
              </div>
              {singleHeroImage ? null : (
              <div className="absolute -bottom-5 left-4 md:left-8 w-36 md:w-44 aspect-[4/5] rounded-2xl overflow-hidden border-4 border-[#F6F1E6] shadow-xl">
                <OptImage
                  src={displayHero.imageSmall}
                  alt={imageAlt(displayHero.imageSmall, displayHero.badge)}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* Search */}
        <section className="mx-auto w-[min(1240px,92%)] pb-12">
          <div className="bg-[#FCFAF4] border border-[#E4DBC5] rounded-2xl shadow-[0_22px_55px_-24px_rgba(35,40,31,.28)] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_.85fr_.85fr_auto]">
            <SearchField label="Destination or area">
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base sm:text-[0.95rem] font-semibold text-[#1F3528] outline-none"
              >
                <option value="">Anywhere in Goa</option>
                <option value="North Goa">North Goa</option>
                <option value="South Goa">South Goa</option>
                {areaNames.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Check-in">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base sm:text-[0.95rem] font-semibold text-[#1F3528] outline-none [color-scheme:light]"
              />
            </SearchField>
            <SearchField label="Check-out">
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base sm:text-[0.95rem] font-semibold text-[#1F3528] outline-none [color-scheme:light]"
              />
            </SearchField>
            <SearchField label="Guests">
              <select
                value={barGuests}
                onChange={(e) => setBarGuests(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base sm:text-[0.95rem] font-semibold text-[#1F3528] outline-none"
              >
                <option value="">Any</option>
                {["2", "4", "6", "8", "10", "12", "14", "16"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Bedrooms" last>
              <select
                value={barBeds}
                onChange={(e) => setBarBeds(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base sm:text-[0.95rem] font-semibold text-[#1F3528] outline-none"
              >
                <option value="">Any</option>
                {["1", "2", "3", "4", "5"].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </SearchField>
            <div className="flex flex-col sm:flex-row xl:flex-col items-stretch xl:items-center justify-center gap-2 p-4 px-5 md:col-span-2 xl:col-span-1">
              <button
                type="button"
                onClick={applySearchBar}
                className="inline-flex items-center justify-center gap-2 bg-[#1F3528] text-[#F6F1E6] px-6 py-3.5 rounded-full text-[0.72rem] font-bold tracking-[0.12em] uppercase hover:bg-[#16241C] transition w-full xl:w-auto"
              >
                <Search className="size-4 text-[#A9853C]" />
                Search Villas
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#5C6152] border-b border-[#D3C7A8]"
              >
                Clear Search
              </button>
            </div>
          </div>
        </section>

        {/* Filters + grid */}
        <section className="mx-auto w-[min(1240px,92%)] pb-20">
          <div className="flex lg:hidden mb-5">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#D3C7A8] bg-[#FCFAF4] px-4 py-2.5 text-sm font-semibold text-[#1F3528]"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>

          <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 xl:gap-11 items-start">
            {/* Desktop: sticky panel with max-height + vertical scroll so every filter is reachable */}
            <div className="hidden lg:block lg:sticky lg:top-28 self-start">
              <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto overscroll-contain rounded-2xl [scrollbar-gutter:stable] pr-0.5">
                {FiltersPanel}
              </div>
            </div>
            {showFilters && (
              <div className="fixed inset-0 z-[70] lg:hidden">
                <button
                  type="button"
                  className="absolute inset-0 bg-[#1F3528]/40"
                  aria-label="Close"
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute inset-y-0 left-0 w-[min(100%,380px)] h-full overflow-y-auto overscroll-contain p-4 bg-[#F6F1E6]">
                  {FiltersPanel}
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h2 className="font-display text-[clamp(1.45rem,2.4vw,1.9rem)] text-[#1F3528]">
                  {filtered.length} Luxury Villas Available in {placeName}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex rounded-full border border-[#E4DBC5] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setView("grid")}
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase",
                        view === "grid"
                          ? "bg-[#1F3528] text-[#F6F1E6]"
                          : "bg-[#FCFAF4] text-[#5C6152]"
                      )}
                    >
                      <LayoutGrid className="size-3.5" />
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("map")}
                      className={clsx(
                        "inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.65rem] font-bold tracking-[0.12em] uppercase",
                        view === "map"
                          ? "bg-[#1F3528] text-[#F6F1E6]"
                          : "bg-[#FCFAF4] text-[#5C6152]"
                      )}
                    >
                      <Map className="size-3.5" />
                      Map
                    </button>
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-full border border-[#E4DBC5] bg-[#FCFAF4] px-4 py-2 text-sm font-semibold text-[#1F3528] outline-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Guest Rating</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {view === "map" ? (
                <div className="rounded-2xl border border-[#E4DBC5] bg-[#FCFAF4] overflow-hidden min-h-[480px] relative">
                  <OptImage
                    src={images.aerial}
                    alt="Goa map preview"
                    fill
                    className="object-cover opacity-80"
                    sizes="70vw"
                  />
                  <div className="absolute inset-0 bg-[#1F3528]/30" />
                  <p className="absolute bottom-5 left-5 right-5 text-sm text-[#F6F1E6]">
                    Marker locations are approximate to protect the privacy of
                    our homes and guests.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-[#E4DBC5] bg-[#FCFAF4] p-10 text-center">
                  <p className="font-display text-2xl text-[#1F3528]">
                    No villas match your filters just yet
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-5 text-sm text-[#8A6C2D] underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-7 md:grid-cols-2">
                    {pageItems.map((villa) => (
                      <ListingVillaCard key={villa.id} villa={villa} />
                    ))}
                  </div>
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="size-10 rounded-full border border-[#E4DBC5] flex items-center justify-center text-[#1F3528] disabled:opacity-40"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPage(n)}
                          className={clsx(
                            "size-10 rounded-full text-sm font-semibold",
                            page === n
                              ? "bg-[#1F3528] text-[#F6F1E6]"
                              : "text-[#1F3528] hover:bg-[#EDE4D0]"
                          )}
                        >
                          {n}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="inline-flex items-center gap-1 px-4 h-10 rounded-full border border-[#E4DBC5] text-sm font-semibold text-[#1F3528] disabled:opacity-40"
                    >
                      Next <ChevronRight className="size-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Locations mosaic */}
        <section className="py-20 md:py-24 border-t border-[#E4DBC5]/80">
          <div className="mx-auto w-[min(1240px,92%)]">
            <Reveal>
              <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
                <span className="w-[30px] h-px bg-[#A9853C]" />
                Goa, by Neighbourhood
              </div>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1F3528]">
                Browse Villas by Location
              </h2>
              <p className="mt-4 max-w-2xl text-[#5C6152]">
                From leafy Assagao lanes to quiet South Goa shores — explore
                villas by the neighbourhood that suits your trip.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
              {locations.slice(0, 8).map((loc, i) => (
                <Link
                  key={loc.name}
                  href={locationHref(loc)}
                  className={clsx(
                    "group relative overflow-hidden rounded-2xl text-left",
                    i === 0 && "row-span-2 col-span-1",
                    i === 1 && "md:col-span-2",
                    i > 3 && "md:col-span-1"
                  )}
                >
                  <OptImage
                    src={loc.image}
                    alt={imageAlt(loc.image, loc.name)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3528]/85 via-[#1F3528]/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-[#F6F1E6]">
                    <h3 className="font-display text-xl md:text-2xl">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#F6F1E6]/75 mt-1">
                      Villas in {loc.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Villa types */}
        <section className="bg-[#1F3528] text-[#F6F1E6] py-20 md:py-24">
          <div className="mx-auto w-[min(1240px,92%)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
                  <span className="w-[30px] h-px bg-[#A9853C]" />
                  Curated Collections
                </div>
                <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.5rem)]">
                  Browse by Villa Type
                </h2>
              </div>
              <p className="max-w-md text-[#F6F1E6]/75 text-sm leading-relaxed">
                Every stay is different. Explore our collections, each curated
                around the way you like to travel.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-x-16">
              {VILLA_TYPES.map((type, i) => (
                <Link
                  key={type}
                  href="/villas"
                  className="group flex items-center justify-between gap-4 py-5 border-b border-[#F6F1E6]/15 hover:border-[#A9853C]/50 transition"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="text-[#A9853C] text-sm font-medium tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl md:text-2xl">
                      {type}
                    </span>
                  </span>
                  <ArrowRight className="size-4 text-[#A9853C] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Standard */}
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1240px,92%)] grid lg:grid-cols-2 gap-14 lg:gap-20">
            <Reveal>
              <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
                <span className="w-[30px] h-px bg-[#A9853C]" />
                The {BRAND} Standard
              </div>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1F3528] leading-tight">
                Luxury Villas, Personally Selected for Your Stay
              </h2>
              <p className="mt-5 text-[#5C6152] leading-relaxed">
                We only list villas we would stay in ourselves. Each home is
                reviewed for comfort, privacy, location and guest experience —
                then supported by specialists on the ground in Goa.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 text-[0.72rem] font-bold tracking-[0.14em] uppercase text-[#1F3528] border-b border-[#1F3528] pb-1"
              >
                How We Handpick Our Villas <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
            <div className="divide-y divide-[#E4DBC5]">
              {STANDARDS.map((item) => (
                <div key={item.title} className="flex gap-4 py-5 first:pt-0">
                  <div className="size-11 rounded-full border border-[#D3C7A8] flex items-center justify-center shrink-0">
                    <item.icon className="size-4 text-[#A9853C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F3528]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#5C6152] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#EDE4D0]/55 py-20 md:py-24">
          <div className="mx-auto w-[min(1240px,92%)]">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1F3528]">
                  Stories From Our Guests
                </h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-[#5C6152]">
                  <span className="inline-flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-[#A9853C] text-[#A9853C]"
                      />
                    ))}
                  </span>
                  {averageRating} out of 5 — {reviewTotal.toLocaleString("en-IN")} verified guest reviews
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#5C6152] tabular-nums">
                  {String(testimonial + 1).padStart(2, "0")} —{" "}
                  {String(testimonials.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() =>
                    setTestimonial(
                      (t) => (t - 1 + testimonials.length) % testimonials.length
                    )
                  }
                  className="size-10 rounded-full border border-[#D3C7A8] flex items-center justify-center"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() =>
                    setTestimonial((t) => (t + 1) % testimonials.length)
                  }
                  className="size-10 rounded-full border border-[#D3C7A8] flex items-center justify-center"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex gap-0.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-[#A9853C] text-[#A9853C]"
                  />
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-3xl text-[#1F3528] leading-snug italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <p className="font-semibold text-[#1F3528]">{t.name}</p>
                <span className="text-[#5C6152]">{t.place}</span>
                <span className="rounded-full bg-[#FCFAF4] border border-[#E4DBC5] px-3 py-1 text-[0.62rem] font-bold tracking-[0.12em] uppercase text-[#5C6152]">
                  {t.tag}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#5C6152]">{t.stay}</p>
            </div>
          </div>
        </section>

        {/* Guide */}
        <section className="py-20 md:py-28">
          <div className="mx-auto w-[min(1240px,92%)] grid lg:grid-cols-[240px_1fr] gap-12 lg:gap-16 items-start">
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C] mb-6">
                <span className="w-[30px] h-px bg-[#A9853C]" />
                Goa Villa Guide
              </div>
              <nav className="divide-y divide-[#E4DBC5]">
                {GUIDE.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGuideTab(g.id)}
                    className={clsx(
                      "block w-full text-left py-4 text-sm font-semibold transition",
                      guideTab === g.id
                        ? "text-[#1F3528]"
                        : "text-[#5C6152] hover:text-[#1F3528]"
                    )}
                  >
                    {g.title}
                  </button>
                ))}
              </nav>
            </aside>
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] text-[#1F3528]">
                Find the Right Luxury Villa in Goa
              </h2>
              <h3 className="mt-10 font-display text-2xl text-[#1F3528]">
                {activeGuide.heading}
              </h3>
              <p className="mt-4 text-[#5C6152] leading-relaxed text-lg first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-[#1F3528]">
                {activeGuide.body}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-20 md:pb-28">
          <div className="mx-auto w-[min(800px,92%)]">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
                <span className="w-8 h-px bg-[#A9853C]" />
                Good to Know
                <span className="w-8 h-px bg-[#A9853C]" />
              </div>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,3vw,2.5rem)] text-[#1F3528]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-y divide-[#E4DBC5] border-y border-[#E4DBC5]">
              {FAQS.map((faq, i) => (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-lg md:text-xl text-[#1F3528]">
                      {faq.q}
                    </span>
                    <span className="size-9 rounded-full border border-[#E4DBC5] flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={clsx(
                          "size-4 text-[#A9853C] transition",
                          openFaq === i && "rotate-180"
                        )}
                      />
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 text-[#5C6152] leading-relaxed pr-12">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 md:py-28 overflow-hidden">
          <OptImage
            src={images.cta}
            alt="Private Goa escape"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#1F3528]/82" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-[#F6F1E6]">
            <div className="inline-flex flex-col items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase text-[#A9853C]">
              <span className="w-10 h-px bg-[#A9853C]" />
              {BRAND} · Goa
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl">
              Your Private Goa Escape Starts Here
            </h2>
            <p className="mt-5 text-[#F6F1E6]/80 leading-relaxed">
              Browse exclusive villas or speak with our team for personalised
              recommendations based on your dates and group size.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 600, behavior: "smooth" });
                }}
                className="rounded-full bg-[#F6F1E6] text-[#1F3528] px-7 py-3.5 text-[0.72rem] font-bold tracking-[0.12em] uppercase"
              >
                Explore Available Villas
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-[#F6F1E6]/40 text-[#F6F1E6] px-7 py-3.5 text-[0.72rem] font-bold tracking-[0.12em] uppercase hover:bg-[#F6F1E6] hover:text-[#1F3528] transition"
              >
                Speak to Our Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function matchAmenity(v: Villa, key: string): boolean {
  if (key === "instant") return !!v.instantBooking;
  if (v.amenityKeys?.includes(key)) return true;
  if (key === "pool") return v.amenities.some((x) => /pool/i.test(x));
  if (key === "beach")
    return (
      v.tags.some((t) => /beach/i.test(t)) ||
      v.amenities.some((x) => /beach/i.test(x))
    );
  if (key === "pet") return v.tags.some((t) => /pet/i.test(t));
  if (key === "chef") return v.amenities.some((x) => /chef/i.test(x));
  if (key === "hk") return v.amenities.some((x) => /housekeep/i.test(x));
  if (key === "family") return v.tags.some((t) => /family/i.test(t));
  if (key === "sea")
    return (
      v.tags.some((t) => /sea/i.test(t)) ||
      v.amenities.some((x) => /sea/i.test(x))
    );
  if (key === "event")
    return /wedding|event|celebration/i.test(
      v.shortDescription + v.tags.join(" ")
    );
  return !!v.amenityKeys?.includes(key);
}

function SearchField({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={clsx(
        "p-4 sm:p-[18px_22px] border-b md:border-b-0 xl:border-r border-[#E4DBC5] flex flex-col gap-1.5",
        last && "xl:border-r"
      )}
    >
      <label className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5C6152]">
        {label}
      </label>
      {children}
    </div>
  );
}

import { OptImage } from "@/components/OptImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Bath,
  BedDouble,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Share2,
  Star,
  Users,
  Waves,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VillaBookingCard } from "@/components/VillaBookingCard";
import { VillaCard } from "@/components/VillaCard";
import { VillaFaqs } from "@/components/VillaFaqs";
import { VillaGallery } from "@/components/VillaGallery";
import { imageAlt } from "@/lib/image-alt";
import { getVillaDetail } from "@/app/actions/villas";
import { images, type GuestReview } from "@/data/villas";
import {
  descriptionParagraphs,
  villaDescriptionHtml,
  villaHasPool,
} from "@/lib/villa-api";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_CANCELLATION_POLICY = [
  "45 Days or More Before Check-in: 90% refund of the booking amount.",
  "44–30 Days Before Check-in: 75% refund of the booking amount.",
  "29–15 Days Before Check-in: 50% refund of the booking amount.",
  "Less Than 15 Days Before Check-in: No refund applicable.",
  "Peak Dates and Long Weekends: All bookings are non-refundable and non-amendable.",
  "Peak Period (23rd December – 5th January): All bookings are non-refundable and non-amendable.",
  "Lockdown Policy: In case of a lockdown in Goa or the guest’s city of origin, a 100% refund of the total booking value will be provided.",
  "Refund Processing: Refunds will be initiated within 5–7 working days from the date of cancellation.",
  "International Payments: Refund amounts are subject to the prevailing exchange rate at the time of processing.",
  "Full Payment Requirement: Refunds or credits are applicable only when 100% payment has been received as per the booking policy. No refund or credit will be provided for partially paid bookings.",
  "Cancellation and Modification Requests: All cancellation or modification requests must be communicated via email. Requests made through other channels will not be considered valid.",
];

function policyHasText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length > 0;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { villa } = await getVillaDetail(slug);
  if (!villa) return { title: "Villa not found" };
  return {
    title: {
      absolute:
        villa.metaTitle ||
        `${villa.name} | Luxury Villa in ${villa.location}, ${villa.region}`,
    },
    description: villa.metaDescription || villa.shortDescription || undefined,
  };
}

function scoreAverage(reviews: GuestReview[], key: keyof GuestReview) {
  const values = reviews
    .map((review) => review[key])
    .filter((value): value is number => typeof value === "number" && value > 0);
  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function reviewBars(reviews: GuestReview[]) {
  const rows: [string, keyof GuestReview][] = [
    ["Cleanliness", "cleanliness_rating"],
    ["Accuracy", "accuracy_rating"],
    ["Service", "communication_rating"],
    ["Location", "location_rating"],
    ["Value", "value_rating"],
  ];
  return rows
    .map(([label, key]) => {
      const score = scoreAverage(reviews, key);
      if (score == null) return null;
      return [label, score.toFixed(1), Math.round((score / 5) * 100)] as const;
    })
    .filter((row): row is readonly [string, string, number] => Boolean(row));
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params;
  const { villa, faqs } = await getVillaDetail(slug);
  if (!villa) notFound();

  const gallery = villa.gallery.length ? villa.gallery : [villa.image];
  const descriptionHtml = villaDescriptionHtml(villa.description);
  const paragraphs = descriptionHtml ? [] : descriptionParagraphs(villa.description);
  const hasPool = villaHasPool(villa);
  const rooms = villa.rooms ?? [];
  const attractions = villa.attractions ?? [];
  const locationProfile = villa.locationProfile;
  const nearby = locationProfile ? locationProfile.places : attractions;
  const locationTitle =
    locationProfile?.heading || `${villa.location}, ${villa.region}`;
  const locationCopy =
    locationProfile?.description ||
    villa.address ||
    `${villa.name} is in ${villa.location}, ${villa.region}. The exact pin is shared after booking.`;
  const locationImage =
    locationProfile?.image || gallery[gallery.length - 1] || images.aerial;
  const guestReviews = villa.guestReviews ?? [];
  const similar = (villa.similar ?? []).slice(0, 3);
  const cancellationSource = villa.houseRules?.cancellation?.trim() ?? "";
  const hasCustomCancellation = policyHasText(cancellationSource);
  const cancellationHtml = hasCustomCancellation ? villaDescriptionHtml(cancellationSource) : "";
  const rulesContentSource = villa.houseRules?.content?.trim() ?? "";
  const rulesContentHtml = rulesContentSource ? villaDescriptionHtml(rulesContentSource) : "";
  const bars = reviewBars(guestReviews);
  const nearest = nearby[0];

  return (
    <div className="bg-[#F6F1E6] min-h-screen">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-32 md:pt-36">
        <nav style={{display: 'none'}}
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-forest/60"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span className="text-gold/50">/</span>
          <Link href="/villas" className="hover:text-gold transition-colors">
            Villas in Goa
          </Link>
          <span className="text-gold/50">/</span>
          <Link
            href={`/villas?location=${encodeURIComponent(villa.location)}`}
            className="hover:text-gold transition-colors"
          >
            {villa.location}
          </Link>
          <span className="text-gold/50">/</span>
          <span className="text-forest">{villa.name}</span>
        </nav>
      </div>

      <VillaGallery
        name={villa.name}
        images={gallery}
        videoTour={villa.videos?.[0]}
      />

      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-2 md:pt-4">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl sm:text-3xl md:text-[2.75rem] text-forest leading-[1.15] tracking-tight">
                {villa.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-gold" />
                  {villa.location}, {villa.region}
                </span>
                <span style={{display: 'none'}} className="text-gold/40">·</span>
                <span style={{display: 'none'}}  className="inline-flex items-center gap-1.5">
                  <Star className="size-4 fill-gold text-gold" />
                  {villa.rating}
                </span>
                <a style={{display: 'none'}}  href="#reviews" className="underline underline-offset-2 hover:text-forest">
                  {villa.reviews} reviews
                </a>
              </div>
              {villa.shortDescription ? (
                <p className="mt-5 text-muted leading-relaxed max-w-2xl">
                  {villa.shortDescription}
                </p>
              ) : null}
            </div>
            <div className="flex gap-3 shrink-0 md:pt-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-beige-dark/60 bg-ivory/60 px-4 py-2 text-sm text-forest hover:border-gold transition"
              >
                <Heart className="size-4" /> Save
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-beige-dark/60 bg-ivory/60 px-4 py-2 text-sm text-forest hover:border-gold transition"
              >
                <Share2 className="size-4" /> Share
              </button>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-forest border-y border-beige-dark/50 py-5">
            <li className="inline-flex items-center gap-2">
              <Users className="size-4 text-gold" />
              {villa.guests}+ Guests
            </li>
            <li className="inline-flex items-center gap-2">
              <BedDouble className="size-4 text-gold" />
              {villa.bedrooms} Bedrooms
            </li>
            <li className="inline-flex items-center gap-2">
              <BedDouble className="size-4 text-gold" />
              {villa.beds} Beds
            </li>
            <li className="inline-flex items-center gap-2">
              <Bath className="size-4 text-gold" />
              {villa.bathrooms} Bathrooms
            </li>
            {hasPool ? (
              <li className="inline-flex items-center gap-2">
                <Waves className="size-4 text-gold" />
                Private Pool
              </li>
            ) : null}
            {nearest ? (
              <li className="inline-flex items-center gap-2 text-muted">
                <MapPin className="size-4 text-gold" />
                {nearest.distance} to {nearest.name}
              </li>
            ) : null}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-12 md:pb-20 grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-14">
        <div className="order-2 lg:order-1 min-w-0">
          <Reveal>
            <div className="py-8">
              <p className="section-eyebrow inline-flex items-center gap-2">
                <span className="h-px w-6 bg-gold/60" />
                About This Villa
              </p>
              {descriptionHtml ? null : (
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                  A private stay in {villa.location}
                </h2>
              )}
              <div className={descriptionHtml ? "" : "mt-6 space-y-4 text-muted leading-relaxed max-w-3xl"}>
                {descriptionHtml ? (
                  <div
                    className="villa-copy"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                ) : paragraphs.length ? (
                  paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                ) : (
                  <p>
                    {villa.bedrooms} bedrooms in {villa.location}, {villa.region},
                    sleeping up to {villa.guests} guests.
                  </p>
                )}
                {villa.address ? (
                  <p>
                    <span className="text-forest font-medium">Address. </span>
                    {villa.address}
                  </p>
                ) : null}
              </div>
              {villa.tags.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {villa.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-ivory px-3 py-1 text-xs tracking-wide text-forest border border-beige"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>

          {villa.amenities.length ? (
            <Reveal>
              <div id="villa-highlights" className="py-8 border-t border-beige-dark/40">
                <p className="section-eyebrow inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-gold/60" />
                  Villa Highlights
                </p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                  Everything included with this stay
                </h2>
                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  {villa.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl bg-ivory/70 px-4 py-3 text-sm text-forest"
                    >
                      <Check className="size-4 text-gold shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ) : null}

          <Reveal>
            <div className="py-8 border-t border-beige-dark/40">
              <p className="section-eyebrow inline-flex items-center gap-2">
                <span className="h-px w-6 bg-gold/60" />
                Where You&apos;ll Sleep
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                {villa.sleepHeading ||
                  `${villa.bedrooms} bedroom${villa.bedrooms === 1 ? "" : "s"} · ${villa.beds} beds`}
              </h2>
              {villa.sleepIntro ? (
                <p className="mt-4 max-w-3xl text-muted leading-relaxed">{villa.sleepIntro}</p>
              ) : null}
              {rooms.length ? (
                <div className="mt-8 grid sm:grid-cols-2 gap-5">
                  {rooms.map((room) => (
                    <article
                      key={room.id}
                      className="rounded-2xl overflow-hidden border border-beige-dark/40 bg-ivory"
                    >
                      <div className="relative aspect-[4/3]">
                        <OptImage
                          src={room.image || villa.image}
                          alt={imageAlt(room.image || villa.image, room.room_name)}
                          fill
                          className="object-cover"
                          sizes="40vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-xl text-forest">{room.room_name}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {room.bed_type}
                          {room.ensuite_bath ? " · Ensuite bathroom" : ""}
                        </p>
                        {room.description ? (
                          <p className="mt-3 text-sm text-muted">{room.description}</p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted max-w-2xl">
                  Bedroom photos are added from the villa record. This home is listed
                  with {villa.bedrooms} bedrooms, {villa.bathrooms} bathrooms and space
                  for {villa.guests} guests.
                </p>
              )}
            </div>
          </Reveal>

          {villa.amenityGroups?.length || villa.services?.length ? (
            <Reveal>
              <div className="py-8 border-t border-beige-dark/40">
                {villa.amenityGroups?.length ? (
                  <>
                    <p className="section-eyebrow inline-flex items-center gap-2">
                      <span className="h-px w-6 bg-gold/60" />
                      {villa.amenityEyebrow || "Amenities"}
                    </p>
                    <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                      {villa.amenityHeading || "Thoughtfully appointed throughout"}
                    </h2>
                    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
                      {villa.amenityGroups.map((group) => (
                        <div key={group.title}>
                          <h3 className="font-semibold text-forest mb-3">{group.title}</h3>
                          <ul className="space-y-2.5">
                            {group.items.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                                <Check className="size-4 text-gold shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* <a
                      href="#villa-highlights"
                      className="mt-8 inline-flex rounded-full border border-beige-dark px-5 py-2 text-sm text-forest hover:border-gold transition"
                    >
                      View All Amenities
                    </a> */}
                  </>
                ) : null}

                {villa.services?.length ? (
                  <div className={villa.amenityGroups?.length ? "mt-10" : ""}>
                    <p className="section-eyebrow inline-flex items-center gap-2">
                      <span className="h-px w-6 bg-gold/60" />
                      {villa.servicesEyebrow || "Private Dining & Services"}
                    </p>
                    <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                      {villa.servicesHeading || "Curated services, included or on request"}
                    </h2>
                    {villa.servicesIntro ? (
                      <p className="mt-4 max-w-3xl text-muted leading-relaxed">{villa.servicesIntro}</p>
                    ) : null}
                    <div className="mt-8 grid sm:grid-cols-2 gap-3">
                      {villa.services.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between gap-4 rounded-2xl bg-ivory/80 border border-beige px-4 py-3.5"
                        >
                          <span className="text-sm text-forest">{service.name}</span>
                          <span className="shrink-0 rounded-full bg-beige px-3 py-1 text-[10px] tracking-[0.14em] uppercase text-muted">
                            {service.included ? "Included" : "On request"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          <Reveal>
              <div className="border-t border-beige-dark/40">
                <div className="divide-y divide-beige-dark/50">
                  {rulesContentSource ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-left [&::-webkit-details-marker]:hidden">
                        <span className="text-base font-medium leading-snug text-forest">
                          House Rules
                        </span>
                        <ChevronDown className="policy-chevron size-5 shrink-0 text-gold transition-transform duration-300" strokeWidth={1.75} />
                      </summary>
                      <div className="pb-4 pr-8">
                        {rulesContentHtml ? (
                          <div
                            className="villa-copy !mt-0 text-sm [&_p:last-child]:mb-0"
                            dangerouslySetInnerHTML={{ __html: rulesContentHtml }}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed text-muted">{rulesContentSource}</p>
                        )}
                      </div>
                    </details>
                  ) : null}

                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-left [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-medium leading-snug text-forest">
                        Cancellation Policy
                      </span>
                      <ChevronDown className="policy-chevron size-5 shrink-0 text-gold transition-transform duration-300" strokeWidth={1.75} />
                    </summary>
                    <div className="pb-4 pr-8">
                      {hasCustomCancellation ? (
                        cancellationHtml ? (
                          <div
                            className="villa-copy !mt-0 text-sm [&_p:last-child]:mb-0"
                            dangerouslySetInnerHTML={{ __html: cancellationHtml }}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed text-muted">{cancellationSource}</p>
                        )
                      ) : (
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-gold">
                          {DEFAULT_CANCELLATION_POLICY.map((item) => {
                            const splitAt = item.indexOf(": ");
                            const label = splitAt === -1 ? "" : item.slice(0, splitAt);
                            const detail = splitAt === -1 ? item : item.slice(splitAt + 2);
                            return (
                              <li key={item}>
                                {label ? (
                                  <span className="font-medium text-forest">{label}: </span>
                                ) : null}
                                {detail}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            </Reveal>

          <Reveal>
            <div className="py-8 border-t border-beige-dark/40">
              <p className="section-eyebrow inline-flex items-center gap-2">
                <span className="h-px w-6 bg-gold/60" />
                The Location
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                {locationTitle}
              </h2>
              <p className="mt-5 text-muted leading-relaxed max-w-2xl">
                {locationCopy}
              </p>
              <div className="mt-6 relative aspect-[16/9] rounded-2xl overflow-hidden">
                <OptImage
                  src={locationImage}
                  alt={imageAlt(locationImage, `${villa.location} area`)}
                  fill
                  className="object-cover"
                  sizes="70vw"
                />
                <div className="absolute inset-0 bg-forest/20" />
                <p className="absolute bottom-4 left-4 text-xs text-ivory bg-forest/60 rounded-full px-3 py-1.5">
                  Approximate area · exact location shared on booking
                </p>
              </div>
              {nearby.length ? (
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {nearby.map((place) => (
                    <div
                      key={`${place.name}-${place.distance}`}
                      className="flex justify-between gap-4 rounded-xl bg-ivory/70 px-4 py-3 text-sm"
                    >
                      <span className="text-forest">
                        {place.name}
                        {place.category ? (
                          <span className="block text-xs text-muted">{place.category}</span>
                        ) : null}
                      </span>
                      <span className="text-muted shrink-0">{place.distance}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-6 text-sm text-muted">
                Explore more villas in{" "}
                <Link
                  href={`/villas?location=${encodeURIComponent(villa.region)}`}
                  className="text-forest underline underline-offset-2 hover:text-gold"
                >
                  {villa.region}
                </Link>{" "}
                or browse the{" "}
                <Link href="/villas" className="text-forest underline underline-offset-2 hover:text-gold">
                  full collection
                </Link>
                .
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{display: 'none'}} id="reviews" className="py-8 border-t border-beige-dark/40 scroll-mt-28">
              <p className="section-eyebrow inline-flex items-center gap-2">
                <span className="h-px w-6 bg-gold/60" />
                Guest Reviews
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
                {guestReviews.length ? "Loved by guests" : "Guest rating"}
              </h2>
              <div className="mt-9 grid gap-8 lg:grid-cols-[280px_1fr]">
                <div className="rounded-2xl border border-gold/15 bg-ivory p-7 text-center shadow-sm">
                  <p className="font-display text-5xl text-forest">{villa.rating}</p>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted">{villa.reviews} verified reviews</p>
                  {bars.length ? (
                    <ul className="mt-6 space-y-3 text-left">
                      {bars.map(([label, score, pct]) => (
                        <li key={label}>
                          <div className="flex items-center justify-between text-sm text-forest/75">
                            <span>{label}</span>
                            <span className="font-semibold text-forest">{score}</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige">
                            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 content-start">
                  {guestReviews.length ? (
                    guestReviews.map((review) => (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-beige-dark/40 bg-ivory/80 p-5"
                      >
                        <p className="text-[10px] tracking-[0.16em] uppercase text-gold font-medium">
                          Verified Guest · {review.rating}
                        </p>
                        <p className="mt-3 text-sm text-muted leading-relaxed italic">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                          <div className="size-10 rounded-full bg-forest text-ivory flex items-center justify-center font-display text-lg">
                            {review.guest_name.trim().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-forest">{review.guest_name}</p>
                            <p className="text-xs text-muted">
                              {[review.guest_location, review.stay_date].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      Written reviews for this villa will appear here once guests have stayed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {faqs.length ? (
            <Reveal>
              <VillaFaqs faqs={faqs} />
            </Reveal>
          ) : null}
        </div>

        <aside className="order-1 lg:order-2 lg:pt-1">
          <VillaBookingCard
            name={villa.name}
            slug={villa.slug}
            villaId={villa.id}
            price={villa.price}
            rating={villa.rating}
            maxGuests={villa.guests}
            petsAllowed={
              villa.amenityKeys?.includes("pet") ||
              villa.amenities.some((item) => /pet/i.test(item))
            }
          />
        </aside>
      </section>

      {similar.length ? (
        <section className="bg-beige/50 py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="section-eyebrow inline-flex items-center gap-2">
              <span className="h-px w-6 bg-gold/60" />
              You May Also Like
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
              More villas in {villa.region}
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <VillaCard key={item.id} villa={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative py-20 md:py-24 overflow-hidden">
        <OptImage
          src={images.cta}
          alt="Need help finding a villa"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-ivory">
          <p className="section-eyebrow text-gold inline-flex items-center gap-2 justify-center">
            <span className="h-px w-6 bg-gold/60" />
            Personalised Service
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl leading-[1.08] tracking-tight">
            Need Help Finding the Perfect Villa in Goa?
          </h2>
          <p className="mt-5 text-ivory/80">
            Speak with our villa specialists for personalised recommendations
            based on your travel dates, group size and preferred location.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-gold">
              Talk to a Villa Specialist
            </Link>
            <a
              href="https://wa.me/918860331188"
              className="btn-secondary-light"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


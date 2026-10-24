import Link from "next/link";
import { OptImage } from "@/components/OptImage";
import { Bed, MapPin, Users, Waves } from "lucide-react";
import { BookingTrigger } from "@/components/BookingTrigger";
import type { Villa } from "@/data/villas";
import { formatPrice } from "@/data/villas";
import { imageAlt } from "@/lib/image-alt";
import { clsx } from "clsx";

export function VillaCard({
  villa,
  variant = "portrait",
  enquireOnly = false,
  compact = false,
  noLink = false,
}: {
  villa: Villa;
  variant?: "portrait" | "landscape";
  enquireOnly?: boolean;
  compact?: boolean;
  /** When true, all links are disabled — image and title are not clickable */
  noLink?: boolean;
}) {
  const badgeClass =
    villa.badge === "BEST SELLER" || villa.badge === "Best Seller"
      ? "bg-forest text-ivory"
      : "bg-gold text-forest";

  const imageContent = (
    <>
      <OptImage
        src={villa.image}
        alt={imageAlt(villa.image, villa.name)}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes={compact ? "(max-width:640px) 100vw, 320px" : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"}
        quality={70}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/75 via-transparent to-transparent opacity-80" />
      {villa.badge && (
        <span
          className={clsx(
            compact
              ? "absolute top-3 left-3 text-[0.62rem] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full font-semibold"
              : "absolute top-4 left-4 text-[0.7rem] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full font-semibold",
            badgeClass
          )}
        >
          {villa.badge === "BEST SELLER" ? "Best Seller" : villa.badge === "FEATURED" ? "Featured" : villa.badge}
        </span>
      )}
      <div className={clsx("absolute flex items-end justify-between", compact ? "bottom-3 left-3 right-3" : "bottom-4 left-4 right-4")}>
        <p className={clsx("flex items-center gap-1.5 text-ivory/85", compact ? "text-xs" : "text-sm")}>
          <MapPin className={clsx("text-gold", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
          {villa.location}
        </p>
        <p className="text-right text-ivory">
          <span className="text-[0.65rem] uppercase tracking-wider text-ivory/70 block">
            From
          </span>
          <span className={clsx("font-display leading-none", compact ? "text-xl" : "text-2xl")}>
            {formatPrice(villa.price)}
          </span>
          <span className="text-[0.65rem] text-ivory/70">/night</span>
        </p>
      </div>
    </>
  );

  return (
    <article className="group bg-ivory rounded-2xl overflow-hidden border border-beige shadow-[0_18px_50px_-30px_rgba(22,43,34,0.35)] flex flex-col h-full">
      {noLink ? (
        <div
          className={clsx(
            "relative overflow-hidden",
            compact ? "aspect-[5/4]" : variant === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"
          )}
        >
          {imageContent}
        </div>
      ) : (
        <Link
          href={`/villas/${villa.slug}`}
          aria-label={`View ${villa.name}`}
          className={clsx(
            "relative block overflow-hidden",
            compact ? "aspect-[5/4]" : variant === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"
          )}
        >
          {imageContent}
        </Link>
      )}

      <div className={clsx("flex flex-1 flex-col", compact ? "p-4" : "p-6")}>
        <h3 className={clsx("font-display text-forest", compact ? "text-xl leading-snug line-clamp-2" : "text-2xl")}>
          {noLink ? (
            villa.name
          ) : (
            <Link href={`/villas/${villa.slug}`} className="hover:text-gold-dark">
              {villa.name}
            </Link>
          )}
        </h3>

        <div className={clsx("flex flex-wrap text-muted", compact ? "mt-2 gap-x-3 gap-y-1 text-xs" : "mt-3 gap-x-5 gap-y-2 text-sm")}>
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-gold" />
            {villa.bedrooms} Bedrooms
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gold" />
            {villa.guests} Guests
          </span>
          {villa.amenities.some((item) => /pool/i.test(item)) && (
            <span className="flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-gold" />
              Private Pool
            </span>
          )}
        </div>

        {compact ? null : (
          <div className="mt-4 flex flex-wrap gap-2">
            {villa.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[0.7rem] uppercase tracking-wider px-2.5 py-1 rounded-full bg-beige/60 text-muted"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        <div
          className={
            enquireOnly || noLink
              ? compact ? "mt-auto pt-4" : "mt-auto pt-5"
              : "mt-auto pt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3"
          }
        >
          {!enquireOnly && !noLink && (
            <Link
              href={`/villas/${villa.slug}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-forest/25 px-4 py-3 text-sm font-medium text-forest whitespace-nowrap hover:bg-forest hover:text-ivory transition"
            >
              View Villa
            </Link>
          )}
          <BookingTrigger
            villaName={villa.name}
            villaSlug={villa.slug}
            villaId={villa.id}
            intent="enquiry"
            className={clsx(
              "inline-flex w-full items-center justify-center rounded-full bg-forest px-4 text-sm font-medium text-ivory whitespace-nowrap hover:bg-forest-light transition cursor-pointer",
              compact ? "py-2.5" : "py-3"
            )}
          >
            Enquire
          </BookingTrigger>
        </div>
      </div>
    </article>
  );
}

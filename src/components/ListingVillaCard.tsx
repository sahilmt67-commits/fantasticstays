"use client";

import { useState } from "react";
import { OptImage } from "@/components/OptImage";
import { imageAlt } from "@/lib/image-alt";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Star,
  Users,
  Waves,
} from "lucide-react";
import type { Villa } from "@/data/villas";
import { formatPrice } from "@/data/villas";
import { BookingTrigger } from "@/components/BookingTrigger";
import { clsx } from "clsx";

export function ListingVillaCard({ villa }: { villa: Villa }) {
  const gallery =
    villa.gallery.length > 0 ? villa.gallery.slice(0, 3) : [villa.image];
  const [idx, setIdx] = useState(0);
  const [wish, setWish] = useState(false);

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  }
  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % gallery.length);
  }

  const badges = villa.listingBadges || (villa.badge ? [villa.badge] : []);

  return (
    <article className="group flex flex-col bg-[#FCFAF4] border border-[#E4DBC5] rounded-[14px] overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_-24px_rgba(35,40,31,.28)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE4D0]">
        <Link
          href={`/villas/${villa.slug}`}
          aria-label={`View ${villa.name}`}
          className="absolute inset-0 z-[1] block"
        >
          <OptImage
            key={gallery[idx]}
            src={gallery[idx]}
            alt={imageAlt(gallery[idx], villa.name)}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 40vw"
            quality={70}
          />
        </Link>

        <div className="absolute top-4 left-4 z-[3] flex flex-col items-start gap-2 pointer-events-none">
          {badges.slice(0, 2).map((b) => {
            const label =
              b === "FEATURED"
                ? "Guest Favourite"
                : b === "EXCLUSIVE"
                  ? "Exclusive"
                  : b === "BEST SELLER"
                    ? "Most Popular"
                    : b === "NEW"
                      ? "New Villa"
                      : b;
            return (
              <span
                key={b}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] uppercase border backdrop-blur-sm",
                  label === "Exclusive"
                    ? "bg-[#1F3528] border-[#1F3528] text-[#F6F1E6]"
                    : label === "Guest Favourite"
                      ? "bg-[#FCFAF4]/95 border-[#A9853C] text-[#8A6C2D]"
                      : label.includes("Weekend")
                        ? "bg-[#FCFAF4]/95 border-[#E4DBC5] text-[#2F7A4F]"
                        : "bg-[#EDE4D0]/95 border-[#D3C7A8] text-[#1F3528]"
                )}
              >
                {label.includes("Weekend") && (
                  <span className="size-1.5 rounded-full bg-[#2F7A4F]" />
                )}
                {label}
              </span>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Save villa"
          aria-pressed={wish}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWish((v) => !v);
          }}
          className={clsx(
            "absolute top-3.5 right-3.5 z-[3] size-10 rounded-full bg-[#FCFAF4]/95 flex items-center justify-center transition hover:scale-110 cursor-pointer",
            wish ? "text-[#B4552D]" : "text-[#1F3528]"
          )}
        >
          <Heart className={clsx("size-[18px]", wish && "fill-current")} />
        </button>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-[3] size-9 rounded-full bg-[#FCFAF4]/95 text-[#1F3528] flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-[3] size-9 rounded-full bg-[#FCFAF4]/95 text-[#1F3528] flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <div className="absolute bottom-3.5 left-0 right-0 z-[3] flex justify-center gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIdx(i);
                  }}
                  className={clsx(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    i === idx ? "w-4 bg-[#FCFAF4]" : "w-1.5 bg-[#FCFAF4]/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-[#A9853C]">
          <MapPin className="size-3 text-[#A9853C] shrink-0" />
          {villa.location}, {villa.region}
        </p>
        <h3 className="mt-2 font-display text-[1.45rem] text-[#1F3528] leading-snug">
          <Link href={`/villas/${villa.slug}`} className="hover:text-[#A9853C]">
            {villa.name.includes(",")
              ? villa.name
              : `${villa.name}, ${villa.location}`}
          </Link>
        </h3>
        <p className="mt-2 text-[0.9rem] text-[#5C6152] leading-relaxed line-clamp-2">
          {villa.shortDescription}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.8rem] text-[#1F3528]">
          <li className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5 text-[#A9853C]" />
            {villa.bedrooms} Bedrooms
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users className="size-3.5 text-[#A9853C]" />
            {villa.guests} Guests
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5 text-[#A9853C]" />
            {villa.bathrooms} Bathrooms
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Waves className="size-3.5 text-[#A9853C]" />
            {villa.amenities.find((a) => /pool/i.test(a)) || "Private Pool"}
          </li>
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-sm text-[#1F3528]">
            <Star className="size-3.5 fill-[#A9853C] text-[#A9853C]" />
            {villa.rating.toFixed(2)}{" "}
            <span className="text-[#5C6152]">({villa.reviews} reviews)</span>
          </span>
          {villa.instantBooking && (
            <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase text-[#2F7A4F]">
              Instant Booking
            </span>
          )}
        </div>

        <p className="mt-3 font-display text-[1.65rem] text-[#1F3528] leading-none">
          From {formatPrice(villa.price)}
          <span className="text-sm font-sans font-normal text-[#5C6152]">
            {" "}
            / night
          </span>
        </p>
        <p className="text-[0.68rem] text-[#5C6152] mt-1.5">
          + taxes &amp; service fees, shown before payment
        </p>

        <div className="mt-auto pt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Link
            href={`/villas/${villa.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#1F3528] px-4 py-3.5 text-sm font-semibold tracking-wide text-[#F6F1E6] whitespace-nowrap hover:bg-[#16241C] transition"
          >
            View Villa
          </Link>
          <BookingTrigger
            villaName={villa.name}
            villaSlug={villa.slug}
            villaId={villa.id}
            intent="enquiry"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#1F3528]/30 px-4 py-3.5 text-sm font-semibold tracking-wide text-[#1F3528] whitespace-nowrap hover:bg-[#1F3528] hover:text-[#F6F1E6] transition cursor-pointer"
          >
            Enquire
          </BookingTrigger>
        </div>
      </div>
    </article>
  );
}

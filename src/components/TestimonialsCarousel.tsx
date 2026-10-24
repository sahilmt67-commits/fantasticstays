"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { BRAND } from "@/lib/brand";

const testimonials = [
  {
    quote:
      "An immaculate villa with a stunning private pool. The team was responsive from enquiry to checkout. Our family holiday in Goa was truly memorable.",
    name: "Aarav & Meera Sharma",
    stay: "Casa Serenity, Candolim",
    initial: "A",
  },
  {
    quote:
      "We hosted a group of ten and the villa exceeded expectations — spacious, private and beautifully kept. The caretaker arranged everything we needed.",
    name: "Rohan Desai",
    stay: "The Leaf Pavilion, Assagao",
    initial: "R",
  },
  {
    quote: `From the first WhatsApp reply to the final night, everything felt effortless. Highly recommend ${BRAND}.`,
    name: "Sneha Iyer",
    stay: "Azure Retreat, Vagator",
    initial: "S",
  },
  {
    quote:
      "From villa selection to airport transfers, everything was seamless. The local knowledge of the team made our celebration effortless and special.",
    name: "Vikram Nair",
    stay: "Casa Morjim, Morjim",
    initial: "V",
  },
];

export function TestimonialsCarousel({
  items,
}: {
  items?: { quote: string; name: string; stay: string; initial: string }[];
}) {
  const slides = items && items.length > 0 ? items : testimonials;
  const [index, setIndex] = useState(0);
  const t = slides[index % slides.length];

  function prev() {
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  }
  function next() {
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="relative">
      <blockquote className="font-display text-2xl md:text-3xl leading-relaxed text-ivory/95 italic min-h-[8.5rem] md:min-h-[7rem]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="size-14 rounded-full bg-gold/20 flex items-center justify-center font-display text-2xl text-gold">
          {t.initial}
        </div>
        <p className="font-medium">{t.name}</p>
        <p className="text-sm text-ivory/60">{t.stay}</p>
        <span className="mt-2 text-[10px] tracking-[0.2em] uppercase text-gold">
          Verified Stay
        </span>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous"
          onClick={prev}
          className="flex size-10 items-center justify-center rounded-full border border-ivory/25 text-ivory hover:bg-ivory/10 transition"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to ${i + 1}`}
              onClick={() => setIndex(i)}
              className={clsx(
                "h-2 rounded-full transition-all",
                i === index ? "w-8 bg-gold" : "w-2 bg-ivory/30"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={next}
          className="flex size-10 items-center justify-center rounded-full border border-ivory/25 text-ivory hover:bg-ivory/10 transition"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/about"
          className="text-sm text-gold hover:text-ivory transition tracking-wide"
        >
          View more guest reviews
        </Link>
      </div>
    </div>
  );
}

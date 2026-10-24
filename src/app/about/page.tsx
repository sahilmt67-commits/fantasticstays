import type { Metadata } from "next";
import Link from "next/link";
import { OptImage } from "@/components/OptImage";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/villas";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    `Learn about ${BRAND} — your trusted partner for luxury villa rentals in Goa.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-end">
        <OptImage
          src={images.about}
          alt={`About ${BRAND}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/65" />
        <div className="relative z-10 mx-auto max-w-7xl w-full px-5 md:px-8 pb-16 pt-40">
          <p className="section-eyebrow text-gold">About the Company</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-ivory max-w-3xl">
            Your Trusted Partner for Luxury Villa Rentals in Goa
          </h1>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ivory">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <p className="text-muted leading-relaxed text-lg">
              {BRAND} helps guests discover private villas in Goa suited
              to their travel requirements. We focus on carefully selected
              properties, responsive communication, genuine local knowledge and
              personalised booking support — so every stay feels considered,
              comfortable and entirely your own.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                ["10+", "Years of Local Experience"],
                ["120+", "Villas Curated"],
                ["5,000+", "Happy Guests"],
                ["20+", "Goa Locations Covered"],
                ["4.9", "Average Guest Rating"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display text-4xl text-forest">{stat}</p>
                  <p className="text-sm text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="btn-primary mt-12">
              Speak with Our Team
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { OptImage } from "@/components/OptImage";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { locationHref } from "@/data/villas";
import { imageAlt } from "@/lib/image-alt";
import { getLocations } from "@/lib/villa-api";

export const metadata: Metadata = {
  title: "Villa Locations in Goa",
  description:
    "Browse luxury villas across Candolim, Assagao, Anjuna, Vagator, Morjim, Siolim and South Goa.",
};

export default async function LocationsPage() {
  const locations = await getLocations();
  return (
    <>
      <section className="pt-36 md:pt-40 pb-16 md:pb-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Browse Villas by Location</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl text-forest max-w-3xl">
              Find Your Perfect Villa in Goa&apos;s Most Desirable Locations
            </h1>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {locations.map((loc, i) => (
              <Reveal key={loc.name} delay={i * 40}>
                <Link
                  href={locationHref(loc)}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
                >
                  <OptImage
                    src={loc.image}
                    alt={imageAlt(loc.image, loc.name)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                    <p className="text-gold text-sm">{loc.count} villas</p>
                    <h2 className="font-display text-xl mt-0.5">{loc.name}</h2>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

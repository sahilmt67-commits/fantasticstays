import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getListingVillas } from "@/app/actions/villas";
import { getListingHero, type ListingHero } from "@/lib/villa-api";
import VillasListingPage from "../../villas/VillasClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function placeSlug(slug: string) {
  const match = slug.match(/^villas-in-(.+)$/i);
  return match?.[1]?.toLowerCase() || "";
}

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getListingVillas();
  const location = catalog.locations.find(
    (item) => item.slug.toLowerCase() === placeSlug(slug)
  );
  if (!location || location.pageType !== "luxury_rental") {
    return { title: "Luxury Villas" };
  }

  return {
    title: location.metaTitle || `Luxury Villas in ${location.name}`,
    description:
      location.metaDescription || plainText(location.description).slice(0, 160),
    keywords: location.metaKeywords,
  };
}

export default async function LuxuryRentalLocationPage({ params }: Props) {
  const { slug } = await params;
  const place = placeSlug(slug);
  if (!place) notFound();

  const [catalog, baseHero] = await Promise.all([
    getListingVillas(),
    getListingHero(),
  ]);
  const location = catalog.locations.find(
    (item) => item.slug.toLowerCase() === place
  );
  if (!location) notFound();
  if (location.pageType !== "luxury_rental") {
    redirect(`/villas?location=${encodeURIComponent(location.name)}`);
  }

  const villas = catalog.villas.filter(
    (villa) => villa.locationSlug?.toLowerCase() === location.slug.toLowerCase()
  );

  const hero: ListingHero = {
    ...baseHero,
    eyebrow: `Handpicked Villas · ${location.region || location.name}`,
    heading:
      location.detailHeading ||
      `Luxury Villas in ${location.name} for an Exceptional Private Stay`,
    paragraph1:
      location.description ||
      `Explore our handpicked collection of luxury villas in ${location.name}.`,
    paragraph2: "",
    badge: [location.name, location.region].filter(Boolean).join(" · ").toUpperCase(),
    image: location.image || baseHero.image,
    imageSmall: location.image || baseHero.imageSmall,
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted">
          Loading villas…
        </div>
      }
    >
      <VillasListingPage
        villas={villas}
        locations={catalog.locations}
        amenityCounts={catalog.amenityCounts}
        priceBounds={{ min: catalog.priceMin, max: catalog.priceMax }}
        reviews={catalog.reviews}
        hero={hero}
        placeName={location.name}
        presetLocation={location.name}
        singleHeroImage
        hideHeroStats
      />
    </Suspense>
  );
}

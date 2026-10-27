import { Suspense } from "react";
import type { Metadata } from "next";
import { getListingVillas } from "@/app/actions/villas";
import { getListingHero } from "@/lib/villa-api";
import VillasListingPage from "./VillasClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxury Villas in Goa",
  description:
    "Browse handpicked luxury villas in Goa with private pools across North and South Goa.",
};

export default async function Page() {
  const [catalog, hero] = await Promise.all([getListingVillas(), getListingHero()]);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted">
          Loading villas…
        </div>
      }
    >
      <VillasListingPage
        villas={catalog.villas}
        locations={catalog.locations}
        amenityCounts={catalog.amenityCounts}
        priceBounds={{ min: catalog.priceMin, max: catalog.priceMax }}
        reviews={catalog.reviews}
        hero={hero}
        singleHeroImage
      />
    </Suspense>
  );
}

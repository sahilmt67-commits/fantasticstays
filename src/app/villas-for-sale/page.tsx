import type { Metadata } from "next";
import { ServiceLeadForm } from "@/components/ServiceLeadForm";
import { VillaCard } from "@/components/VillaCard";
import { getPlacementVillas, getServicePages } from "@/lib/villa-api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { sale } = await getServicePages();
  return {
    title: { absolute: sale.metaTitle },
    description: sale.metaDescription,
    keywords: sale.metaKeywords,
  };
}

export default async function VillasForSalePage() {
  const [{ sale }, villas] = await Promise.all([
    getServicePages(),
    getPlacementVillas("sale"),
  ]);

  return (
    <section className="bg-[#F6F1E6] pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-5 md:px-8 lg:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] lg:gap-10">
        <div className="lg:sticky lg:top-28">
          <ServiceLeadForm kind="sale" heading={sale.formHeading} stacked />
        </div>
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-beige pb-4">
            <h1 className="font-display text-3xl text-forest md:text-4xl">{sale.listTitle}</h1>
            {villas.length ? (
              <p className="shrink-0 rounded-full border border-beige bg-ivory px-3 py-1 text-sm text-muted">
                {villas.length} {villas.length === 1 ? "villa" : "villas"}
              </p>
            ) : null}
          </div>
          {villas.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {villas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} compact enquireOnly noLink />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-beige bg-ivory px-6 py-12 text-center text-muted">
              Villas selected for sale will appear here.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

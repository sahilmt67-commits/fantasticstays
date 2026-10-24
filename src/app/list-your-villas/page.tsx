import type { Metadata } from "next";
import { ServiceLeadForm } from "@/components/ServiceLeadForm";
import { VillaCard } from "@/components/VillaCard";
import { getPlacementVillas, getServicePages } from "@/lib/villa-api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { list } = await getServicePages();
  return {
    title: { absolute: list.metaTitle },
    description: list.metaDescription,
    keywords: list.metaKeywords,
  };
}

export default async function ListYourVillasPage() {
  const [{ list }, villas] = await Promise.all([
    getServicePages(),
    getPlacementVillas("list"),
  ]);

  return (
    <section className="bg-[#F6F1E6] pt-32 pb-16 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="section-eyebrow">{list.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl text-forest leading-tight md:text-5xl">
          {list.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-forest/80 leading-relaxed">{list.intro}</p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ServiceLeadForm kind="list" heading={list.formHeading} stacked />
          <aside className="rounded-3xl border border-forest/10 bg-ivory p-6 lg:sticky lg:top-32">
            <dl className="grid grid-cols-2 gap-4 border-b border-beige pb-5">
              {list.stats.map((stat) => (
                <div key={stat.value}>
                  <dt className="font-display text-lg text-forest">{stat.value}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <ol className="mt-5 space-y-5">
              {list.benefits.map((benefit, index) => (
                <li key={benefit.title} className="flex gap-4">
                  <span className="font-display text-2xl text-gold">0{index + 1}</span>
                  <div className="pt-1">
                    <h2 className="text-sm font-semibold text-forest">{benefit.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{benefit.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        {villas.length ? (
          <div className="mt-14">
            <div className="flex items-end justify-between gap-4 border-b border-beige pb-4">
              <h2 className="font-display text-3xl text-forest md:text-4xl">List your villas</h2>
              <p className="shrink-0 rounded-full border border-beige bg-ivory px-3 py-1 text-sm text-muted">
                {villas.length} {villas.length === 1 ? "villa" : "villas"}
              </p>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} compact enquireOnly noLink />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

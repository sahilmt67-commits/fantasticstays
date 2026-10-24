import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Goa Experiences",
  description:
    "Private chef, transfers, yacht cruises, spa and celebration experiences for your Goa villa stay.",
};

const experiences = [
  {
    title: "Private Chef Experiences",
    desc: "Bespoke menus crafted in your villa by skilled private chefs.",
  },
  {
    title: "Airport & Local Transfers",
    desc: "Comfortable, reliable transfers arranged on request.",
  },
  {
    title: "Yacht & Sunset Cruises",
    desc: "Sail along the Goan coastline for an unforgettable evening.",
  },
  {
    title: "Beach Club Reservations",
    desc: "Premium sunbeds and access at Goa's finest beach clubs.",
  },
  {
    title: "Birthday & Anniversary Setups",
    desc: "Thoughtful decor to celebrate your special moments.",
  },
  {
    title: "Wedding & Event Assistance",
    desc: "End-to-end planning support for villa celebrations.",
  },
  {
    title: "Wellness & Spa Sessions",
    desc: "In-villa spa, yoga and wellness experiences.",
  },
  {
    title: "Local Sightseeing Experiences",
    desc: "Curated days out with trusted local guides.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="pt-36 md:pt-40 pb-16 md:pb-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Goa Experiences</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl text-forest max-w-3xl">
              Make Your Goa Holiday Even More Memorable
            </h1>
            <p className="mt-5 text-muted max-w-2xl leading-relaxed">
              Services are subject to availability and may involve additional
              charges. Our specialists will confirm options for your stay.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <div className="rounded-2xl border border-beige bg-beige/30 p-6 h-full">
                  <h2 className="font-display text-xl text-forest mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-12">
            Plan Experiences for Your Stay
          </Link>
        </div>
      </section>
    </>
  );
}

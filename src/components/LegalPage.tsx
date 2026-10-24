import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND, BRAND_EMAIL } from "@/lib/brand";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-[#F6F1E6] min-h-screen">
      <section className="mx-auto max-w-3xl px-5 md:px-8 pt-32 md:pt-40 pb-16 md:pb-24">
        <p className="section-eyebrow inline-flex items-center gap-2">
          <span className="h-px w-6 bg-gold/60" />
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-forest leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
        <div className="mt-10 space-y-8 text-muted leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-forest [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-forest [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold">
          {children}
        </div>
        <p className="mt-12 text-sm text-muted">
          Questions?{" "}
          <Link href="/contact" className="text-forest underline underline-offset-2">
            Contact {BRAND}
          </Link>{" "}
          at{" "}
          <a href={`mailto:${BRAND_EMAIL}`} className="text-forest underline underline-offset-2">
            {BRAND_EMAIL}
          </a>
          .
        </p>
      </section>
    </main>
  );
}

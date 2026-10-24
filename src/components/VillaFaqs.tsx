"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { VillaFaq } from "@/data/villas";

export function VillaFaqs({ faqs }: { faqs: VillaFaq[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="py-12 border-t border-beige-dark/40">
      <p className="section-eyebrow inline-flex items-center gap-2">
        <span className="h-px w-6 bg-gold/60" />
        FAQ
      </p>
      <h2 className="mt-3 font-display text-3xl md:text-4xl text-forest leading-[1.08] tracking-tight">
        Frequently asked questions
      </h2>
      <div className="mt-8 divide-y divide-beige-dark/50 border-y border-beige-dark/50">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <div key={`${faq.question}-${index}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-forest text-base md:text-lg leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <p className="pb-5 pr-8 text-sm md:text-base text-muted leading-relaxed">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

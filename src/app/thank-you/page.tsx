import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your enquiry has been received. A villa specialist will contact you shortly.",
};

export default function ThankYouPage() {
  return (
    <section className="bg-[#F6F1E6] px-5 pt-36 pb-24 md:px-8 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow text-gold">Enquiry received</p>
        <h1 className="mt-4 font-display text-4xl text-forest md:text-6xl">
          Thank you
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
          Your details are saved. A villa specialist will contact you shortly
          to confirm availability and next steps.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/villas" className="btn-secondary">
            Browse Villas
          </Link>
        </div>
      </div>
    </section>
  );
}

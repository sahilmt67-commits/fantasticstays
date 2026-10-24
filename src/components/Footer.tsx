"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BRAND } from "@/lib/brand";
import type { SiteFooter } from "@/lib/villa-api";
import { applyContactValidity, emailError } from "@/lib/form-validation";

const locations = [
  "Candolim",
  "Anjuna",
  "Assagao",
  "Vagator",
  "Morjim",
  "South Goa",
];

const categories = [
  "Family Villas",
  "Couple Villas",
  "Group Villas",
  "Wedding Villas",
  "Beachfront Villas",
  "Private Pool",
];

const socialIcons = {
  Instagram,
  Facebook,
  YouTube: Youtube,
} as const;

export function Footer({ settings }: { settings: SiteFooter }) {
  const [emailMessage, setEmailMessage] = useState("");

  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-8 md:py-10 border-b border-ivory/10">
        <div className="max-w-xl">
          <h3 className="font-display text-2xl md:text-3xl">Stay Inspired</h3>
          <p className="mt-2 text-sm text-ivory/70">
            Receive new villa listings, Goa travel inspiration and exclusive stay
            offers.
          </p>
          <form
            noValidate
            className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              applyContactValidity(form);
              const message = emailError(String(new FormData(form).get("email") ?? ""), true) ?? "";
              setEmailMessage(message);
              if (message || !form.checkValidity()) form.reportValidity();
            }}
          >
            <input
              name="email"
              type="email"
              required
              inputMode="email"
              placeholder="Your email address"
              aria-invalid={emailMessage ? true : undefined}
              className="flex-1 min-w-0 rounded-full bg-ivory/10 border border-ivory/20 px-5 py-3 sm:py-2.5 text-base sm:text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-gold text-forest px-6 py-3 sm:py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-gold/90 transition w-full sm:w-auto"
            >
              Subscribe
            </button>
            {emailMessage ? (
              <p className="sm:basis-full text-xs text-[#F3C7B8]">{emailMessage}</p>
            ) : null}
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 py-8 md:py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        <div className="sm:col-span-2 lg:col-span-3">
          <BrandLogo tone="white" />
          <p className="text-gold text-[10px] tracking-[0.28em] uppercase mt-3">
            {settings.kicker}
          </p>
          <p className="mt-3 text-ivory/70 text-sm leading-relaxed max-w-xs">
            {settings.about}
          </p>
          <div className="mt-4 flex gap-2.5">
            {settings.socials.map(({ label, href }) => {
              const Icon = socialIcons[label];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-ivory/20 text-gold hover:bg-ivory/10 transition"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2.5">
            Quick Links
          </p>
          <ul className="space-y-1 text-sm text-ivory/75">
            {[
              ["Home", "/"],
              ["Villas", "/villas"],
              ["Locations", "/#locations"],
              ["Experiences", "/#experiences"],
              ["About Us", "/#about"],
              ["Villas for Sale", "/villas-for-sale"],
              ["List Your Villas", "/list-your-villas"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-ivory transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2.5">
            Villa Locations
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ivory/75">
            {locations.map((loc) => (
              <li key={loc}>
                <Link
                  href={`/villas?location=${encodeURIComponent(loc)}`}
                  className="hover:text-ivory transition"
                >
                  {loc}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/villas"
            className="mt-2 inline-block text-xs text-gold hover:text-ivory transition"
          >
            View all areas →
          </Link>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2.5">
            Villa Categories
          </p>
          <ul className="space-y-1 text-sm text-ivory/75">
            {categories.map((cat) => (
              <li key={cat}>
                <Link href="/villas" className="hover:text-ivory transition">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs tracking-[0.2em] uppercase text-gold mb-2.5">
            Contact
          </p>
          <ul className="space-y-2 text-sm text-ivory/75">
            <li className="flex items-start gap-2.5">
              <Phone className="size-4 mt-0.5 text-gold shrink-0" />
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-ivory">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageCircle className="size-4 mt-0.5 text-gold shrink-0" />
              <a
                href={settings.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ivory"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="size-4 mt-0.5 text-gold shrink-0" />
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-ivory break-all"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="size-4 mt-0.5 text-gold shrink-0" />
              <span>
                {settings.addressLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between text-xs text-ivory/50">
          <p>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
            <span className="mx-2 text-ivory/30" aria-hidden>
              ·
            </span>
            Develop By:{" "}
            <a
              href="https://webbaaz.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ivory"
            >
              Webbaaz
            </a>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <Link href="/privacy" className="hover:text-ivory">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ivory">
              Terms &amp; Conditions
            </Link>
            <Link href="/cancellation" className="hover:text-ivory">
              Booking &amp; Cancellation Policy
            </Link>
            <Link href="/" className="hover:text-ivory">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

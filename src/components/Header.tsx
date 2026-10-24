"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { clsx } from "clsx";
import { BookingTrigger } from "@/components/BookingTrigger";
import { BrandLogo } from "@/components/BrandLogo";
import {
  BRAND_PHONE_DISPLAY,
  BRAND_PHONE_TEL,
  BRAND_WA_HREF,
} from "@/lib/brand";

const serviceLinks = [
  { href: "/#about", label: "About Us" },
  { href: "/villas-for-sale", label: "Villas for Sale" },
  { href: "/list-your-villas", label: "List Your Villas" },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/villas", label: "Villas" },
  { href: "/#locations", label: "Locations" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/contact", label: "Contact" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type HeaderProps = {
  variant?: "transparent" | "solid";
  phone?: string;
  phoneTel?: string;
  whatsappHref?: string;
};

export function Header({
  variant = "solid",
  phone = BRAND_PHONE_DISPLAY,
  phoneTel = BRAND_PHONE_TEL,
  whatsappHref = BRAND_WA_HREF,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  function closeMenu() {
    setOpen(false);
    document.body.style.overflow = "";
  }

  function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.querySelector("header");
    const offset = (header?.getBoundingClientRect().height ?? 120) + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close whenever the route changes
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const timer = window.setTimeout(() => scrollToSection(id), 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    // Always dismiss the sheet first so navigation is never blocked by the overlay.
    closeMenu();

    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (pathname === "/") {
        e.preventDefault();
        scrollToSection(id);
        window.history.replaceState(null, "", href);
      }
      return;
    }

    // Same-route taps (e.g. Home while already on /) still need an explicit close.
    if (href === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Soft-nav via router keeps close + navigation in one gesture on mobile.
    e.preventDefault();
    router.push(href);
  }

  const light = variant === "transparent" && !scrolled && !open;

  const waBtn = clsx(
    "flex items-center justify-center w-10 h-10 rounded-full border transition-colors",
    light
      ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-forest"
      : "border-forest/25 text-forest hover:bg-forest hover:text-ivory"
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-forest text-ivory/90 text-center text-[0.65rem] sm:text-xs md:text-sm py-2 px-3 sm:py-2.5 sm:px-4 tracking-wide leading-snug">
          Luxury Private Villas in Goa
          <span className="text-gold mx-1 sm:mx-1.5">|</span>
          <span className="hidden xs:inline sm:inline">
            Personalised Booking Assistance
            <span className="text-gold mx-1 sm:mx-1.5">|</span>
          </span>
          Enquire for Exclusive Offers
        </div>

        <div
          className={clsx(
            "transition-all duration-500",
            light
              ? "bg-transparent"
              : "bg-[#fcfaf8]/95 backdrop-blur-md border-b border-[#efe8dc]"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8 h-[70px] flex items-center justify-between gap-3 md:gap-6">
            <Link
              href="/"
              aria-label="fantastic stays home"
              className="shrink-0 min-w-0"
              onClick={closeMenu}
            >
              <BrandLogo priority tone={light ? "white" : "brand"} />
            </Link>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {links.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                const item = (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => onNavClick(e, link.href)}
                    className={clsx(
                      "relative pb-1 text-sm font-medium tracking-wide transition-colors group",
                      light
                        ? "text-ivory/90 hover:text-ivory"
                        : active
                          ? "text-forest"
                          : "text-muted hover:text-forest"
                    )}
                  >
                    {link.label}
                    <span
                      className={clsx(
                        "pointer-events-none absolute left-0 right-0 -bottom-0.5 h-[2px] origin-center bg-gold transition-transform duration-300 ease-out",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                );
                if (link.href !== "/contact") return item;
                const servicesActive =
                  pathname === "/villas-for-sale" ||
                  pathname === "/list-your-villas";
                return (
                  <Fragment key="services-contact">
                    <div
                      className="relative"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-haspopup="true"
                        onClick={() => setServicesOpen(true)}
                        className={clsx(
                          "inline-flex items-center gap-1 pb-1 text-sm font-medium tracking-wide",
                          light
                            ? "text-ivory/90 hover:text-ivory"
                            : servicesActive
                              ? "text-forest"
                              : "text-muted hover:text-forest"
                        )}
                      >
                        Services
                        <ChevronDown
                          className={clsx(
                            "size-3.5 transition-transform",
                            servicesOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {servicesOpen ? (
                        <div className="absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 pt-3">
                          <div className="rounded-2xl border border-[#efe8dc] bg-[#fcfaf8] p-2 shadow-lg">
                            {serviceLinks.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={(e) => {
                                  setServicesOpen(false);
                                  onNavClick(e, child.href);
                                }}
                                className="block rounded-xl px-3 py-2.5 text-sm text-forest hover:bg-beige/60"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {item}
                  </Fragment>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Enquiry"
                className={waBtn}
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={`tel:${phoneTel}`}
                aria-label="Call us"
                className={clsx(
                  "hidden xl:flex items-center gap-2 text-sm whitespace-nowrap",
                  light ? "text-ivory/90" : "text-forest"
                )}
              >
                <Phone className="size-3.5 text-gold shrink-0" />
                <span className="font-medium">{phone}</span>
              </a>
              <BookingTrigger
                intent="enquiry"
                className="hidden sm:inline-flex bg-gold text-forest px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap hover:bg-gold/90 transition-colors"
              >
                Book Now
              </BookingTrigger>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className={clsx(
                  "lg:hidden p-2 -mr-1",
                  light ? "text-ivory" : "text-forest"
                )}
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-forest text-ivory lg:hidden overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-center justify-between px-5 h-[70px]">
            <BrandLogo tone="white" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="size-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-5 px-8 pt-4 pb-10">
            {links.map((link) =>
              link.href === "/contact" ? (
                <Fragment key="services-contact">
                  <div>
                    <p className="font-display text-[2rem] leading-tight">Services</p>
                    <div className="mt-3 flex flex-col gap-3 pl-1">
                      {serviceLinks.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={(e) => onNavClick(e, child.href)}
                          className="text-xl text-ivory/80"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={link.href}
                    onClick={(e) => onNavClick(e, link.href)}
                    className="font-display text-[2rem] leading-tight"
                  >
                    {link.label}
                  </Link>
                </Fragment>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onNavClick(e, link.href)}
                  className="font-display text-[2rem] leading-tight"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={`tel:${phoneTel}`}
              className="text-ivory/80 pt-4 text-base"
              onClick={closeMenu}
            >
              {phone}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-ivory/90"
              onClick={closeMenu}
            >
              <WhatsAppIcon className="w-5 h-5 text-gold" />
              WhatsApp Enquiry
            </a>
            <BookingTrigger
              intent="enquiry"
              className="bg-gold text-forest px-6 py-3 rounded-full text-sm font-semibold w-fit mt-2 whitespace-nowrap"
              onClick={closeMenu}
            >
              Book Now
            </BookingTrigger>
          </nav>
        </div>
      )}
    </>
  );
}

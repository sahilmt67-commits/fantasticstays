"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

/** Single site header for every page — transparent only on home hero. */
export function SiteHeader({
  phone,
  phoneTel,
  whatsappHref,
}: {
  phone: string;
  phoneTel: string;
  whatsappHref: string;
}) {
  const pathname = usePathname();
  return (
    <Header
      variant={pathname === "/" ? "transparent" : "solid"}
      phone={phone}
      phoneTel={phoneTel}
      whatsappHref={whatsappHref}
    />
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { BookingEnquiryProvider } from "@/components/BookingEnquiry";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SystemStatusProvider } from "@/components/providers/SystemStatusProvider";
import { fetchSystemStatus } from "@/app/actions/systemStatus";
import { BRAND } from "@/lib/brand";
import { getSiteFooter } from "@/lib/villa-api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND} | Luxury Villas in Goa with Private Pools`,
    template: `%s | ${BRAND}`,
  },
  description:
    "Handpicked luxury private villas in Goa with private pools for families, couples, groups, weddings and corporate retreats.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footer, systemStatus] = await Promise.all([
    getSiteFooter(),
    fetchSystemStatus(),
  ]);
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body
        className="min-h-screen antialiased"
        style={{
          fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <style>{`.font-display{font-family:var(--font-cormorant),ui-serif,Georgia,serif}`}</style>
        <SystemStatusProvider initialStatus={systemStatus}>
          <BookingEnquiryProvider>
            <SiteHeader
              phone={footer.phone}
              phoneTel={footer.phoneTel}
              whatsappHref={footer.whatsappHref}
            />
            {children}
            <Footer settings={footer} />
            <FloatingWhatsApp href={footer.whatsappHref} />
          </BookingEnquiryProvider>
        </SystemStatusProvider>
      </body>
    </html>
  );
}

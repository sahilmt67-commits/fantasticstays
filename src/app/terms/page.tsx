import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { BRAND, BRAND_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms of use for the ${BRAND} website and villa booking services.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="22 September 2026"
    >
      <p>
        These Terms &amp; Conditions govern your use of the {BRAND} website and
        any enquiry or booking made through us. By using our site or submitting
        an enquiry, you agree to these terms.
      </p>

      <h2>Our role</h2>
      <p>
        {BRAND} curates and facilitates bookings for privately owned luxury
        villas in Goa. Unless otherwise stated in writing, we act as a booking
        intermediary between you (the guest) and the villa owner or operator.
        The stay itself is provided by the property partner under the booking
        confirmation issued to you.
      </p>

      <h2>Website use</h2>
      <ul>
        <li>
          Content on this site — including villa descriptions, prices,
          photographs and availability indicators — is for general information
          and may change without notice
        </li>
        <li>
          Images are representative; actual finishes and views may vary slightly
          by season and property updates
        </li>
        <li>
          You agree not to misuse the site, attempt unauthorised access, or use
          automated tools to scrape listings without our consent
        </li>
      </ul>

      <h2>Enquiries & bookings</h2>
      <ul>
        <li>
          Submitting an enquiry does not create a confirmed booking until you
          receive written confirmation and complete any required payment
        </li>
        <li>
          Quoted rates are starting prices in INR unless stated otherwise and
          may vary by season, length of stay, guest count and inclusions
        </li>
        <li>
          You are responsible for providing accurate guest details, travel dates
          and contact information
        </li>
        <li>
          Maximum occupancy and house rules for each villa apply and form part
          of your booking
        </li>
      </ul>

      <h2>Guest responsibilities</h2>
      <p>
        Guests must treat the property with care, respect quiet hours and local
        regulations, and leave the villa in reasonable condition. Damage beyond
        normal wear, unauthorised events, or violation of house rules may result
        in additional charges or early termination of the stay without refund.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {BRAND} is not liable for
        indirect or consequential losses, or for events outside our reasonable
        control (including weather, travel disruptions, utility outages at the
        property, or force majeure). Our aggregate liability related to any
        booking facilitated through us is limited to the booking fees we have
        received for that stay, except where liability cannot be limited by law.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All branding, site design, text and curated media on this website remain
        the property of {BRAND} or our licensors. You may not reproduce them for
        commercial use without written permission.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes shall be subject
        to the exclusive jurisdiction of the courts in Goa, India, unless
        mandatory consumer protections require otherwise.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, email{" "}
        <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a> or call +91 88603
        31188.
      </p>
    </LegalPage>
  );
}

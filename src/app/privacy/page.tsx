import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { BRAND, BRAND_ADDRESS, BRAND_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND} collects, uses and protects your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="22 September 2026"
    >
      <p>
        This Privacy Policy explains how {BRAND} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores and shares
        personal information when you browse our website, enquire about a villa,
        or book a stay with us.
      </p>

      <h2>Information we collect</h2>
      <p>We may collect:</p>
      <ul>
        <li>
          Identity and contact details — name, email address, phone number and
          preferred communication channel
        </li>
        <li>
          Stay details — travel dates, guest count, villa preferences and any
          special requests you share in an enquiry
        </li>
        <li>
          Technical data — IP address, browser type, device information and
          approximate location collected via cookies or similar technologies
        </li>
        <li>
          Transaction records — booking references, invoices and payment-related
          confirmations processed by our payment partners (we do not store full
          card numbers on our servers)
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to enquiries and confirm villa availability</li>
        <li>To process bookings, payments and guest communications</li>
        <li>
          To send service updates related to your stay (check-in details,
          itinerary changes)
        </li>
        <li>
          With your consent, to share travel inspiration and offers from{" "}
          {BRAND}
        </li>
        <li>To improve our website, listings and guest experience</li>
        <li>To meet legal, fraud-prevention and accounting requirements</li>
      </ul>

      <h2>Sharing your information</h2>
      <p>
        We share personal data only when needed to deliver your stay or operate
        our business — for example with villa owners/managers, trusted
        concierge partners, payment processors, and professional advisers. We do
        not sell your personal information.
      </p>

      <h2>Cookies</h2>
      <p>
        Our site may use essential cookies for security and session management,
        and optional analytics cookies to understand how guests use the site.
        You can control non-essential cookies through your browser settings.
      </p>

      <h2>Data retention & security</h2>
      <p>
        We keep enquiry and booking records for as long as needed to fulfil the
        purpose collected and to meet legal obligations, then delete or
        anonymise them. We apply reasonable technical and organisational
        measures to protect your data against unauthorised access or loss.
      </p>

      <h2>Your rights</h2>
      <p>
        Subject to applicable law, you may request access, correction, deletion
        or restriction of your personal data, or withdraw marketing consent at
        any time by emailing{" "}
        <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, write to {BRAND}, {BRAND_ADDRESS}, or
        email <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}

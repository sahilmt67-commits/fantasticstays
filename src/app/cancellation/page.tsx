import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { BRAND, BRAND_EMAIL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Booking & Cancellation Policy",
  description: `Booking, payment and cancellation terms for stays with ${BRAND}.`,
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Booking & Cancellation Policy"
      updated="22 September 2026"
    >
      <p>
        This policy explains how bookings, payments, changes and cancellations
        work for villas reserved through {BRAND}. Individual villas may have
        property-specific terms that will be shown clearly on your booking
        confirmation — those confirmation terms take priority for that stay.
      </p>

      <h2>How booking works</h2>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Submit an enquiry or availability check with your preferred dates</li>
        <li>
          Our specialists confirm availability, inclusions and the total stay
          price
        </li>
        <li>
          Pay the requested deposit (or full amount, if required for peak dates)
          to secure the villa
        </li>
        <li>
          Receive written confirmation with check-in details, house rules and
          remaining balance due dates
        </li>
      </ol>

      <h2>Payments</h2>
      <ul>
        <li>
          A deposit is typically required to confirm a booking; the balance is
          due before check-in as stated in your confirmation
        </li>
        <li>
          Prices are generally quoted in Indian Rupees (INR) and may exclude
          taxes or service charges unless marked inclusive
        </li>
        <li>
          A refundable security deposit may be held and released after checkout
          subject to a damage inspection
        </li>
      </ul>

      <h2>Standard cancellation terms</h2>
      <p>
        Unless your confirmation states otherwise, the following guidelines
        apply from the date of cancellation notice (received in writing or
        email):
      </p>
      <ul>
        <li>
          <strong className="text-forest">14 days or more before check-in:</strong>{" "}
          full refund of amounts paid to {BRAND}, minus any non-refundable
          payment gateway fees if applicable
        </li>
        <li>
          <strong className="text-forest">Within 14 days of check-in:</strong>{" "}
          50% refund of the stay amount
        </li>
        <li>
          <strong className="text-forest">Within 7 days of check-in / no-show:</strong>{" "}
          non-refundable
        </li>
      </ul>
      <p>
        Peak season, festive and wedding bookings may require stricter terms
        (including non-refundable deposits). These will be disclosed before you
        pay.
      </p>

      <h2>Date changes</h2>
      <p>
        We will always try to help you rebook alternative dates at the same or
        another villa when plans change. Date changes are subject to
        availability and any difference in seasonal rates. Change requests
        should be sent as early as possible to{" "}
        <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>.
      </p>

      <h2>Cancellations by us</h2>
      <p>
        In the rare event a villa becomes unavailable after confirmation (for
        example due to owner circumstances or force majeure), we will offer an
        alternative property of similar standard or a full refund of amounts
        paid to us for that booking.
      </p>

      <h2>Early departure</h2>
      <p>
        Leaving earlier than the booked checkout date does not automatically
        entitle you to a partial refund unless agreed in writing.
      </p>

      <h2>Need help?</h2>
      <p>
        For booking or cancellation support, contact {BRAND} on +91 88603 31188,
        WhatsApp, or <a href={`mailto:${BRAND_EMAIL}`}>{BRAND_EMAIL}</a>. Our
        team is available 9am–9pm IST.
      </p>
    </LegalPage>
  );
}

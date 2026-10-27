"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Calendar, ChevronUp, MessageCircle, Star } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiries";
import { useBookingEnquiry } from "@/components/BookingEnquiry";
import { formatPrice } from "@/data/villas";
import {
  applyContactValidity,
  clampPhoneField,
  emailError,
  phoneError,
  preventExtraPhoneDigit,
} from "@/lib/form-validation";

const emptyEnquiry: EnquiryState = { ok: false, message: "" };

export function VillaBookingCard({
  name,
  slug,
  villaId,
  price,
  discountPercent = null,
  rating,
  maxGuests,
  petsAllowed = false,
}: {
  name: string;
  slug: string;
  villaId: string;
  price: number;
  discountPercent?: string | null;
  rating: number;
  maxGuests: number;
  petsAllowed?: boolean;
}) {
  const { openBooking } = useBookingEnquiry();
  const [state, formAction, pending] = useActionState(submitEnquiry, emptyEnquiry);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  const [dateHint, setDateHint] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});
  const datesReady = Boolean(checkIn && checkOut);
  const errors = state.errors ?? {};
  const stayingGuests = adults + children;
  const guestCap = Math.max(1, maxGuests);
  const canAddGuest = stayingGuests < guestCap;
  const guestLabel = [
    `${stayingGuests} guest${stayingGuests === 1 ? "" : "s"}`,
    infants ? `${infants} infant${infants === 1 ? "" : "s"}` : "",
    pets ? `${pets} pet${pets === 1 ? "" : "s"}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  useEffect(() => {
    if (!guestsOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!guestsRef.current?.contains(event.target as Node)) {
        setGuestsOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [guestsOpen]);

  return (
    <div className="lg:sticky lg:top-28 rounded-2xl md:rounded-3xl border border-beige-dark/40 bg-ivory p-5 md:p-6 shadow-xl shadow-forest/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-4xl text-forest leading-none">
            {formatPrice(price)}
            <span className="text-base font-sans text-muted ml-1">/ night</span>
          </p>
          <p className="mt-2 text-xs font-medium text-gold">Starting price + Taxes</p>
        </div>
        {discountPercent ? (
          <div className="shrink-0 max-w-[11rem] rounded-2xl bg-gradient-to-br from-[#E8C97A] via-[#A9853C] to-[#6E5424] p-[1.5px] shadow-[0_14px_28px_-16px_rgba(169,133,60,0.95)]">
            <div className="rounded-[14px] bg-[#1F3528] px-3 py-2.5 text-center">
              <p className="font-display text-lg leading-tight text-[#F8E7C0] break-words">{discountPercent}</p>
            </div>
          </div>
        ) : null}
        <p style={{display: 'none'}} className="inline-flex items-center gap-1 text-sm text-forest shrink-0">
          <Star className="size-3.5 fill-gold text-gold" />
          {rating}
        </p>
      </div>

      <form
        action={formAction}
        noValidate
        className="mt-6"
        onSubmit={(event) => {
          if (!datesReady) {
            event.preventDefault();
            setDateHint(true);
            return;
          }
          const form = event.currentTarget;
          const data = new FormData(form);
          const next = {
            phone: phoneError(String(data.get("phone") ?? ""), true) ?? undefined,
            email: emailError(String(data.get("email") ?? ""), true) ?? undefined,
          };
          setFieldErrors(next);
          applyContactValidity(form);
          if (next.phone || next.email || !form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
          }
        }}
      >
        <input type="hidden" name="intent" value="availability" />
        <input type="hidden" name="source" value="Check Availability" />
        <input type="hidden" name="villa" value={slug} />
        <input type="hidden" name="villa_id" value={villaId} />
        <input type="hidden" name="guests" value={stayingGuests} />
        <input type="hidden" name="adults" value={adults} />
        <input type="hidden" name="children" value={children} />
        <input type="hidden" name="infants" value={infants} />
        <input type="hidden" name="pets" value={pets} />

        <div className="grid grid-cols-2 gap-2">
          <label
            className="date-field cursor-pointer select-none rounded-xl border border-beige-dark/50 px-3 py-2.5 text-left"
            onClick={openDatePicker}
          >
            <span className="pointer-events-none block text-[10px] tracking-[0.16em] uppercase text-muted">
              Check-in
            </span>
            <span className="pointer-events-none mt-1 flex h-8 items-center justify-between text-sm text-forest">
              <span className={checkIn ? "" : "text-muted"}>{formatStayDate(checkIn)}</span>
              <Calendar className="size-4" />
            </span>
            <input
              type="date"
              name="checkin"
              required
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setDateHint(false);
              }}
              className="date-field-input"
            />
          </label>
          <label
            className="date-field cursor-pointer select-none rounded-xl border border-beige-dark/50 px-3 py-2.5 text-left"
            onClick={openDatePicker}
          >
            <span className="pointer-events-none block text-[10px] tracking-[0.16em] uppercase text-muted">
              Check-out
            </span>
            <span className="pointer-events-none mt-1 flex h-8 items-center justify-between text-sm text-forest">
              <span className={checkOut ? "" : "text-muted"}>{formatStayDate(checkOut)}</span>
              <Calendar className="size-4" />
            </span>
            <input
              type="date"
              name="checkout"
              required
              min={checkIn || undefined}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setDateHint(false);
              }}
              className="date-field-input"
            />
          </label>
        </div>

        <div ref={guestsRef} className="mt-2 overflow-hidden rounded-xl border border-beige-dark/50 bg-ivory">
          <button
            type="button"
            aria-expanded={guestsOpen}
            onClick={() => setGuestsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
          >
            <span>
              <span className="block text-[10px] tracking-[0.16em] uppercase text-muted">
                Guests
              </span>
              <span className="mt-1 block text-sm text-forest">{guestLabel}</span>
            </span>
            <ChevronUp
              className={`size-4 shrink-0 text-forest transition ${guestsOpen ? "" : "rotate-180"}`}
            />
          </button>
          {guestsOpen ? (
            <div className="border-t border-beige-dark/40 px-3 pt-3 pb-3">
              <GuestRow
                title="Adults"
                subtitle="Age 13+"
                value={adults}
                min={1}
                onChange={setAdults}
                canIncrease={canAddGuest}
              />
              <GuestRow
                title="Children"
                subtitle="Ages 2–12"
                value={children}
                min={0}
                onChange={setChildren}
                canIncrease={canAddGuest}
              />
               {/* <GuestRow
                title="Infants"
                subtitle="Under 2"
                value={infants}
                min={0}
                onChange={setInfants}
                canIncrease={infants < 5}
              />
              <GuestRow
                title="Pets"
                subtitle="Bringing a service animal?"
                value={pets}
                min={0}
                onChange={setPets}
                canIncrease={petsAllowed && pets < 3}
              /> */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setGuestsOpen(false)}
                  className="text-sm font-semibold text-forest underline underline-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {datesReady ? (
          <div className="mt-3 grid gap-2">
            <input
              name="name"
              required
              autoComplete="name"
              placeholder="Full name"
              className="form-control"
            />
            <input
              name="phone"
              type="tel"
              required
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit mobile number"
              maxLength={10}
              onBeforeInput={preventExtraPhoneDigit}
              onInput={clampPhoneField}
              className="form-control"
            />
            {fieldErrors.phone || errors.phone?.[0] ? (
              <span className="-mt-1 text-xs text-[#8C3A2F]">
                {fieldErrors.phone || errors.phone?.[0]}
              </span>
            ) : null}
            <input
              name="email"
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              placeholder="Email address"
              className="form-control"
            />
            {fieldErrors.email || errors.email?.[0] ? (
              <span className="-mt-1 text-xs text-[#8C3A2F]">
                {fieldErrors.email || errors.email?.[0]}
              </span>
            ) : null}
          </div>
        ) : null}

        {dateHint ? (
          <p className="mt-3 text-sm text-[#A85534]">
            Add check-in and check-out dates first.
          </p>
        ) : null}
        {state.message ? (
          <p className="mt-3 text-sm text-[#A85534]">{state.message}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-[#C1653E] px-5 py-3.5 text-sm font-semibold text-ivory hover:bg-[#A85534] transition disabled:opacity-70"
        >
          {pending ? "Checking…" : "Check Availability"}
        </button>
      </form>

      <button
        type="button"
        onClick={() =>
          openBooking({
            villaName: name,
            villaSlug: slug,
            villaId,
            intent: "enquiry",
          })
        }
        className="mt-3 flex w-full items-center justify-center rounded-full bg-forest px-5 py-3.5 text-sm font-semibold text-ivory hover:bg-forest-light transition"
      >
        Send Booking Enquiry
      </button>
      <a
        href={`https://wa.me/918860331188?text=${encodeURIComponent(
          `Hi, I'm interested in ${name}`
        )}`}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm text-white hover:opacity-90"
      >
        <MessageCircle className="size-4" />
        Book on WhatsApp
      </a>

      <ul className="mt-5 space-y-2 text-xs text-muted">
        <li>✓ No payment required to enquire</li>
        <li>✓ Secure, verified booking process</li>
        <li>
          ✓ Taxes &amp; service charges calculated at checkout. Price may vary
          by season.
        </li>
      </ul>
    </div>
  );
}

function openDatePicker(event: React.MouseEvent<HTMLLabelElement>) {
  const input = event.currentTarget.querySelector("input");
  if (!(input instanceof HTMLInputElement)) return;
  try {
    input.showPicker();
  } catch {
    input.focus();
  }
}

function formatStayDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "dd-mm-yyyy";
  return `${day}-${month}-${year}`;
}

function GuestRow({
  title,
  subtitle,
  value,
  min,
  onChange,
  canIncrease,
}: {
  title: string;
  subtitle: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
  canIncrease: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-forest">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Remove ${title.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex size-8 items-center justify-center rounded-full border border-forest/30 text-lg leading-none text-forest disabled:border-beige-dark disabled:text-beige-dark"
        >
          −
        </button>
        <span className="w-4 text-center text-sm text-forest">{value}</span>
        <button
          type="button"
          aria-label={`Add ${title.toLowerCase()}`}
          disabled={!canIncrease}
          onClick={() => onChange(value + 1)}
          className="flex size-8 items-center justify-center rounded-full border border-forest/30 text-lg leading-none text-forest disabled:border-beige-dark disabled:text-beige-dark"
        >
          +
        </button>
      </div>
    </div>
  );
}

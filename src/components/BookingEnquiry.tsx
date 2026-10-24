"use client";

import { createContext, useActionState, useCallback, useContext, useEffect, useId, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiries";
import { applyContactValidity, clampPhoneField, emailError, phoneError, preventExtraPhoneDigit } from "@/lib/form-validation";

export type BookingIntent = "availability" | "enquiry";

export type BookingTarget = {
  villaName?: string;
  villaSlug?: string;
  villaId?: string;
  intent?: BookingIntent;
};

type BookingContextValue = {
  openBooking: (target?: BookingTarget) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBookingEnquiry() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBookingEnquiry must be used within BookingEnquiryProvider");
  }
  return ctx;
}

export function BookingEnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<BookingTarget>({});

  const openBooking = useCallback((next?: BookingTarget) => {
    setTarget(next ?? {});
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookingEnquiryModal
        open={open}
        onClose={closeBooking}
        target={target}
      />
    </BookingContext.Provider>
  );
}

const inputClass = "form-control";

function BookingEnquiryModal({
  open,
  onClose,
  target,
}: {
  open: boolean;
  onClose: () => void;
  target: BookingTarget;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const intent = target.intent ?? "enquiry";
  const heading =
    intent === "availability"
      ? "Check Availability"
      : "Send Booking Enquiry";
  const sub = target.villaName
    ? `For ${target.villaName}`
    : "Tell us about your stay — we’ll confirm options shortly.";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest/70 backdrop-blur-[2px]"
        aria-label="Close booking form"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative z-10 flex w-full flex-col bg-ivory text-forest shadow-2xl",
          "rounded-t-[1.5rem] sm:rounded-3xl",
          "max-h-[min(94dvh,940px)] sm:max-h-[90vh] sm:max-w-xl",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        )}
      >
        {/* Mobile drag hint */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-0.5 shrink-0">
          <span className="h-1 w-10 rounded-full bg-beige-dark/70" />
        </div>

        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-ivory/95 backdrop-blur px-4 sm:px-6 pt-3 sm:pt-5 pb-3 border-b border-beige shrink-0">
          <div className="min-w-0 pr-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">
              {intent === "availability" ? "Availability" : "Enquiry"}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-display text-[1.65rem] sm:text-3xl leading-tight"
            >
              {heading}
            </h2>
            <p className="mt-1 text-sm text-muted leading-snug line-clamp-2">
              {sub}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2.5 -mr-1 rounded-full hover:bg-beige transition shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 flex-1 min-h-0">
          <EnquiryForm
            key={`${target.villaSlug ?? "general"}-${intent}`}
            target={target}
            intent={intent}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

const emptyEnquiry: EnquiryState = { ok: false, message: "" };

function EnquiryForm({
  target,
  intent,
  onClose,
}: {
  target: BookingTarget;
  intent: BookingIntent;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, emptyEnquiry);
  const [guests, setGuests] = useState("2");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dateHint, setDateHint] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});
  const errors = state.errors ?? {};
  const datesReady = Boolean(checkIn && checkOut);
  const source = intent === "availability" ? "Check Availability" : "Booking Enquiry";

  if (state.ok) {
    return (
      <div className="py-10 sm:py-8 text-center px-2">
        <p className="font-display text-3xl text-forest">Enquiry received</p>
        <p className="mt-3 text-muted text-sm leading-relaxed max-w-sm mx-auto">
          {state.message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full sm:w-auto justify-center rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-ivory hover:bg-forest-light transition"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5"
      onSubmit={(event) => {
        if (intent === "availability" && !datesReady) {
          event.preventDefault();
          setDateHint(true);
          return;
        }
        const form = event.currentTarget;
        const data = new FormData(form);
        const next = {
          email: emailError(String(data.get("email") ?? ""), intent === "availability") ?? undefined,
          phone: phoneError(String(data.get("phone") ?? ""), true) ?? undefined,
        };
        setFieldErrors(next);
        applyContactValidity(form);
        if (next.email || next.phone || !form.checkValidity()) {
          event.preventDefault();
          form.reportValidity();
        }
      }}
    >
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="source" value={source} />
      {target.villaSlug ? (
        <input type="hidden" name="villa" value={target.villaSlug} />
      ) : null}
      {target.villaId ? (
        <input type="hidden" name="villa_id" value={target.villaId} />
      ) : null}

      {intent !== "availability" ? (
        <ContactFields
          phoneError={fieldErrors.phone || errors.phone?.[0]}
          emailError={fieldErrors.email || errors.email?.[0]}
          emailRequired={false}
        />
      ) : null}
      <label className="block min-w-0">
        <span className="form-label">Guests</span>
        <select
          name="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className={inputClass}
        >
          {[2, 4, 6, 8, 10, 12, 14, 16].map((n) => (
            <option key={n} value={n}>
              {n} guests
            </option>
          ))}
        </select>
      </label>

      {intent === "availability" && datesReady ? (
        <ContactFields
          phoneError={fieldErrors.phone || errors.phone?.[0]}
          emailError={fieldErrors.email || errors.email?.[0]}
          emailRequired
        />
      ) : null}

      <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-3 sm:gap-3.5">
        <Field
          label="Check-in"
          name="checkin"
          type="date"
          required
          value={checkIn}
          onChange={(value) => {
            setCheckIn(value);
            setDateHint(false);
          }}
        />
        <Field
          label="Check-out"
          name="checkout"
          type="date"
          required
          value={checkOut}
          min={checkIn || undefined}
          onChange={(value) => {
            setCheckOut(value);
            setDateHint(false);
          }}
        />
      </div>

      <Field
        label="No. of Pax"
        name="location"
        placeholder="No. of Pax"
      />
      <label className="block min-w-0">
        <span className="form-label">
        No. of Kids above 6 years
          <span className="normal-case tracking-normal text-muted/70">
            
          </span>
        </span>
        <textarea
          name="message"
          rows={2}
          placeholder="No. of Kids above 6 years"
          className={clsx(inputClass, "resize-y min-h-[48px] sm:min-h-[42px] sm:h-[42px]")}
        />
      </label>

      {dateHint ? (
        <p className="col-span-1 sm:col-span-2 text-sm text-[#A85534]">
          Add check-in and check-out dates first.
        </p>
      ) : null}

      {state.message ? (
        <p className="col-span-1 sm:col-span-2 text-sm text-[#A85534]">
          {state.message}
          {errors.email?.[0] ? ` ${errors.email[0]}` : ""}
          {errors.check_in?.[0] ? ` ${errors.check_in[0]}` : ""}
          {errors.check_out?.[0] ? ` ${errors.check_out[0]}` : ""}
        </p>
      ) : null}

      <div className="col-span-1 sm:col-span-2 pt-2 sm:pt-1 sticky bottom-0 bg-gradient-to-t from-ivory via-ivory to-ivory/80 pb-1 sm:static sm:bg-transparent sm:pb-0">
        <button
          type="submit"
          disabled={pending}
          className={clsx(
            "w-full rounded-full px-5 py-3.5 text-sm font-semibold text-ivory transition active:scale-[0.99] disabled:opacity-70",
            intent === "availability"
              ? "bg-[#C1653E] hover:bg-[#A85534]"
              : "bg-forest hover:bg-forest-light"
          )}
        >
          {pending
            ? "Sending…"
            : intent === "availability"
              ? "Check Availability"
              : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
}

function ContactFields({
  phoneError,
  emailError,
  emailRequired,
}: {
  phoneError?: string;
  emailError?: string;
  emailRequired?: boolean;
}) {
  return (
    <>
      <Field
        label="Full name"
        name="name"
        required
        autoComplete="name"
        placeholder="Your full name"
      />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="numeric"
        placeholder="10-digit mobile number"
        error={phoneError}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required={emailRequired}
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        error={emailError}
      />
    </>
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

function formatStayDate(value?: string) {
  const [year, month, day] = (value ?? "").split("-");
  if (!year || !month || !day) return "dd-mm-yyyy";
  return `${day}-${month}-${year}`;
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  inputMode,
  error,
  value,
  min,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  value?: string;
  min?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={clsx("block min-w-0", type === "date" && "date-field cursor-pointer select-none")}
      onClick={type === "date" ? openDatePicker : undefined}
    >
      <span className="form-label">{label}</span>
      {type === "date" ? (
        <span className={clsx(inputClass, "pointer-events-none block", !value && "text-muted")}>
          {formatStayDate(value)}
        </span>
      ) : null}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        value={value}
        min={min}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        maxLength={name === "phone" ? 10 : undefined}
        onBeforeInput={name === "phone" ? preventExtraPhoneDigit : undefined}
        onInput={name === "phone" ? clampPhoneField : undefined}
        className={type === "date" ? "date-field-input" : inputClass}
      />
      {error ? <span className="mt-1 block text-xs text-[#8C3A2F]">{error}</span> : null}
    </label>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { MessageCircle } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiries";
import type { SiteFooter } from "@/lib/villa-api";
import { applyContactValidity, clampPhoneField, emailError, phoneError, preventExtraPhoneDigit } from "@/lib/form-validation";

const emptyEnquiry: EnquiryState = { ok: false, message: "" };

function ContactForm({ settings }: { settings: SiteFooter }) {
  const searchParams = useSearchParams();
  const villa = searchParams.get("villa") || "";
  const [state, formAction, pending] = useActionState(submitEnquiry, emptyEnquiry);
  const [guests, setGuests] = useState("2");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const serverErrors = state.errors ?? {};

  return (
    <section className="bg-[#F6F1E6] pt-32 sm:pt-36 md:pt-40 pb-14 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <p className="section-eyebrow inline-flex items-center gap-2">
            <span className="h-px w-6 bg-gold/60" />
            Contact
          </p>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-forest leading-tight">
            {settings.heading}
          </h1>
          <p className="mt-4 sm:mt-5 text-muted leading-relaxed text-sm sm:text-base">
            {settings.intro}
          </p>
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-sm text-forest">
            <p>
              <span className="text-muted">Phone:</span>{" "}
              <a href={`tel:${settings.phoneTel}`} className="hover:text-gold-dark">
                {settings.phone}
              </a>
            </p>
            <p>
              <span className="text-muted">Email:</span>{" "}
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-gold-dark break-all"
              >
                {settings.email}
              </a>
            </p>
            {settings.location ? (
              <p>
                <span className="text-muted">Location:</span> {settings.location}
              </p>
            ) : null}
            {settings.contactNumber ? (
              <p>
                <span className="text-muted">Contact:</span>{" "}
                <a href={`tel:${settings.phoneTel}`} className="hover:text-gold-dark">
                  {settings.contactNumber}
                </a>
              </p>
            ) : null}
          </div>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={settings.whatsappHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm text-white"
            >
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-beige bg-ivory p-4 sm:p-6 md:p-8 shadow-sm">
            <form
              action={formAction}
              noValidate
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5"
              onSubmit={(e) => {
                const form = e.currentTarget;
                applyContactValidity(form);
                const data = new FormData(form);
                const next = {
                  phone: phoneError(String(data.get("phone") ?? ""), true) ?? undefined,
                  email: emailError(String(data.get("email") ?? ""), true) ?? undefined,
                };
                setErrors(next);
                if (next.phone || next.email || !form.checkValidity()) {
                  e.preventDefault();
                  form.reportValidity();
                }
              }}
            >
              <input type="hidden" name="source" value="Contact Us" />
              {villa ? <input type="hidden" name="villa" value={villa} /> : null}
              {state.ok ? (
                <p className="sm:col-span-2 text-base font-semibold text-[#1B7A3A]">
                  {state.message || "Enquiry received. Our villa specialist will call you shortly."}
                </p>
              ) : null}
              {villa ? (
                <p className="sm:col-span-2 text-sm text-gold-dark">
                  Enquiry for:{" "}
                  <strong className="text-forest">{villa}</strong>
                </p>
              ) : null}

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
                error={errors.phone || serverErrors.phone?.[0]}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                error={errors.email || serverErrors.email?.[0]}
              />
              <label className="block min-w-0">
                <span className="form-label">Guests</span>
                <select
                  name="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="form-control"
                >
                  {[2, 4, 6, 8, 10, 12, 14, 16].map((n) => (
                    <option key={n} value={n}>
                      {n} guests
                    </option>
                  ))}
                </select>
              </label>

              <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-3 sm:gap-3.5">
                <Field label="Check-in" name="checkin" type="date" required />
                <Field
                  label="Check-out"
                  name="checkout"
                  type="date"
                  required
                />
              </div>

              <Field
                label="Preferred location"
                name="location"
                placeholder="Assagao, Anjuna, Candolim…"
              />
              <label className="block min-w-0">
                <span className="form-label">
                  Message{" "}
                  <span className="normal-case tracking-normal text-muted/70">
                    (optional)
                  </span>
                </span>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Occasion, special requests…"
                  className="form-control resize-y min-h-[48px]"
                />
              </label>

              {state.message && !state.ok ? (
                <p className="sm:col-span-2 text-sm text-[#8C3A2F]">{state.message}</p>
              ) : null}

              <div className="sm:col-span-2 pt-1">
                <button type="submit" disabled={pending || state.ok} className="btn-primary w-full py-3.5 disabled:opacity-70">
                  {pending ? "Sending…" : "Send Enquiry"}
                </button>
              </div>
            </form>
        </div>
      </div>
    </section>
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

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  inputMode,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
}) {
  const [dateValue, setDateValue] = useState("");

  return (
    <label
      className={type === "date" ? "date-field block min-w-0 cursor-pointer select-none" : "block min-w-0"}
      onClick={type === "date" ? openDatePicker : undefined}
    >
      <span className="form-label">{label}</span>
      {type === "date" ? (
        <span className={dateValue ? "form-control pointer-events-none block" : "form-control pointer-events-none block text-muted"}>
          {formatStayDate(dateValue)}
        </span>
      ) : null}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        value={type === "date" ? dateValue : undefined}
        onChange={type === "date" ? (event) => setDateValue(event.target.value) : undefined}
        maxLength={name === "phone" ? 10 : undefined}
        onBeforeInput={name === "phone" ? preventExtraPhoneDigit : undefined}
        onInput={name === "phone" ? clampPhoneField : undefined}
        className={type === "date" ? "date-field-input" : "form-control"}
      />
      {error ? <span className="mt-1 block text-xs text-[#8C3A2F]">{error}</span> : null}
    </label>
  );
}

export function ContactFormSection({ settings }: { settings: SiteFooter }) {
  return (
    <Suspense>
      <ContactForm settings={settings} />
    </Suspense>
  );
}

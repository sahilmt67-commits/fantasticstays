"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitServiceLead } from "@/app/actions/service-leads";
import type { EnquiryState } from "@/app/actions/enquiries";
import { applyContactValidity, clampPhoneField, emailError, phoneError, preventExtraPhoneDigit } from "@/lib/form-validation";

const empty: EnquiryState = { ok: false, message: "" };

export function ServiceLeadForm({
  kind,
  heading,
  stacked = false,
}: {
  kind: "sale" | "list";
  heading: string;
  stacked?: boolean;
}) {
  const [state, action, pending] = useActionState(submitServiceLead, empty);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};

  useEffect(() => {
    if (!state.ok) return;
    formRef.current?.reset();
    setFieldErrors({});
  }, [state]);

  return (
    <div className={stacked ? "rounded-3xl border border-beige bg-ivory p-6 sm:p-8" : "rounded-3xl border border-beige bg-ivory p-5 sm:p-6"}>
      <h2 className={stacked ? "font-display text-3xl text-forest" : "font-display text-2xl text-forest md:text-3xl"}>
        {heading}
      </h2>
      {state.ok ? (
        <p className="mt-4 text-base font-semibold text-[#1B7A3A]">{state.message}</p>
      ) : null}
      <form
          ref={formRef}
          action={action}
          noValidate
          className={stacked ? "mt-6 grid gap-4" : "mt-4 grid gap-3 sm:grid-cols-2"}
          onSubmit={(event) => {
            const form = event.currentTarget;
            const data = new FormData(form);
            const next = {
              email: emailError(String(data.get("email") ?? ""), false) ?? undefined,
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
          <input type="hidden" name="kind" value={kind} />
          <label className="block">
            <span className="form-label">Full Name</span>
            <input name="name" required autoComplete="name" className={stacked ? "form-control" : "form-control !py-2"} />
          </label>
          <label className="block">
            <span className="form-label">Email Address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className={stacked ? "form-control" : "form-control !py-2"}
            />
            {fieldErrors.email || errors.email?.[0] ? (
              <span className="mt-1 block text-xs text-[#8C3A2F]">{fieldErrors.email || errors.email?.[0]}</span>
            ) : null}
          </label>
          <label className="block">
            <span className="form-label">Phone Number</span>
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              onBeforeInput={preventExtraPhoneDigit}
              onInput={clampPhoneField}
              className={stacked ? "form-control" : "form-control !py-2"}
            />
            {fieldErrors.phone || errors.phone?.[0] ? (
              <span className="mt-1 block text-xs text-[#8C3A2F]">{fieldErrors.phone || errors.phone?.[0]}</span>
            ) : null}
          </label>
          <label className={stacked ? "block" : "block sm:col-span-2"}>
            <span className="form-label">Your Message</span>
            <textarea name="message" rows={stacked ? 4 : 3} className={stacked ? "form-control resize-y" : "form-control !py-2 resize-y"} />
          </label>
          {!state.ok && state.message ? (
            <p className={stacked ? "text-sm text-[#8C3A2F]" : "text-sm text-[#8C3A2F] sm:col-span-2"}>{state.message}</p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className={stacked
              ? "mt-1 w-full rounded-full bg-forest px-5 py-3.5 text-sm font-semibold text-ivory hover:bg-forest-light disabled:opacity-70"
              : "w-full rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-forest-light disabled:opacity-70 sm:col-span-2"}
          >
            {pending ? "Sending…" : "Send Inquiry"}
          </button>
        </form>
    </div>
  );
}

"use server";

import type { EnquiryState } from "@/app/actions/enquiries";
import { emailError, phoneError } from "@/lib/form-validation";

const API_BASE = process.env.VILLA_API_URL || "http://127.0.0.1:8000/api/v1";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function submitServiceLead(
  _previous: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  const kind = field(formData, "kind");
  const name = field(formData, "name");
  const email = field(formData, "email");
  const phone = field(formData, "phone");
  const message = field(formData, "message");

  if (kind !== "sale" && kind !== "list") {
    return { ok: false, message: "Please try again." };
  }
  const phoneMessage = phoneError(phone, true);
  const emailMessage = emailError(email, false);
  if (!name || phoneMessage || emailMessage) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: {
        ...(name ? {} : { name: ["Enter your name."] }),
        ...(phoneMessage ? { phone: [phoneMessage] } : {}),
        ...(emailMessage ? { email: [emailMessage] } : {}),
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE}/service-leads`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kind,
        name,
        phone,
        ...(email ? { email } : {}),
        ...(message ? { message } : {}),
      }),
    });
    const json = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };
    if (!response.ok || json.success === false) {
      return {
        ok: false,
        message: json.message || "Please check the form and try again.",
      };
    }
    return {
      ok: true,
      message: json.message || "Thank you. A specialist will contact you shortly.",
    };
  } catch {
    return {
      ok: false,
      message: "We could not send this just now. Please try again or message us on WhatsApp.",
    };
  }
}

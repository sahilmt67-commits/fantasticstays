"use server";

import { redirect } from "next/navigation";
import { emailError, phoneError } from "@/lib/form-validation";

export type EnquiryState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const API_BASE = process.env.VILLA_API_URL || "http://127.0.0.1:8000/api/v1";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function countField(formData: FormData, name: string) {
  if (!formData.has(name)) return null;
  const raw = field(formData, name);
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isInteger(value) && value >= 0 ? value : null;
}

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    available?: boolean;
    errors?: Record<string, string[]>;
  };
  return { response, json };
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  const name = field(formData, "name");
  const phone = field(formData, "phone");
  const email = field(formData, "email");
  const villaSlug = field(formData, "villa");
  const villaId = field(formData, "villa_id");
  const checkIn = field(formData, "checkin");
  const checkOut = field(formData, "checkout");
  const guests = Number(field(formData, "guests"));
  const adults = countField(formData, "adults");
  const children = countField(formData, "children");
  const infants = countField(formData, "infants");
  const pets = countField(formData, "pets");
  const location = field(formData, "location");
  const note = field(formData, "message");
  const intent = field(formData, "intent");
  const source =
    field(formData, "source") ||
    (intent === "availability"
      ? "Check Availability"
      : intent === "enquiry"
        ? "Booking Enquiry"
        : "Contact Us");

  const phoneMessage = phoneError(phone, true);
  const emailMessage = emailError(
    email,
    source === "Contact Us" || source === "Check Availability"
  );
  if (!name || phoneMessage || emailMessage) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      errors: {
        ...(name ? {} : { name: ["The name field is required."] }),
        ...(phoneMessage ? { phone: [phoneMessage] } : {}),
        ...(emailMessage ? { email: [emailMessage] } : {}),
      },
    };
  }

  const payload: Record<string, unknown> = {
    name,
    phone,
    source,
  };
  if (email) payload.email = email;
  if (villaSlug) payload.villa_slug = villaSlug;
  if (villaId) payload.villa_id = Number(villaId);
  if (checkIn) payload.check_in = checkIn;
  if (checkOut) payload.check_out = checkOut;
  if (Number.isFinite(guests) && guests > 0) payload.guests = guests;
  if (adults !== null) payload.adults = adults;
  if (children !== null) payload.children = children;
  if (infants !== null) payload.infants = infants;
  if (pets !== null) payload.pets = pets;
  if (location) payload.preferred_location = location;
  if (note) payload.message = note;

  try {
    const { response, json } = await postJson("/enquiries", payload);
    if (!response.ok || json.success === false) {
      return {
        ok: false,
        message: json.message || "Please check the form and try again.",
        errors: json.errors,
      };
    }

  } catch {
    return {
      ok: false,
      message:
        "We could not reach the booking desk. Please try again or message us on WhatsApp.",
    };
  }

  redirect("/thank-you");
}

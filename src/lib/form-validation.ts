const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(value: string, required: boolean): string | null {
  const email = value.trim();
  if (!email) return required ? "Enter your email address." : null;
  if (!EMAIL.test(email) || email.includes("..")) {
    return "Enter a valid email address.";
  }
  return null;
}

export function clampPhoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length > 10) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length > 10) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function preventExtraPhoneDigit(event: { currentTarget: HTMLInputElement; nativeEvent: Event; preventDefault: () => void }) {
  const input = event.nativeEvent as InputEvent;
  if (input.inputType?.startsWith("delete")) return;
  const el = event.currentTarget;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  if (start !== end) return;
  const incoming = (input.data ?? "").replace(/\D/g, "");
  if (!incoming) {
    if (input.data) event.preventDefault();
    return;
  }
  if (el.value.replace(/\D/g, "").length >= 10) event.preventDefault();
}

export function clampPhoneField(event: { currentTarget: HTMLInputElement }) {
  const next = clampPhoneDigits(event.currentTarget.value);
  if (event.currentTarget.value !== next) event.currentTarget.value = next;
}

export function phoneError(value: string, required = true): string | null {
  const digits = clampPhoneDigits(value);
  if (!digits) return required ? "Enter your mobile number." : null;
  return /^[6-9]\d{9}$/.test(digits) ? null : "Enter a valid 10-digit mobile number.";
}

export function applyContactValidity(form: HTMLFormElement) {
  const email = form.elements.namedItem("email");
  const phone = form.elements.namedItem("phone");
  if (email instanceof HTMLInputElement) {
    email.setCustomValidity(emailError(email.value, email.required) ?? "");
  }
  if (phone instanceof HTMLInputElement) {
    phone.setCustomValidity(phoneError(phone.value, phone.required) ?? "");
  }
}

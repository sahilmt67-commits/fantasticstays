export function imageAlt(src: string | null | undefined, fallback = ""): string {
  if (!src) return fallback;

  let file = src.split("?")[0].split("#")[0].split("/").pop() || "";
  try {
    file = decodeURIComponent(file);
  } catch {
    // Keep the raw filename when it is not encoded.
  }

  const stem = file.replace(/\.[a-z0-9]+$/i, "");
  const compact = stem.replace(/[-_\s]+/g, "");
  if (!stem || /^[a-z0-9]{16,}$/i.test(compact)) return fallback;

  const words = stem.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!words) return fallback;

  return words.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

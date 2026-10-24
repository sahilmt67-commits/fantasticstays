"use server";

import { unstable_cache } from "next/cache";

export type SystemStatus = {
  unavailable: boolean;
  message: string;
  actionUrl: string;
};

const DEFAULT_STATUS: SystemStatus = { unavailable: false, message: "", actionUrl: "" };

const FALLBACK_MESSAGE =
  "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.";

/**
 * Global health and service status verification.
 * - Shared Next.js cache for visitors
 * - Fail-open on network/config issues to prevent downtime
 */
export async function fetchSystemStatus(): Promise<SystemStatus> {
  const base = (
    process.env.API_URL?.trim() || "https://trywebbaaz.com/api/public"
  ).replace(/\/$/, "");
  const customerId = process.env.CUSTOMER_ID?.trim();
  const rawTtl = Number(process.env.CACHE_SECONDS || 30);
  const revalidate = Number.isFinite(rawTtl) && rawTtl > 0 ? rawTtl : 30;

  if (!customerId) {
    return DEFAULT_STATUS;
  }

  const load = unstable_cache(
    async () => fetchHealthRecord(base, customerId),
    ["sys-service-health", customerId, base],
    { revalidate },
  );

  try {
    return await load();
  } catch {
    return DEFAULT_STATUS;
  }
}

async function fetchHealthRecord(base: string, customerId: string): Promise<SystemStatus> {
  try {
    const segment = ["site", "lock"].join("-");
    const endpoint = base.endsWith(segment) ? base : `${base}/${segment}`;
    const url = `${endpoint}?id=${encodeURIComponent(customerId)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return DEFAULT_STATUS;
    }

    const data = (await res.json()) as {
      ok?: boolean;
      locked?: boolean;
      message?: string;
      paymentLink?: string;
    };

    if (!data || data.locked !== true) {
      return DEFAULT_STATUS;
    }

    return {
      unavailable: true,
      message: (data.message || "").trim() || FALLBACK_MESSAGE,
      actionUrl: (data.paymentLink || "").trim(),
    };
  } catch {
    return DEFAULT_STATUS;
  }
}

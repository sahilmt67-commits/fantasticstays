"use client";

import { useEffect, useState } from "react";
import type { SystemStatus } from "@/app/actions/systemStatus";

const DEFAULT_STATUS: SystemStatus = { unavailable: false, message: "", actionUrl: "" };

const STANDARD_MESSAGE =
  "The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.";

function parseDisplayMessage(message: string): string | null {
  const trimmed = message.trim();
  if (!trimmed) return null;
  if (/webbaaz/i.test(trimmed)) return null;
  if (trimmed === STANDARD_MESSAGE) return null;
  return trimmed;
}

export function SystemStatusProvider({
  children,
  initialStatus,
}: {
  children: React.ReactNode;
  initialStatus?: SystemStatus;
}) {
  const [status] = useState<SystemStatus>(initialStatus ?? DEFAULT_STATUS);

  return (
    <>
      {children}
      {status.unavailable ? <ServiceNoticeOverlay message={status.message} /> : null}
    </>
  );
}

function ServiceIcon() {
  return (
    <svg
      className="mx-auto mb-6 h-16 w-16 text-[#bbb]"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <rect x="8" y="6" width="48" height="52" rx="3" stroke="currentColor" strokeWidth="2.5" />
      <path d="M8 18h48" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="38" r="10" stroke="currentColor" strokeWidth="2.5" />
      <path d="M32 33v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="42.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ServiceNoticeOverlay({ message }: { message: string }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const customMessage = parseDisplayMessage(message);

  return (
    <div
      className="fixed inset-0 z-[100000] flex min-h-screen w-full items-center justify-center bg-white px-6 py-12"
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="status-notice-title"
      aria-describedby="status-notice-message"
    >
      <main className="w-full max-w-xl text-center">
        <ServiceIcon />

        <h1
          id="status-notice-title"
          className="text-[1.625rem] font-normal tracking-tight text-[#1a1a1a] sm:text-[2rem]"
        >
          503 Service Unavailable
        </h1>

        <hr className="mx-auto my-8 w-full max-w-md border-0 border-t border-[#d9d9d9]" />

        <p id="status-notice-message" className="text-[15px] leading-7 text-[#444]">
          {STANDARD_MESSAGE}
        </p>

        {customMessage ? (
          <p className="mt-5 text-[15px] leading-7 text-[#444]">{customMessage}</p>
        ) : null}
      </main>
    </div>
  );
}

"use client";

import { useBookingEnquiry } from "@/components/BookingEnquiry";
import { clsx } from "clsx";

export function BookingTrigger({
  children,
  className,
  villaName,
  villaSlug,
  villaId,
  intent = "availability",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  villaName?: string;
  villaSlug?: string;
  villaId?: string;
  intent?: "availability" | "enquiry";
  onClick?: () => void;
}) {
  const { openBooking } = useBookingEnquiry();
  return (
    <button
      type="button"
      className={clsx(className)}
      onClick={() => {
        onClick?.();
        openBooking({ villaName, villaSlug, villaId, intent });
      }}
    >
      {children}
    </button>
  );
}

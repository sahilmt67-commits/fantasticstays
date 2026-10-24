import { OptImage } from "@/components/OptImage";
import { clsx } from "clsx";
import { BRAND } from "@/lib/brand";

type BrandLogoProps = {
  className?: string;
  /** White mark for dark/transparent headers (home hero). */
  tone?: "brand" | "white";
  priority?: boolean;
};

export function BrandLogo({
  className,
  tone = "brand",
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={clsx("inline-flex items-center shrink-0", className)}>
      <OptImage
        src="/logo.png"
        alt={BRAND}
        width={250}
        height={65}
        priority={priority}
        className={clsx(
          "h-8 w-auto sm:h-[34px] md:h-9 object-contain object-left transition-[filter] duration-500",
          tone === "white" && "brightness-0 invert"
        )}
      />
    </span>
  );
}

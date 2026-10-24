import Image, { type ImageProps } from "next/image";

type OptImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
};

/**
 * Shared Next.js Image defaults for faster loads.
 * Pass `sizes` whenever using `fill`.
 */
export function OptImage({
  quality = 75,
  alt,
  style,
  fill,
  ...props
}: OptImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      fill={fill}
      quality={quality}
      style={{
        // ...(fill ? { backgroundColor: "#efe8dc" } : null),
        ...style,
      }}
    />
  );
}

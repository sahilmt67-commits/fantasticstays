"use client";

import { OptImage } from "@/components/OptImage";
import { imageAlt } from "@/lib/image-alt";
import type { VillaVideo } from "@/data/villas";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Play, X } from "lucide-react";
import { clsx } from "clsx";

function youtubeEmbedSrc(url: string) {
  const withAutoplay = (embed: string) =>
    `${embed}${embed.includes("?") ? "&" : "?"}autoplay=1`;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return withAutoplay(`https://www.youtube.com/embed/${id}`);
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) return withAutoplay(url);
      const shorts = parsed.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts?.[1]) return withAutoplay(`https://www.youtube.com/embed/${shorts[1]}`);
      const id = parsed.searchParams.get("v");
      if (id) return withAutoplay(`https://www.youtube.com/embed/${id}`);
    }
  } catch {
    /* keep the original url */
  }
  return withAutoplay(url);
}

const FALLBACKS = [
  "/images/demo/detail-sunlit-open-plan-living-room-with-cream-linen-sofas-a.jpg",
  "/images/demo/detail-indoor-outdoor-dining-pavilion-with-teak-table-and-br.jpg",
  "/images/demo/detail-primary-bedroom-with-four-poster-teak-bed-and-sheer-d.jpg",
  "/images/demo/detail-master.jpg",
  "/images/demo/detail-pool-room.jpg",
  "/images/demo/detail-garden-room.jpg",
  "/images/demo/detail-aerial-view-of-the-goa-coastline-at-golden-hour-with-.jpg",
];

/** Ensure we always have at least `count` unique image URLs for the 1+4 grid */
function padGallery(images: string[], count = 5): string[] {
  const out: string[] = [];
  for (const src of images) {
    if (src && !out.includes(src)) out.push(src);
  }
  for (const src of FALLBACKS) {
    if (out.length >= count) break;
    if (!out.includes(src)) out.push(src);
  }
  while (out.length < count && out[0]) out.push(out[0]);
  return out.slice(0, Math.max(count, images.length));
}

export function VillaGallery({
  name,
  images,
  videoTour,
}: {
  name: string;
  images: string[];
  /** When set, shows the Video Tour button on the gallery */
  videoTour?: VillaVideo;
}) {
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [active, setActive] = useState(0);
  const shots = padGallery(images, 5);
  const thumbs = shots.slice(1, 5);
  const hasVideo = Boolean(videoTour?.embed);
  const isInstagram = videoTour?.source === "instagram";
  const total = shots.length;

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-3 md:py-5">
        {/* Desktop / tablet: client 1 large + 2×2 thumbs */}
        <div className="relative hidden sm:grid sm:grid-cols-4 sm:grid-rows-2 gap-2.5 h-[380px] md:h-[480px] lg:h-[520px]">
          <button
            type="button"
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="group relative col-span-2 row-span-2 h-full min-h-0 overflow-hidden rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Open main photo"
          >
            <OptImage
              src={shots[0]}
              alt={imageAlt(shots[0], name)}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width:1024px) 55vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>

          {thumbs.map((src, i) => (
            <button
              key={`thumb-${i}-${src}`}
              type="button"
              onClick={() => {
                setActive(i + 1);
                setOpen(true);
              }}
              className="group relative h-full min-h-0 overflow-hidden rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Open photo ${i + 2}`}
            >
              <OptImage
                src={src}
                alt={imageAlt(src, `${name} photo ${i + 2}`)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 25vw, 280px"
              />
            </button>
          ))}

          <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-wrap justify-end gap-2 sm:bottom-4 sm:right-4">
            <button
              type="button"
              onClick={() => {
                setActive(0);
                setOpen(true);
              }}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-ivory/95 backdrop-blur-sm px-3.5 py-2 text-xs sm:text-sm font-medium text-forest shadow-sm transition hover:text-gold"
            >
              <Images className="size-3.5 sm:size-4" />
              View All Photos ({shots.length})
            </button>
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-ivory/95 backdrop-blur-sm px-3.5 py-2 text-xs sm:text-sm font-medium text-forest shadow-sm transition hover:text-gold"
              >
                <Play className="size-3.5 sm:size-4 fill-current" />
                Video Tour
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile: main + 2×2 thumbs stack */}
        <div className="sm:hidden space-y-2">
          <button
            type="button"
            onClick={() => {
              setActive(0);
              setOpen(true);
            }}
            className="group relative block w-full aspect-[4/3] overflow-hidden rounded-xl text-left"
            aria-label="Open main photo"
          >
            <OptImage
              src={shots[0]}
              alt={imageAlt(shots[0], name)}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </button>
          <div className="grid grid-cols-2 gap-2">
            {thumbs.map((src, i) => (
              <button
                key={`m-thumb-${i}-${src}`}
                type="button"
                onClick={() => {
                  setActive(i + 1);
                  setOpen(true);
                }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl text-left"
                aria-label={`Open photo ${i + 2}`}
              >
                <OptImage
                  src={src}
                  alt={imageAlt(src, `${name} photo ${i + 2}`)}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setActive(0);
                setOpen(true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory border border-beige-dark/40 px-4 py-2.5 text-sm font-medium text-forest"
            >
              <Images className="size-4" />
              View All ({shots.length})
            </button>
            {hasVideo ? (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory border border-beige-dark/40 px-4 py-2.5 text-sm font-medium text-forest"
              >
                <Play className="size-4 fill-current" />
                Video Tour
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[90] bg-forest/95 flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-5 h-14 sm:h-16 text-ivory">
            <p className="text-sm tabular-nums">
              {active + 1} / {shots.length}
            </p>
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-ivory/10 transition"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center min-h-0 px-12 sm:px-16 md:px-20">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={goPrev}
              className="absolute left-2 sm:left-4 z-10 flex size-10 sm:size-12 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm border border-ivory/20 hover:bg-ivory hover:text-forest transition"
            >
              <ChevronLeft className="size-6 sm:size-7" />
            </button>

            <div className="relative w-full h-full max-w-5xl">
              <OptImage
                src={shots[active]}
                alt={imageAlt(shots[active], `${name} ${active + 1}`)}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              aria-label="Next photo"
              onClick={goNext}
              className="absolute right-2 sm:right-4 z-10 flex size-10 sm:size-12 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur-sm border border-ivory/20 hover:bg-ivory hover:text-forest transition"
            >
              <ChevronRight className="size-6 sm:size-7" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 sm:px-5 py-3 sm:py-4 justify-start sm:justify-center">
            {shots.map((src, i) => (
              <button
                key={`lightbox-${i}-${src}`}
                type="button"
                onClick={() => setActive(i)}
                className={clsx(
                  "relative size-14 sm:size-16 shrink-0 rounded-lg overflow-hidden border-2",
                  i === active ? "border-gold" : "border-transparent"
                )}
              >
                <OptImage src={src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}

      {videoOpen && hasVideo && videoTour && isInstagram && (
        <div className="fixed inset-0 z-[90] bg-forest/95 flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setVideoOpen(false)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-ivory p-2"
          >
            <X className="size-6" />
          </button>
          <a
            href={videoTour.embed}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full max-w-4xl aspect-video overflow-hidden rounded-2xl bg-black"
            aria-label="Open Instagram video"
          >
            {videoTour.thumb ? (
              <OptImage
                src={videoTour.thumb}
                alt={imageAlt(videoTour.thumb, `${name} video tour`)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            ) : null}
            <span className="absolute inset-0 flex items-center justify-center bg-forest/20">
              <span className="flex size-16 items-center justify-center rounded-full bg-ivory/95 text-forest shadow-lg">
                <Play className="size-7 fill-current" />
              </span>
            </span>
          </a>
        </div>
      )}

      {videoOpen && hasVideo && videoTour && !isInstagram && (
        <div className="fixed inset-0 z-[90] bg-forest/95 flex items-center justify-center p-4 sm:p-5">
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setVideoOpen(false)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-ivory p-2"
          >
            <X className="size-6" />
          </button>
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              title={`${name} video tour`}
              src={youtubeEmbedSrc(videoTour.embed)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}

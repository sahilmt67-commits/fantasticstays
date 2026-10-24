"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";

export function SearchBar({
  compact = false,
  locations = [
    "Candolim",
    "Calangute",
    "Anjuna",
    "Assagao",
    "Vagator",
    "Morjim",
    "Siolim",
    "Saligao",
    "Baga",
    "South Goa",
  ],
}: {
  compact?: boolean;
  locations?: string[];
}) {
  const router = useRouter();
  const [guests, setGuests] = useState("2");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("1");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (guests) params.set("guests", guests);
    if (location) params.set("location", location);
    if (bedrooms) params.set("bedrooms", bedrooms);
    router.push(`/villas?${params.toString()}`);
  }

  if (compact) {
    return (
      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-ivory/85 backdrop-blur-xl border border-ivory/60 shadow-[0_30px_80px_-30px_rgba(22,43,34,0.5)] p-4 md:p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Fields
            guests={guests}
            setGuests={setGuests}
            location={location}
            setLocation={setLocation}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            locations={locations}
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-forest text-ivory px-6 py-3.5 rounded-full font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-forest/90 transition-colors"
        >
          <Search className="w-4 h-4 text-gold" />
          Search Luxury Villas
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-6xl mx-auto rounded-2xl bg-ivory/85 backdrop-blur-xl border border-ivory/60 shadow-[0_30px_80px_-30px_rgba(22,43,34,0.5)] p-4 sm:p-5 md:p-7"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Fields
          guests={guests}
          setGuests={setGuests}
          location={location}
          setLocation={setLocation}
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          locations={locations}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          type="submit"
          className="flex-1 bg-forest text-ivory px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-forest/90 transition-colors"
        >
          <Search className="w-4 h-4 text-gold" />
          Search Luxury Villas
        </button>
        <a
          href="https://wa.me/918860331188?text=Hi%2C%20I%27d%20like%20to%20check%20villa%20availability%20in%20Goa."
          target="_blank"
          rel="noreferrer"
          className="flex-1 border border-forest/25 text-forest px-6 py-3.5 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-forest hover:text-ivory transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-gold" />
          Chat on WhatsApp
        </a>
      </div>
    </form>
  );
}

function Fields({
  guests,
  setGuests,
  location,
  setLocation,
  bedrooms,
  setBedrooms,
  locations,
}: {
  guests: string;
  setGuests: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  locations: string[];
}) {
  return (
    <>
      <label className="flex flex-col gap-1.5 text-left min-w-0">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted font-medium">
          Check-in
        </span>
        <input type="date" className="input-base" />
      </label>
      <label className="flex flex-col gap-1.5 text-left min-w-0">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted font-medium">
          Check-out
        </span>
        <input type="date" className="input-base" />
      </label>
      <label className="flex flex-col gap-1.5 text-left min-w-0">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted font-medium">
          Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="input-base"
        >
          {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n === 16 ? "16+" : String(n)}>
              {n === 16 ? "16+ Guests" : `${n} Guests`}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-left min-w-0">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted font-medium">
          Preferred Location
        </span>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-base"
        >
          <option value="">Any location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-left min-w-0 sm:col-span-2 lg:col-span-1">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted font-medium">
          Bedrooms
        </span>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="input-base"
        >
          {["1", "2", "3", "4", "5", "6+"].map((n) => (
            <option key={n} value={n}>
              {n === "6+"
                ? "6+ Bedrooms"
                : `${n} Bedroom${n === "1" ? "" : "s"}`}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

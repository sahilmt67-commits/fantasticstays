import { OptImage } from "@/components/OptImage";
import Link from "next/link";
import {
  CheckCircle2,
  ChefHat,
  Gem,
  Headphones,
  MapPinned,
  Phone,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { VillaCard } from "@/components/VillaCard";
import { getHomeVillas } from "@/app/actions/villas";
import { images } from "@/data/villas";
import { imageAlt } from "@/lib/image-alt";
import { getHomeHero } from "@/lib/villa-api";
import { BRAND } from "@/lib/brand";

const whyIcons = {
  sparkles: Sparkles,
  waves: Waves,
  map: MapPinned,
  headphones: Headphones,
  shield: ShieldCheck,
  chef: ChefHat,
  gem: Gem,
  phone: Phone,
};

const steps = [
  {
    n: "01",
    title: "Share Your Requirements",
    desc: "Tell us your dates, number of guests, preferred location and budget.",
  },
  {
    n: "02",
    title: "Receive Curated Villa Options",
    desc: "Our team will recommend available villas that match your requirements.",
  },
  {
    n: "03",
    title: "Confirm Your Villa",
    desc: "Review the property details, inclusions, policies and final price.",
  },
  {
    n: "04",
    title: "Enjoy Your Goa Stay",
    desc: "Complete your booking and receive assistance for a smooth arrival.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ featured, locations, occasions, whyChoose, amenities, reviews, homepage, total, averageRating }, hero] =
    await Promise.all([getHomeVillas(), getHomeHero()]);
  const ratingLabel = averageRating.toFixed(1);
  const statValue = (source: string, value: string) => {
    if (source === "villas") return String(total);
    if (source === "locations") return String(locations.length);
    if (source === "rating") return ratingLabel;
    return value;
  };

  return (
    <>
      {/* Hero — full-bleed cover image (matches live demo framing) */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col overflow-hidden"
      >
        <div className="absolute inset-0" aria-hidden>
          <OptImage
            src={hero.image}
            alt={imageAlt(hero.image, `${hero.titleLead} ${hero.titleMain} ${hero.titleEnd}`)}
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/55 via-forest/25 to-forest/70" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 pt-28 sm:pt-32 md:pt-36 pb-6 md:pb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              {hero.eyebrow}
            </span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h1 className="font-display text-ivory text-4xl sm:text-5xl md:text-7xl lg:text-[5.6rem] leading-[1.05] tracking-tight max-w-4xl text-balance">
            <span className="italic font-normal">{hero.titleLead}</span>{" "}
            <span className="block sm:inline uppercase tracking-[0.08em] font-semibold">
              {hero.titleMain}
            </span>{" "}
            {hero.titleEnd}
          </h1>
          <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed px-1">
            {hero.subtitle}
          </p>
        </div>

        <div
          id="search"
          className="relative z-10 mt-auto px-4 lg:px-8 pb-14"
        >
          <SearchBar locations={locations.map((location) => location.name)} />
          <div className="max-w-6xl mx-auto mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {[
              { icon: Gem, label: "Handpicked Luxury Villas" },
              { icon: Waves, label: "Private Pools & Premium Amenities" },
              { icon: Headphones, label: "Dedicated Guest Support" },
              { icon: ShieldCheck, label: "Secure & Simple Booking" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <Icon className="w-5 h-5 text-gold shrink-0" />
                <span className="text-sm text-ivory/90 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured villas */}
      <section id="villas" className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Featured Luxury Villas in Goa</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              Handpicked Villas for an Exceptional Goa Holiday
            </h2>
            <p className="mt-5 text-muted max-w-2xl leading-relaxed">
              Explore carefully selected villas combining privacy, stylish
              interiors, spacious living areas and convenient access to Goa&apos;s
              beaches and attractions.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((villa, i) => (
              <Reveal key={villa.id} delay={i * 80}>
                <VillaCard villa={villa} />
              </Reveal>
            ))}
          </div>
          {featured.length === 0 ? (
            <p className="mt-10 text-muted">
              Featured villas will appear here as soon as they are published.
            </p>
          ) : null}

          <div className="mt-12 flex justify-center px-1">
            <Link
              href="/villas"
              className="btn-secondary w-full max-w-xs sm:w-auto whitespace-nowrap"
            >
              View All Villas
            </Link>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="scroll-mt-28 py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Browse Villas by Location</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              Find Your Perfect Villa in Goa&apos;s Most Desirable Locations
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {locations.map((loc, i) => (
              <Reveal key={loc.name} delay={i * 50}>
                <Link
                  href={`/villas?location=${encodeURIComponent(loc.name)}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
                >
                  <OptImage
                    src={loc.image}
                    alt={imageAlt(loc.image, loc.name)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
                    quality={70}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                    <p className="text-gold text-sm font-medium">{loc.count}</p>
                    <h3 className="font-display text-xl leading-tight mt-0.5">
                      {loc.name}
                    </h3>
                    <p className="mt-2 text-[10px] tracking-[0.2em] uppercase opacity-0 translate-y-2 transition group-hover:opacity-100 group-hover:translate-y-0">
                      Explore Villas
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-16 md:py-24 bg-beige/40">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Why Choose {BRAND}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              More Than a Villa, Your Private Goa Experience
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => {
              const Icon = whyIcons[item.icon as keyof typeof whyIcons] ?? Sparkles;
              return (
              <Reveal key={item.title} delay={i * 60}>
                <div className="h-full bg-ivory p-8 lg:p-10 hover:bg-beige/50 transition">
                  <Icon className="size-7 text-gold" />
                  <h3 className="font-display text-2xl text-forest mt-5 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Villas for Every Occasion</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              Luxury Stays Designed Around Your Plans
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {occasions.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <Link
                  href="/villas"
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <OptImage
                    src={item.image}
                    alt={imageAlt(item.image, item.title)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 25vw"
                    quality={70}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                    <h3 className="font-display text-xl md:text-2xl leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-ivory/75 line-clamp-2">
                      {item.desc}
                    </p>
                    <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-gold">
                      Explore Villas
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 md:py-24 bg-beige/40">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">Luxury Amenities</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              Everything You Need for a Comfortable Villa Stay
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-ivory px-4 py-4 border border-beige"
              >
                <CheckCircle2 className="size-4 text-gold shrink-0" />
                <span className="text-sm text-forest">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Amenities and additional services may vary between villas. Confirm
            inclusions for your chosen property at the time of enquiry.
          </p>
        </div>
      </section>

      {/* Special offer */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <OptImage
          src={images.offer}
          alt="Group celebration at a Goa villa"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/80" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-ivory">
          <Reveal>
            <p className="section-eyebrow text-gold">Special Offer</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight">
              Planning a Group Holiday or Special Celebration in Goa?
            </h2>
            <p className="mt-5 text-ivory/80 leading-relaxed">
              Tell us your dates, group size and preferred location. Our villa
              specialists will recommend suitable properties and help you plan a
              comfortable stay.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-gold">
                Get Personalised Villa Options
              </Link>
              <a
                href="https://wa.me/918860331188"
                className="btn-secondary-light"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Booking steps */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">How the Booking Process Works</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              Book Your Luxury Villa in Four Simple Steps
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div>
                  <p className="font-display text-5xl text-gold/40">{step.n}</p>
                  <h3 className="font-display text-2xl text-forest mt-4">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-forest text-ivory">
        <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Reveal>
            <p className="section-eyebrow text-gold">Guest Experiences</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight">
              What Our Guests Say About Their Goa Villa Stays
            </h2>
          </Reveal>
          <div className="mt-12">
            <TestimonialsCarousel
              items={reviews.map((review) => ({
                quote: review.quote,
                name: review.name,
                stay: review.stay,
                initial: review.initial,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="scroll-mt-28 py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">{homepage.experiences.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              {homepage.experiences.heading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homepage.experiences.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <div className="rounded-2xl border border-beige bg-beige/30 p-6 h-full hover:bg-beige/60 transition">
                  <h3 className="font-display text-xl text-forest mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-muted italic max-w-2xl mx-auto">
            {homepage.experiences.note}
          </p>
        </div>
      </section>

      {/* About stats */}
      <section className="py-16 md:py-24 bg-beige/40">
        <div id="about" className="scroll-mt-36 mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <p className="text-5xl md:text-6xl font-display text-forest">
              {ratingLabel} / 5
            </p>
            <p className="mt-2 text-muted">
              {homepage.about.ratingCaption}
            </p>
            <p className="section-eyebrow mt-10">{homepage.about.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-forest leading-[1.08] tracking-tight">
              {homepage.about.heading}
            </h2>
            <p className="mt-5 text-muted leading-relaxed">
              {homepage.about.body}
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {homepage.about.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-forest">
                    {statValue(stat.source, stat.value)}
                  </p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-primary mt-10">
              Learn More About Us
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <OptImage
                src={homepage.about.image}
                alt={imageAlt(homepage.about.image, "Luxury villa lifestyle in Goa")}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 md:py-24 bg-ivory">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">{homepage.inspiration.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-forest max-w-3xl leading-[1.08] tracking-tight">
              {homepage.inspiration.heading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homepage.inspiration.items.map((post, i) => (
              <Reveal key={post.title} delay={i * 60}>
                <article className="group rounded-2xl border border-beige p-6 h-full hover:shadow-md transition bg-beige/20">
                  <p className="text-xs text-gold tracking-wide">{post.date}</p>
                  <h3 className="font-display text-xl text-forest mt-3 leading-snug group-hover:text-gold-dark transition">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-xs tracking-[0.16em] uppercase text-forest">
                    Read More
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-beige/40">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <p className="section-eyebrow">{homepage.faqs.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-forest leading-[1.08] tracking-tight">
              {homepage.faqs.heading}
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {homepage.faqs.items.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-ivory border border-beige open:shadow-sm"
              >
                <summary className="cursor-pointer list-none px-6 py-5 font-medium text-forest flex justify-between gap-4">
                  {faq.q}
                  <span className="text-gold transition group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm text-muted leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <OptImage
          src={images.cta}
          alt="Private Goa villa escape"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest/85" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center text-ivory">
          <Reveal>
            <p className="section-eyebrow text-gold">Begin Your Journey</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] tracking-tight">
              Your Private Goa Escape Starts Here
            </h2>
            <p className="mt-5 text-ivory/80 leading-relaxed">
              Share your travel dates and requirements with our villa
              specialists to receive carefully selected options for your Goa
              holiday.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/villas" className="btn-gold">
                Find Your Perfect Villa
              </Link>
              <Link
                href="/contact"
                className="btn-secondary-light"
              >
                Speak with a Villa Specialist
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm">
              <a
                href="tel:+918860331188"
                className="inline-flex items-center gap-2 text-ivory/90 hover:text-ivory transition"
              >
                <Phone className="size-4 text-gold" />
                +91 88603 31188
              </a>
              <a
                href="https://wa.me/918860331188"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-ivory/90 hover:text-ivory transition"
              >
                WhatsApp Us
              </a>
            </div>
            <p className="mt-3 text-sm text-ivory/60">
              Enquiries answered within 2 hours
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

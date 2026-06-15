import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { formatINR } from "@/lib/format";
import heroL1 from "@/assets/hero-l1.png";
import heroL2 from "@/assets/hero-l2.png";
import heroL3 from "@/assets/hero-l3.png";
import heroL4 from "@/assets/hero-l4.png";

const heroImages = [heroL1, heroL2, heroL3, heroL4];

export function HeroCarousel() {
  const { products, featured } = useProducts();
  const heroProducts = featured.hero
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % heroProducts.length);
    }, 3500);
    return () => clearInterval(id);
  }, [heroProducts.length]);

  if (heroProducts.length === 0) return null;
  const active = heroProducts[index];
  const activeImg = heroImages[index % heroImages.length];

  return (
    <section className="relative bg-banner overflow-hidden font-display">
      {/* Soft decorative blobs for a cleaner, modern look */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative container mx-auto px-4 pt-3 pb-6 sm:pt-5 sm:pb-10 md:pt-8 md:pb-14 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Left: pitch — order-2 on mobile so product shows first */}
        <div className="text-center md:text-left order-2 md:order-1 animate-fade-in">
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Flat 40% Discount
          </span>
          <h1 className="font-display text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mt-3">
            Power your day
            <br className="hidden sm:block" />{" "}
            <span className="text-primary">with the perfect laptop</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-muted-foreground max-w-md mx-auto md:mx-0">
            Ultrabooks, gaming beasts and business workhorses — hand-picked, fairly priced and ready
            to ship today.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/shop"
              className="inline-flex bg-primary text-primary-foreground rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 hover-scale"
            >
              SHOP NOW
            </Link>
            <Link
              to="/services"
              className="inline-flex border border-border bg-background/60 backdrop-blur rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:border-primary"
            >
              Our Services
            </Link>
          </div>
          <div className="mt-5 sm:mt-6 flex gap-5 sm:gap-8 justify-center md:justify-start text-[10px] sm:text-xs text-muted-foreground">
            <div>
              <p className="text-base sm:text-xl font-extrabold text-foreground font-display">1M+</p>
              Customers
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-foreground font-display">4.8★</p>
              Rated
            </div>
            <div>
              <p className="text-base sm:text-xl font-extrabold text-foreground font-display">70+</p>
              Countries
            </div>
          </div>
        </div>

        {/* Right: rotating product (no card / no box) — order-1 on mobile */}
        <div className="relative flex flex-col items-center order-1 md:order-2">
          {/* Glow ring behind product */}
          <div
            aria-hidden
            className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full bg-primary/15 blur-2xl"
          />

          <div className="relative w-full h-44 sm:h-64 md:h-[360px] flex items-center justify-center">
            {heroProducts.map((p, i) => {
              const img = heroImages[i % heroImages.length];
              const isActive = i === index;
              return (
                <img
                  key={p.id}
                  src={img}
                  alt={p.name}
                  className={`absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-2xl transition-all duration-700 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-95 translate-x-8 pointer-events-none"
                  }`}
                  draggable={false}
                />
              );
            })}
          </div>

          {/* Free-floating info (no box) */}
          <div key={active.id} className="mt-3 sm:mt-4 text-center animate-fade-in px-2">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-display">
              {active.brand} · {active.category}
            </p>
            <h3 className="font-display font-bold text-sm sm:text-lg md:text-2xl mt-1 line-clamp-1">
              {active.name}
            </h3>
            <div className="flex items-baseline gap-2 justify-center mt-1">
              <span className="text-primary font-display font-extrabold text-lg sm:text-2xl md:text-3xl">
                {formatINR(active.price)}
              </span>
              {active.oldPrice && (
                <span className="text-[11px] sm:text-sm text-muted-foreground line-through">
                  {formatINR(active.oldPrice)}
                </span>
              )}
            </div>
            <Link
              to="/product/$id"
              params={{ id: active.id }}
              className="mt-3 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-5 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition hover-scale"
            >
              BUY NOW
            </Link>
          </div>

          {/* Dots — always below image */}
          <div className="mt-3 sm:mt-4 flex gap-1.5 justify-center">
            {heroProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show product ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

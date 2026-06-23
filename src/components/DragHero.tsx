import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";

export function DragHero() {
  const { heroSlides } = useProducts();
  const slides = heroSlides.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);

  useEffect(() => {
    const update = () => {
      widthRef.current = trackRef.current?.clientWidth ?? 0;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };
  const onUp = () => {
    if (startX.current === null) return;
    const w = widthRef.current || 1;
    const threshold = w * 0.15;
    if (dragX > threshold) setIndex((i) => (i - 1 + slides.length) % slides.length);
    else if (dragX < -threshold) setIndex((i) => (i + 1) % slides.length);
    startX.current = null;
    setDragX(0);
  };

  const offsetPct = -(index * 100);
  const dragPct = widthRef.current ? (dragX / widthRef.current) * 100 : 0;

  return (
    <section className="bg-card border-b border-border">
      <div className="relative overflow-hidden select-none" ref={trackRef}>
        <div
          className="flex touch-pan-y cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(calc(${offsetPct}% + ${dragPct}%))`,
            transition: startX.current === null ? "transform 500ms ease" : "none",
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {slides.map((s) => (
            <div key={s.id} className="w-full shrink-0 relative">
              <div className="relative h-72 sm:h-[28rem] md:h-[34rem] lg:h-[600px] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-lg text-white">
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent pb-1">
                        {s.title}
                      </h2>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-base text-white/90">
                        {s.subtitle}
                      </p>
                      <Link
                        to={s.link}
                        className="inline-flex mt-4 sm:mt-5 bg-fk-buy text-white rounded-sm px-5 sm:px-7 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide hover:opacity-90"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

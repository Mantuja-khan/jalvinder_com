import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { DragHero } from "@/components/DragHero";
import { FadeIn } from "@/components/FadeIn";
import { useProducts } from "@/context/ProductsContext";
import { formatINR } from "@/lib/format";
import { SERVICES } from "@/routes/services";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Jalvindar Computer — Laptops, Desktops & CCTV" },
      { name: "description", content: "Laptop & desktop sales and service, CCTV installation and complete computer solutions." },
    ],
  }),
});

function Home() {
  const { products, featured } = useProducts();
  const latest = products.slice(0, 5);
  const best = featured.bestseller
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 5);
  const bestTop = featured.bestTop
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 2);
  const promoProducts = featured.promo
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 2);

  return (
    <div>
      <DragHero />

      {/* Services */}
      <FadeIn>
        <section className="container mx-auto px-4 py-12 sm:py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider">What we do</p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">Our Services</h2>
            </div>
            <Link to="/services" className="text-sm text-primary font-medium">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {SERVICES.slice(0, 8).map(({ Icon, t, s }, i) => (
              <FadeIn key={t} delay={i * 80} direction="up">
                <div className="border border-border rounded-xl p-4 sm:p-5 hover:border-primary/40 hover:shadow-md transition">
                  <div className="bg-primary/10 text-primary rounded-md p-2.5 inline-flex">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold mt-3">{t}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">{s}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Latest products */}
      {latest.length > 0 && (
        <FadeIn>
          <section className="container mx-auto px-4 py-12 sm:py-14">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest Products</h2>
              <Link to="/shop" className="text-sm text-primary font-medium">VIEW ALL</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {latest.map((p, i) => (
                <FadeIn key={p.id} delay={i * 60} direction="up">
                  <ProductCard p={p} />
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {promoProducts.length > 0 && (
        <FadeIn>
          <section className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
            {promoProducts.map((p, i) => (
              <FadeIn key={p.id} delay={i * 120} direction={i === 0 ? "left" : "right"}>
                <div
                  className={`${i === 0 ? "bg-banner" : "bg-promo-blue"} rounded-lg p-6 sm:p-8 flex items-center justify-between overflow-hidden`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-2xl font-extrabold leading-tight line-clamp-2">{p.name}</h3>
                    <p className="text-primary font-bold mt-2">
                      <span className="text-xl sm:text-2xl">{formatINR(p.price)}</span>
                    </p>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="inline-flex mt-3 sm:mt-4 bg-primary text-primary-foreground rounded-full px-5 py-2 text-xs font-semibold"
                    >
                      SHOP NOW
                    </Link>
                  </div>
                  <img src={p.image} alt={p.name} loading="lazy" className="w-32 h-24 sm:w-44 sm:h-32 object-contain rounded shrink-0" />
                </div>
              </FadeIn>
            ))}
          </section>
        </FadeIn>
      )}

      {(bestTop.length > 0 || best.length > 0) && (
        <FadeIn>
          <section className="container mx-auto px-4 py-12 sm:py-14">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold">Best Selling Products</h2>
              <Link to="/shop" className="text-sm text-primary font-medium">VIEW ALL</Link>
            </div>

            {bestTop.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {bestTop.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 100} direction={i === 0 ? "left" : "right"}>
                    <div className="bg-banner rounded-lg p-5 sm:p-6 flex items-center gap-4 overflow-hidden">
                      <img src={p.image} alt={p.name} loading="lazy" className="w-28 h-28 sm:w-36 sm:h-36 object-contain bg-background/40 rounded shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-2xl font-extrabold leading-tight line-clamp-2">{p.name}</h3>
                        <p className="text-primary text-xl sm:text-2xl font-bold mt-1">{formatINR(p.price)}</p>
                        <Link
                          to="/product/$id"
                          params={{ id: p.id }}
                          className="inline-flex mt-3 bg-primary text-primary-foreground rounded-full px-5 py-2 text-xs font-semibold"
                        >
                          SHOP NOW
                        </Link>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            )}

            {best.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {best.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 60} direction="up">
                    <ProductCard p={p} />
                  </FadeIn>
                ))}
              </div>
            )}
          </section>
        </FadeIn>
      )}
    </div>
  );
}

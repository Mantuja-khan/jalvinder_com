import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/ProductCard";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/shop")({
  component: Shop,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Shop Laptops — Jalvindar Computer" },
      { name: "description", content: "Browse our full catalog of laptops, ultrabooks, gaming and business notebooks." },
    ],
  }),
});

function Shop() {
  const { products, categories } = useProducts();
  const { q } = Route.useSearch();
  const [cat, setCat] = useState<string>("All");
  const [sub, setSub] = useState<string>("All");

  const activeCat = categories.find((c) => c.name === cat);

  const list = useMemo(() => {
    let out = products;
    if (cat !== "All") out = out.filter((l) => l.category === cat);
    if (sub !== "All") out = out.filter((l) => l.subcategory === sub);
    if (q) {
      const searchLower = q.toLowerCase();
      out = out.filter(
        (l) =>
          l.name.toLowerCase().includes(searchLower) ||
          l.brand.toLowerCase().includes(searchLower) ||
          l.category.toLowerCase().includes(searchLower) ||
          l.description.toLowerCase().includes(searchLower),
      );
    }
    return out;
  }, [products, cat, sub, q]);

  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold">All Laptops</h1>
        <p className="text-muted-foreground mt-1 text-sm">Find the perfect machine for your needs.</p>

        {q && (
          <div className="mt-4 p-3 bg-accent/30 border border-border rounded-xl flex items-center justify-between">
            <span className="text-sm">
              Showing search results for: <span className="font-semibold text-primary">"{q}"</span>
            </span>
            <Link to="/shop" search={{ q: "" }} className="text-xs text-primary font-semibold hover:underline">
              Clear Search
            </Link>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          <CatBtn active={cat === "All"} onClick={() => { setCat("All"); setSub("All"); }}>All</CatBtn>
          {categories.map((c) => (
            <CatBtn key={c.id} active={cat === c.name} onClick={() => { setCat(c.name); setSub("All"); }}>
              {c.name}
            </CatBtn>
          ))}
        </div>

        {activeCat && activeCat.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <SubBtn active={sub === "All"} onClick={() => setSub("All")}>All {activeCat.name}</SubBtn>
            {activeCat.subcategories.map((s) => (
              <SubBtn key={s.id} active={sub === s.name} onClick={() => setSub(s.name)}>
                {s.name}
              </SubBtn>
            ))}
          </div>
        )}

        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {list.map((p, i) => (
            <FadeIn key={p.id} delay={i * 50} direction="up">
              <ProductCard p={p} />
            </FadeIn>
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No products in this category yet.</p>
        )}
      </div>
    </FadeIn>
  );
}

function CatBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs sm:text-sm border transition ${
        active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}

function SubBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs border transition ${
        active ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

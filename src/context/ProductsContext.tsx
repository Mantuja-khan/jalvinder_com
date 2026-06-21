import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Laptop } from "@/data/laptops";
import { API_BASE } from "./AuthContext";
import rentalServicesImg from "@/assets/rental-services.png";

export type FeaturedSlot = "hero" | "bestseller" | "bestTop" | "promo";

export type Subcategory = { id: string; name: string };
export type Category = { id: string; name: string; subcategories: Subcategory[] };
export type HeroSlide = { id: string; image: string; title: string; subtitle: string; cta: string; link: string };

type Ctx = {
  products: Laptop[];
  add: (p: Omit<Laptop, "id" | "createdAt">) => Promise<void>;
  update: (id: string, patch: Partial<Laptop>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setOffer: (id: string, oldPrice: number | undefined, badge?: string) => Promise<void>;
  featured: Record<FeaturedSlot, string[]>;
  toggleFeatured: (slot: FeaturedSlot, id: string) => void;
  getById: (id: string) => Laptop | undefined;
  // Categories
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addSubcategory: (categoryId: string, name: string) => Promise<void>;
  removeSubcategory: (categoryId: string, subId: string) => Promise<void>;
  // Hero slides
  heroSlides: HeroSlide[];
  addHeroSlide: (s: Omit<HeroSlide, "id">) => void;
  updateHeroSlide: (id: string, patch: Partial<HeroSlide>) => void;
  removeHeroSlide: (id: string) => void;
};

const C = createContext<Ctx | null>(null);
const FEATURED_KEY = "lh_featured_v3";
const HERO_KEY = "lh_hero_slides_v2";

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "https://i.pinimg.com/1200x/3d/61/a2/3d61a2283e48219475b14cc6f33a103c.jpg",
    title: "Laptops & Desktops",
    subtitle: "Top brands at unbeatable prices",
    cta: "Shop Now",
    link: "/shop",
  },
  {
    id: "slide-2",
    image: "https://i.pinimg.com/736x/8a/d5/0c/8ad50cea21d4eff8cd04427965e0670d.jpg",
    title: "CCTV Installation",
    subtitle: "Secure your home & business",
    cta: "Explore Services",
    link: "/services",
  },
  {
    id: "slide-3",
    image: "https://i.pinimg.com/1200x/47/4c/f3/474cf3bad5cfe9dddfdb2318be6d8fe0.jpg",
    title: "Rental Services",
    subtitle: "Trusted service since years",
    cta: "Contact Us",
    link: "/contact",
  },
];

function getAuthHeaders() {
  const token = localStorage.getItem("lh_token_v1");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Laptop[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Record<FeaturedSlot, string[]>>({
    hero: [],
    bestseller: [],
    bestTop: [],
    promo: [],
  });
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        // Ensure every category has subcategories array for the frontend structure
        const mapped = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          subcategories: cat.subcategories || [],
        }));
        setCategories(mapped);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    try {
      const f = localStorage.getItem(FEATURED_KEY);
      if (f) {
        const parsed = JSON.parse(f);
        setFeatured({
          hero: parsed.hero ?? [],
          bestseller: parsed.bestseller ?? [],
          bestTop: parsed.bestTop ?? [],
          promo: parsed.promo ?? [],
        });
      }
      const h = localStorage.getItem(HERO_KEY);
      if (h) {
        try {
          const parsed = JSON.parse(h);
          const updated = parsed.map((s: any) => {
            if (s.id === "slide-1") {
              return { ...s, image: "https://i.pinimg.com/1200x/3d/61/a2/3d61a2283e48219475b14cc6f33a103c.jpg" };
            }
            if (s.id === "slide-2") {
              return { ...s, image: "https://i.pinimg.com/736x/8a/d5/0c/8ad50cea21d4eff8cd04427965e0670d.jpg" };
            }
            if (s.id === "slide-3") {
              return { ...s, title: "Rental Services", image: "https://i.pinimg.com/1200x/47/4c/f3/474cf3bad5cfe9dddfdb2318be6d8fe0.jpg" };
            }
            return s;
          });
          setHeroSlides(updated);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FEATURED_KEY, JSON.stringify(featured));
  }, [featured]);

  useEffect(() => {
    localStorage.setItem(HERO_KEY, JSON.stringify(heroSlides));
  }, [heroSlides]);

  const addHeroSlide: Ctx["addHeroSlide"] = (s) =>
    setHeroSlides((prev) => [...prev, { ...s, id: `slide-${Date.now()}` }]);
  const updateHeroSlide: Ctx["updateHeroSlide"] = (id, patch) =>
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeHeroSlide: Ctx["removeHeroSlide"] = (id) =>
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));

  const add = async (p: Omit<Laptop, "id" | "createdAt">) => {
    // Map category string to categoryId
    const catObj = categories.find(c => c.name.toLowerCase() === p.category.toLowerCase()) || categories[0];
    const categoryId = catObj ? catObj.id : "laptops";

    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...p, categoryId }),
    });

    if (!res.ok) {
      const err = await res.json();
      let errMsg = err.error || "Failed to add product";
      if (err.details && err.details.fieldErrors) {
        const fields = Object.keys(err.details.fieldErrors);
        const details = fields.map(f => `${f}: ${err.details.fieldErrors[f].join(", ")}`).join("; ");
        errMsg += ` (${details})`;
      }
      throw new Error(errMsg);
    }
    await fetchProducts();
  };

  const update = async (id: string, patch: Partial<Laptop>) => {
    const updatePayload = { ...patch };
    if (patch.category) {
      const catObj = categories.find(c => c.name.toLowerCase() === patch.category!.toLowerCase());
      if (catObj) {
        updatePayload.categoryId = catObj.id;
      }
    }
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      const err = await res.json();
      let errMsg = err.error || "Failed to update product";
      if (err.details && err.details.fieldErrors) {
        const fields = Object.keys(err.details.fieldErrors);
        const details = fields.map(f => `${f}: ${err.details.fieldErrors[f].join(", ")}`).join("; ");
        errMsg += ` (${details})`;
      }
      throw new Error(errMsg);
    }
    await fetchProducts();
  };

  const remove = async (id: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete product");
    }
    
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setFeatured((f) => ({
      hero: f.hero.filter((x) => x !== id),
      bestseller: f.bestseller.filter((x) => x !== id),
      bestTop: f.bestTop.filter((x) => x !== id),
      promo: f.promo.filter((x) => x !== id),
    }));
  };

  const setOffer = async (id: string, oldPrice: number | undefined, badge?: string) => {
    await update(id, { oldPrice, badge });
  };

  const toggleFeatured: Ctx["toggleFeatured"] = (slot, id) =>
    setFeatured((f) => ({
      ...f,
      [slot]: f[slot].includes(id) ? f[slot].filter((x) => x !== id) : [...f[slot], id],
    }));

  const getById: Ctx["getById"] = (id) => products.find((p) => p.id === id);

  const addCategory = async (name: string) => {
    let slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) slug = `cat-${Date.now()}`;
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: name.trim(), slug }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to add category");
    }
    await fetchCategories();
  };

  const removeCategory = async (id: string) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to remove category");
    }
    await fetchCategories();
  };

  const addSubcategory: Ctx["addSubcategory"] = async (categoryId, name) => {
    const subId = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;
    if (cat.subcategories.some((s) => s.id === subId)) return;

    const newSubs = [...cat.subcategories, { id: subId, name: name.trim() }];
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ subcategories: newSubs }),
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const err = await res.json();
        console.error("Failed to add subcategory:", err.message);
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const removeSubcategory: Ctx["removeSubcategory"] = async (categoryId, subId) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;
    const newSubs = cat.subcategories.filter((s) => s.id !== subId);

    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ subcategories: newSubs }),
      });
      if (res.ok) {
        await fetchCategories();
      } else {
        const err = await res.json();
        console.error("Failed to remove subcategory:", err.message);
      }
    } catch (error) {
      console.error("Error removing subcategory:", error);
    }
  };

  return (
    <C.Provider
      value={{
        products,
        add,
        update,
        remove,
        setOffer,
        featured,
        toggleFeatured,
        getById,
        categories,
        addCategory,
        removeCategory,
        addSubcategory,
        removeSubcategory,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        removeHeroSlide,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useProducts() {
  const v = useContext(C);
  if (!v) throw new Error("useProducts outside provider");
  return v;
}

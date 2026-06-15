import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { API_BASE } from "./AuthContext";

export type Review = {
  id: string;
  productId: string;
  user: string;
  phone?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
};

type Ctx = {
  reviews: Review[];
  forProduct: (productId: string) => Review[];
  averageFor: (productId: string, fallback?: number) => { avg: number; count: number };
  add: (r: Omit<Review, "id" | "date">) => Promise<void>;
};

const C = createContext<Ctx | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});

  const fetchForProduct = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/product/${productId}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((r: any) => ({
          id: r.id,
          productId: r.productId,
          user: r.name,
          phone: r.phone,
          rating: r.rating,
          comment: r.response,
          date: r.createdAt,
        }));
        setReviewsMap((prev) => ({ ...prev, [productId]: mapped }));
      }
    } catch (error) {
      console.error("Failed to fetch reviews for product:", productId, error);
    }
  };

  const forProduct: Ctx["forProduct"] = (productId) => {
    if (reviewsMap[productId] === undefined) {
      // Trigger lazy load
      fetchForProduct(productId);
      // Temporarily mark as loading by setting to empty array
      setReviewsMap((prev) => ({ ...prev, [productId]: [] }));
      return [];
    }
    return reviewsMap[productId];
  };

  const averageFor: Ctx["averageFor"] = (productId, fallback = 0) => {
    const list = reviewsMap[productId] || [];
    if (list.length === 0) return { avg: fallback, count: 0 };
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    return { avg: Math.round(avg * 10) / 10, count: list.length };
  };

  const add: Ctx["add"] = async (r) => {
    const res = await fetch(`${API_BASE}/reviews/product/${r.productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: r.user,
        phone: r.phone || "",
        rating: r.rating,
        response: r.comment,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to submit review");
    }

    // Refresh reviews for this product
    await fetchForProduct(r.productId);
  };

  // Compile a flat list of all loaded reviews if needed by anything
  const reviews = Object.values(reviewsMap).flat();

  return (
    <C.Provider value={{ reviews, forProduct, averageFor, add }}>{children}</C.Provider>
  );
}

export function useReviews() {
  const v = useContext(C);
  if (!v) throw new Error("useReviews outside provider");
  return v;
}

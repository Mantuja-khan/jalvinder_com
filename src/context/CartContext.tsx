import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Laptop } from "@/data/laptops";
import { API_BASE } from "./AuthContext";

export type CartItem = { product: Laptop; qty: number };
export type OrderStatus = "Processing" | "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";
export type ShippingInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};
export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shipping?: ShippingInfo;
};

type CartCtx = {
  items: CartItem[];
  add: (p: Laptop, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  orders: Order[];
  placeOrder: (paymentMethod: "card" | "paypal" | "cod") => Promise<Order | null>;
  fetchOrders: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

function getAuthHeaders() {
  const token = localStorage.getItem("lh_token_v1");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("cart");
      if (c) setItems(JSON.parse(c));
    } catch {
      // ignore
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("lh_token_v1");
    if (!token) {
      // Offline/Local orders
      try {
        const o = localStorage.getItem("orders");
        if (o) setOrders(JSON.parse(o));
      } catch {
        // ignore
      }
      return;
    }

    try {
      // Determine if admin or user to call appropriate endpoint
      const meRes = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() });
      let url = `${API_BASE}/orders/me`;
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.user.role === "admin") {
          url = `${API_BASE}/orders`;
        }
      }

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Map backend order to frontend structure
        const mapped: Order[] = data.map((o: any) => ({
          id: o.id,
          date: o.createdAt,
          total: o.total,
          status: o.status === "pending" ? "Processing" : (o.status.charAt(0).toUpperCase() + o.status.slice(1) as OrderStatus),
          shipping: o.shippingAddress ? {
            name: o.shippingAddress.fullName,
            email: "",
            phone: o.shippingAddress.phone,
            address: o.shippingAddress.line1,
            city: o.shippingAddress.city,
            zip: o.shippingAddress.pincode,
            country: o.shippingAddress.state,
          } : undefined,
          items: o.items.map((it: any) => ({
            product: {
              id: it.productId,
              name: it.name,
              price: it.price,
              image: "", // placeholder
              specs: [],
            } as any,
            qty: it.quantity,
          })),
        }));
        setOrders(mapped);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((i) => i.product.id === p.id);
      if (ex) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product: p, qty }];
    });
  };

  const remove: CartCtx["remove"] = (id) =>
    setItems((prev) => prev.filter((i) => i.product.id !== id));

  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const placeOrder = async (paymentMethod: "card" | "paypal" | "cod") => {
    if (items.length === 0) return null;
    let shipping: ShippingInfo | undefined;
    try {
      const raw = sessionStorage.getItem("shipping");
      if (raw) shipping = JSON.parse(raw) as ShippingInfo;
    } catch {
      // ignore
    }

    const token = localStorage.getItem("lh_token_v1");
    if (!token) {
      // Local storage fallback for guests
      const order: Order = {
        id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        items,
        total: subtotal,
        status: "Processing",
        shipping,
      };
      const newOrders = [order, ...orders];
      setOrders(newOrders);
      localStorage.setItem("orders", JSON.stringify(newOrders));
      setItems([]);
      return order;
    }

    // Backend order placing
    const apiPayload = {
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.qty,
      })),
      shippingAddress: {
        fullName: shipping?.name || "Anonymous",
        phone: shipping?.phone || "0000000000",
        line1: shipping?.address || "Address",
        city: shipping?.city || "City",
        state: shipping?.country || "State",
        pincode: shipping?.zip || "0000",
      },
      paymentMethod: paymentMethod === "paypal" ? "upi" : paymentMethod,
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(apiPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to place order");
      }

      const data = await res.json();
      const order: Order = {
        id: data.id,
        date: data.createdAt,
        items,
        total: subtotal,
        status: "Processing",
        shipping,
      };

      setItems([]);
      await fetchOrders();
      return order;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || "Failed to place order.");
    }
  };

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, orders, placeOrder, fetchOrders }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
}

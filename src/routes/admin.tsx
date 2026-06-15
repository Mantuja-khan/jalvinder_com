import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import type { Laptop } from "@/data/laptops";
import type { Order, OrderStatus } from "@/context/CartContext";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Tag,
  Star,
  Crown,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  MessageCircle,
  Truck,
  CheckCircle2,
  FolderTree,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const STATUS_FLOW: OrderStatus[] = [
  "Processing",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function saveOrders(orders: Order[]) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function buildWhatsappUrl(phone: string, message: string) {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export const Route = createFileRoute("/admin")({
  component: Admin,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("lh_session_v1");
        const session = raw ? JSON.parse(raw) : null;
        if (!session || session.role !== "admin") {
          throw redirect({ to: "/admin-login" });
        }
      } catch (e) {
        if (e && typeof e === "object" && "to" in e) throw e;
        throw redirect({ to: "/admin-login" });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Admin — Jalvindar Computer" },
      { name: "description", content: "Manage products, offers, orders and analytics." },
    ],
  }),
});

type Draft = Omit<Laptop, "specs" | "highlights" | "offers" | "images" | "features"> & {
  specsText: string;
  highlightsText: string;
  offersText: string;
  imagesText: string;
  featuresText: string;
};
type Tab = "dashboard" | "products" | "categories" | "slides" | "orders" | "delivered";

const EMPTY: Draft = {
  id: "",
  name: "",
  brand: "",
  price: 0,
  oldPrice: undefined,
  image: "",
  badge: "",
  rating: 4.5,
  category: "",
  subcategory: "",
  description: "",
  warranty: "",
  seller: "Jalvindar Computer",
  inStock: true,
  deliveryDays: 4,
  specsText: "",
  highlightsText: "",
  offersText: "",
  imagesText: "",
  featuresText: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem("orders");
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function Admin() {
  const navigate = useNavigate();
  const { products, add, update, remove, featured, toggleFeatured, categories, addCategory, removeCategory, addSubcategory, removeSubcategory, heroSlides, addHeroSlide, updateHeroSlide, removeHeroSlide } = useProducts();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [offerFor, setOfferFor] = useState<string | null>(null);
  const [offerOld, setOfferOld] = useState("");
  const [offerBadge, setOfferBadge] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
    const onStorage = () => setOrders(loadOrders());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [tab]);

  const startNew = () => {
    setDraft({
      ...EMPTY,
      category: categories[0]?.name ?? "",
    });
    setEditingId(null);
    setShowForm(true);
  };
  const startEdit = (p: Laptop) => {
    setEditingId(p.id);
    setDraft({
      ...p,
      badge: p.badge ?? "",
      subcategory: p.subcategory ?? "",
      oldPrice: p.oldPrice,
      warranty: p.warranty ?? "",
      seller: p.seller ?? "",
      inStock: p.inStock ?? true,
      deliveryDays: p.deliveryDays ?? 4,
      specsText: p.specs.map((s) => `${s.label}: ${s.value}`).join("\n"),
      highlightsText: (p.highlights ?? []).join("\n"),
      offersText: (p.offers ?? []).join("\n"),
      imagesText: (p.images ?? []).join("\n"),
      featuresText: (p.features ?? []).map((f) => `${f.label}: ${f.value}`).join("\n"),
    });
    setShowForm(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsePairs = (t: string) =>
      t
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, ...rest] = l.split(":");
          return { label: label.trim(), value: rest.join(":").trim() };
        })
        .filter((p) => p.label);
    const specs = parsePairs(draft.specsText);
    const features = parsePairs(draft.featuresText);
    const splitLines = (t: string) =>
      t.split("\n").map((l) => l.trim()).filter(Boolean);
    const id = editingId ?? (slugify(draft.name) || `prod-${Date.now()}`);
    const payload: Laptop = {
      id,
      name: draft.name,
      brand: draft.brand,
      price: Number(draft.price),
      oldPrice: draft.oldPrice ? Number(draft.oldPrice) : undefined,
      image: draft.image || "https://placehold.co/600x600?text=Product",
      images: splitLines(draft.imagesText),
      badge: draft.badge || undefined,
      rating: Number(draft.rating),
      category: draft.category,
      subcategory: draft.subcategory || undefined,
      description: draft.description,
      highlights: splitLines(draft.highlightsText),
      offers: splitLines(draft.offersText),
      warranty: draft.warranty || undefined,
      seller: draft.seller || undefined,
      inStock: draft.inStock,
      deliveryDays: draft.deliveryDays ? Number(draft.deliveryDays) : undefined,
      specs,
      features: features.length > 0 ? features : undefined,
    };
    if (editingId) {
      update(editingId, payload);
      toast.success("Product updated");
    } else {
      add(payload);
      toast.success("Product added");
    }
    setShowForm(false);
    setEditingId(null);
    setDraft(EMPTY);
  };

  const onDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      remove(id);
      toast.success("Product deleted");
    }
  };

  const applyOffer = () => {
    if (!offerFor) return;
    update(offerFor, {
      oldPrice: offerOld ? Number(offerOld) : undefined,
      badge: offerBadge || undefined,
    });
    toast.success("Offer applied");
    setOfferFor(null);
    setOfferOld("");
    setOfferBadge("");
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      saveOrders(next);
      return next;
    });
    toast.success(`Order ${orderId} → ${status}`);
  };

  const sendWhatsapp = (order: Order) => {
    const phone = order.shipping?.phone;
    if (!phone) {
      toast.error("No phone number on this order");
      return;
    }
    const name = order.shipping?.name || "Customer";
    const itemList = order.items
      .map((i) => `• ${i.product.name} ×${i.qty}`)
      .join("\n");
    const trackingMsg =
      order.status === "Out for Delivery"
        ? `Hi ${name}, your order ${order.id} is *Out for Delivery* today and will reach you soon.`
        : order.status === "Delivered"
          ? `Hi ${name}, your order ${order.id} has been *Delivered*. Hope you love it! Thanks for shopping with Jalvindar Computer.`
          : `Hi ${name}, update on your order ${order.id}: status is *${order.status}*.`;
    const msg = `${trackingMsg}\n\n${itemList}\n\nTotal: ${formatINR(order.total)}`;
    window.open(buildWhatsappUrl(phone, msg), "_blank");
  };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalUnits = orders.reduce(
    (s, o) => s + o.items.reduce((a, i) => a + i.qty, 0),
    0,
  );
  const featuredCount = featured.hero.length + featured.bestseller.length;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
            <img src={logo} alt="Jalvindar Computer logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" /> Admin Panel
          </h1>
          <p className="text-[11px] sm:text-sm text-muted-foreground mt-1">
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            toast.success("Signed out");
            navigate({ to: "/admin-login" });
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm border border-border rounded-full px-3 py-2 hover:border-primary"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 sm:mt-6 flex gap-1 sm:gap-2 border-b border-border overflow-x-auto no-scrollbar">
        <TabBtn active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
        <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="h-4 w-4" />} label="Products" />
        <TabBtn active={tab === "categories"} onClick={() => setTab("categories")} icon={<FolderTree className="h-4 w-4" />} label="Categories" />
        <TabBtn active={tab === "slides"} onClick={() => setTab("slides")} icon={<ImageIcon className="h-4 w-4" />} label="Hero Slides" />
      </div>

      {/* Dashboard */}
      {tab === "dashboard" && (
        <div className="mt-5 sm:mt-7 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={<DollarSign className="h-5 w-5" />} label="Revenue" value={`${formatINR(totalRevenue)}`} />
            <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Orders" value={String(orders.length)} />
            <StatCard icon={<Package className="h-5 w-5" />} label="Products" value={String(products.length)} />
            <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Featured" value={String(featuredCount)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <div className="border border-border rounded-xl p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" /> Recent Orders
              </h2>
              {orders.length === 0 ? (
                <p className="text-xs text-muted-foreground">No orders yet.</p>
              ) : (
                <ul className="space-y-2">
                  {orders.slice(0, 5).map((o) => (
                    <li key={o.id} className="flex items-center justify-between text-xs sm:text-sm border-b border-border pb-2 last:border-0">
                      <div>
                        <p className="font-semibold">{o.id}</p>
                        <p className="text-muted-foreground text-[11px]">
                          {new Date(o.date).toLocaleDateString()} · {o.items.length} item(s)
                        </p>
                      </div>
                      <span className="text-primary font-bold">{formatINR(o.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-border rounded-xl p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Top Products
              </h2>
              <ul className="space-y-2">
                {products.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 text-xs sm:text-sm">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-secondary rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                    </div>
                    <span className="text-primary font-bold">{formatINR(p.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {tab === "products" && (
        <div className="mt-5 sm:mt-7">
          <div className="flex items-center justify-between gap-2 mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => {
              const inHero = featured.hero.includes(p.id);
              const inBest = featured.bestseller.includes(p.id);
              const inBestTop = featured.bestTop.includes(p.id);
              const inPromo = featured.promo.includes(p.id);
              return (
                <div key={p.id} className="border border-border rounded-xl p-3 sm:p-4 flex flex-col">
                  <div className="flex gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-secondary rounded-md shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {p.brand} · {p.category}
                      </p>
                      <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{p.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                        <span className="text-primary font-bold text-sm">{formatINR(p.price)}</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            {formatINR(p.oldPrice)}
                          </span>
                        )}
                        {p.badge && (
                          <span className="text-[10px] bg-destructive text-destructive-foreground rounded px-1.5 py-0.5 font-bold">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <FeatureToggle active={inHero} onClick={() => toggleFeatured("hero", p.id)} label="Hero" />
                    <FeatureToggle active={inBest} onClick={() => toggleFeatured("bestseller", p.id)} label="Best Selling" />
                    <FeatureToggle active={inBestTop} onClick={() => toggleFeatured("bestTop", p.id)} label="Best Top" />
                    <FeatureToggle active={inPromo} onClick={() => toggleFeatured("promo", p.id)} label="Promo Box" />
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => startEdit(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-2 py-1.5 rounded border border-border hover:bg-accent/40"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setOfferFor(p.id);
                        setOfferOld(p.oldPrice ? String(p.oldPrice) : "");
                        setOfferBadge(p.badge ?? "");
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-2 py-1.5 rounded border border-border hover:bg-accent/40"
                    >
                      <Tag className="h-3.5 w-3.5" /> Offer
                    </button>
                    <button
                      onClick={() => onDelete(p.id, p.name)}
                      className="inline-flex items-center justify-center text-xs p-1.5 rounded border border-border text-destructive hover:bg-destructive/10"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="mt-5 sm:mt-7">
          {orders.filter((o) => o.status !== "Delivered").length === 0 ? (
            <div className="border border-border rounded-xl p-8 text-center">
              <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No active orders.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.filter((o) => o.status !== "Delivered").map((o) => {
                const canWhatsapp =
                  (o.status === "Out for Delivery" || o.status === "Delivered") &&
                  !!o.shipping?.phone;
                return (
                  <div key={o.id} className="border border-border rounded-xl p-3 sm:p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base">{o.id}</p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {new Date(o.date).toLocaleString()}
                        </p>
                        {o.shipping && (
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 truncate">
                            {o.shipping.name} · {o.shipping.phone} · {o.shipping.city}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-sm sm:text-base">{formatINR(o.total)}</p>
                        <span className={`inline-block text-[10px] uppercase tracking-wider rounded px-2 py-0.5 mt-1 ${
                          o.status === "Delivered"
                            ? "bg-primary/15 text-primary"
                            : o.status === "Out for Delivery"
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-3 pt-3 border-t border-border divide-y divide-border">
                      {o.items.map((it) => (
                        <li key={it.product.id} className="flex items-center gap-3 py-2">
                          <img src={it.product.image} alt={it.product.name} className="w-12 h-12 object-contain bg-secondary rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{it.product.name}</p>
                            <p className="text-[11px] text-muted-foreground">Qty: {it.qty}</p>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold">
                            {formatINR((it.product.price * it.qty))}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Status controls */}
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Truck className="h-3 w-3" /> Update delivery status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_FLOW.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateOrderStatus(o.id, s)}
                            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full border transition ${
                              o.status === s
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      {canWhatsapp && (
                        <button
                          onClick={() => sendWhatsapp(o)}
                          className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90"
                        >
                          {o.status === "Delivered" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}
                          Send "{o.status}" update on WhatsApp
                        </button>
                      )}
                      {!canWhatsapp &&
                        (o.status === "Out for Delivery" || o.status === "Delivered") && (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            No phone number captured for this order.
                          </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delivered */}
      {tab === "delivered" && (
        <div className="mt-5 sm:mt-7">
          {orders.filter((o) => o.status === "Delivered").length === 0 ? (
            <div className="border border-border rounded-xl p-8 text-center">
              <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No delivered orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders
                .filter((o) => o.status === "Delivered")
                .map((o) => (
                  <div key={o.id} className="border border-primary/30 bg-primary/5 rounded-xl p-3 sm:p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> {o.id}
                        </p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground">
                          {new Date(o.date).toLocaleString()}
                        </p>
                        {o.shipping && (
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 truncate">
                            {o.shipping.name} · {o.shipping.phone} · {o.shipping.city}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-sm sm:text-base">{formatINR(o.total)}</p>
                        <span className="inline-block text-[10px] uppercase tracking-wider rounded px-2 py-0.5 mt-1 bg-primary/15 text-primary">
                          Delivered
                        </span>
                      </div>
                    </div>
                    <ul className="mt-3 pt-3 border-t border-border divide-y divide-border">
                      {o.items.map((it) => (
                        <li key={it.product.id} className="flex items-center gap-3 py-2">
                          <img src={it.product.image} alt={it.product.name} className="w-12 h-12 object-contain bg-secondary rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate">{it.product.name}</p>
                            <p className="text-[11px] text-muted-foreground">Qty: {it.qty}</p>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold">
                            {formatINR(it.product.price * it.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {o.shipping?.phone && (
                      <button
                        onClick={() => sendWhatsapp(o)}
                        className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-full px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90"
                      >
                        <MessageCircle className="h-4 w-4" /> Send thank-you on WhatsApp
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {tab === "categories" && (
        <CategoriesPanel
          categories={categories}
          addCategory={addCategory}
          removeCategory={removeCategory}
          addSubcategory={addSubcategory}
          removeSubcategory={removeSubcategory}
        />
      )}

      {tab === "slides" && (
        <SlidesPanel
          slides={heroSlides}
          addHeroSlide={addHeroSlide}
          updateHeroSlide={updateHeroSlide}
          removeHeroSlide={removeHeroSlide}
        />
      )}


      {showForm && (
        <Modal title={editingId ? "Edit Product" : "Add Product"} onClose={() => setShowForm(false)}>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Name">
              <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Brand">
                <input required value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value, subcategory: "" })}
                  className={inputCls}
                >
                  <option value="">— Select —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Subcategory">
              <select
                value={draft.subcategory ?? ""}
                onChange={(e) => setDraft({ ...draft, subcategory: e.target.value })}
                className={inputCls}
                disabled={!draft.category}
              >
                <option value="">— None —</option>
                {categories
                  .find((c) => c.name === draft.category)
                  ?.subcategories.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
              </select>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Price ($)">
                <input required type="number" step="0.01" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={inputCls} />
              </Field>
              <Field label="Old Price">
                <input type="number" step="0.01" value={draft.oldPrice ?? ""} onChange={(e) => setDraft({ ...draft, oldPrice: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
              </Field>
              <Field label="Rating">
                <input type="number" step="0.1" min="0" max="5" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} className={inputCls} />
              </Field>
            </div>
            <Field label="Main Image URL">
              <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." className={inputCls} />
            </Field>
            <Field label="Gallery Images (one URL per line)">
              <textarea rows={3} value={draft.imagesText} onChange={(e) => setDraft({ ...draft, imagesText: e.target.value })} placeholder="https://...\nhttps://..." className={inputCls} />
            </Field>
            <Field label="Badge (e.g. NEW, -20%)">
              <input value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Description (optional)">
              <textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
            </Field>

            <div className="rounded-md border border-dashed border-border bg-muted/30 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Optional fields — fill only what applies (Laptop / Monitor / Keyboard / Camera etc.)
              </p>
            </div>

            <Field label="Key Highlights (one per line) — optional">
              <textarea rows={4} value={draft.highlightsText} onChange={(e) => setDraft({ ...draft, highlightsText: e.target.value })} placeholder="8 GB DDR4 RAM\n512 GB SSD\n15.6 inch FHD Display" className={inputCls} />
            </Field>
            <Field label="Custom Features (one per line — Label: Value) — optional">
              <textarea rows={5} value={draft.featuresText} onChange={(e) => setDraft({ ...draft, featuresText: e.target.value })} placeholder="Delivery: In 3–5 days\nSeller: Jalvindar Computer\nWarranty: 1 Year Acer India Warranty\nResolution: 1920 x 1080\nRefresh Rate: 144Hz\nConnectivity: HDMI, USB-C" className={inputCls} />
            </Field>
            <Field label="Available Offers (one per line) — optional">
              <textarea rows={3} value={draft.offersText} onChange={(e) => setDraft({ ...draft, offersText: e.target.value })} placeholder="10% off on HDFC Credit Card\nNo Cost EMI available" className={inputCls} />
            </Field>
            <Field label="Specifications Table (one per line — Label: Value) — optional">
              <textarea rows={5} value={draft.specsText} onChange={(e) => setDraft({ ...draft, specsText: e.target.value })} placeholder="Processor: Intel Core i7\nRAM: 16 GB\nStorage: 512 GB SSD" className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Warranty (optional)">
                <input value={draft.warranty ?? ""} onChange={(e) => setDraft({ ...draft, warranty: e.target.value })} placeholder="e.g. 1 Year Acer India Warranty" className={inputCls} />
              </Field>
              <Field label="Seller (optional)">
                <input value={draft.seller ?? ""} onChange={(e) => setDraft({ ...draft, seller: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Delivery Days (optional)">
                <input type="number" min="1" value={draft.deliveryDays ?? ""} onChange={(e) => setDraft({ ...draft, deliveryDays: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
              </Field>
              <Field label="In Stock">
                <select value={draft.inStock ? "yes" : "no"} onChange={(e) => setDraft({ ...draft, inStock: e.target.value === "yes" })} className={inputCls}>
                  <option value="yes">In Stock</option>
                  <option value="no">Out of Stock</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 text-sm rounded-md border border-border hover:bg-accent/40">
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-semibold">
                {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {offerFor && (
        <Modal title="Set Offer" onClose={() => setOfferFor(null)}>
          <div className="space-y-3">
            <Field label="Original price (shown struck through)">
              <input type="number" step="0.01" value={offerOld} onChange={(e) => setOfferOld(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Badge text (e.g. -20%, SALE, HOT)">
              <input value={offerBadge} onChange={(e) => setOfferBadge(e.target.value)} className={inputCls} />
            </Field>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setOfferFor(null)} className="flex-1 px-4 py-2 text-sm rounded-md border border-border hover:bg-accent/40">
                Cancel
              </button>
              <button onClick={applyOffer} className="flex-1 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-semibold">
                Apply Offer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inputCls =
  "w-full border border-border rounded-md px-3 py-2 text-sm bg-background outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border border-border rounded-xl p-3 sm:p-4 bg-card">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[11px] sm:text-xs uppercase tracking-wider">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="text-lg sm:text-2xl font-bold mt-1.5">{value}</p>
    </div>
  );
}

function FeatureToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border transition ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary"
      }`}
    >
      <Star className="h-3 w-3" fill={active ? "currentColor" : "none"} /> {label}
    </button>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-card rounded-xl border border-border w-full max-w-lg my-4 sm:my-8 max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
          <h2 className="text-base sm:text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function CategoriesPanel({
  categories,
  addCategory,
  removeCategory,
  addSubcategory,
  removeSubcategory,
}: {
  categories: import("@/context/ProductsContext").Category[];
  addCategory: (n: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addSubcategory: (catId: string, n: string) => Promise<void>;
  removeSubcategory: (catId: string, subId: string) => Promise<void>;
}) {
  const [newCat, setNewCat] = useState("");
  const [newSub, setNewSub] = useState<Record<string, string>>({});

  const submitCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await addCategory(newCat);
      toast.success(`Category "${newCat}" added`);
      setNewCat("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
    }
  };

  return (
    <div className="mt-5 sm:mt-7 space-y-4">
      <form onSubmit={submitCat} className="flex flex-col sm:flex-row gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name (e.g. Accessories)"
          className="flex-1 border border-border rounded-md px-3 py-2.5 text-sm bg-background outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </form>

      {categories.length === 0 ? (
        <div className="border border-border rounded-xl p-8 text-center">
          <FolderTree className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {categories.map((c) => {
            const val = newSub[c.id] ?? "";
            return (
              <div key={c.id} className="border border-border rounded-xl p-4 bg-card">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-primary" /> {c.name}
                  </h3>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete category "${c.name}"?`)) {
                        try {
                          await removeCategory(c.id);
                          toast.success("Category removed");
                        } catch (err: any) {
                          toast.error(err.message || "Failed to remove category");
                        }
                      }
                    }}
                    className="text-destructive hover:bg-destructive/10 p-1.5 rounded"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.subcategories.length === 0 && (
                    <span className="text-[11px] text-muted-foreground">No subcategories yet.</span>
                  )}
                  {c.subcategories.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 text-xs bg-secondary border border-border rounded-full pl-3 pr-1.5 py-1"
                    >
                      {s.name}
                      <button
                        onClick={async () => {
                          try {
                            await removeSubcategory(c.id, s.id);
                            toast.success(`Subcategory "${s.name}" removed`);
                          } catch (err: any) {
                            toast.error(err.message || "Failed to remove subcategory");
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove subcategory"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!val.trim()) return;
                    try {
                      await addSubcategory(c.id, val);
                      toast.success(`Subcategory "${val}" added`);
                      setNewSub((n) => ({ ...n, [c.id]: "" }));
                    } catch (err: any) {
                      toast.error(err.message || "Failed to add subcategory");
                    }
                  }}
                  className="mt-3 flex gap-2"
                >
                  <input
                    value={val}
                    onChange={(e) => setNewSub((n) => ({ ...n, [c.id]: e.target.value }))}
                    placeholder="Add subcategory"
                    className="flex-1 border border-border rounded-md px-3 py-1.5 text-xs bg-background outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 bg-foreground text-background rounded-md px-3 py-1.5 text-xs font-semibold hover:opacity-90"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SlidesPanel({
  slides,
  addHeroSlide,
  updateHeroSlide,
  removeHeroSlide,
}: {
  slides: import("@/context/ProductsContext").HeroSlide[];
  addHeroSlide: (s: Omit<import("@/context/ProductsContext").HeroSlide, "id">) => void;
  updateHeroSlide: (id: string, patch: Partial<import("@/context/ProductsContext").HeroSlide>) => void;
  removeHeroSlide: (id: string) => void;
}) {
  const [draft, setDraft] = useState({ image: "", title: "", subtitle: "", cta: "Shop Now", link: "/shop" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.image || !draft.title) {
      toast.error("Image and title are required");
      return;
    }
    addHeroSlide(draft);
    setDraft({ image: "", title: "", subtitle: "", cta: "Shop Now", link: "/shop" });
    toast.success("Slide added");
  };

  return (
    <div className="mt-5 sm:mt-7 space-y-5">
      <form onSubmit={submit} className="border border-border rounded-xl p-4 sm:p-5 space-y-3 bg-card">
        <h3 className="font-bold text-sm sm:text-base">Add New Slide</h3>
        <Field label="Image URL">
          <input required value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." className={inputCls} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Title">
            <input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Subtitle">
            <input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Button Text">
            <input value={draft.cta} onChange={(e) => setDraft({ ...draft, cta: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Link (e.g. /shop)">
            <input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {slides.map((s) => (
          <div key={s.id} className="border border-border rounded-xl overflow-hidden bg-card">
            <img src={s.image} alt={s.title} className="w-full h-32 object-cover" />
            <div className="p-3 space-y-2">
              <input
                value={s.title}
                onChange={(e) => updateHeroSlide(s.id, { title: e.target.value })}
                className={inputCls}
              />
              <input
                value={s.subtitle}
                onChange={(e) => updateHeroSlide(s.id, { subtitle: e.target.value })}
                className={inputCls}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={s.cta}
                  onChange={(e) => updateHeroSlide(s.id, { cta: e.target.value })}
                  className={inputCls}
                  placeholder="Button"
                />
                <input
                  value={s.link}
                  onChange={(e) => updateHeroSlide(s.id, { link: e.target.value })}
                  className={inputCls}
                  placeholder="Link"
                />
              </div>
              <input
                value={s.image}
                onChange={(e) => updateHeroSlide(s.id, { image: e.target.value })}
                className={inputCls}
                placeholder="Image URL"
              />
              <button
                onClick={() => {
                  if (confirm("Delete this slide?")) {
                    removeHeroSlide(s.id);
                    toast.success("Slide removed");
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs px-2 py-1.5 rounded border border-border text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Slide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

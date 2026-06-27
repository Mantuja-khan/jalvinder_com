import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { Star, Minus, Plus, Truck, ShieldCheck, RotateCcw, MessageCircle, Store, Tag, CheckCircle2 } from "lucide-react";
import { getLaptop } from "@/data/laptops";
import { useCart } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewsContext";
import { useAuth, API_BASE } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/ProductCard";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`${API_BASE}/products/${params.id}`);
      if (!res.ok) throw notFound();
      return await res.json();
    } catch {
      throw notFound();
    }
  },
  component: ProductPage,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Jalvindar Computer` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/shop" className="text-primary mt-4 inline-block">Back to shop</Link>
    </div>
  ),
});

function FkStars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-fk-green text-white text-xs font-bold rounded px-1.5 py-0.5">
      {value.toFixed(1)} <Star className="h-3 w-3" fill="currentColor" stroke="currentColor" />
    </span>
  );
}

function ProductPage() {
  const p = Route.useLoaderData() as import("@/data/laptops").Laptop;
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { forProduct, averageFor, add: addReview } = useReviews();
  const { user } = useAuth();

  const gallery = [p.image, ...(p.images ?? [])].filter(Boolean);
  const [activeImg, setActiveImg] = useState(0);

  const reviews = forProduct(p.id);
  const { avg, count } = averageFor(p.id, p.rating);
  const displayRating = count > 0 ? avg : p.rating;

  const { products } = useProducts();
  const related = products.filter((l) => l.id !== p.id).slice(0, 4);
  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : 0;

  const OWNER_WHATSAPP = "919352190208";
  const sendEnquiry = () => {
    const msg =
      `Hi, I'd like to enquire about this product:\n\n` +
      `*${p.name}*\nBrand: ${p.brand}\nPrice: ${formatINR(p.price)}\nQuantity: ${qty}\n\n` +
      `Please share more details. Thank you!`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Review form
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please add your name and a response.");
      return;
    }
    if (phone && !/^[+\d\s\-()]{7,20}$/.test(phone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    addReview({
      productId: p.id,
      user: name.trim(),
      phone: phone.trim() || undefined,
      rating,
      comment: comment.trim(),
    });
    setComment("");
    setPhone("");
    setRating(5);
    toast.success("Thanks for your review!");
  };

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <nav className="text-xs text-muted-foreground mb-3 px-2">
          <Link to="/">Home</Link> › <Link to="/shop">{p.category}</Link> › <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="bg-card rounded-sm shadow-sm grid lg:grid-cols-[500px_1fr] gap-6 p-3 sm:p-5">
          {/* Image gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex gap-3">
              {gallery.length > 1 && (
                <div className="flex flex-col gap-2">
                  {gallery.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setActiveImg(i)}
                      onClick={() => setActiveImg(i)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-sm overflow-hidden flex items-center justify-center bg-secondary ${
                        activeImg === i ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex-1 border border-border rounded-sm bg-white p-4 flex items-center justify-center min-h-[300px]">
                <img
                  src={gallery[activeImg]}
                  alt={p.name}
                  className="max-h-[440px] w-full object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => add(p, qty)}
                className="inline-flex items-center justify-center gap-2 bg-fk-cart text-white rounded-sm py-3 font-bold text-sm uppercase hover:opacity-90 shadow-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={sendEnquiry}
                className="inline-flex items-center justify-center gap-2 bg-fk-buy text-white rounded-sm py-3 font-bold text-sm uppercase hover:opacity-90 shadow-sm"
              >
                <MessageCircle className="h-4 w-4" /> Send Enquiry
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs text-muted-foreground">{p.brand}</p>
            <h1 className="text-base sm:text-xl font-medium mt-0.5 leading-snug">{p.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <FkStars value={displayRating} />
              <span className="text-xs text-muted-foreground font-semibold">
                {count} Ratings & Reviews
              </span>
            </div>

            {p.badge && (
              <p className="text-xs text-fk-green font-bold mt-2">{p.badge}</p>
            )}

            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-green-600">{formatINR(p.price)}</span>
              {p.oldPrice && (
                <>
                  <span className="text-sm text-red-500 line-through">{formatINR(p.oldPrice)}</span>
                  {discount > 0 && (
                    <span className="text-sm text-fk-green font-bold">{discount}% off</span>
                  )}
                </>
              )}
            </div>

            {p.inStock === false ? (
              <p className="text-sm text-destructive font-semibold mt-1">Out of Stock</p>
            ) : (
              <p className="text-xs text-fk-green font-semibold mt-1">In Stock</p>
            )}

            {/* Offers */}
            {p.offers && p.offers.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Available offers</h3>
                <ul className="mt-2 space-y-1.5">
                  {p.offers.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <Tag className="h-4 w-4 text-fk-green shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery / Seller / Warranty / Custom Features */}
            <div className="mt-5 grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              {p.seller && (
                <>
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-semibold text-primary">
                    <Store className="inline h-4 w-4 mr-1" /> {p.seller}
                  </span>
                </>
              )}
              {p.warranty && (
                <>
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-semibold">
                    <ShieldCheck className="inline h-4 w-4 mr-1 text-primary" /> {p.warranty}
                  </span>
                </>
              )}
              {p.features?.map((f, i) => (
                <Fragment key={i}>
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-semibold">{f.value}</span>
                </Fragment>
              ))}
              <span className="text-muted-foreground">Quantity</span>
              <div className="flex items-center border border-border rounded-sm w-fit">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1.5"><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="p-1.5"><Plus className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            {/* Highlights */}
            {p.highlights && p.highlights.length > 0 && (
              <div className="mt-6 grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="text-muted-foreground">Highlights</span>
                <ul className="list-disc pl-5 space-y-1">
                  {p.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filler info cards — keep right column rich */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="border border-border rounded-md p-4 bg-muted/30">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-fk-green" /> Why buy from us
                </h4>
                <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                  <li>• 100% genuine products with bill</li>
                  <li>• Trusted local seller — Jalvindar Computer</li>
                  <li>• On-site service & installation support</li>
                </ul>
              </div>
              <div className="border border-border rounded-md p-4 bg-muted/30">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" /> Need help?
                </h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  Chat with our team on WhatsApp for stock availability, custom quotes and bulk orders.
                </p>
                <button
                  onClick={sendEnquiry}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Start chat →
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-6 leading-relaxed">{p.description}</p>

            {/* Specs */}
            {p.specs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold border-b border-border pb-2">Specifications</h2>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold mb-2">General</h3>
                  <table className="w-full text-sm border border-border">
                    <tbody>
                      {p.specs.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                          <td className="px-3 py-2 text-muted-foreground w-1/3 align-top">{s.label}</td>
                          <td className="px-3 py-2 font-medium">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
              <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Free shipping</div>
              <div className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-primary" /> Easy returns</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-fk-green" /> Genuine product</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-4 bg-card rounded-sm shadow-sm p-4 sm:p-5 grid lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <h2 className="text-lg font-bold">Ratings & Reviews</h2>
            <div className="flex items-center gap-3 mt-2">
              <FkStars value={displayRating} />
              <span className="text-xs text-muted-foreground">{count} review{count === 1 ? "" : "s"}</span>
            </div>

            <div className="mt-5 space-y-3">
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground border border-dashed border-border rounded-md p-5 text-center">
                  No reviews yet. Be the first!
                </p>
              )}
              {reviews.map((r) => (
                <article key={r.id} className="border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <FkStars value={r.rating} />
                    <span className="text-sm font-semibold">{r.user}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(r.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-2">{r.comment}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="border border-border rounded-md p-4 h-fit bg-muted/30">
            <h3 className="font-bold text-sm">Write a review</h3>
            <form onSubmit={submitReview} className="mt-3 space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const v = i + 1;
                  const active = (hover || rating) >= v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onMouseEnter={() => setHover(v)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(v)}
                      aria-label={`Rate ${v} stars`}
                    >
                      <Star
                        className={`h-5 w-5 ${active ? "text-amber-500" : "text-muted-foreground"}`}
                        fill={active ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                maxLength={80}
                className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                maxLength={20}
                className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Your response — share your experience *"
                className="w-full border border-border rounded-sm px-3 py-2 text-sm bg-background resize-none"
              />
              <button
                type="submit"
                className="w-full bg-fk-buy text-white rounded-sm py-2 text-sm font-bold uppercase hover:opacity-90"
              >
                Submit Review
              </button>
            </form>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="mt-4 bg-card rounded-sm shadow-sm p-4 sm:p-5">
            <h2 className="text-lg font-bold mb-4">Similar products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {related.map((r) => <ProductCard key={r.id} p={r} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

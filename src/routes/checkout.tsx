import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — Jalvindar Computer" }] }),
});

function Checkout() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 500 ? 0 : 25;

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "", country: "United States",
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <Link to="/shop" className="text-primary mt-4 inline-block">Browse laptops</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("shipping", JSON.stringify(form));
    navigate({ to: "/payment" });
  };

  const input = "w-full border border-border rounded-md px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary";

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-10 mt-8">
        <form onSubmit={submit} className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-lg">Shipping Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Full name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required placeholder="Phone" className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input required placeholder="Country" className={input} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input required placeholder="Address" className={`${input} md:col-span-2`} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input required placeholder="City" className={input} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input required placeholder="ZIP / Postal" className={input} value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm hover:bg-primary/90">
            Continue to Payment
          </button>
        </form>
        <aside className="border border-border rounded-lg p-6 h-fit">
          <h2 className="font-bold text-lg">Your Order</h2>
          <div className="space-y-3 mt-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{product.name} × {qty}</span>
                <span className="font-semibold">{formatINR((product.price * qty))}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span></div>
            <div className="flex justify-between font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatINR((subtotal + shipping))}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Cart — Jalvindar Computer" }] }),
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Browse our latest laptops.</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 border border-border rounded-lg p-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-contain bg-secondary rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="text-primary font-bold mt-1">{formatINR(product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center border border-border rounded-full">
                  <button onClick={() => setQty(product.id, qty - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(product.id, qty + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="border border-border rounded-lg p-6 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-semibold">{subtotal > 500 ? "Free" : "$25.00"}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border font-bold">
            <span>Total</span>
            <span className="text-primary">{formatINR((subtotal + (subtotal > 500 ? 0 : 25)))}</span>
          </div>
          <Link to="/checkout" className="block text-center mt-6 bg-primary text-primary-foreground rounded-full py-3 font-semibold text-sm hover:bg-primary/90">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

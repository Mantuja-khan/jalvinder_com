import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import { useState } from "react";
import { CreditCard, Wallet, Banknote } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/payment")({
  component: Payment,
  head: () => ({ meta: [{ title: "Payment — Jalvindar Computer" }] }),
});

function Payment() {
  const { items, subtotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 500 ? 0 : 25;
  const [method, setMethod] = useState<"card" | "paypal" | "cod">("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No items to pay for</h1>
        <Link to="/shop" className="text-primary mt-4 inline-block">Browse</Link>
      </div>
    );
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const order = await placeOrder(method);
      if (order) {
        sessionStorage.setItem("lastOrder", order.id);
        navigate({ to: "/order-success" });
      }
    } catch (err: any) {
      alert(err.message || "Failed to place order");
    }
  };

  const input = "w-full border border-border rounded-md px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary";

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Payment</h1>
      <div className="grid lg:grid-cols-3 gap-10 mt-8">
        <form onSubmit={pay} className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-3">Choose a payment method</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "card", Icon: CreditCard, l: "Credit Card" },
                { v: "paypal", Icon: Wallet, l: "PayPal" },
                { v: "cod", Icon: Banknote, l: "Cash on Delivery" },
              ].map(({ v, Icon, l }) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setMethod(v as typeof method)}
                  className={`border rounded-lg p-4 text-sm flex flex-col items-center gap-2 transition ${
                    method === v ? "border-primary bg-primary/5 text-primary" : "border-border"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {l}
                </button>
              ))}
            </div>
          </div>

          {method === "card" && (
            <div className="space-y-4">
              <input required placeholder="Card number" className={input} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
              <input required placeholder="Name on card" className={input} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="MM / YY" className={input} value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
                <input required placeholder="CVC" className={input} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
              </div>
            </div>
          )}
          {method === "paypal" && (
            <p className="text-sm text-muted-foreground">You'll be redirected to PayPal to complete your purchase.</p>
          )}
          {method === "cod" && (
            <p className="text-sm text-muted-foreground">Pay in cash when your laptop is delivered.</p>
          )}

          <button type="submit" className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold text-sm hover:bg-primary/90">
            Place Order — {formatINR((subtotal + shipping))}
          </button>
        </form>

        <aside className="border border-border rounded-lg p-6 h-fit">
          <h2 className="font-bold text-lg">Order Summary</h2>
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

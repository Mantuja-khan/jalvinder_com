import { createFileRoute, Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/orders")({
  component: Orders,
  head: () => ({ meta: [{ title: "My Orders — Jalvindar Computer" }] }),
});

function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="text-muted-foreground mt-2">When you place an order, it'll show up here.</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <div className="space-y-5 mt-8">
        {orders.map((o) => (
          <div key={o.id} className="border border-border rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <p className="font-semibold">Order {o.id}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleString()}</p>
              </div>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {o.status}
              </span>
              <p className="font-bold text-primary">{formatINR(o.total)}</p>
            </div>
            <div className="mt-4 space-y-3">
              {o.items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-contain bg-secondary rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {qty} · {formatINR(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

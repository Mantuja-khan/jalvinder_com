import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-success")({
  component: Success,
  head: () => ({ meta: [{ title: "Order Confirmed — Jalvindar Computer" }] }),
});

function Success() {
  const id = typeof window !== "undefined" ? sessionStorage.getItem("lastOrder") : null;
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <CheckCircle2 className="h-20 w-20 text-primary mx-auto" />
      <h1 className="text-3xl font-bold mt-6">Thank you for your order!</h1>
      <p className="text-muted-foreground mt-2">
        Your order {id && <span className="font-semibold text-foreground">{id}</span>} has been placed successfully.
      </p>
      <div className="flex justify-center gap-3 mt-8">
        <Link to="/orders" className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold text-sm">View My Orders</Link>
        <Link to="/shop" className="border border-border rounded-full px-6 py-3 font-semibold text-sm">Continue Shopping</Link>
      </div>
    </div>
  );
}

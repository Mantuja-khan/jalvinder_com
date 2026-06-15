import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import type { Laptop } from "@/data/laptops";
import { formatINR } from "@/lib/format";

const OWNER_WHATSAPP = "919352190208";

export function ProductCard({ p }: { p: Laptop }) {
  const sendEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg =
      `Hi, I'd like to enquire about this product:\n\n` +
      `*${p.name}*\nBrand: ${p.brand}\nPrice: ${formatINR(p.price)}\n\n` +
      `Please share more details. Thank you!`;
    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group bg-card border border-border rounded-lg p-3 sm:p-4 flex flex-col hover:shadow-lg hover:border-primary/40 transition relative"
    >
      {p.badge && (
        <span className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded">
          {p.badge}
        </span>
      )}
      <div className="aspect-square bg-secondary rounded-md flex items-center justify-center overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition"
        />
      </div>
      <h3 className="text-sm font-semibold line-clamp-2 mt-3 group-hover:text-primary">
        {p.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span className="text-primary font-bold">{formatINR(p.price)}</span>
        {p.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">
            {formatINR(p.oldPrice)}
          </span>
        )}
      </div>
      <button
        onClick={sendEnquiry}
        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-white rounded-full py-2 text-xs font-semibold hover:opacity-90 transition"
      >
        <MessageCircle className="h-3.5 w-3.5" /> SEND ENQUIRY
      </button>
    </Link>
  );
}

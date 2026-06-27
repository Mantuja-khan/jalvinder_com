import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Wrench, Info, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const items = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/shop", label: "Products", Icon: ShoppingBag, exact: false },
  { to: "/services", label: "Services", Icon: Wrench, exact: false },
  { to: "/about", label: "About", Icon: Info, exact: false },
  { to: "/cart", label: "Cart", Icon: ShoppingCart, exact: false },
] as const;
export function MobileBottomNav() {
  const { count } = useCart();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] text-foreground/70 hover:text-primary relative"
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {to === "/cart" && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

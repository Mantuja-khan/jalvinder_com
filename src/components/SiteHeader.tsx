import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Search, X, LogOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const re = new RegExp(`(${escapeRegExp(query.trim())})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark key={i} className="search-hl">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function SiteHeader() {
  const { count } = useCart();
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">

      <div className="container mx-auto px-4 h-20 flex items-center gap-6">
        <Link to="/" className="flex flex-col justify-center leading-none shrink-0 font-heading">
          <span className="text-lg sm:text-x3 font-black tracking-wider uppercase text-primary">Jalvinder Computer</span>
          <span className="text-lg sm:text-x3 font-black tracking-wider uppercase text-primary">Technologies</span>
        </Link>

        <div ref={wrapperRef} className="hidden md:block flex-1 max-w-xl relative">
          <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search laptops, brands, specs..."
              className="bg-transparent outline-none text-sm flex-1"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {open && query.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50">
              {results.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground text-center">
                  No products match "<span className="font-medium text-foreground">{query}</span>".
                </p>
              ) : (
                <ul className="max-h-[420px] overflow-y-auto divide-y divide-border">
                  {results.map((l) => (
                    <li key={l.id}>
                      <div className="w-full flex gap-3 p-3 items-center hover:bg-accent/40 transition-colors">
                        <button
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                            navigate({ to: "/product/$id", params: { id: l.id } });
                          }}
                          className="flex gap-3 flex-1 min-w-0 text-left"
                        >
                          <img
                            src={l.image}
                            alt={l.name}
                            className="w-14 h-14 object-contain bg-secondary rounded-md shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              <Highlight text={l.name} query={query} />
                            </p>
                            <span className="text-sm font-bold text-price">
                              ₹{Math.round(l.price * 83).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                            navigate({ to: "/product/$id", params: { id: l.id } });
                          }}
                          className="shrink-0 bg-primary text-primary-foreground rounded-full px-3 py-1.5 text-[11px] font-semibold hover:opacity-90"
                        >
                          BUY NOW
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="hover:text-primary transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 ml-auto">
          <AuthMenu />
          <Link to="/cart" className="relative text-foreground/70 hover:text-primary">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function AuthMenu() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold rounded-full bg-secondary border border-border pl-1 pr-3 py-1 hover:border-primary"
      >
        <span className="bg-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center text-[11px] font-bold">
          {initials}
        </span>
        <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <div className="p-1 text-sm">
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50"
            >
              <ShoppingCart className="h-4 w-4" /> My Orders
            </Link>

            <button
              onClick={() => {
                logout();
                setOpen(false);
                toast.success("Signed out");
                navigate({ to: "/" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

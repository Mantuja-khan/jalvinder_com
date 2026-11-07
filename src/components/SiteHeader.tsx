import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const { products, categories } = useProducts();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHomePage = routerState.location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAtHero = isHomePage && !scrolled;

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
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isAtHero
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-background/95 backdrop-blur border-b border-border shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Container with reserved width for scale-250 */}
        <div className="flex items-center justify-start shrink-0 w-44 sm:w-52 md:w-60 lg:w-64 mr-2 sm:mr-4">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Jalvinder Computer Technology"
              className="h-20 w-auto object-contain scale-250 origin-left drop-shadow-sm"
            />
          </Link>
        </div>
        {/* Decreased compact search bar - does not cover logo */}
        <div className="hidden md:flex justify-center flex-1 max-w-[260px] lg:max-w-xs px-2">
          <div ref={wrapperRef} className="w-full relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) {
                  setOpen(false);
                  navigate({ to: "/shop", search: { q: query.trim() } });
                }
              }}
              className={`flex items-center gap-2 border rounded-full px-3 py-1.5 w-full transition-colors ${
                isAtHero
                  ? "bg-background/85 backdrop-blur-md border-border/80 text-foreground shadow-sm"
                  : "bg-transparent border-border text-foreground"
              }`}
            >
              <button type="submit" className="text-muted-foreground hover:text-primary transition-colors">
                <Search className="h-3.5 w-3.5" />
              </button>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search laptops, specs..."
                className="bg-transparent outline-none text-xs flex-1 w-full"
              />
              {query && (
                <button
                  type="button"
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
            </form>

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
        </div>

        {/* Buttons / Navigation / Auth Container */}
        <div className="flex items-center justify-end gap-4 lg:gap-6 shrink-0">
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {nav.map((n) => {
              const navLinkCls = isAtHero
                ? "text-white/95 hover:text-white drop-shadow-sm font-semibold transition-colors"
                : "text-foreground hover:text-primary transition-colors font-medium";

              if (n.label === "Shop") {
                return (
                  <div key={n.to} className="relative group py-2">
                    <Link
                      to={n.to}
                      activeProps={{ className: "text-primary" }}
                      className={`flex items-center gap-0.5 ${navLinkCls}`}
                    >
                      {n.label}
                      <span className="text-[8px] opacity-70 transition-transform group-hover:rotate-180">▼</span>
                    </Link>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-64 bg-popover/95 backdrop-blur border border-border rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                      <div className="p-2 space-y-1">
                        <Link
                          to="/shop"
                          search={{ category: "" }}
                          className="block px-3 py-2 rounded-lg text-xs font-semibold hover:bg-accent/50 text-foreground"
                        >
                          All Categories
                        </Link>
                        {categories.map((c) => (
                          <div key={c.id} className="relative group/sub">
                            <Link
                              to="/shop"
                              search={{ category: c.name }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium hover:bg-accent/50 text-foreground text-left"
                            >
                              <span>{c.name}</span>
                              {c.subcategories.length > 0 && (
                                <span className="text-[8px] opacity-60">▶</span>
                              )}
                            </Link>
                            {/* Subcategories Dropdown */}
                            {c.subcategories.length > 0 && (
                              <div className="absolute left-full top-0 ml-1 w-56 bg-popover/95 backdrop-blur border border-border rounded-xl shadow-lg opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-200">
                                <div className="p-2 space-y-1">
                                  {c.subcategories.map((s) => (
                                    <Link
                                      key={s.id}
                                      to="/shop"
                                      search={{ category: c.name, subcategory: s.name }}
                                      className="block px-3 py-1.5 rounded-lg text-[11px] hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                    >
                                      {s.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-primary" }}
                  className={navLinkCls}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <AuthMenu isAtHero={isAtHero} />
            <Link
              to="/cart"
              className={`relative transition-colors ${
                isAtHero ? "text-white hover:text-white/80 drop-shadow-sm" : "text-foreground/70 hover:text-primary"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function AuthMenu({ isAtHero }: { isAtHero?: boolean }) {
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
        className={`flex items-center gap-2 text-xs font-semibold rounded-full border pl-1 pr-3 py-1 transition-colors ${
          isAtHero
            ? "bg-black/40 text-white border-white/20 hover:border-white/50 backdrop-blur-sm"
            : "bg-secondary border-border text-foreground hover:border-primary"
        }`}
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

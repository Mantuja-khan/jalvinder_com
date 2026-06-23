import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer
      className="mt-20 border-t border-border relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('https://i.pinimg.com/1200x/9d/ab/d7/9dabd7bf2489a7c94fd3ce615c01e57e.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      <div className="relative container mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 relative h-20 overflow-visible">
            <img
              src={logo}
              alt="Jalvindar Computer logo"
              className="h-20 w-auto object-contain scale-250 origin-left"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Laptop & desktop sales, repairs and CCTV installation — all under one trusted roof.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop">All Laptops</Link></li>
            <li><Link to="/shop">Gaming</Link></li>
            <li><Link to="/shop">Ultrabooks</Link></li>
            <li><Link to="/shop">Business</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about">About Us</Link></li>
            <li>Support 24/7</li>
            <li>Returns & Warranty</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jalvindar Computer. All rights reserved.
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <div className="relative mt-20 sm:mt-28 md:mt-36">
      {/* Giant typography overlapping section above and footer - full screen width */}
      <div className="relative w-full overflow-hidden pointer-events-none select-none -mb-4 sm:-mb-7 md:-mb-10 lg:-mb-14 z-20">
        <svg
          viewBox="0 0 1200 90"
          className="w-full h-auto block select-none drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="jalvindarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.95" />
              <stop offset="48%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="72"
            textAnchor="middle"
            textLength="1170"
            lengthAdjust="spacingAndGlyphs"
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "82px",
              fontWeight: 950,
              fill: "url(#jalvindarGrad)",
            }}
          >
            JALVINDAR COMPUTER
          </text>
        </svg>
      </div>

      <footer
        className="relative border-t border-border/80 overflow-hidden bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/9d/ab/d7/9dabd7bf2489a7c94fd3ce615c01e57e.jpg')",
        }}
      >
        {/* Semi-transparent overlay so the footer background is clearly visible */}
        <div className="absolute inset-0 bg-slate-950/60" />

        <div className="relative z-10 container mx-auto px-4 pt-12 sm:pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 relative h-20 overflow-visible">
              <img
                src={logo}
                alt="Jalvindar Computer logo"
                className="h-20 w-auto object-contain scale-250 origin-left drop-shadow"
              />
            </div>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Laptop & desktop sales, repairs and CCTV installation — all under one trusted roof.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wide text-sm sm:text-base">Shop</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wide text-sm sm:text-base">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 tracking-wide text-sm sm:text-base">Information</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visit our shop for custom setups, upgrade diagnostics, repairs, and high-security CCTV configurations.
            </p>
          </div>
        </div>
        <div className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Jalvindar Computer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

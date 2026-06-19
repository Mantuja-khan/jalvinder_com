import { createFileRoute, Link } from "@tanstack/react-router";
import { Laptop as LaptopIcon, Monitor, Cctv, Wrench, HardDrive, Network, Printer, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services — Jalvindar Computer" },
      { name: "description", content: "Laptop & desktop sales and repair, CCTV installation, networking, printer service and more." },
      { property: "og:title", content: "Services — Jalvindar Computer" },
      { property: "og:description", content: "Laptop & desktop sales and repair, CCTV installation and more." },
    ],
  }),
});

export const SERVICES = [
  { Icon: LaptopIcon, t: "Laptop Sales & Service", s: "New & branded laptops with on-site repair, upgrades and warranty support." },
  { Icon: Monitor, t: "Desktop Sales & Service", s: "Custom-built desktops, assembled PCs and complete servicing for home or office." },
  { Icon: Cctv, t: "CCTV Installation", s: "End-to-end CCTV camera setup with DVR/NVR, mobile viewing and AMC support." },
  { Icon: Network, t: "Networking & Wi-Fi", s: "LAN, Wi-Fi and router setup for shops, offices and homes." },
  { Icon: HardDrive, t: "Data Recovery & Backup", s: "Recover lost data from HDD, SSD and pen drives — safe and confidential." },
  { Icon: Printer, t: "Printer Sales & Repair", s: "Inkjet and laser printer sales, cartridge refills and service." },
  { Icon: Wrench, t: "Annual Maintenance (AMC)", s: "Monthly and yearly maintenance contracts for businesses and institutions." },
  { Icon: ShieldCheck, t: "Antivirus & Software", s: "Windows installation, antivirus setup and productivity software." },
];

function Services() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <FadeIn>
        <section className="relative overflow-hidden bg-banner py-20 border-b border-border">
          <div aria-hidden className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-45 -left-45 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Expert Solutions
            </span>
            <h1 className="text-4xl md:text-6xl font-black mt-4 tracking-tight leading-tight">
              Our Services
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              Premium IT sales, support, and security installation services custom-built for homes and corporate institutions.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES.map(({ Icon, t, s }, i) => (
            <FadeIn key={t} delay={i * 60} direction="up">
              <div className="group bg-card border border-border/80 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
                <div className="bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-3 inline-flex w-fit transition-colors duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mt-5 tracking-tight group-hover:text-primary transition-colors duration-200">{t}</h3>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed flex-1">{s}</p>
                <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-end">
                  <span className="text-muted-foreground/30 text-xs">0{i + 1}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Custom Quote CTA */}
      <FadeIn>
        <section className="container mx-auto px-4 pb-20">
          <div className="relative overflow-hidden bg-banner rounded-3xl p-8 sm:p-12 md:p-16 border border-border text-center max-w-5xl mx-auto">
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Need a custom quote?</h2>
              <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
                From a single workspace setup to building-wide CCTV integration, our consultants are ready to tailor the ideal system for you.
              </p>
              <Link
                to="/contact"
                className="inline-flex mt-8 bg-primary text-primary-foreground rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-primary/20 hover:scale-[1.02] transition"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

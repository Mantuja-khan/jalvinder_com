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
    <div>
      <FadeIn>
        <section className="bg-banner">
          <div className="container mx-auto px-4 py-12 sm:py-14 max-w-3xl text-center">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">What we offer</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-3">Our Services</h1>
            <p className="text-muted-foreground mt-4">
              Everything for your computer and security needs — from sales and repairs to CCTV installation.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="container mx-auto px-4 py-12 sm:py-14 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {SERVICES.map(({ Icon, t, s }, i) => (
          <FadeIn key={t} delay={i * 80} direction="up">
            <div className="border border-border rounded-xl p-5 sm:p-6 hover:border-primary/40 hover:shadow-md transition">
              <div className="bg-primary/10 text-primary rounded-md p-3 inline-flex">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mt-4">{t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s}</p>
            </div>
          </FadeIn>
        ))}
      </section>

      <FadeIn>
        <section className="container mx-auto px-4 pb-16">
          <div className="bg-banner rounded-xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Need a custom quote?</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From a single PC to a multi-camera CCTV setup, we'll get you the right solution.
            </p>
            <Link
              to="/contact"
              className="inline-flex mt-6 bg-primary text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

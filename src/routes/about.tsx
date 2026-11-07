import { createFileRoute } from "@tanstack/react-router";
import { Target, Scan, Gem, Award, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import laptopImg from "@/assets/laptop-1.jpg";
import heroLaptop from "@/assets/hero-laptop.jpg";
import cctvImg from "@/assets/cctv-install-hero.png";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — Jalvindar Computer" },
      { name: "description", content: "Learn about Jalvindar Computer, our story, mission, vision, and core values." },
    ],
  }),
});

const hexPolygon = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

interface HexCardProps {
  image: string;
  label: string;
  tag: string;
  className?: string;
}

function HexCard({ image, label, tag, className = "" }: HexCardProps) {
  return (
    <div className={`relative group p-1 transition-all duration-300 hover:scale-105 hover:z-30 ${className}`}>
      {/* Outer border hexagon */}
      <div
        className="w-24 h-28 sm:w-32 sm:h-36 md:w-36 md:h-40 p-[3px] bg-gradient-to-b from-primary/80 via-blue-400 to-primary/40 shadow-xl"
        style={{ clipPath: hexPolygon }}
      >
        {/* Inner image hexagon */}
        <div
          className="w-full h-full bg-slate-900 relative overflow-hidden"
          style={{ clipPath: hexPolygon }}
        >
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end justify-center pb-2.5 sm:pb-3.5">
            <span className="text-[10px] sm:text-xs font-bold text-white px-1 text-center drop-shadow">
              {label}
            </span>
          </div>
        </div>
      </div>
      {/* Milestone/Tag node badge matching reference image */}
      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-mono font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center border-2 border-background shadow-md">
        {tag}
      </span>
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <FadeIn>
        <section
          className="relative overflow-hidden bg-cover bg-center py-16 sm:py-24"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/25/48/ee/2548eec8ac03570b81f764ed4787149b.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
          <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-white border border-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Trusted since 2015
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mt-4 text-white tracking-tight leading-tight uppercase">
              POWERING YOUR WORK, PLAY & CREATIVITY
            </h1>
            <p className="text-slate-200 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-normal">
              From high-performance laptops and custom assembled workstations to complete CCTV surveillance networks,
              we deliver hardware solutions you can trust unconditionally.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Main Section: Hexagonal Cluster on Left & Our Story on Right */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: Hexagonal Product & Service Cluster (Reference Style) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Background decorative connector lines */}
            <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-dashed border-primary/25 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-primary/10" />
            </div>

            {/* Honeycomb Interlocking Hexagons */}
            <div className="w-full max-w-lg mx-auto select-none">
              {/* Row 1: Laptop & Printer */}
              <div className="flex justify-center gap-2.5 sm:gap-4 md:gap-6 -mb-5 sm:-mb-8 md:-mb-10">
                <HexCard
                  image={laptopImg}
                  label="Laptops"
                  tag=".01"
                />
                <HexCard
                  image="https://i.pinimg.com/736x/eb/02/3e/eb023e44a9858cd14f17fe3843b355b0.jpg"
                  label="Printers"
                  tag=".02"
                />
              </div>

              {/* Row 2: Desktops, Center Core Hexagon, CCTV */}
              <div className="flex justify-center items-center gap-2.5 sm:gap-4 md:gap-6 -mb-5 sm:-mb-8 md:-mb-10 z-10 relative">
                <HexCard
                  image="https://i.pinimg.com/1200x/b0/12/f5/b012f5a8c77d06c37aabd96d81d2c97e.jpg"
                  label="Custom Desktops"
                  tag=".03"
                />

                {/* Center Core Brand Hexagon */}
                <div className="relative group p-1 transition-all duration-300 hover:scale-105 z-20">
                  <div
                    className="w-24 h-28 sm:w-32 sm:h-36 md:w-36 md:h-40 p-[3px] bg-gradient-to-br from-primary via-blue-500 to-indigo-600 shadow-2xl"
                    style={{ clipPath: hexPolygon }}
                  >
                    <div
                      className="w-full h-full bg-slate-950 text-white flex flex-col items-center justify-center p-2 sm:p-3 text-center"
                      style={{ clipPath: hexPolygon }}
                    >
                      <span className="text-[8px] sm:text-[9px] font-medium text-primary">Est. 2015</span>
                      <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-tight mt-1 text-white leading-tight">
                        JALVINDAR
                      </h4>
                      <p className="text-[8px] sm:text-[9px] text-slate-300 font-normal mt-0.5">Computer tech</p>
                      <div className="mt-1 h-0.5 w-5 sm:w-6 bg-primary rounded-full" />
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center border-2 border-background shadow-md">
                    ★
                  </span>
                </div>

                <HexCard
                  image={cctvImg}
                  label="CCTV Systems"
                  tag=".04"
                />
              </div>

              {/* Row 3: Repairs & Networking */}
              <div className="flex justify-center gap-2.5 sm:gap-4 md:gap-6">
                <HexCard
                  image="https://i.pinimg.com/736x/6b/96/70/6b9670b726e2b55a6a57391391558187.jpg"
                  label="Repairs & AMC"
                  tag=".05"
                />
                <HexCard
                  image="https://i.pinimg.com/1200x/4b/5f/20/4b5f201c35da82e7b80c2da09fb3f11a.jpg"
                  label="Networking"
                  tag=".06"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Our Story with Bold Dark Typography */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <p className="text-xs sm:text-sm text-primary font-bold">Our story & background</p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mt-2 text-slate-950 dark:text-white leading-tight uppercase">
                A DECADE OF HARDWARE MASTERY & HONEST SOLUTIONS
              </h2>
            </div>

            {/* Dark, crisp body typography in small letters */}
            <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              Jalvindar Computer was founded in 2015 with one uncompromising principle: buying computers, upgrades, and
              surveillance systems should be completely transparent, dependable, and backed by expert engineering.
            </p>

            <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              What began as a dedicated repair and assembly workbench has grown into the region's preferred tech hub.
              We partner directly with leading component manufacturers (Intel, AMD, NVIDIA, Seagate, HP, Dell, Hikvision, CP PLUS)
              to guarantee 100% authentic hardware, upfront pricing, and zero compromise on reliability.
            </p>

            <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              Whether you need an ultra-fast gaming laptop, an enterprise CAD workstation, chip-level motherboard
              diagnostics, or a multi-camera CCTV security installation, our technicians treat every build with meticulous care.
            </p>

            {/* Credibility highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">10+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Years active</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">15k+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Units deployed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">100%</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Genuine parts</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-primary">4.9★</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Customer trust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION, VISION & VALUES SECTION — EXACT LAYOUT FROM REFERENCE IMAGE 1 */}
      <section className="bg-slate-50/75 dark:bg-card/40 border-y border-border py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs sm:text-sm text-primary font-bold">Our core pillars</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 text-slate-950 dark:text-white uppercase">
              MISSION, VISION & VALUES
            </h2>
            <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg mt-3 font-normal leading-relaxed">
              The fundamental standards that drive every machine we recommend, every circuit we solder, and every customer we support.
            </p>
          </div>

          {/* 3-Card Grid matching Image 1: Blue (Mission), Rose (Vision), Orange (Values) */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* CARD 1: MISSION */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              {/* Header with Fluid Marble Blue Style */}
              <div
                className="h-44 sm:h-48 relative overflow-hidden flex items-center justify-center p-6 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/90 via-blue-600/90 to-indigo-700/90" />
                <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-white tracking-widest uppercase drop-shadow-md">
                  MISSION
                </h3>
              </div>

              {/* Overlapping Hexagonal Badge with Target / Bullseye Icon */}
              <div className="relative -mt-10 sm:-mt-12 flex justify-center z-10">
                <div
                  className="w-20 h-22 sm:w-24 sm:h-26 p-[3px] bg-white dark:bg-card shadow-xl"
                  style={{ clipPath: hexPolygon }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white"
                    style={{ clipPath: hexPolygon }}
                  >
                    <Target className="h-8 w-8 sm:h-9 sm:w-9 text-white stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Card Body with Dark High-Contrast Text */}
              <div className="p-6 sm:p-8 pt-4 flex-1 flex flex-col justify-between text-center">
                <div>
                  <h4 className="font-bold text-lg text-slate-950 dark:text-white">Empowering performance</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed mt-3 font-normal">
                    To put the right computing power and security technology into every client's hands at fair, transparent
                    prices — backed by verified genuine components, expert diagnostics, and rapid responsive service.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-border space-y-2 text-xs sm:text-sm text-left">
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Hand-tested hardware before every delivery</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Transparent pricing with zero hidden fees</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: VISION */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              {/* Header with Fluid Marble Coral/Rose Style */}
              <div
                className="h-44 sm:h-48 relative overflow-hidden flex items-center justify-center p-6 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/90 via-red-600/90 to-pink-600/90" />
                <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-white tracking-widest uppercase drop-shadow-md">
                  VISION
                </h3>
              </div>

              {/* Overlapping Hexagonal Badge with Eye / Focus Icon */}
              <div className="relative -mt-10 sm:-mt-12 flex justify-center z-10">
                <div
                  className="w-20 h-22 sm:w-24 sm:h-26 p-[3px] bg-white dark:bg-card shadow-xl"
                  style={{ clipPath: hexPolygon }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center text-white"
                    style={{ clipPath: hexPolygon }}
                  >
                    <Scan className="h-8 w-8 sm:h-9 sm:w-9 text-white stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Card Body with Dark High-Contrast Text */}
              <div className="p-6 sm:p-8 pt-4 flex-1 flex flex-col justify-between text-center">
                <div>
                  <h4 className="font-bold text-lg text-slate-950 dark:text-white">Future forward innovation</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed mt-3 font-normal">
                    To be the region's benchmark for reliable computing and digital security — leading the curve in
                    high-speed custom builds, smart remote CCTV monitoring, and sustainable component repair.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-border space-y-2 text-xs sm:text-sm text-left">
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Cutting-edge creator & gaming workstations</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Next-gen smart surveillance infrastructure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: VALUES */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              {/* Header with Fluid Marble Amber/Orange Style */}
              <div
                className="h-44 sm:h-48 relative overflow-hidden flex items-center justify-center p-6 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 via-orange-500/90 to-amber-700/90" />
                <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-white tracking-widest uppercase drop-shadow-md">
                  VALUES
                </h3>
              </div>

              {/* Overlapping Hexagonal Badge with Diamond / Gem Icon */}
              <div className="relative -mt-10 sm:-mt-12 flex justify-center z-10">
                <div
                  className="w-20 h-22 sm:w-24 sm:h-26 p-[3px] bg-white dark:bg-card shadow-xl"
                  style={{ clipPath: hexPolygon }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white"
                    style={{ clipPath: hexPolygon }}
                  >
                    <Gem className="h-8 w-8 sm:h-9 sm:w-9 text-white stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Card Body with Dark High-Contrast Text */}
              <div className="p-6 sm:p-8 pt-4 flex-1 flex flex-col justify-between text-center">
                <div>
                  <h4 className="font-bold text-lg text-slate-950 dark:text-white">Uncompromising integrity</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed mt-3 font-normal">
                    We treat every machine as if it were our own. No unnecessary replacements, no inflated quotes —
                    only honest advice, original warranty parts, and dependable post-installation support.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-border space-y-2 text-xs sm:text-sm text-left">
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>100% genuine, sealed manufacturer components</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Customer-first warranty & emergency support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl border border-border bg-card flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-950 dark:text-white uppercase tracking-wider">AUTHORISED PRODUCTS</h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">Direct from official distributors with full manufacturer warranty.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-950 dark:text-white uppercase tracking-wider">QUICK TURNAROUND</h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">Same-day diagnostics and fast repair for laptops and PCs.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-950 dark:text-white uppercase tracking-wider">GUARANTEED WORKMANSHIP</h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">Certified technicians with rigorous quality testing standards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

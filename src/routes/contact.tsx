import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us — Jalvindar Computer" },
      {
        name: "description",
        content: "Get in touch with the Jalvindar Computer team. We're here to help with orders, support and partnerships.",
      },
      { property: "og:title", content: "Contact Us — Jalvindar Computer" },
      { property: "og:description", content: "Reach the Jalvindar Computer support and sales team." },
    ],
  }),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <FadeIn>
        <section
          className="relative overflow-hidden bg-cover bg-center py-14"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/25/48/ee/2548eec8ac03570b81f764ed4787149b.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="relative z-10 container mx-auto px-4 py-14 max-w-3xl text-center text-white">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">Get in touch</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 text-white">We're here to help</h1>
            <p className="text-gray-300 mt-4">
              Questions about a product, an order or returns? Send us a message and our team will respond within
              one business day.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="container mx-auto px-4 py-14 grid md:grid-cols-2 gap-10">
        <FadeIn direction="left">
          <div className="space-y-5">
            {[
              { Icon: Mail, t: "Email", s: "jalvindercomputertechnology@gmail.com" },
              { Icon: Phone, t: "Contact Numbers", s: "+91-9352190208 / +91-7690085046 / 01493-491035" },
              { Icon: MapPin, t: "Office Address", s: "Shop No.E-GF08, Phool Bhag Choke Bhiwadi, Capitalhigh Street Phool Bhag Bhiwadi, Industrial Area, Bhiwadi-301019, Rajasthan" },
              { Icon: Clock, t: "Location & Hours", s: "Jitander · Mon–Sat · 9:00 AM – 8:00 PM" },
            ].map(({ Icon, t, s }, i) => (
              <FadeIn key={t} delay={i * 100} direction="up">
                <div className="flex items-start gap-4 border border-border rounded-lg p-5">
                  <div className="bg-primary/10 text-primary rounded-md p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        <FadeIn direction="right">
          <form onSubmit={submit} className="border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="border border-border rounded-md px-3 py-2 text-sm bg-background outline-none focus:border-primary"
              />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="border border-border rounded-md px-3 py-2 text-sm bg-background outline-none focus:border-primary"
              />
            </div>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background outline-none focus:border-primary"
            />
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </FadeIn>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Globe2, Truck } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — Jalvindar Computer" },
      { name: "description", content: "Learn about Jalvindar Computer, our mission and the team behind your favorite laptop store." },
    ],
  }),
});

function About() {
  return (
    <div>
      <FadeIn>
        <section
          className="relative overflow-hidden bg-cover bg-center py-16"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/25/48/ee/2548eec8ac03570b81f764ed4787149b.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="relative z-10 container mx-auto px-4 py-16 max-w-3xl text-center text-white">
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">About Jalvindar Computer</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 text-white">Powering your work, play and creativity</h1>
            <p className="text-gray-300 mt-5">
              Since 2015 we've helped over a million people find the perfect laptop. We hand-pick every model
              to make sure you only see machines we'd happily recommend to a friend.
            </p>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold text-center">Our Story</h2>
          <p className="text-muted-foreground mt-6 leading-relaxed text-center text-base">
            Jalvindar Computer started in a small garage in 2015 with one simple idea: buying a laptop online should
            feel as confident as shopping in your favorite local store. A decade later, we ship to more than
            70 countries and have become the trusted destination for students, creators, gamers and Fortune
            500 IT teams.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed text-center text-base">
            We work directly with manufacturers like Intel, AMD, NVIDIA and the world's leading laptop
            brands. That means lower prices, genuine products and access to the newest models the moment they
            launch.
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="container mx-auto px-4 pb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              To put the right machine in every person's hands at the right price — backed by honest reviews,
              fair shipping and a support team that actually picks up the phone.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                t: "Curated Selection",
                s: "Every laptop in our catalog is hand-tested by our review team before it goes on sale.",
              },
              {
                t: "Honest Pricing",
                s: "No hidden fees, no inflated MSRPs. The price you see is the price you pay at checkout.",
              },
              {
                t: "Real Support",
                s: "Talk to a real human within 60 seconds, 24 hours a day, 7 days a week.",
              },
            ].map((b, i) => (
              <FadeIn key={b.t} delay={i * 120} direction="up">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold">{b.t}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.s}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="container mx-auto px-4 pb-20">
          <div className="bg-banner rounded-xl p-10 grid md:grid-cols-4 gap-6 text-center">
            {[
              { n: "10+", l: "Years in business" },
              { n: "1M+", l: "Happy customers" },
              { n: "70+", l: "Countries served" },
              { n: "4.8/5", l: "Average review" },
            ].map((s, i) => (
              <FadeIn key={s.l} delay={i * 100} direction="up">
                <div>
                  <p className="text-4xl font-extrabold text-primary">{s.n}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{s.l}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

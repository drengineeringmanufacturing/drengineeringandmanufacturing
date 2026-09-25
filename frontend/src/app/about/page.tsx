import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, FileText, Layers, ShieldCheck, Sparkles, Users, Wrench } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteProvider } from "@/components/SiteProvider";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us | DR Engineering & Manufacturing",
  description:
    "Learn about DR Engineering & Manufacturing — a family-owned engineering firm founded by Danial Raja specializing in Rapid Prototyping, 3D CAD Modeling, 3D Printing, Injection Moulding and more.",
};

const specialtyIcons: Record<string, typeof Wrench> = {
  "Rapid Prototyping": Sparkles,
  "Technical Engineering Drawings": FileText,
  "3D CAD Modeling": Cpu,
  "3D Printing": Layers,
  "Reverse Engineering": Wrench,
  "Design Support": Users,
  "Surface Finishing": ShieldCheck,
  "Small Sheet Metal Fabrication": Wrench,
  "Injection Moulding": Layers,
  "Post Processing": CheckCircle2,
};

export default function AboutPage() {
  const story = site.aboutStory;

  return (
    <SiteProvider>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-obsidian pt-28 text-silver">
        {/* Ambient glows and grid */}
        <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
        <div aria-hidden className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-boeing/20 blur-[150px]" />
        <div aria-hidden className="absolute -right-40 top-80 h-[500px] w-[500px] rounded-full bg-aero/20 blur-[150px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-ping">
              <span className="rounded border border-ping/40 bg-ping/10 px-2 py-0.5">Company Story</span>
              <span>Danial Raja · Founder</span>
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Precision engineering built on <span className="text-ping">vision, passion &amp; family values</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-steel">
              {story.lead}
            </p>
          </div>

          {/* Main Story Grid */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Story Content */}
            <div className="space-y-6 rounded-3xl border border-white/10 bg-midnight/70 p-6 backdrop-blur-xl sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">How it started</h2>
              {story.paragraphs.map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed text-slate-steel">
                  {p}
                </p>
              ))}

              {/* Loyalty & Discount Highlight */}
              <div className="mt-8 rounded-2xl border border-ping/30 bg-gradient-to-r from-boeing/40 via-midnight to-ping/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-ping/20 p-2.5 text-ping">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      Repeat, Loyal &amp; Referred Client Benefits
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-steel">
                      We value long-term partnerships. Repeat, loyal, and referred clients receive exclusive project discounts, accelerated production scheduling, and dedicated engineering review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties & Founder Card */}
            <div className="flex flex-col gap-6">
              {/* Founder Profile Card */}
              <div className="rounded-3xl border border-white/10 bg-midnight/70 p-6 backdrop-blur-xl sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Leadership</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">Danial Raja</h3>
                <p className="font-mono text-xs text-slate-steel">Founder &amp; Principal Engineer</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-steel">
                  Bringing formal engineering qualifications and hands-on manufacturing expertise to reduce waste, lower overheads, and guarantee benchmark aerospace &amp; industrial quality.
                </p>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-steel">Direct email</span>
                  <a href={`mailto:${site.contact.email}`} className="font-mono text-ping hover:underline">
                    {site.contact.email}
                  </a>
                </div>
              </div>

              {/* Our Specialties List */}
              <div className="rounded-3xl border border-white/10 bg-midnight/70 p-6 backdrop-blur-xl sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Core Disciplines</p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">What We Specialize In</h3>

                <ul className="mt-5 space-y-3">
                  {story.specialties.map((item) => {
                    const Icon = specialtyIcons[item] || Wrench;
                    return (
                      <li key={item} className="flex items-center gap-3 text-sm text-silver">
                        <Icon className="h-4 w-4 text-ping shrink-0" />
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-16 rounded-3xl border border-white/15 bg-gradient-to-r from-boeing/60 via-midnight to-aero/40 p-8 text-center sm:p-12">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to engineer your next part?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-steel">
              Get in touch now. We look forward to solving your engineering challenges and adding value to your products.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ping to-aero px-6 py-3 text-sm font-semibold text-obsidian shadow-lg shadow-ping/20 hover:brightness-110 transition-all"
              >
                Contact Us &amp; Request Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#capabilities"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                Explore Capabilities
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SiteProvider>
  );
}

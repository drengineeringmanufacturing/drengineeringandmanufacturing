import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { SiteProvider } from "@/components/SiteProvider";
import { locationsData } from "@/data/locations";

export const metadata: Metadata = {
  title: "Global Locations | Dallas, Texas & Preston, UK | DR Engineering & Manufacturing",
  description:
    "DR Engineering & Manufacturing operates dual global facilities in Dallas, Texas (USA) and Preston, Lancashire (UK) delivering rapid prototyping, 3D CAD modelling, and production runs.",
};

export default function LocationsPage() {
  return (
    <SiteProvider>
      <Navbar />
      <main className="relative min-h-screen bg-obsidian text-silver">
        {/* Main Locations Section with Interactive Map and Tabs */}
        <LocationsSection isFullPage />

        {/* Strategic Global Advantage Section */}
        <section className="relative overflow-hidden bg-navy-950/60 py-20 border-t border-white/10">
          <div aria-hidden className="absolute inset-0 bg-grid opacity-25" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-[0.26em] text-ping">
                Global Operations Advantage
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-white">
                Why Our Dual-Continent Setup Delivers for You
              </h2>
              <p className="mt-4 text-base text-slate-300">
                Operating simultaneously in Dallas, Texas and Preston, UK gives our clients an unmatched combination of local responsiveness and deep manufacturing scale.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-midnight/70 p-6 sm:p-8 backdrop-blur-xl">
                <div className="rounded-xl bg-ping/20 p-3 text-ping w-fit">
                  <Globe2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  Overlapping Timezones
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  With engineering offices active across Central Time (CT) and Greenwich Mean Time (GMT), your requests, CAD revisions, and RFQs are addressed with virtually zero downtime.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-midnight/70 p-6 sm:p-8 backdrop-blur-xl">
                <div className="rounded-xl bg-ping/20 p-3 text-ping w-fit">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  Domestic US &amp; UK Logistics
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Avoid costly customs holds and overseas freight friction. American clients benefit from Dallas distribution, while UK and European clients receive rapid domestic dispatch from Preston.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-midnight/70 p-6 sm:p-8 backdrop-blur-xl">
                <div className="rounded-xl bg-ping/20 p-3 text-ping w-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  Unified Engineering Standards
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Every drawing, prototype, and production run adheres to strict ISO tolerances (±0.05 mm on critical dimensions) overseen directly by founder Danial Raja.
                </p>
              </div>
            </div>

            {/* Direct RFQ Callout */}
            <div className="mt-16 rounded-3xl border border-white/15 bg-gradient-to-r from-boeing/70 via-midnight to-aero/50 p-8 sm:p-12 text-center">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Have a project ready for quotation?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-200">
                Send your files for direct engineering evaluation by our Dallas or Preston teams today.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ping to-aero px-6 py-3 text-sm font-semibold text-obsidian shadow-lg shadow-ping/20 hover:brightness-110 transition-all"
                >
                  Contact Engineering Team <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#capabilities"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  View Capabilities
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}

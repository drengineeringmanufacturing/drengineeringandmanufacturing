import type { Metadata } from "next";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import { SiteProvider } from "@/components/SiteProvider";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us | DR Engineering & Manufacturing",
  description:
    "Get in touch with Danial Raja and the DR Engineering & Manufacturing team. Request a CAD, 3D printing or prototyping quote.",
};

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <SiteProvider>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-obsidian pt-24 text-silver">
        {/* Header Hero */}
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-ping">
              <span className="rounded border border-ping/40 bg-ping/10 px-2 py-0.5">Direct Communication</span>
              <span>Available Mon – Fri</span>
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Contact <span className="text-ping">DR Engineering</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-steel">
              Send us your drawing packs, CAD geometry, or physical samples. Danial Raja and the engineering team will review your requirements and provide an itemized proposal with clear turnaround schedules.
            </p>
          </div>

          {/* Social Media & Contact Quick Cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Primary Email */}
            <a
              href={`mailto:${site.contact.email}`}
              className="group rounded-2xl border border-white/10 bg-midnight/80 p-5 backdrop-blur-xl transition-all hover:border-ping/40 hover:bg-midnight"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-ping/10 p-2 text-ping">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-steel">Direct</span>
              </div>
              <p className="mt-4 text-xs text-slate-steel">Founder Email</p>
              <p className="mt-1 text-sm font-semibold text-white group-hover:text-ping transition-colors break-all">
                {site.contact.email}
              </p>
            </a>

            {/* General Info Email */}
            {site.contact.infoEmail && (
              <a
                href={`mailto:${site.contact.infoEmail}`}
                className="group rounded-2xl border border-white/10 bg-midnight/80 p-5 backdrop-blur-xl transition-all hover:border-ping/40 hover:bg-midnight"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-aero/10 p-2 text-aero">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-steel">General</span>
                </div>
                <p className="mt-4 text-xs text-slate-steel">General Inquiries</p>
                <p className="mt-1 text-sm font-semibold text-white group-hover:text-aero transition-colors break-all">
                  {site.contact.infoEmail}
                </p>
              </a>
            )}

            {/* LinkedIn Card */}
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-midnight/80 p-5 backdrop-blur-xl transition-all hover:border-[#0A66C2]/60 hover:bg-midnight"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-[#0A66C2]/15 p-2 text-[#0A66C2]">
                  <LinkedinIcon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-steel">Social</span>
              </div>
              <p className="mt-4 text-xs text-slate-steel">Professional Network</p>
              <p className="mt-1 flex items-center justify-between text-sm font-semibold text-white group-hover:text-[#0A66C2] transition-colors">
                <span>LinkedIn Company</span>
                <ArrowRight className="h-4 w-4" />
              </p>
            </a>

            {/* Instagram Card */}
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-midnight/80 p-5 backdrop-blur-xl transition-all hover:border-[#E1306C]/60 hover:bg-midnight"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-[#E1306C]/15 p-2 text-[#E1306C]">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-steel">Social</span>
              </div>
              <p className="mt-4 text-xs text-slate-steel">Follow Projects &amp; Reels</p>
              <p className="mt-1 flex items-center justify-between text-sm font-semibold text-white group-hover:text-[#E1306C] transition-colors">
                <span>@drengineering...</span>
                <ArrowRight className="h-4 w-4" />
              </p>
            </a>
          </div>
        </div>

        {/* Embedded RFQ & Interactive Contact Section */}
        <Contact />
      </main>
      <Footer />
    </SiteProvider>
  );
}

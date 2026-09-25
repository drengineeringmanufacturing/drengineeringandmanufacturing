"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { acceptedFormats, site } from "@/data/site";

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

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-boeing via-[#0047B3] to-aero py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-35" />
      <div aria-hidden className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-aero-bright/40 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full bg-navy-900/70 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white/90"
          >
            <span className="rounded border border-white/30 bg-white/10 px-2 py-0.5">05</span>
            <span className="h-px w-8 bg-white/40" />
            Contact &amp; Start a project
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="text-balance mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Have a part in mind? <span className="text-white/90 underline decoration-white/30 underline-offset-8">Let&apos;s engineer it.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-relaxed text-white/80"
          >
            Send a sketch, a photo, a broken part or full CAD drawings directly to our engineering team. We review every request personally and respond with the most efficient manufacturing path.
          </motion.p>
        </div>

        {/* 3 Step Process Bar */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
          {[
            { k: "01", t: "Send Drawings or Files", d: "Email your STEP, STL, DWG, PDF, or sample photos directly." },
            { k: "02", t: "Direct Engineering Review", d: "Danial Raja reviews geometry, material suitability and tolerances." },
            { k: "03", t: "Itemised Quotation", d: "Transparent pricing, manufacturing route, and delivery schedule." },
          ].map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl border border-white/20 bg-white/[0.08] p-5 backdrop-blur-md"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-white/70">{s.k}</span>
              <p className="mt-2 text-base font-semibold text-white">{s.t}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/75">{s.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Direct Contact & Social Cards Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {/* Danial Raja Direct Email */}
          <a
            href={`mailto:${site.contact.email}`}
            className="group rounded-2xl border border-white/25 bg-navy-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-navy-900 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-white/10 p-2.5 text-white group-hover:bg-white/20 transition-colors">
                <Mail className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-slate-400">Founder Direct</p>
            <p className="mt-1 font-display text-base font-semibold text-white group-hover:text-ping transition-colors break-all">
              {site.contact.email}
            </p>
            <p className="mt-2 text-xs text-slate-400">Danial Raja · Technical Director</p>
          </a>

          {/* General Inquiries Email */}
          {site.contact.infoEmail && (
            <a
              href={`mailto:${site.contact.infoEmail}`}
              className="group rounded-2xl border border-white/25 bg-navy-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white hover:bg-navy-900 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-white/10 p-2.5 text-white group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-slate-400">General Enquiries</p>
              <p className="mt-1 font-display text-base font-semibold text-white group-hover:text-aero transition-colors break-all">
                {site.contact.infoEmail}
              </p>
              <p className="mt-2 text-xs text-slate-400">Quotes &amp; RFQ processing</p>
            </a>
          )}

          {/* LinkedIn Profile */}
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/25 bg-navy-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#0A66C2] hover:bg-navy-900 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#0A66C2]/20 p-2.5 text-[#38BDF8] group-hover:bg-[#0A66C2]/40 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-slate-400">LinkedIn Company</p>
            <p className="mt-1 font-display text-base font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
              DR Engineering
            </p>
            <p className="mt-2 text-xs text-slate-400">Professional network &amp; updates</p>
          </a>

          {/* Instagram Profile */}
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/25 bg-navy-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#E1306C] hover:bg-navy-900 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-[#E1306C]/20 p-2.5 text-[#F43F5E] group-hover:bg-[#E1306C]/40 transition-colors">
                <InstagramIcon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-slate-400">Instagram</p>
            <p className="mt-1 font-display text-base font-semibold text-white group-hover:text-[#F43F5E] transition-colors">
              @drengineering...
            </p>
            <p className="mt-2 text-xs text-slate-400">Behind the scenes &amp; builds</p>
          </a>
        </div>

        {/* Accepted Formats Strip */}
        <div className="mt-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/80">
            Accepted Formats for Direct Review
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {acceptedFormats.map((f) => (
              <span
                key={f}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-xs font-medium text-white backdrop-blur-sm"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/70">
            Non-disclosure agreements (NDAs) signed on request before file transfer.
          </p>
        </div>
      </div>
    </section>
  );
}

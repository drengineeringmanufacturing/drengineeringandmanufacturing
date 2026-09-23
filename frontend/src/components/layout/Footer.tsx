"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { PulseDot } from "@/components/ui/PulseDot";
import { services } from "@/data/services";
import { acceptedFormats, navLinks, site } from "@/data/site";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden bg-navy-900 text-silver">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-25" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ping/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <span className="relative block h-16 w-16 shrink-0">
                <Image src="/logo/dr-badge.png" alt={`${site.name} logo`} fill sizes="64px" className="rounded-full bg-white object-contain" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-white">DR Engineering</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-steel">&amp; Manufacturing</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-steel">{site.description}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              <PulseDot color="signal" /> Accepting new projects
            </p>
          </div>

          <FooterCol title="Capabilities" items={services.map((s) => ({ label: s.title, href: "#capabilities" }))} />
          <FooterCol
            title="Company"
            items={[...navLinks.map((l) => ({ label: l.label, href: `#${l.id}` })), { label: "Start a project", href: "#contact" }]}
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ping">Accepted formats</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {acceptedFormats.map((f) => (
                <span key={f} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-silver">
                  {f}
                </span>
              ))}
            </div>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="mt-6 block text-sm text-white hover:text-ping">
                {site.contact.email}
              </a>
            )}
          </div>
        </div>

        {/* Giant wordmark */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
          aria-hidden
          className="pointer-events-none mt-20 select-none bg-gradient-to-b from-white/15 to-white/0 bg-clip-text text-center whitespace-nowrap font-display text-[14vw] font-bold leading-none tracking-tighter text-transparent lg:text-[12.5rem]"
        >
          DR ENG&amp;MFG
        </motion.p>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-steel sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">Designed · Engineered · Manufactured</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-silver transition-colors hover:border-ping/50 hover:text-white"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ping">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <a href={it.href} className="group inline-flex items-center text-sm text-slate-steel transition-colors hover:text-white">
              <span className="h-px w-0 bg-ping transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

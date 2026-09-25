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

          <FooterCol title="Capabilities" items={services.map((s) => ({ label: s.title, href: "/#capabilities" }))} />
          <FooterCol
            title="Company"
            items={[
              { label: "Contact Us", href: "/contact" },
              { label: "About Us", href: "/about" },
              { label: "Capabilities", href: "/#capabilities" },
              { label: "Work", href: "/#work" },
              { label: "Process", href: "/#process" },
              { label: "Materials", href: "/#materials" },
              { label: "Start a project", href: "/contact" },
            ]}
          />
          <FooterCol
            title="Social Media"
            items={[
              {
                label: "LinkedIn",
                href: site.socials.linkedin,
                external: true,
                icon: <LinkedinIcon className="h-4 w-4" />,
              },
              {
                label: "Instagram",
                href: site.socials.instagram,
                external: true,
                icon: <InstagramIcon className="h-4 w-4" />,
              },
            ]}
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
            <div className="mt-6 space-y-1.5">
              <a href={`mailto:${site.contact.email}`} className="block text-sm text-white hover:text-ping transition-colors">
                {site.contact.email}
              </a>
              {site.contact.infoEmail && (
                <a href={`mailto:${site.contact.infoEmail}`} className="block text-xs text-slate-steel hover:text-ping transition-colors">
                  {site.contact.infoEmail}
                </a>
              )}
            </div>
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
          <div className="flex items-center gap-4">
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DR Engineering on LinkedIn"
              className="text-slate-steel transition-colors hover:text-ping"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DR Engineering on Instagram"
              className="text-slate-steel transition-colors hover:text-ping"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <span className="font-mono uppercase tracking-[0.2em]">Designed · Engineered · Manufactured</span>
          </div>
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

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean; icon?: React.ReactNode }[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ping">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              target={it.external ? "_blank" : undefined}
              rel={it.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 text-sm text-slate-steel transition-colors hover:text-white"
            >
              {it.icon ? (
                <span className="text-slate-steel transition-colors group-hover:text-ping">{it.icon}</span>
              ) : (
                <span className="h-px w-0 bg-ping transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
              )}
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}


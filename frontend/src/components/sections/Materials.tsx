"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Thermometer, Dumbbell } from "lucide-react";
import Image from "next/image";
import { useSite } from "@/components/SiteProvider";
import { PulseDot } from "@/components/ui/PulseDot";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { materials } from "@/data/materials";

export function Materials() {
  const { openHud } = useSite();

  return (
    <section id="materials" className="relative overflow-hidden bg-gradient-to-b from-obsidian via-navy-950 to-obsidian py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 mask-fade-y" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04"
          eyebrow="Material library"
          title={
            <>
              The right polymer for the job — <span className="text-slate-steel">not just the one on the spool.</span>
            </>
          }
          description="Commodity to engineering grades for printing and moulding. Tap any material to open its full spec sheet in the HUD."
        />

        <div className="mt-14 grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] sm:aspect-[21/9] lg:aspect-[21/7]"
          >
            <Image
              src="/products/filament-range.jpg"
              alt="Spools of PLA, PETG, ABS, ASA and TPU filament"
              fill
              sizes="(min-width:1280px) 1216px, 100vw"
              className="object-cover object-[30%_40%] sm:object-[50%_45%] transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian from-25% via-obsidian/70 via-55% to-obsidian/0 sm:bg-gradient-to-r sm:from-0% sm:via-50% sm:from-obsidian sm:via-obsidian/75 sm:to-obsidian/0" />
            <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-60" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-obsidian/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-silver backdrop-blur">
              <PulseDot color="ping" /> Library · {materials.length} grades loaded
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:inset-y-0 sm:right-auto sm:flex sm:max-w-lg sm:flex-col sm:justify-end sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Why it matters</p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug text-white sm:text-3xl">
                UV, heat, chemicals, flex — material choice decides whether a part lasts a week or a decade.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {materials.map((m, i) => (
              <motion.button
                key={m.id}
                onClick={() => openHud(m.id)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 110, damping: 18 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-midnight/70 p-4 text-left backdrop-blur transition-colors hover:border-ping/40"
              >
                <span
                  aria-hidden
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
                  style={{ background: m.swatch }}
                />
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full ring-2 ring-white/15" style={{ background: m.swatch }} />
                    <span className="font-display text-lg font-semibold text-white">{m.name}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-steel transition-all group-hover:rotate-45 group-hover:text-ping" />
                </div>
                <p className="relative mt-1 truncate text-xs text-slate-steel">{m.family}</p>
                <div className="relative mt-4 flex items-center gap-3 font-mono text-[11px] text-silver">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 text-ping" /> {m.tensile} MPa
                  </span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-ping" /> {m.hdt}°C
                  </span>
                </div>
                <div className="relative mt-3 flex gap-1">
                  {m.fdm && <span className="rounded bg-[#2F9BEA]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#7cc4fa]">Print</span>}
                  {m.moulding && <span className="rounded bg-[#CF7A17]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f0b56a]">Mould</span>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

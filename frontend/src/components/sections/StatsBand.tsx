"use client";

import { motion } from "framer-motion";
import { Counter } from "@/components/ui/Counter";
import { bandStats } from "@/data/site";
import { services } from "@/data/services";

export function StatsBand() {
  const ticker = [...services, ...services];
  return (
    <section aria-label="Key figures" className="relative border-y border-white/[0.06] bg-gradient-to-b from-navy-950 to-obsidian">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {bandStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 90, damping: 18 }}
            className="group relative border-white/[0.06] py-8 pr-4 odd:border-r sm:py-10 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ping/80">{s.code}</p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
            </p>
            <p className="mt-2 max-w-[16rem] text-sm text-slate-steel">{s.label}</p>
            <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-ping to-transparent transition-all duration-700 group-hover:w-2/3" />
          </motion.div>
        ))}
      </div>

      <div className="relative overflow-hidden border-t border-white/[0.06] py-4 mask-fade-x">
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {ticker.map((s, i) => (
            <span key={`${s.id}-${i}`} className="flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-slate-steel">
              <span className="text-ping/70">{s.code}</span>
              <span className="text-silver">{s.title}</span>
              <span aria-hidden className="h-1 w-1 rotate-45 bg-ping/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

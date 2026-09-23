"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Counter } from "@/components/ui/Counter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PulseDot } from "@/components/ui/PulseDot";
import { heroStats } from "@/data/site";
import { TelemetryConsole } from "./hero/TelemetryConsole";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const line: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { type: "spring", stiffness: 70, damping: 16 } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const consoleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden bg-obsidian">
      {/* Background system */}
      <motion.div aria-hidden style={{ y: gridY }} className="absolute inset-0 -z-10 bg-grid mask-radial" />
      <motion.div aria-hidden style={{ y: glowY }} className="absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[640px] w-[640px] rounded-full bg-boeing/40 blur-[140px]" />
        <div className="absolute right-[-10%] top-[20%] h-[520px] w-[520px] rounded-full bg-aero-bright/20 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-[420px] w-[720px] rounded-full bg-navy-900/80 blur-[120px]" />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-full animate-scan">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-ping/40 to-transparent" />
          <div className="h-24 w-full bg-gradient-to-b from-ping/[0.05] to-transparent" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pb-24 lg:pt-32">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show" style={{ opacity: fade }} className="relative min-w-0">
          <motion.div variants={item}>
            <a
              href="#lab"
              className="group inline-flex items-center gap-3 rounded-full border border-ping/20 bg-ping/[0.06] py-1.5 pl-3 pr-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ping backdrop-blur-md transition-colors hover:border-ping/40"
            >
              <PulseDot color="signal" />
              <span className="text-signal">Workshop online</span>
              <span className="hidden h-3 w-px bg-ping/30 sm:block" />
              <span className="hidden text-silver sm:inline">4 builds in progress</span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-ping/15 transition-transform group-hover:translate-x-0.5">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          </motion.div>

          <h1 className="mt-7 font-display text-[2.55rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[clamp(2.6rem,4.1vw,3.6rem)] lg:whitespace-nowrap">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={line} className="block">
                Precision engineered.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                variants={line}
                className="block bg-gradient-to-r from-ping via-aero-bright to-[#7aa7ff] bg-clip-text text-transparent"
              >
                Rapidly manufactured.
              </motion.span>
            </span>
          </h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-slate-steel sm:text-lg">
            From a napkin sketch or a broken part to a production run — DR Engineering &amp; Manufacturing delivers
            <span className="text-silver"> 3D CAD modelling, technical drawings, reverse engineering, 3D printing, rapid prototyping, injection moulding</span> and
            <span className="text-silver"> post-processing</span> under one roof.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton href="#contact">
              Start a Project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#capabilities" variant="ghost">
              Explore Capabilities
            </MagneticButton>
          </motion.div>

          <motion.dl variants={item} className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10">
            {heroStats.map((s) => (
              <div key={s.label} className="px-3 py-4 first:pl-0 sm:px-5">
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-steel">{s.label}</dt>
                <dd className="mt-1.5 whitespace-nowrap font-display text-xl font-semibold text-white sm:text-3xl">
                  <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Console */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.35 }}
          style={{ y: consoleY, transformPerspective: 1200 }}
          className="relative min-w-0"
        >
          <TelemetryConsole />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#capabilities"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-steel lg:flex"
      >
        Scroll to explore
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4 text-ping" />
        </motion.span>
      </motion.a>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ping/30 to-transparent" />
    </section>
  );
}

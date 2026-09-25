"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps, type ProcessStep } from "@/data/process";
import { acceptedFormats } from "@/data/site";

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="relative overflow-hidden bg-white py-24 text-navy-950 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid-light opacity-70 mask-fade-y" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            tone="light"
            index="03"
            eyebrow="How we work"
            title={
              <>
                One pipeline. <span className="text-aero">Six precise stages.</span>
              </>
            }
            description="A single engineering thread runs from your first message to parts on your bench — so nothing is lost in hand-offs between designers, printers and finishers."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 rounded-2xl border border-slate-200 bg-paper p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-aero">Files we accept</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {acceptedFormats.map((f) => (
                <span key={f} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs text-navy-950">
                  .{f.toLowerCase()}
                </span>
              ))}
              <span className="rounded-md border border-dashed border-slate-300 px-2.5 py-1 font-mono text-xs text-slate-500">+ sketches & photos</span>
            </div>
          </motion.div>
        </div>

        <ol ref={listRef} className="relative">
          {/* rail */}
          <div aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-slate-200" />
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-gradient-to-b from-boeing via-aero to-aero-bright"
          />
          {processSteps.map((s, i) => (
            <Step key={s.id} step={s} i={i} total={processSteps.length} progress={progress} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({
  step,
  i,
  total,
  progress,
}: {
  step: ProcessStep;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const threshold = i / (total - 1);
  const lit = useTransform(progress, [Math.max(0, threshold - 0.08), threshold], [0, 1]);
  const bg = useTransform(lit, [0, 1], ["#ffffff", "#0033A0"]);
  const color = useTransform(lit, [0, 1], ["#94a3b8", "#ffffff"]);
  const border = useTransform(lit, [0, 1], ["#cbd5e1", "#0066CC"]);
  const ring = useTransform(lit, [0, 1], ["0 0 0 0px rgba(0,102,204,0)", "0 0 0 6px rgba(0,102,204,0.15)"]);

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="relative pb-10 pl-16 last:pb-0"
    >
      <motion.span
        style={{ backgroundColor: bg, color, borderColor: border, boxShadow: ring }}
        className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full border font-mono text-xs font-semibold"
      >
        {step.index}
      </motion.span>

      <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,34,68,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-aero/40 hover:shadow-[0_30px_60px_-35px_rgba(0,51,160,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-navy-950">{step.title}</h3>
          <span className="rounded-full bg-aero/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-aero">{step.window}</span>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">{step.body}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {step.outputs.map((o) => (
            <span key={o} className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-navy-900 ring-1 ring-slate-200">
              {o}
            </span>
          ))}
        </div>
      </div>
    </motion.li>
  );
}

"use client";

import { AnimatePresence, motion, useDragControls, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Gauge, Radar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { PulseDot } from "@/components/ui/PulseDot";
import { getMaterial, materials, type Material } from "@/data/materials";
import { cn } from "@/lib/cn";

type Units = "metric" | "imperial";

interface MetricDef {
  id: string;
  label: string;
  value: (m: Material, u: Units) => string;
  pct: (m: Material) => number;
}

const METRICS: MetricDef[] = [
  {
    id: "tensile",
    label: "Tensile strength",
    value: (m, u) => (u === "metric" ? `${m.tensile} MPa` : `${Math.round(m.tensile * 145.04).toLocaleString("en-GB")} psi`),
    pct: (m) => m.tensile / 80,
  },
  {
    id: "hdt",
    label: "Heat deflection",
    value: (m, u) => (u === "metric" ? `${m.hdt} °C` : `${Math.round((m.hdt * 9) / 5 + 32)} °F`),
    pct: (m) => m.hdt / 160,
  },
  {
    id: "density",
    label: "Density",
    value: (m, u) => (u === "metric" ? `${m.density.toFixed(2)} g/cm³` : `${(m.density * 0.036127).toFixed(4)} lb/in³`),
    pct: (m) => m.density / 1.4,
  },
  { id: "flexibility", label: "Flexibility", value: (m) => `${m.flexibility}/10`, pct: (m) => m.flexibility / 10 },
  { id: "uv", label: "UV resistance", value: (m) => `${m.uv}/10`, pct: (m) => m.uv / 10 },
  { id: "chemical", label: "Chemical resistance", value: (m) => `${m.chemical}/10`, pct: (m) => m.chemical / 10 },
  { id: "printability", label: "Processability", value: (m) => `${m.printability}/10`, pct: (m) => m.printability / 10 },
];

const avg = (fn: (m: Material) => number) => materials.reduce((a, m) => a + fn(m), 0) / materials.length;
const AVERAGES = Object.fromEntries(METRICS.map((d) => [d.id, avg(d.pct)]));

export function SpecHud() {
  const { hudOpen, hudMaterial, openHud, closeHud, setHudMaterial, requestQuote } = useSite();
  const [units, setUnits] = useState<Units>("metric");
  const [hidden, setHidden] = useState<string[]>([]);
  const dragControls = useDragControls();
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.7));
  const m = getMaterial(hudMaterial);

  useEffect(() => {
    if (!hudOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeHud();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hudOpen, closeHud]);

  const toggle = (id: string) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!hudOpen && pastHero && (
          <motion.button
            key="hud-trigger"
            onClick={() => openHud()}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            aria-label="Open Spec HUD — material inspector"
            className="group fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-ping/30 bg-midnight/85 py-2 pl-2 pr-2 shadow-[0_20px_60px_-15px_rgba(0,102,204,0.8)] backdrop-blur-xl sm:pr-5"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-boeing to-aero text-white">
              <span className="absolute inset-0 animate-ping rounded-full bg-ping/30 [animation-duration:2.4s]" />
              <Radar className="relative h-5 w-5" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block font-mono text-[9.5px] uppercase tracking-[0.24em] text-ping">Spec HUD</span>
              <span className="block text-sm font-semibold text-white">Inspect materials</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {hudOpen && (
          <>
            <motion.div
              key="hud-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeHud}
              className="fixed inset-0 z-[85] bg-obsidian/60 backdrop-blur-sm"
            />
            <motion.aside
              key="hud-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Spec HUD material inspector"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              drag="x"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 120 || info.velocity.x > 600) closeHud();
              }}
              className="fixed right-0 top-0 z-[90] flex h-dvh w-full flex-col border-l border-ping/15 bg-midnight/95 shadow-[-40px_0_120px_-40px_rgba(0,102,204,0.6)] backdrop-blur-2xl sm:w-[460px]"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-fine opacity-60" />

              {/* Header */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="relative flex touch-none items-center justify-between border-b border-white/[0.06] px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-ping/30 bg-ping/10 text-ping">
                    <Gauge className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Spec HUD</p>
                    <p className="text-sm font-semibold text-white">Material inspector</p>
                  </div>
                </div>
                <button
                  onClick={closeHud}
                  aria-label="Close Spec HUD"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-silver transition-colors hover:border-ping/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="hud-scroll relative flex-1 overflow-y-auto px-5 pb-8">
                {/* Material tabs */}
                <div className="-mx-5 overflow-x-auto px-5 pt-4">
                  <div className="flex w-max gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
                    {materials.map((mat) => {
                      const on = mat.id === m.id;
                      return (
                        <button
                          key={mat.id}
                          onClick={() => setHudMaterial(mat.id)}
                          className={cn("relative rounded-full px-3 py-1.5 font-mono text-xs transition-colors", on ? "text-white" : "text-slate-steel hover:text-silver")}
                        >
                          {on && (
                            <motion.span
                              layoutId="hud-mat"
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-boeing to-aero"
                              transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            />
                          )}
                          <span className="relative">{mat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Identity */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 flex items-center gap-4"
                  >
                    <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/10 bg-obsidian">
                      <span className="h-8 w-8 rounded-full shadow-[0_0_30px_currentColor]" style={{ background: m.swatch, color: m.swatch }} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-3xl font-semibold text-white">{m.name}</p>
                      <p className="truncate text-sm text-slate-steel">{m.family}</p>
                      <div className="mt-1.5 flex gap-1">
                        {m.fdm && <span className="rounded bg-[#2F9BEA]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#7cc4fa]">3D print</span>}
                        {m.moulding && <span className="rounded bg-[#CF7A17]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#f0b56a]">Moulding</span>}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-steel">Units</p>
                  <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
                    {(["metric", "imperial"] as Units[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnits(u)}
                        className={cn("relative rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]", units === u ? "text-white" : "text-slate-steel")}
                      >
                        {units === u && <motion.span layoutId="hud-units" className="absolute inset-0 rounded-full bg-white/10" />}
                        <span className="relative">{u}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-steel">Toggle metrics</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {METRICS.map((d) => {
                      const on = !hidden.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          onClick={() => toggle(d.id)}
                          aria-pressed={on}
                          className={cn(
                            "rounded-md border px-2 py-1 text-[11px] transition-colors",
                            on ? "border-ping/40 bg-ping/10 text-white" : "border-white/10 text-slate-steel line-through decoration-slate-steel/50"
                          )}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Readouts */}
                <div className="mt-6 space-y-2">
                  <AnimatePresence initial={false}>
                    {METRICS.filter((d) => !hidden.includes(d.id)).map((d) => {
                      const pct = Math.min(1, d.pct(m));
                      const avgPct = Math.min(1, AVERAGES[d.id]);
                      return (
                        <motion.div
                          key={d.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl border border-white/[0.06] bg-obsidian/60 px-4 py-3">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs text-slate-steel">{d.label}</span>
                              <span className="font-mono text-sm tabular-nums text-white">{d.value(m, units)}</span>
                            </div>
                            <div className="relative mt-2.5 h-1.5 rounded-full bg-white/[0.06]">
                              <motion.div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-aero to-ping"
                                initial={false}
                                animate={{ width: `${pct * 100}%` }}
                                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                              />
                              <span
                                title="Library average"
                                className="absolute -top-1 h-3.5 w-0.5 rounded bg-silver/70"
                                style={{ left: `${avgPct * 100}%` }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <p className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-steel">
                    <span className="h-3 w-0.5 rounded bg-silver/70" /> Library average · typical values, indicative only
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-boeing/30 to-transparent p-4">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ping">
                    <PulseDot color="ping" /> Best for
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-silver">{m.bestFor}</p>
                </div>
              </div>

              <div className="relative border-t border-white/[0.06] p-5">
                <button
                  onClick={() => requestQuote(m.fdm ? "printing" : "moulding")}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-boeing to-aero px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(0,102,204,0.9)] transition-transform hover:scale-[1.01]"
                >
                  Quote a part in {m.name} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

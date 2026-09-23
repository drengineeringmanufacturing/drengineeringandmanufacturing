"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Box, Crosshair, Factory, Printer, Radar } from "lucide-react";
import { useEffect, useState } from "react";
import { PulseDot } from "@/components/ui/PulseDot";
import { cn } from "@/lib/cn";
import { IsoPart, type PartMode } from "./IsoPart";

const TABS: { id: PartMode; label: string; icon: typeof Box }[] = [
  { id: "cad", label: "CAD", icon: Box },
  { id: "print", label: "Print", icon: Printer },
  { id: "mould", label: "Mould", icon: Factory },
];

const LAYERS = 380;
const MOULD_CYCLE = 36;

interface Metric {
  label: string;
  value: string;
  unit?: string;
  status?: "ok" | "live" | "warn";
}

function metricsFor(mode: PartMode, t: number): Metric[] {
  const s = (k: number, a: number) => Math.sin(t * k) * a;
  if (mode === "cad") {
    return [
      { label: "Features", value: "42", unit: "ops" },
      { label: "Tolerance", value: "±0.05", unit: "mm", status: "ok" },
      { label: "Est. mass", value: "38.4", unit: "g" },
      { label: "Rebuild", value: (0.82 + s(0.31, 0.05)).toFixed(2), unit: "s", status: "live" },
    ];
  }
  if (mode === "print") {
    return [
      { label: "Nozzle", value: (245 + s(0.7, 0.6)).toFixed(1), unit: "°C", status: "live" },
      { label: "Bed", value: (80 + s(0.23, 0.2)).toFixed(1), unit: "°C", status: "live" },
      { label: "Speed", value: (180 + s(0.18, 12)).toFixed(0), unit: "mm/s" },
      { label: "Flow", value: (100 + s(0.41, 1.4)).toFixed(1), unit: "%", status: "ok" },
    ];
  }
  return [
    { label: "Melt", value: (232 + s(0.5, 0.8)).toFixed(1), unit: "°C", status: "live" },
    { label: "Pressure", value: (850 + s(0.37, 9)).toFixed(0), unit: "bar", status: "live" },
    { label: "Clamp", value: "80", unit: "t" },
    { label: "Cycle", value: "28.4", unit: "s", status: "ok" },
  ];
}

export function TelemetryConsole() {
  const [mode, setMode] = useState<PartMode>("cad");
  const [solid, setSolid] = useState(true);
  const [t, setT] = useState(0);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const id = window.setInterval(() => {
      setT((v) => v + 1);
      setClock(new Date().toISOString().slice(11, 19));
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  const layer = (t * 2) % (LAYERS + 40);
  const printLayer = Math.min(layer, LAYERS);
  const printHeight = (printLayer / LAYERS) * 70;
  const printProgress = printLayer / LAYERS;
  const etaSec = Math.round((LAYERS - printLayer) * 9.5);

  const phase = t % MOULD_CYCLE;
  const lift = phase > 20 && phase < 32 ? 1 : 0;
  const cycles = 1284 + Math.floor(t / MOULD_CYCLE);

  const metrics = metricsFor(mode, t);

  return (
    <div className="relative">
      {/* outer glow */}
      <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(0,102,204,0.35),transparent)] blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-ping/15 bg-midnight/75 shadow-[0_40px_120px_-40px_rgba(0,51,160,0.9)] backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-ping/30 bg-ping/10 text-ping">
              <Radar className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-steel">Build Telemetry</p>
              <p className="truncate font-display text-sm font-semibold text-white">Cell 02 · Pivot Mount REV C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span className="inline-flex items-center gap-1.5 text-signal">
              <PulseDot color="signal" /> Live
            </span>
            <span className="hidden whitespace-nowrap tabular-nums text-slate-steel sm:inline" suppressHydrationWarning>
              {clock} UTC
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-5">
          <div role="tablist" aria-label="Telemetry mode" className="relative flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {TABS.map((tab) => {
              const active = tab.id === mode;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(tab.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors sm:px-4 sm:tracking-[0.16em]",
                    active ? "text-white" : "text-slate-steel hover:text-silver"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="console-tab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-boeing to-aero shadow-[0_0_20px_rgba(0,102,204,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <tab.icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View toggle (wireframe / solid) */}
          <button
            onClick={() => setSolid((v) => !v)}
            aria-pressed={solid}
            aria-label="Toggle solid shading"
            className="group flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-steel"
          >
            <span className={cn("hidden transition-colors sm:inline", !solid && "text-ping")}>Wire</span>
            <span className={cn("relative h-5 w-9 rounded-full border transition-colors", solid ? "border-aero/60 bg-aero/30" : "border-white/15 bg-white/5")}>
              <motion.span
                className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                animate={{ left: solid ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </span>
            <span className={cn("hidden transition-colors sm:inline", solid && "text-ping")}>Solid</span>
          </button>
        </div>

        {/* Visual */}
        <div className="relative mx-4 mt-3 aspect-[5/4] overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidian/70 sm:mx-5 sm:aspect-[16/12]">
          <div aria-hidden className="absolute inset-0 bg-grid-fine" />
          {/* radar */}
          <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-ping/10" />
            <div className="absolute inset-[16%] rounded-full border border-ping/10" />
            <div className="absolute inset-[32%] rounded-full border border-ping/10" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-ping/10" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-ping/10" />
            <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(56,189,248,0.18)_36deg,transparent_64deg)]" />
          </div>

          {/* HUD corners */}
          {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-l border-b", "right-2 bottom-2 border-r border-b"].map((c) => (
            <span key={c} aria-hidden className={cn("absolute h-4 w-4 border-ping/60", c)} />
          ))}

          <div className="absolute inset-[6%]">
            <IsoPart mode={mode} solid={solid} height={printHeight} lift={lift} />
          </div>

          <div className="pointer-events-none absolute left-7 top-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-slate-steel">
            <p className="text-ping">
              {mode === "cad" ? "Model view · ISO" : mode === "print" ? "FDM · PETG-CF" : "Mould tool T-02"}
            </p>
            <p>{mode === "cad" ? "Fully defined" : mode === "print" ? `Layer ${printLayer}/${LAYERS}` : `Shot ${cycles.toLocaleString("en-GB")}`}</p>
          </div>
          <div className="pointer-events-none absolute bottom-5 right-7 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-steel">
            <Crosshair className="h-3 w-3 text-ping" /> X 92.00 · Y 62.00 · Z 35.00
          </div>
          <div className="pointer-events-none absolute bottom-5 left-7 hidden items-center gap-2 font-mono text-[10px] text-slate-steel sm:flex">
            <span className="h-px w-10 bg-slate-steel" />
            50 mm
          </div>
        </div>

        {/* Metrics */}
        <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-steel">
                    {m.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-ping shadow-[0_0_8px_#38bdf8]" />}
                    {m.status === "ok" && <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#10b981]" />}
                    {m.label}
                  </p>
                  <p className="mt-1 font-mono text-lg font-medium tabular-nums text-white">
                    {m.value}
                    {m.unit && <span className="ml-1 text-[11px] text-slate-steel">{m.unit}</span>}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Progress / status line */}
          <div className="mt-3 flex items-center gap-3">
            <Activity className="h-3.5 w-3.5 shrink-0 text-ping" />
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-aero to-ping"
                animate={{
                  width:
                    mode === "print"
                      ? `${printProgress * 100}%`
                      : mode === "mould"
                        ? `${(phase / MOULD_CYCLE) * 100}%`
                        : "100%",
                }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>
            <span className="w-28 text-right font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-slate-steel">
              {mode === "print"
                ? printLayer >= LAYERS
                  ? "Complete"
                  : `ETA ${String(Math.floor(etaSec / 60)).padStart(2, "0")}:${String(etaSec % 60).padStart(2, "0")}`
                : mode === "mould"
                  ? lift
                    ? "Ejecting"
                    : "Packing"
                  : "DFM ✓ passed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

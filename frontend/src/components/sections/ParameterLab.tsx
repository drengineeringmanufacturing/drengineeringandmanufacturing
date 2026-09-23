"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { Clock, Layers, Lightbulb, PanelRightOpen, ShieldCheck, Sparkles, Weight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useSite } from "@/components/SiteProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { materials } from "@/data/materials";
import { estimate, type FinishLevel, type LabProcess, type LayerHeight } from "@/lib/estimator";
import { cn } from "@/lib/cn";
import { CostCurve } from "./lab/CostCurve";

const PROCESSES: { id: LabProcess; label: string; sub: string }[] = [
  { id: "fdm", label: "3D Printing", sub: "FDM · batch" },
  { id: "moulding", label: "Injection Moulding", sub: "Tooling + runs" },
];
const LAYERS: LayerHeight[] = [0.12, 0.2, 0.28];
const FINISHES: { id: FinishLevel; label: string }[] = [
  { id: "raw", label: "Raw" },
  { id: "sanded", label: "Sanded" },
  { id: "painted", label: "Painted" },
];

const posToQty = (pos: number) => {
  const q = 10 ** ((pos / 1000) * 4);
  if (q < 10) return Math.round(q);
  if (q < 100) return Math.round(q);
  if (q < 1000) return Math.round(q / 5) * 5;
  return Math.round(q / 50) * 50;
};

function LiveNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const text = useTransform(spring, (v) =>
    v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span>{text}</motion.span>;
}

function Segmented<T extends string | number>({
  id,
  options,
  value,
  onChange,
  render,
}: {
  id: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => ReactNode;
}) {
  return (
    <div role="radiogroup" className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={String(o)}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={cn("relative rounded-lg px-3 py-2 text-sm transition-colors", on ? "text-white" : "text-slate-steel hover:text-silver")}
          >
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-lg border border-ping/30 bg-aero/25"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{render(o)}</span>
          </button>
        );
      })}
    </div>
  );
}

function Label({ children, value }: { children: ReactNode; value?: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-slate-steel">
      <span>{children}</span>
      {value && <span className="text-sm normal-case tracking-normal text-white">{value}</span>}
    </div>
  );
}

export function ParameterLab() {
  const { openHud } = useSite();
  const [process, setProcess] = useState<LabProcess>("fdm");
  const [materialId, setMaterialId] = useState("petg");
  const [infill, setInfill] = useState(35);
  const [layer, setLayer] = useState<LayerHeight>(0.2);
  const [finish, setFinish] = useState<FinishLevel>("sanded");
  const [qPos, setQPos] = useState(600);

  const quantity = posToQty(qPos);
  const allowed = materials.filter((m) => (process === "fdm" ? m.fdm : m.moulding));
  const material = allowed.find((m) => m.id === materialId) ?? allowed[0];
  const est = estimate({ process, material, infill, layer, finish, quantity });

  const ratio = est.altCost / est.unitCost;
  const be = est.breakEven;
  let verdict: { tone: "print" | "mould" | "even"; text: string };
  if (!Number.isFinite(be)) {
    verdict = { tone: "print", text: "3D printing stays the most economical route across this whole volume range." };
  } else if (quantity < be * 0.8) {
    verdict = {
      tone: "print",
      text: `At ${quantity.toLocaleString("en-GB")} units, printing runs ~${(process === "fdm" ? ratio : 1 / ratio).toFixed(1)}× lower unit cost than moulding — no tooling to amortise.`,
    };
  } else if (quantity > be * 1.2) {
    verdict = {
      tone: "mould",
      text: `At ${quantity.toLocaleString("en-GB")} units the mould pays for itself — moulded parts come in ~${(process === "moulding" ? ratio : 1 / ratio).toFixed(1)}× cheaper per unit.`,
    };
  } else {
    verdict = {
      tone: "even",
      text: "You're right at break-even. We'd typically print a bridge batch while production tooling is cut.",
    };
  }

  const kpis = [
    { icon: ShieldCheck, label: "Strength index", value: est.strength, unit: "/100", bar: est.strength },
    { icon: Sparkles, label: "Surface finish", value: est.surface, unit: "/100", bar: est.surface },
    { icon: Clock, label: "Est. lead time", value: est.leadDays, unit: "days" },
    { icon: Weight, label: "Part mass", value: est.mass, unit: "g", decimals: 1 },
  ];

  return (
    <section id="lab" className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40 mask-fade-y" />
      <div aria-hidden className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-aero/20 blur-[150px]" />
      <div aria-hidden className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-boeing/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          eyebrow="Parameter Lab"
          title={
            <>
              Tune a build. <span className="text-slate-steel">Watch the numbers move.</span>
            </>
          }
          description="Explore how process, material, infill and volume trade off against strength, finish, lead time and unit cost for a reference 42 cm³ bracket. Indicative only — every real quote is engineer-reviewed."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[400px_1fr]">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="rounded-3xl border border-white/[0.08] bg-midnight/70 p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ping">
                <Layers className="h-3.5 w-3.5" /> Build parameters
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-steel">REF-42</span>
            </div>

            <div className="mt-6">
              <Label>Process</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROCESSES.map((p) => {
                  const on = p.id === process;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProcess(p.id)}
                      aria-pressed={on}
                      className={cn(
                        "relative rounded-xl border px-3 py-3 text-left transition-colors",
                        on ? "border-ping/40" : "border-white/10 hover:border-white/20"
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="lab-process"
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-boeing/70 to-aero/40"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative block text-sm font-semibold text-white">{p.label}</span>
                      <span className="relative block font-mono text-[10px] uppercase tracking-[0.16em] text-slate-steel">{p.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <Label value={material.name}>Material</Label>
              <div className="flex flex-wrap gap-1.5">
                {allowed.map((m) => {
                  const on = m.id === material.id;
                  return (
                    <motion.button
                      key={m.id}
                      layout
                      onClick={() => setMaterialId(m.id)}
                      aria-pressed={on}
                      whileTap={{ scale: 0.94 }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                        on ? "border-ping/60 bg-ping/10 text-white" : "border-white/10 text-slate-steel hover:border-white/25 hover:text-silver"
                      )}
                    >
                      <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white/10" style={{ background: m.swatch }} />
                      {m.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {process === "fdm" && (
                <motion.div
                  key="fdm-controls"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-6">
                    <Label value={`${infill}%`}>Infill density</Label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={infill}
                      onChange={(e) => setInfill(Number(e.target.value))}
                      className="hud-range"
                      style={{ ["--fill" as string]: `${((infill - 10) / 90) * 100}%` }}
                      aria-label="Infill density"
                    />
                  </div>
                  <div className="mt-5">
                    <Label>Layer height</Label>
                    <Segmented id="layer" options={LAYERS} value={layer} onChange={setLayer} render={(v) => <span className="font-mono">{v.toFixed(2)} mm</span>} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <Label>Finish</Label>
              <Segmented
                id="finish"
                options={FINISHES.map((f) => f.id)}
                value={finish}
                onChange={setFinish}
                render={(v) => FINISHES.find((f) => f.id === v)?.label}
              />
            </div>

            <div className="mt-6">
              <Label value={`${quantity.toLocaleString("en-GB")} units`}>Quantity</Label>
              <input
                type="range"
                min={0}
                max={1000}
                value={qPos}
                onChange={(e) => setQPos(Number(e.target.value))}
                className="hud-range"
                style={{ ["--fill" as string]: `${qPos / 10}%` }}
                aria-label="Quantity"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-steel">
                <span>1</span>
                <span>10</span>
                <span>100</span>
                <span>1k</span>
                <span>10k</span>
              </div>
            </div>

            <button
              onClick={() => openHud(material.id)}
              className="mt-7 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-silver transition-colors hover:border-ping/40 hover:text-white"
            >
              <span>
                Inspect <span className="font-semibold text-white">{material.name}</span> in Spec HUD
              </span>
              <PanelRightOpen className="h-4 w-4 text-ping" />
            </button>
          </motion.div>

          {/* Readouts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
            className="flex min-w-0 flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.label} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-midnight/70 p-4 backdrop-blur-xl">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-steel">
                    <k.icon className="h-3.5 w-3.5 text-ping" />
                    {k.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-white">
                    <LiveNumber value={k.value} decimals={k.decimals ?? 0} />
                    <span className="ml-1 text-sm font-normal text-slate-steel">{k.unit}</span>
                  </p>
                  {k.bar !== undefined && (
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-aero to-ping"
                        animate={{ width: `${k.bar}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="min-w-0 rounded-3xl border border-white/[0.08] bg-midnight/70 p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Volume economics</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-white">When does a mould pay for itself?</h3>
                </div>
                <p className="font-mono text-xs text-slate-steel">
                  {material.name} · {process === "fdm" ? `${infill}% infill · ${layer.toFixed(2)} mm` : "moulded solid"}
                </p>
              </div>
              <CostCurve material={material} infill={infill} layer={layer} quantity={quantity} process={process} breakEven={be} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={verdict.tone + verdict.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm",
                  verdict.tone === "print" && "border-[#2F9BEA]/30 bg-[#2F9BEA]/[0.08] text-silver",
                  verdict.tone === "mould" && "border-[#CF7A17]/35 bg-[#CF7A17]/[0.08] text-silver",
                  verdict.tone === "even" && "border-white/15 bg-white/[0.04] text-silver"
                )}
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ping" />
                <p>
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white">Recommendation</span>
                  {verdict.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

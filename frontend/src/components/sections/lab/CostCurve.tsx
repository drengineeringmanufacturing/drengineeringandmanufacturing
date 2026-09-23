"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Material } from "@/data/materials";
import { mouldUnitCost, printUnitCost, type LabProcess, type LayerHeight } from "@/lib/estimator";

const PRINT = "#2F9BEA";
const MOULD = "#CF7A17";
const Q_DECADES = 4; // 1 .. 10,000
const Y_MIN_LOG = -1; // 0.1
const Y_DECADES = 4; // 0.1 .. 1000

interface CostCurveProps {
  material: Material;
  infill: number;
  layer: LayerHeight;
  quantity: number;
  process: LabProcess;
  breakEven: number;
}

const fmtQ = (q: number) => (q >= 1000 ? `${(q / 1000).toFixed(q >= 10000 ? 0 : 1)}k` : `${Math.round(q)}`);
const fmtC = (v: number) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2));

export function CostCurve({ material, infill, layer, quantity, process, breakEven }: CostCurveProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverQ, setHoverQ] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = width < 480 ? 220 : 260;
  const pad = { l: 44, r: width < 480 ? 64 : 76, t: 14, b: 30 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const xs = (q: number) => pad.l + (Math.log10(q) / Q_DECADES) * iw;
  const ys = (v: number) => {
    const lv = Math.min(Math.max(Math.log10(v), Y_MIN_LOG), Y_MIN_LOG + Y_DECADES);
    return pad.t + (1 - (lv - Y_MIN_LOG) / Y_DECADES) * ih;
  };

  const N = 90;
  const pp: string[] = [];
  const mp: string[] = [];
  for (let i = 0; i <= N; i++) {
    const q = 10 ** ((i / N) * Q_DECADES);
    pp.push(`${i ? "L" : "M"}${xs(q).toFixed(1)} ${ys(printUnitCost(q, material, infill, layer)).toFixed(1)}`);
    mp.push(`${i ? "L" : "M"}${xs(q).toFixed(1)} ${ys(mouldUnitCost(q, material)).toFixed(1)}`);
  }
  const printPath = pp.join(" ");
  const mouldPath = mp.join(" ");
  const printEnd = ys(printUnitCost(10 ** Q_DECADES, material, infill, layer));
  const mouldEnd = ys(mouldUnitCost(10 ** Q_DECADES, material));

  const qMarker = Math.min(Math.max(quantity, 1), 10 ** Q_DECADES);
  const activeCost = process === "fdm" ? printUnitCost(qMarker, material, infill, layer) : mouldUnitCost(qMarker, material);
  const hasBE = Number.isFinite(breakEven) && breakEven >= 1 && breakEven <= 10 ** Q_DECADES;

  // keep direct labels from colliding
  let labelPrint = printEnd;
  let labelMould = mouldEnd;
  if (Math.abs(labelPrint - labelMould) < 14) {
    const mid = (labelPrint + labelMould) / 2;
    const up = labelPrint < labelMould;
    labelPrint = mid + (up ? -7 : 7);
    labelMould = mid + (up ? 7 : -7);
  }

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const t = (x - pad.l) / iw;
    if (t < 0 || t > 1) return setHoverQ(null);
    setHoverQ(10 ** (t * Q_DECADES));
  };

  const hq = hoverQ ?? null;
  const tipLeft = hq ? xs(hq) : 0;

  return (
    <div>
      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-steel">
        <span className="inline-flex items-center gap-2">
          <svg width="22" height="6" aria-hidden>
            <line x1="0" y1="3" x2="22" y2="3" stroke={PRINT} strokeWidth="2" strokeLinecap="round" />
          </svg>
          3D printing (FDM)
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="22" height="6" aria-hidden>
            <line x1="0" y1="3" x2="22" y2="3" stroke={MOULD} strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
          </svg>
          Injection moulding (incl. tooling)
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em]">Relative unit cost · log scale</span>
      </div>

      <div ref={wrapRef} className="relative">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block max-w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHoverQ(null)}
          role="img"
          aria-label={`Relative unit cost versus quantity. Break-even at roughly ${hasBE ? fmtQ(breakEven) : "over 10k"} units.`}
        >
          {/* grid */}
          {Array.from({ length: Y_DECADES + 1 }, (_, i) => {
            const v = 10 ** (Y_MIN_LOG + i);
            const y = ys(v);
            return (
              <g key={`y${i}`}>
                <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="rgba(148,163,184,0.12)" />
                <text x={pad.l - 8} y={y + 3.5} textAnchor="end" className="fill-slate-steel font-mono" fontSize="10">
                  {v < 1 ? v.toFixed(1) : v.toLocaleString("en-GB")}
                </text>
              </g>
            );
          })}
          {Array.from({ length: Q_DECADES + 1 }, (_, i) => {
            const q = 10 ** i;
            const x = xs(q);
            return (
              <g key={`x${i}`}>
                <line x1={x} x2={x} y1={pad.t} y2={height - pad.b} stroke="rgba(148,163,184,0.08)" />
                <text x={x} y={height - pad.b + 18} textAnchor="middle" className="fill-slate-steel font-mono" fontSize="10">
                  {fmtQ(q)}
                </text>
              </g>
            );
          })}
          <text x={width - pad.r} y={height - 2} textAnchor="end" className="fill-slate-steel/70 font-mono" fontSize="9">
            QTY →
          </text>

          {/* break-even */}
          {hasBE && (
            <g>
              <line x1={xs(breakEven)} x2={xs(breakEven)} y1={pad.t} y2={height - pad.b} stroke="rgba(226,232,240,0.35)" strokeDasharray="2 4" />
              <text x={xs(breakEven) + 6} y={pad.t + 10} className="fill-silver font-mono" fontSize="10">
                Break-even ≈ {fmtQ(breakEven)}
              </text>
            </g>
          )}

          {/* series */}
          <motion.path
            d={printPath}
            fill="none"
            stroke={PRINT}
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ opacity: process === "fdm" ? 1 : 0.55 }}
          />
          <motion.path
            d={mouldPath}
            fill="none"
            stroke={MOULD}
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
            animate={{ opacity: process === "moulding" ? 1 : 0.55 }}
          />

          {/* direct labels */}
          <text x={width - pad.r + 8} y={labelPrint + 3.5} className="fill-silver" fontSize="11">
            3D print
          </text>
          <text x={width - pad.r + 8} y={labelMould + 3.5} className="fill-silver" fontSize="11">
            Moulding
          </text>

          {/* current quantity marker */}
          <motion.g animate={{ x: xs(qMarker), y: ys(activeCost) }} transition={{ type: "spring", stiffness: 200, damping: 24 }}>
            <circle r="9" fill={process === "fdm" ? PRINT : MOULD} opacity="0.18" />
            <circle r="5" fill={process === "fdm" ? PRINT : MOULD} stroke="#0A1428" strokeWidth="2" />
          </motion.g>

          {/* hover crosshair */}
          {hq && (
            <g pointerEvents="none">
              <line x1={xs(hq)} x2={xs(hq)} y1={pad.t} y2={height - pad.b} stroke="rgba(226,232,240,0.45)" />
              <circle cx={xs(hq)} cy={ys(printUnitCost(hq, material, infill, layer))} r="4" fill={PRINT} stroke="#0A1428" strokeWidth="2" />
              <circle cx={xs(hq)} cy={ys(mouldUnitCost(hq, material))} r="4" fill={MOULD} stroke="#0A1428" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hq && (
          <div
            className="pointer-events-none absolute top-9 z-10 w-44 rounded-lg border border-white/10 bg-obsidian/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
            style={{ left: Math.min(Math.max(tipLeft + 12, 0), width - 184) }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-steel">{fmtQ(hq)} units</p>
            <p className="mt-1.5 flex items-center justify-between text-silver">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: PRINT }} />3D print</span>
              <span className="font-mono tabular-nums text-white">{fmtC(printUnitCost(hq, material, infill, layer))}</span>
            </p>
            <p className="mt-1 flex items-center justify-between text-silver">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: MOULD }} />Moulding</span>
              <span className="font-mono tabular-nums text-white">{fmtC(mouldUnitCost(hq, material))}</span>
            </p>
          </div>
        )}
      </div>

      <details className="group mt-3 text-xs text-slate-steel">
        <summary className="cursor-pointer select-none font-mono text-[10px] uppercase tracking-[0.18em] hover:text-silver">
          View data table
        </summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.14em]">
              <th className="py-1.5 font-normal">Quantity</th>
              <th className="py-1.5 font-normal">3D print</th>
              <th className="py-1.5 font-normal">Moulding</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums text-silver">
            {[1, 10, 100, 1000, 10000].map((q) => (
              <tr key={q} className="border-b border-white/[0.04]">
                <td className="py-1.5">{q.toLocaleString("en-GB")}</td>
                <td className="py-1.5">{fmtC(printUnitCost(q, material, infill, layer))}</td>
                <td className="py-1.5">{fmtC(mouldUnitCost(q, material))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

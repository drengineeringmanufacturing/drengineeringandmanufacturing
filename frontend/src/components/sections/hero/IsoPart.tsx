"use client";

import { motion } from "framer-motion";
import { useId } from "react";

/* ------------------------------------------------------------------
   Isometric CAD part — a pivot-mount bracket rendered from real 3D
   geometry projected to 2D. Supports wireframe/solid shading, a
   print mode that truncates the geometry at the current layer height,
   and a moulding mode with an animated cavity plate.
   ------------------------------------------------------------------ */

type V3 = [number, number, number];
type FaceKind = "top" | "right" | "left" | "cylSide" | "cylTop" | "bore" | "hole";

interface Face {
  key: string;
  kind: FaceKind;
  d: string;
  cut?: boolean;
}

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const R2 = Math.SQRT2;

const P = ([x, y, z]: V3): [number, number] => [(x - z) * COS, (x + z) * SIN - y];
const f = (n: number) => n.toFixed(2);

function poly(pts: V3[]) {
  return (
    "M" +
    pts
      .map((p) => {
        const [x, y] = P(p);
        return `${f(x)} ${f(y)}`;
      })
      .join(" L") +
    " Z"
  );
}

function box(key: string, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, h: number): Face[] {
  if (y0 >= h) return [];
  const top = Math.min(y1, h);
  const cut = top < y1;
  return [
    { key: `${key}-l`, kind: "left", d: poly([[x0, y0, z1], [x1, y0, z1], [x1, top, z1], [x0, top, z1]]) },
    { key: `${key}-r`, kind: "right", d: poly([[x1, y0, z0], [x1, top, z0], [x1, top, z1], [x1, y0, z1]]) },
    { key: `${key}-t`, kind: "top", cut, d: poly([[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]]) },
  ];
}

function ellipse(cx: number, cy: number, rx: number, ry: number) {
  return `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 0 ${f(cx - rx)} ${f(cy)} Z`;
}

function cylinder(key: string, cx: number, cz: number, r: number, rb: number, y0: number, y1: number, h: number): Face[] {
  if (y0 >= h) return [];
  const top = Math.min(y1, h);
  const [tx, ty] = P([cx, top, cz]);
  const by = ty + (top - y0);
  const rx = r * COS * R2;
  const ry = r * SIN * R2;
  return [
    {
      key: `${key}-s`,
      kind: "cylSide",
      d: `M${f(tx - rx)} ${f(ty)} L${f(tx - rx)} ${f(by)} A${f(rx)} ${f(ry)} 0 0 0 ${f(tx + rx)} ${f(by)} L${f(tx + rx)} ${f(ty)} Z`,
    },
    { key: `${key}-t`, kind: "cylTop", cut: top < y1, d: ellipse(tx, ty, rx, ry) },
    { key: `${key}-b`, kind: "bore", d: ellipse(tx, ty, rb * COS * R2, rb * SIN * R2) },
  ];
}

/** circle lying in the plane x = const (a hole bored along the x axis) */
function holeYZ(key: string, x: number, cy: number, cz: number, r: number, n = 40): Face {
  const pts: V3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([x, cy + r * Math.cos(a), cz + r * Math.sin(a)]);
  }
  return { key, kind: "hole", d: poly(pts) };
}

/** circle on a horizontal face */
function holeXZ(key: string, cx: number, y: number, cz: number, r: number): Face {
  const [tx, ty] = P([cx, y, cz]);
  return { key, kind: "hole", d: ellipse(tx, ty, r * COS * R2, r * SIN * R2) };
}

const MAX_H = 70;

export function buildPart(h = MAX_H): Face[] {
  const faces: Face[] = [];
  // Base slab
  faces.push(...box("base", 0, 150, 0, 14, 0, 70, h));
  if (h >= 14) faces.push(holeXZ("base-hole", 134, 14, 35, 8));
  // Rear clevis block
  faces.push(...box("clevis", 0, 34, 14, 70, 0, 70, h));
  if (h >= 60) faces.push(holeYZ("clevis-hole", 34, 46, 35, 12));
  // Pivot boss
  faces.push(...cylinder("boss", 92, 35, 26, 13, 14, 62, h));
  return faces;
}

const FULL = buildPart();

/* Dimension geometry (static) */
const dim = (() => {
  const a = P([0, 0, 88]);
  const b = P([150, 0, 88]);
  const ea0 = P([0, 0, 72]);
  const eb0 = P([150, 0, 72]);
  const h0 = P([-18, 0, 70]);
  const h1 = P([-18, 70, 70]);
  const eh0 = P([-2, 0, 70]);
  const eh1 = P([-2, 70, 70]);
  const boss = P([92, 62, 35]);
  const bore = P([92, 62, 35]);
  return { a, b, ea0, eb0, h0, h1, eh0, eh1, boss, bore };
})();

const pt = (p: [number, number]) => `${f(p[0])} ${f(p[1])}`;

export type PartMode = "cad" | "print" | "mould";

interface IsoPartProps {
  mode: PartMode;
  solid: boolean;
  /** print height 0..70 (world units) */
  height?: number;
  /** mould cavity lift 0..1 */
  lift?: number;
}

export function IsoPart({ mode, solid, height = MAX_H, lift = 0 }: IsoPartProps) {
  const uid = useId().replace(/:/g, "");
  const faces = mode === "print" ? buildPart(height) : FULL;

  const fillFor = (k: FaceKind, cut?: boolean) => {
    if (cut) return `url(#${uid}-cut)`;
    switch (k) {
      case "top":
      case "cylTop":
        return `url(#${uid}-top)`;
      case "right":
        return `url(#${uid}-right)`;
      case "left":
        return `url(#${uid}-left)`;
      case "cylSide":
        return `url(#${uid}-cyl)`;
      case "bore":
      case "hole":
        return "#020611";
    }
  };

  const [nzX, nzY] = P([75, height, 35]);

  return (
    <svg viewBox="-112 -120 262 262" className="h-full w-full overflow-visible" role="img" aria-label="Isometric CAD model of a pivot mount bracket">
      <defs>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7cc4fa" />
          <stop offset="100%" stopColor="#2f7fd8" />
        </linearGradient>
        <linearGradient id={`${uid}-right`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1f64c4" />
          <stop offset="100%" stopColor="#0c3a88" />
        </linearGradient>
        <linearGradient id={`${uid}-left`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123f8f" />
          <stop offset="100%" stopColor="#081f4f" />
        </linearGradient>
        <linearGradient id={`${uid}-cyl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a2a66" />
          <stop offset="45%" stopColor="#2c78d4" />
          <stop offset="70%" stopColor="#5fb0f2" />
          <stop offset="100%" stopColor="#1a56b0" />
        </linearGradient>
        <linearGradient id={`${uid}-cut`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="42" cy="68" rx="118" ry="30" fill="#38bdf8" opacity="0.06" />

      {/* Ghost of the full part while printing */}
      {mode === "print" && (
        <g opacity="0.22">
          {FULL.map((fc) => (
            <path key={`g-${fc.key}`} d={fc.d} fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 2" />
          ))}
        </g>
      )}

      {/* MOULD: core plate sits behind the part */}
      {mode === "mould" && (
        <g fill="none" strokeWidth="0.7">
          {box("core", -12, 156, -20, 7, -12, 76, 999).map((fc) => (
            <path key={fc.key} d={fc.d} stroke="#64748b" strokeDasharray="3 2" fill="rgba(100,116,139,0.08)" />
          ))}
        </g>
      )}

      {/* The part */}
      <g>
        {faces.map((fc, i) =>
          mode === "cad" ? (
            <motion.path
              key={fc.key}
              d={fc.d}
              fill={fillFor(fc.kind)}
              stroke={solid ? "rgba(224,242,254,0.55)" : "#38bdf8"}
              strokeWidth={solid ? 0.6 : 0.9}
              strokeLinejoin="round"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{
                pathLength: 1,
                fillOpacity: solid ? 1 : fc.kind === "bore" || fc.kind === "hole" ? 0.9 : 0.05,
              }}
              transition={{
                pathLength: { duration: 1.4, delay: i * 0.06, ease: "easeInOut" },
                fillOpacity: { duration: 0.5 },
              }}
            />
          ) : (
            <path
              key={fc.key}
              d={fc.d}
              fill={fillFor(fc.kind, fc.cut)}
              fillOpacity={fc.cut ? 0.9 : solid ? 1 : fc.kind === "bore" || fc.kind === "hole" ? 0.9 : 0.05}
              stroke={fc.cut ? "#e0f2fe" : solid ? "rgba(224,242,254,0.55)" : "#38bdf8"}
              strokeWidth={fc.cut ? 1 : solid ? 0.6 : 0.9}
              strokeLinejoin="round"
              filter={fc.cut ? `url(#${uid}-glow)` : undefined}
              style={{ transition: "fill-opacity 500ms ease, stroke 500ms ease" }}
            />
          )
        )}
      </g>

      {/* CAD: dimensions */}
      {mode === "cad" && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="font-mono"
          fill="#94a3b8"
          stroke="#94a3b8"
        >
          <path d={`M${pt(dim.ea0)} L${pt(dim.a)} M${pt(dim.eb0)} L${pt(dim.b)}`} strokeWidth="0.4" strokeDasharray="1.5 1.5" fill="none" />
          <motion.path
            d={`M${pt(dim.a)} L${pt(dim.b)}`}
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
          <text
            x={(dim.a[0] + dim.b[0]) / 2 + 4}
            y={(dim.a[1] + dim.b[1]) / 2 + 12}
            fontSize="7"
            stroke="none"
            fill="#bae6fd"
            letterSpacing="0.5"
          >
            150.00
          </text>

          <path d={`M${pt(dim.eh0)} L${pt(dim.h0)} M${pt(dim.eh1)} L${pt(dim.h1)}`} strokeWidth="0.4" strokeDasharray="1.5 1.5" fill="none" />
          <motion.path
            d={`M${pt(dim.h0)} L${pt(dim.h1)}`}
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          />
          <text x={dim.h0[0] - 27} y={(dim.h0[1] + dim.h1[1]) / 2} fontSize="7" stroke="none" fill="#bae6fd">
            70.00
          </text>

          {/* Boss callout */}
          <path d={`M${f(dim.boss[0] + 20)} ${f(dim.boss[1] - 12)} L${f(dim.boss[0] + 44)} ${f(dim.boss[1] - 40)} L${f(dim.boss[0] + 80)} ${f(dim.boss[1] - 40)}`} strokeWidth="0.5" fill="none" />
          <circle cx={dim.boss[0] + 20} cy={dim.boss[1] - 12} r="1.4" stroke="none" fill="#38bdf8" />
          <text x={dim.boss[0] + 46} y={dim.boss[1] - 43} fontSize="6.5" stroke="none" fill="#e0f2fe">
            Ø52.00 BOSS
          </text>
          <text x={dim.boss[0] + 46} y={dim.boss[1] - 33} fontSize="5.5" stroke="none" fill="#94a3b8">
            Ø26 H7 THRU
          </text>

          {/* Axis triad */}
          <g transform="translate(-78 88)" strokeWidth="0.8">
            <path d={`M0 0 L${f(20 * COS)} ${f(20 * SIN)}`} stroke="#f87171" />
            <path d={`M0 0 L${f(-20 * COS)} ${f(20 * SIN)}`} stroke="#34d399" />
            <path d="M0 0 L0 -20" stroke="#38bdf8" />
            <text x={20 * COS + 2} y={20 * SIN + 3} fontSize="5" stroke="none" fill="#f87171">X</text>
            <text x={-20 * COS - 6} y={20 * SIN + 3} fontSize="5" stroke="none" fill="#34d399">Z</text>
            <text x="-2" y="-23" fontSize="5" stroke="none" fill="#38bdf8">Y</text>
          </g>
        </motion.g>
      )}

      {/* PRINT: nozzle tracking the current layer */}
      {mode === "print" && height < MAX_H && (
        <motion.g
          animate={{ x: [-46, 46, -46] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <g transform={`translate(${f(nzX)} ${f(nzY)})`}>
            <path d="M-5 -18 L5 -18 L2 -4 L0 -1 L-2 -4 Z" fill="#e2e8f0" stroke="#38bdf8" strokeWidth="0.5" />
            <rect x="-9" y="-30" width="18" height="12" rx="1.5" fill="#0b1b3d" stroke="#38bdf8" strokeWidth="0.6" />
            <circle cx="0" cy="0" r="2.4" fill="#fef3c7" filter={`url(#${uid}-glow)`} />
          </g>
        </motion.g>
      )}

      {/* MOULD: cavity plate lifts to eject */}
      {mode === "mould" && (
        <g fill="none" strokeWidth="0.7">
          <motion.g animate={{ y: -lift * 26 }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
            {box("cavity", -12, 156, 30, 78, -12, 76, 999).map((fc) => (
              <path
                key={fc.key}
                d={fc.d}
                stroke="#38bdf8"
                strokeDasharray="3 2"
                fill={fc.kind === "top" ? "rgba(56,189,248,0.10)" : "rgba(56,189,248,0.05)"}
              />
            ))}
          </motion.g>
        </g>
      )}
    </svg>
  );
}

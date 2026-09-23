import type { Material } from "@/data/materials";
import { clamp } from "./format";

/**
 * Indicative, relative estimator for the Parameter Lab.
 * All costs are unit-less indices (not currency) so the chart communicates
 * the shape of the print-vs-mould trade-off rather than a price.
 * Reference part: ~42 cm³ bracket.
 */

export type LabProcess = "fdm" | "moulding";
export type LayerHeight = 0.12 | 0.2 | 0.28;
export type FinishLevel = "raw" | "sanded" | "painted";

export interface LabInput {
  process: LabProcess;
  material: Material;
  infill: number; // 10..100
  layer: LayerHeight;
  finish: FinishLevel;
  quantity: number;
}

const REF_VOLUME_CM3 = 42;
const TOOLING_INDEX = 900;
const FLEET_PRINTERS = 6;

const layerTime: Record<LayerHeight, number> = { 0.12: 1.5, 0.2: 1, 0.28: 0.78 };
const layerStrength: Record<LayerHeight, number> = { 0.12: 1, 0.2: 0.97, 0.28: 0.91 };
const layerFinish: Record<LayerHeight, number> = { 0.12: 70, 0.2: 56, 0.28: 44 };
const finishBoost: Record<FinishLevel, number> = { raw: 0, sanded: 14, painted: 26 };
const finishDays: Record<FinishLevel, number> = { raw: 0, sanded: 1, painted: 2 };

export function printUnitCost(q: number, m: Material, infill: number, layer: LayerHeight) {
  const perPart = m.costIndex * (0.55 + 0.9 * (infill / 100)) * layerTime[layer];
  const batchDiscount = 1 - 0.15 * clamp(Math.log10(Math.max(q, 1)) / 3, 0, 1);
  return perPart * batchDiscount + 3 / q;
}

export function mouldUnitCost(q: number, m: Material) {
  return TOOLING_INDEX / q + 0.12 * m.costIndex + 0.05;
}

/** quantity where moulding becomes cheaper than printing (bisection over log q) */
export function breakEven(m: Material, infill: number, layer: LayerHeight) {
  let lo = 0;
  let hi = 6; // 10^6
  const diff = (lq: number) => mouldUnitCost(10 ** lq, m) - printUnitCost(10 ** lq, m, infill, layer);
  if (diff(hi) > 0) return Infinity;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (diff(mid) > 0) lo = mid;
    else hi = mid;
  }
  return 10 ** hi;
}

export function estimate(input: LabInput) {
  const { process, material: m, infill, layer, finish, quantity: q } = input;
  const fdm = process === "fdm";

  const fill = fdm ? 0.3 + 0.7 * (infill / 100) : 1;
  const mass = REF_VOLUME_CM3 * m.density * fill;

  const strengthBase = (m.tensile / 80) * 100;
  const strength = fdm
    ? strengthBase * (0.55 + 0.45 * (infill / 100)) * layerStrength[layer] * 0.82
    : strengthBase;

  const surface = clamp((fdm ? layerFinish[layer] : 90) + finishBoost[finish] * (fdm ? 1 : 0.35), 0, 100);

  const printHours = 3.2 * layerTime[layer] * (0.5 + infill / 100);
  const leadDays = fdm
    ? 2 + Math.ceil((q * printHours) / (FLEET_PRINTERS * 20)) + finishDays[finish]
    : 18 + Math.ceil(q / 4000) + finishDays[finish];

  const unitCost = fdm ? printUnitCost(q, m, infill, layer) : mouldUnitCost(q, m);
  const altCost = fdm ? mouldUnitCost(q, m) : printUnitCost(q, m, infill, layer);

  return {
    mass,
    strength: clamp(strength, 0, 100),
    surface,
    leadDays,
    printHours: fdm ? printHours : 0,
    unitCost,
    altCost,
    breakEven: breakEven(m, infill, layer),
  };
}

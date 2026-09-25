/**
 * Typical, indicative material properties for comparison only.
 * Values vary by grade, print orientation and process parameters.
 */
export interface Material {
  id: string;
  name: string;
  family: string;
  swatch: string;
  fdm: boolean;
  moulding: boolean;
  /** Typical tensile strength, MPa */
  tensile: number;
  /** Heat deflection temperature, °C (0.45 MPa) */
  hdt: number;
  /** Density, g/cm³ */
  density: number;
  /** 0 – 10 relative ratings */
  flexibility: number;
  uv: number;
  chemical: number;
  printability: number;
  /** Relative material cost index (1 = baseline) */
  costIndex: number;
  bestFor: string;
}

export const materials: Material[] = [
  {
    id: "pla",
    name: "PLA",
    family: "Polylactic acid",
    swatch: "#22C55E",
    fdm: true,
    moulding: false,
    tensile: 50,
    hdt: 55,
    density: 1.24,
    flexibility: 2,
    uv: 4,
    chemical: 3,
    printability: 10,
    costIndex: 1,
    bestFor: "Visual prototypes, display models, gifts and low-load indoor parts.",
  },
  {
    id: "petg",
    name: "PETG",
    family: "Glycol-modified PET",
    swatch: "#3B82F6",
    fdm: true,
    moulding: false,
    tensile: 50,
    hdt: 70,
    density: 1.27,
    flexibility: 5,
    uv: 6,
    chemical: 8,
    printability: 8,
    costIndex: 1.1,
    bestFor: "Tough functional parts, jigs, fixtures and anything touching oils or water.",
  },
  {
    id: "abs",
    name: "ABS",
    family: "Acrylonitrile butadiene styrene",
    swatch: "#EF4444",
    fdm: true,
    moulding: true,
    tensile: 40,
    hdt: 95,
    density: 1.04,
    flexibility: 5,
    uv: 3,
    chemical: 6,
    printability: 6,
    costIndex: 1.15,
    bestFor: "Enclosures, automotive interior trim and parts that need post-machining.",
  },
  {
    id: "asa",
    name: "ASA",
    family: "Acrylonitrile styrene acrylate",
    swatch: "#F97316",
    fdm: true,
    moulding: true,
    tensile: 45,
    hdt: 95,
    density: 1.07,
    flexibility: 5,
    uv: 10,
    chemical: 7,
    printability: 6,
    costIndex: 1.3,
    bestFor: "Outdoor and exterior parts — signage, housings and anything in the sun.",
  },
  {
    id: "tpu",
    name: "TPU",
    family: "Thermoplastic polyurethane (95A)",
    swatch: "#A855F7",
    fdm: true,
    moulding: true,
    tensile: 30,
    hdt: 60,
    density: 1.21,
    flexibility: 10,
    uv: 6,
    chemical: 7,
    printability: 4,
    costIndex: 1.5,
    bestFor: "Seals, gaskets, grips, bumpers and vibration dampers.",
  },
  {
    id: "pet-cf",
    name: "PET-CF",
    family: "Carbon-fibre reinforced PET",
    swatch: "#0284C7",
    fdm: true,
    moulding: false,
    tensile: 82,
    hdt: 155,
    density: 1.34,
    flexibility: 2,
    uv: 8,
    chemical: 9,
    printability: 6,
    costIndex: 2.2,
    bestFor: "High-stiffness industrial components, structural brackets, high heat resistance and chemical exposure.",
  },
];

export const getMaterial = (id: string) => materials.find((m) => m.id === id) ?? materials[0];

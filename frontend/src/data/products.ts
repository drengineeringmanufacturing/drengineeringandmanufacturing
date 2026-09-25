export type ProductCategory =
  | "Automotive"
  | "Tooling"
  | "Prototypes"
  | "Home & Office"
  | "Custom";

export interface Product {
  id: string;
  code: string;
  title: string;
  category: ProductCategory;
  image: string;
  /** CSS object-position for the grid thumbnail */
  focus?: string;
  /** Show the image contained (no crop) — for renders on white */
  contain?: boolean;
  summary: string;
  process: string[];
  specs: { label: string; value: string }[];
}

export const productCategories: ("All" | ProductCategory)[] = [
  "All",
  "Automotive",
  "Tooling",
  "Prototypes",
  "Home & Office",
  "Custom",
];

export const products: Product[] = [
  {
    id: "gauge-pod",
    code: "DR-P-011",
    title: "Triple Gauge Dash Pod",
    category: "Automotive",
    image: "/products/gauge-pod.jpg",
    focus: "50% 40%",
    summary:
      "Custom-fit dashboard pod housing three 52 mm gauges. Reverse engineered from the dash contour so it sits flush with factory panels.",
    process: ["Reverse Engineering", "3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "ASA (UV Stable)" },
      { label: "Process", value: "Reverse Engineering, 3D CAD & 3D Printing" },
    ],
  },
  {
    id: "drawer-lock-jig",
    code: "DR-P-027",
    title: "Cabinet Lock Drilling Jig",
    category: "Tooling",
    image: "/products/drawer-lock-jig.jpg",
    focus: "50% 38%",
    summary:
      "Clamp-on jig that locates the lock barrel and cam holes for fast, repeatable cabinet lock installs — with hardened guide bushings.",
    process: ["3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "PETG + Hardened Bushings" },
      { label: "Process", value: "3D CAD, FDM Printing & Assembly" },
    ],
  },
  {
    id: "pivot-bracket-cad",
    code: "DR-C-104",
    title: "Pivot Mount Bracket",
    category: "Prototypes",
    image: "/products/pivot-bracket-cad.jpg",
    contain: true,
    summary:
      "Parametric bracket with bored pivot boss and clevis mount, delivered with a full drawing pack — ready for FDM, CNC or moulding.",
    process: ["3D CAD", "Technical Drawings"],
    specs: [
      { label: "Material", value: "FDM / CNC / Moulding Spec" },
      { label: "Process", value: "3D CAD & Technical Engineering Drawings" },
    ],
  },
  {
    id: "turbine-gearbox",
    code: "DR-P-033",
    title: "Wind Turbine Gearbox Demonstrator",
    category: "Prototypes",
    image: "/products/turbine-gearbox.jpg",
    focus: "50% 55%",
    summary:
      "Working desktop prototype with a printed spur-gear train — built to demonstrate step-up gearing for an educational kit.",
    process: ["3D CAD", "Rapid Prototyping", "3D Printing"],
    specs: [
      { label: "Material", value: "PLA + PETG Gear Train" },
      { label: "Process", value: "3D CAD, Rapid Prototyping & 3D Printing" },
    ],
  },
  {
    id: "workshop-funnel",
    code: "DR-P-019",
    title: "Workshop Oil Funnel",
    category: "Automotive",
    image: "/products/workshop-funnel.jpg",
    focus: "65% 50%",
    summary:
      "Chemical-resistant, narrow-spout funnel for engine oil and coolant top-ups — designed to print without supports.",
    process: ["3D CAD", "3D Printing"],
    specs: [
      { label: "Material", value: "PETG (Chemical & Oil Resistant)" },
      { label: "Process", value: "3D CAD Modeling & FDM Printing" },
    ],
  },
  {
    id: "desk-organiser",
    code: "DR-P-042",
    title: "Hex Desk Organiser",
    category: "Home & Office",
    image: "/products/desk-organiser.jpg",
    contain: true,
    summary:
      "Angled, ribbed desk organiser with dedicated bays for pens, styluses and tools — designed for a clean print with no visible supports.",
    process: ["3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "PLA (Dual-Tone)" },
      { label: "Process", value: "3D CAD Modeling, 3D Printing & Finishing" },
    ],
  },
  {
    id: "house-number-sign",
    code: "DR-P-008",
    title: "Floating House Numbers",
    category: "Home & Office",
    image: "/products/house-number-sign.jpg",
    focus: "50% 35%",
    summary:
      "Modern stand-off house numbers printed in weatherproof ASA, with hidden mounting pins for a crisp floating shadow.",
    process: ["3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "ASA (Weatherproof Outdoor)" },
      { label: "Process", value: "3D CAD, 3D Printing & Post-Processing" },
    ],
  },
  {
    id: "sim-card-organiser",
    code: "DR-P-036",
    title: "SIM & Card Travel Case",
    category: "Home & Office",
    image: "/products/sim-card-organiser.jpg",
    focus: "55% 60%",
    summary:
      "Pocket-sized case with snap-fit sliding lid, slots for SIM and memory cards, and an integrated ejector-tool holder.",
    process: ["3D CAD", "Rapid Prototyping", "3D Printing"],
    specs: [
      { label: "Material", value: "PLA+ Polymer" },
      { label: "Process", value: "3D CAD Modeling & Rapid Prototyping" },
    ],
  },
  {
    id: "mini-wheelie-bin",
    code: "DR-P-015",
    title: "Miniature Wheelie Bin",
    category: "Custom",
    image: "/products/mini-wheelie-bin.jpg",
    focus: "50% 45%",
    summary:
      "Scale replica wheelie bin with a working hinged lid and rolling wheels — a desk bin, gift or promotional piece.",
    process: ["3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "PLA (Matte Black)" },
      { label: "Process", value: "3D CAD, 3D Printing & Assembly" },
    ],
  },
  {
    id: "flag-relief",
    code: "DR-P-022",
    title: "Hand-Painted Flag Relief",
    category: "Custom",
    image: "/products/flag-relief.jpg",
    focus: "50% 50%",
    summary:
      "Layered relief flag with raised stars and stripes, finished by hand in primer, enamel colour and a protective clear coat.",
    process: ["3D CAD", "3D Printing", "Post Processing"],
    specs: [
      { label: "Material", value: "PLA Relief Substrate" },
      { label: "Process", value: "3D CAD, 3D Printing & Hand Finishing" },
    ],
  },
  {
    id: "relief-emblem",
    code: "DR-P-029",
    title: "Custom Relief Emblem",
    category: "Custom",
    image: "/products/relief-emblem.jpg",
    focus: "50% 32%",
    summary:
      "Two-tone embossed emblem traced from artwork and printed with multi-colour layering — ideal for badges, plaques and packaging.",
    process: ["3D CAD", "3D Printing"],
    specs: [
      { label: "Material", value: "PLA (Multi-Colour)" },
      { label: "Process", value: "Vector Tracing, 3D CAD & 3D Printing" },
    ],
  },
];

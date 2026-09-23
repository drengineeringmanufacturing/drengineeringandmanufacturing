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
      { label: "Material", value: "ASA — UV stable" },
      { label: "Finish", value: "Textured satin black" },
      { label: "Fitment", value: "Contour-matched to dash" },
      { label: "Lead time", value: "5 working days" },
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
      { label: "Material", value: "PETG + steel bushings" },
      { label: "Accuracy", value: "±0.1 mm hole location" },
      { label: "Use", value: "Joinery & shop fit-out" },
      { label: "Lead time", value: "3 working days" },
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
      { label: "Deliverable", value: "STEP + drawing pack" },
      { label: "Tolerancing", value: "GD&T on bore & mount" },
      { label: "Revision", value: "REV C" },
      { label: "Lead time", value: "2 working days" },
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
      { label: "Material", value: "PLA + PETG gears" },
      { label: "Mechanism", value: "Printed spur-gear train" },
      { label: "Iterations", value: "3 prototype revisions" },
      { label: "Lead time", value: "4 working days" },
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
      { label: "Material", value: "PETG — oil resistant" },
      { label: "Design", value: "Support-free geometry" },
      { label: "Batch", value: "Printed in runs of 20" },
      { label: "Lead time", value: "2 working days" },
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
      { label: "Material", value: "PLA — two-tone" },
      { label: "Detailing", value: "Ribbed shell, fitted inserts" },
      { label: "Batch", value: "Retail runs available" },
      { label: "Lead time", value: "3 working days" },
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
      { label: "Material", value: "ASA — weatherproof" },
      { label: "Mounting", value: "Concealed stand-off pins" },
      { label: "Sizes", value: "Custom height & font" },
      { label: "Lead time", value: "3 working days" },
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
      { label: "Material", value: "PLA+ — high-vis orange" },
      { label: "Closure", value: "Snap-fit sliding lid" },
      { label: "Tolerance", value: "0.15 mm sliding clearance" },
      { label: "Lead time", value: "2 working days" },
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
      { label: "Material", value: "PLA — matte black" },
      { label: "Moving parts", value: "Print-in-place hinge, wheels" },
      { label: "Branding", value: "Custom logos available" },
      { label: "Lead time", value: "3 working days" },
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
      { label: "Material", value: "PLA relief" },
      { label: "Finish", value: "Hand-painted + clear coat" },
      { label: "Sizes", value: "A5 – A3 panels" },
      { label: "Lead time", value: "5 working days" },
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
      { label: "Material", value: "PLA — multi-colour" },
      { label: "Detail", value: "0.12 mm layer height" },
      { label: "Artwork", value: "Traced from your logo" },
      { label: "Lead time", value: "2 working days" },
    ],
  },
];

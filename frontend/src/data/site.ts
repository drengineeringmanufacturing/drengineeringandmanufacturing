/**
 * Global site content. All values are static for the frontend build —
 * swap these for CMS / API data when the backend is wired up.
 */
export const site = {
  name: "DR Engineering & Manufacturing",
  shortName: "DR Engineering",
  tagline: "Precision engineered. Rapidly manufactured.",
  description:
    "3D CAD modelling, technical engineering drawings, reverse engineering, 3D printing, rapid prototyping, injection moulding and post-processing — one engineering partner from first sketch to production run.",
  // TODO: add real contact details — these render in the footer & contact section once set.
  contact: {
    email: "",
    phone: "",
    location: "",
  },
};

export const navLinks = [
  { id: "capabilities", label: "Capabilities" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Parameter Lab" },
  { id: "process", label: "Process" },
  { id: "materials", label: "Materials" },
] as const;

export type NavId = (typeof navLinks)[number]["id"] | "contact";

export const heroStats = [
  { value: 0.05, prefix: "±", suffix: " mm", decimals: 2, label: "Dimensional accuracy" },
  { value: 48, suffix: " h", decimals: 0, label: "Prototype turnaround" },
  { value: 12, suffix: "+", decimals: 0, label: "Engineering polymers" },
];

export const bandStats = [
  { value: 500, suffix: "+", decimals: 0, label: "Parts engineered & delivered", code: "QTY" },
  { value: 0.05, prefix: "±", suffix: " mm", decimals: 2, label: "Tolerance on critical features", code: "TOL" },
  { value: 48, suffix: " h", decimals: 0, label: "Concept to first prototype", code: "LEAD" },
  { value: 7, suffix: "", decimals: 0, label: "In-house disciplines, one team", code: "SVC" },
];

export const acceptedFormats = ["STEP", "IGES", "STL", "3MF", "OBJ", "DWG", "DXF", "PDF"];

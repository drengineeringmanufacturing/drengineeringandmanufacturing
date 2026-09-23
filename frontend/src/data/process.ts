export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  window: string;
  body: string;
  outputs: string[];
}

export const processSteps: ProcessStep[] = [
  {
    id: "brief",
    index: "01",
    title: "Brief & Discovery",
    window: "Day 0",
    body: "Send us a sketch, photos, a broken part or a CAD file. We define function, loads, environment, quantities and budget before a single line is drawn.",
    outputs: ["Requirements capture", "Feasibility check", "Engineer-reviewed quote"],
  },
  {
    id: "cad",
    index: "02",
    title: "CAD & Drawings",
    window: "Day 1 – 3",
    body: "Parametric 3D models and manufacturing drawings, built for the process that will make them — with a design-for-manufacture review baked in.",
    outputs: ["Parametric model", "Drawing pack", "DFM notes"],
  },
  {
    id: "prototype",
    index: "03",
    title: "Prototype",
    window: "Day 2 – 5",
    body: "Functional prototypes land on your bench for form, fit and function checks against the real-world parts they have to work with.",
    outputs: ["First-article print", "Fit check", "Test plan"],
  },
  {
    id: "validate",
    index: "04",
    title: "Validate & Iterate",
    window: "Rolling",
    body: "Feedback goes straight back into CAD. Quick revision loops take the design from REV A to production-intent without losing momentum.",
    outputs: ["Revision log", "Updated CAD", "Sign-off sample"],
  },
  {
    id: "produce",
    index: "05",
    title: "Produce",
    window: "Scaled to volume",
    body: "Batch 3D printing for low volumes, injection moulding when the numbers climb — we recommend the crossover point, not just the process we like.",
    outputs: ["Batch printing", "Mould tooling", "Production runs"],
  },
  {
    id: "finish",
    index: "06",
    title: "Finish & Deliver",
    window: "Final stage",
    body: "Support removal, sanding, painting, inserts and assembly, followed by inspection — then parts are packed and shipped ready to use.",
    outputs: ["Post-processing", "QC inspection", "Dispatch"],
  },
];

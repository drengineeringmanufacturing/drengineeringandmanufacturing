export type ServiceGroup = "Design" | "Manufacture" | "Finish";

export type ServiceIcon =
  | "cad"
  | "drawing"
  | "reverse"
  | "print"
  | "prototype"
  | "moulding"
  | "finish";

export interface Service {
  id: string;
  code: string;
  title: string;
  group: ServiceGroup;
  icon: ServiceIcon;
  summary: string;
  detail: string;
  chips: string[];
  deliverables: string[];
  specs: { label: string; value: string }[];
}

export const serviceGroups: ("All" | ServiceGroup)[] = ["All", "Design", "Manufacture", "Finish"];

export const services: Service[] = [
  {
    id: "cad",
    code: "SVC-01",
    title: "3D CAD Modelling",
    group: "Design",
    icon: "cad",
    summary:
      "Parametric solid and surface models engineered for manufacture — fully dimensioned and ready for print, machining or tooling.",
    detail:
      "We turn sketches, photos, specifications or rough ideas into clean, fully parametric CAD. Every model is built with design-for-manufacture in mind: sensible wall thicknesses, draft where it matters, tolerance-aware fits and a feature tree you can actually edit later.",
    chips: ["Parametric", "Assemblies", "DFM review"],
    deliverables: [
      "Native parametric model + neutral STEP export",
      "Assembly structure with mates & motion checks",
      "Photoreal renders for review and marketing",
      "Revision-controlled files (REV A, B, C…)",
    ],
    specs: [
      { label: "Output formats", value: "STEP · IGES · STL · 3MF" },
      { label: "Typical turnaround", value: "1 – 5 working days" },
      { label: "Revision rounds", value: "Included until sign-off" },
    ],
  },
  {
    id: "drawings",
    code: "SVC-02",
    title: "Technical Engineering Drawings",
    group: "Design",
    icon: "drawing",
    summary:
      "Manufacturing-grade 2D drawings with GD&T, sections, tolerances and bills of materials your machinist will thank you for.",
    detail:
      "Production-ready drawing packs following ISO drafting conventions — orthographic and isometric views, section and detail views, geometric tolerancing, surface finish callouts, title blocks and a full BOM for assemblies.",
    chips: ["GD&T", "Sections", "BOM"],
    deliverables: [
      "Dimensioned general-arrangement drawings",
      "Part drawings with tolerances & finish callouts",
      "Exploded assembly views with balloon BOM",
      "PDF + DWG/DXF exports",
    ],
    specs: [
      { label: "Standards", value: "ISO drafting conventions" },
      { label: "Formats", value: "PDF · DWG · DXF" },
      { label: "Sheet sizes", value: "A4 – A0" },
    ],
  },
  {
    id: "reverse",
    code: "SVC-03",
    title: "Reverse Engineering",
    group: "Design",
    icon: "reverse",
    summary:
      "Broken, obsolete or undocumented part? We measure, digitise and rebuild it as editable CAD — then make it better.",
    detail:
      "When the original drawings are long gone, we recreate the part from the physical sample. Critical interfaces are measured precisely, the geometry is rebuilt as clean parametric CAD, and weak points are re-engineered so the replacement outlasts the original.",
    chips: ["Measure-to-CAD", "Legacy parts", "Upgrades"],
    deliverables: [
      "Measured, fully editable CAD of the original part",
      "Fit-check prototype against mating parts",
      "Optional design improvements & material upgrade",
      "Drawing pack for future production",
    ],
    specs: [
      { label: "Input", value: "Physical sample, photos or fragments" },
      { label: "Critical fits", value: "Verified by test print" },
      { label: "Typical turnaround", value: "3 – 7 working days" },
    ],
  },
  {
    id: "printing",
    code: "SVC-04",
    title: "3D Printing",
    group: "Manufacture",
    icon: "print",
    summary:
      "Additive manufacturing in PLA, PETG, ABS, ASA, TPU and fibre-reinforced grades — from one-offs to batch production.",
    detail:
      "Tuned FDM printing across a fleet of calibrated machines. We match material to application — UV-stable ASA outdoors, flexible TPU for seals and grips, carbon-fibre nylon for stiff functional brackets — and dial in layer height, orientation and infill for strength where it counts.",
    chips: ["FDM", "Batch runs", "Functional parts"],
    deliverables: [
      "Printed parts, supports removed & inspected",
      "Orientation & infill optimised for load paths",
      "Heat-set threaded inserts on request",
      "Batch consistency across repeat orders",
    ],
    specs: [
      { label: "Layer height", value: "0.08 – 0.28 mm" },
      { label: "Materials", value: "PLA · PETG · ABS · ASA · TPU · PET-CF" },
      { label: "Batch sizes", value: "1 – 1,000+ units" },
    ],
  },
  {
    id: "prototyping",
    code: "SVC-05",
    title: "Rapid Prototyping",
    group: "Manufacture",
    icon: "prototype",
    summary:
      "Functional prototypes in days, not weeks. Test form, fit and function before you commit a single pound to tooling.",
    detail:
      "Iterate fast with a tight design–print–test loop. We turn revisions around in hours, run fit checks against your mating parts and hand you prototypes that behave like the real thing — so the production design is right first time.",
    chips: ["48 h loops", "Fit & function", "Iterations"],
    deliverables: [
      "Form, fit & function prototypes",
      "Rapid revision cycles (REV A → REV C)",
      "Test feedback captured back into CAD",
      "Production-intent final prototype",
    ],
    specs: [
      { label: "First article", value: "From 48 hours" },
      { label: "Iteration cycle", value: "Same / next day" },
      { label: "Hand-off", value: "Production-ready CAD" },
    ],
  },
  {
    id: "moulding",
    code: "SVC-06",
    title: "Injection Moulding",
    group: "Manufacture",
    icon: "moulding",
    summary:
      "Bridge from prototype to production with mould design, low-volume tooling and moulded runs in engineering thermoplastics.",
    detail:
      "When volumes climb, per-part cost falls off a cliff with injection moulding. We design the part for moulding — draft, uniform walls, gate and ejector locations — then manage tooling and production runs in commodity and engineering thermoplastics.",
    chips: ["Mould design", "Low-volume tooling", "Production"],
    deliverables: [
      "Design-for-moulding review & part updates",
      "Mould tool design and manufacture management",
      "First-off samples for approval",
      "Production runs with batch inspection",
    ],
    specs: [
      { label: "Materials", value: "PP · ABS · ASA · PC · TPE" },
      { label: "Sweet spot", value: "500 – 50,000+ units" },
      { label: "Tooling", value: "Aluminium & steel options" },
    ],
  },
  {
    id: "finishing",
    code: "SVC-07",
    title: "Post Processing",
    group: "Finish",
    icon: "finish",
    summary:
      "Sanding, priming, painting, inserts and assembly — the finishing that turns a printed part into a finished product.",
    detail:
      "Parts leave the workshop ready to use. Support removal, sanding and filling, priming and hand or spray painting, colour matching, heat-set threaded inserts, bonding and full sub-assembly — all inspected before dispatch.",
    chips: ["Painting", "Inserts", "Assembly"],
    deliverables: [
      "Support removal, sanding & filling",
      "Primer, paint & clear-coat finishes",
      "Heat-set brass inserts & hardware",
      "Assembly, inspection & packaging",
    ],
    specs: [
      { label: "Finishes", value: "Raw · Sanded · Primed · Painted" },
      { label: "Hardware", value: "M2 – M8 threaded inserts" },
      { label: "QC", value: "Inspected before dispatch" },
    ],
  },
];

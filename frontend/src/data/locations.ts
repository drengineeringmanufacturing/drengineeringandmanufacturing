export interface FacilityLocation {
  id: "dallas" | "preston";
  name: string;
  city: string;
  region: string;
  country: string;
  flag: string;
  role: string;
  badge: string;
  summary: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // percentage on the world map graphic
    yPercent: number;
  };
  timezone: string;
  utcOffset: string;
  hours: string;
  email: string;
  capabilities: string[];
  features: {
    label: string;
    value: string;
  }[];
}

export const locationsData: Record<"dallas" | "preston", FacilityLocation> = {
  dallas: {
    id: "dallas",
    name: "Dallas, Texas",
    city: "Dallas, TX",
    region: "North America",
    country: "United States",
    flag: "🇺🇸",
    role: "North American Technical Hub & Prototyping Support",
    badge: "North America Hub",
    summary: "Strategic operations hub providing North American clients with rapid prototyping consultations, CAD reviews, and agile domestic distribution.",
    description:
      "Our Dallas facility is strategically positioned to serve clients across the United States and the broader Americas. Serving as our North American technical hub, the Dallas location enables direct client consultation, rapid project scoping, technical CAD file evaluations, and expedited US domestic logistics.",
    coordinates: {
      lat: 32.7767,
      lng: -96.797,
      xPercent: 20.0,
      yPercent: 42.0,
    },
    timezone: "Central Time (CT)",
    utcOffset: "UTC-5 / UTC-6",
    hours: "Monday – Friday: 08:00 – 17:30 CT",
    email: "danial@drengineeringandmanufacturing.com",
    capabilities: [
      "Rapid Prototyping Review & Scoping",
      "Technical Engineering Drawings",
      "3D CAD Modeling Consultations",
      "North American Domestic Distribution",
      "Direct Client Engineering Sessions",
      "Confidential NDA File Transfers",
    ],
    features: [
      { label: "Region Covered", value: "USA, Canada & Americas" },
      { label: "Turnaround", value: "24–48 Hours RFQ Response" },
      { label: "Dispatch", value: "Domestic US Couriers & Air Freight" },
      { label: "Support", value: "Direct Founder & Engineering Review" },
    ],
  },
  preston: {
    id: "preston",
    name: "Preston, UK",
    city: "Preston, Lancashire",
    region: "Europe & United Kingdom",
    country: "United Kingdom",
    flag: "🇬🇧",
    role: "Global Headquarters & Primary Manufacturing Plant",
    badge: "Global HQ & Production Plant",
    summary: "Full-scale engineering and manufacturing headquarters housing advanced CAD suites, additive 3D printing cells, injection moulding tooling, and post-processing.",
    description:
      "Located in the historic engineering region of Lancashire, England, our Preston facility serves as the primary engineering headquarters and manufacturing heart of DR Engineering & Manufacturing. From initial CAD sketches and reverse engineering to industrial 3D printing, injection mould tooling, and surface finishing, all primary production workflows are executed here under rigorous quality standards.",
    coordinates: {
      lat: 53.7632,
      lng: -2.7031,
      xPercent: 49.1,
      yPercent: 26.0,
    },
    timezone: "Greenwich Mean Time (GMT / BST)",
    utcOffset: "UTC+0 / UTC+1",
    hours: "Monday – Friday: 08:00 – 18:00 GMT",
    email: "danial@drengineeringandmanufacturing.com",
    capabilities: [
      "Full 3D CAD Modeling & Parametric Design",
      "Industrial Multi-Material 3D Printing",
      "Injection Moulding Tooling & Production",
      "Reverse Engineering & 3D Scanning",
      "Precision Surface Finishing & Polishing",
      "Sheet Metal Fabrication & Assembly",
    ],
    features: [
      { label: "Facility Type", value: "Full-Scale Production & R&D" },
      { label: "Accuracy", value: "±0.05 mm Critical Tolerances" },
      { label: "Turnaround", value: "48-Hour Rapid Prototyping" },
      { label: "Polymers", value: "12+ Engineering-Grade Materials" },
    ],
  },
};

export const globalOverview = {
  title: "DR Engineering Worldwide",
  eyebrow: "Dual-Facility Global Infrastructure",
  lead:
    "Strategically operating across two continents to deliver round-the-clock engineering agility, localized dispatch, and uncompromising aerospace-grade manufacturing precision.",
  paragraphs: [
    "DR Engineering & Manufacturing has facilities strategically located in Dallas, Texas and Preston, UK to provide rapid service to customers wherever they are located. Our facilities offer local contacts for initial project scoping, CAD modeling reviews, rapid prototyping, injection moulding, and direct ongoing engineering support.",
    "By bridging North America and Europe, we eliminate international delays, provide overlapping timezone communication, and ensure seamless delivery routes across both the United States and the United Kingdom.",
  ],
  stats: [
    { label: "Global Facilities", value: "2" },
    { label: "Continents Covered", value: "North America & Europe" },
    { label: "Prototype Turnaround", value: "48 Hours" },
    { label: "Critical Tolerance", value: "±0.05 mm" },
  ],
};

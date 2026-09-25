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
  contact: {
    email: "danial@drengineeringandmanufacturing.com",
    infoEmail: "info@drengineeringandmanufacturing.com",
    phone: "",
    location: "United Kingdom",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/dr-engineering-manufacturing/",
    instagram: "https://www.instagram.com/drengineeringandmanufacturing",
  },
  aboutStory: {
    title: "About DR Engineering & Manufacturing",
    founder: "Danial Raja",
    lead: "A family-owned British engineering company founded on innovation, precision, and efficiency.",
    paragraphs: [
      "DR Engineering & Manufacturing is a family owned company started with many dreams, inspirations, and motivations. With the world facing shortage in jobs and businesses facing rise in operational costs, Danial Raja the founder of DR Engineering & Manufacturing saw a vision that can help solve both of those issues so DR Engineering & Manufacturing was founded.",
      "Danial is very keen to bring his engineering background full of qualifications and experiences which will be used in DR Engineering & Manufacturing to bring value. At DR Engineering & Manufacturing we prioritise product quality and utmost customer satisfaction by reducing waste and lowered business operation costs.",
      "At DR Engineering & Manufacturing, we specialize in Rapid Prototyping, Technical Engineering Drawings, 3D CAD Modeling, 3D printing, Reverse Engineering, Design support, Surface Finishing, Small Sheet Metal Fabrication, Injection Moulding, and Post Processing.",
      "Help us to help you and make the engineering experience even better. Repeat, loyal, & referred clients can receive discounts on jobs alongside other benefits of doing business with us. So why wait, get in contact now and we look forward to solving your problems and adding more value to your quality!",
    ],
    specialties: [
      "Rapid Prototyping",
      "Technical Engineering Drawings",
      "3D CAD Modeling",
      "3D Printing",
      "Reverse Engineering",
      "Design Support",
      "Surface Finishing",
      "Small Sheet Metal Fabrication",
      "Injection Moulding",
      "Post Processing",
    ],
  },
};

export const navLinks = [
  { id: "capabilities", label: "Capabilities", href: "/#capabilities" },
  { id: "work", label: "Recent Builds", href: "/#work" },
  { id: "products", label: "Products", href: "/products" },
  { id: "process", label: "Process", href: "/#process" },
  { id: "materials", label: "Materials", href: "/#materials" },
  { id: "about", label: "About Us", href: "/about" },
  { id: "contact", label: "Contact Us", href: "/contact" },
] as const;

export type NavId = (typeof navLinks)[number]["id"];

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

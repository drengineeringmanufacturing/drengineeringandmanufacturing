# DR Engineering & Manufacturing — Frontend

Marketing site for DR Engineering & Manufacturing (3D CAD modelling, technical drawings, reverse engineering, 3D printing, rapid prototyping, injection moulding and post-processing).

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Framer Motion · lucide-react
Fonts (Inter, Space Grotesk, JetBrains Mono) are self-hosted in `src/app/fonts` via `next/font/local`.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

```
src/
  app/                layout, page, globals.css (design tokens), icon/favicon, fonts
  components/
    layout/           Navbar (scroll-spy, hide-on-scroll, mobile menu), Footer
    sections/         Hero, StatsBand, Capabilities, WorkExplorer, ParameterLab,
                      Process, Materials, Contact
      hero/           TelemetryConsole + IsoPart (isometric SVG part, CAD/Print/Mould modes)
      lab/            CostCurve (print vs moulding break-even chart)
    hud/              SpecHud — floating material-inspector drawer
    ui/               MagneticButton, TiltCard, Counter, Modal, SectionHeading, …
    SiteProvider.tsx  shared UI state (HUD drawer, quote pre-selection)
  data/               all static content — services, products, materials, process, site
  lib/                estimator (Parameter Lab model), helpers
public/
  logo/dr-badge.png   circular-cropped logo (original: logo/image.png)
  products/           cleaned & renamed product photos
```

## Editing content

All copy, stats and specs live in `src/data/*.ts` — no component changes needed.

- `site.ts` → add real email / phone / location in `contact` (they render automatically once set), headline stats.
- `products.ts` → portfolio items (image path, category, build sheet).
- `materials.ts` → typical material properties used by the Spec HUD and Parameter Lab.

## Notes

- Frontend only: the contact form simulates submission (`Contact.tsx → onSubmit`). Wire it to the backend endpoint when ready.
- Parameter Lab figures are relative indices for illustration, not quotes.
- Motion respects the OS "reduce motion" setting (`MotionConfig reducedMotion="user"`).

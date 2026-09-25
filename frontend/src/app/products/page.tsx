import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteProvider } from "@/components/SiteProvider";
import { fetchLiveProducts } from "@/lib/db-products";
import { ProductCatalogClient } from "./ProductCatalogClient";

export const metadata: Metadata = {
  title: "Products & Catalog | DR Engineering & Manufacturing",
  description:
    "Explore our catalog of precision engineered components, tooling jigs, dashboard pods, and custom prototypes manufactured in-house by DR Engineering & Manufacturing.",
};

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await fetchLiveProducts();

  return (
    <SiteProvider>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-obsidian pt-28 text-silver">
        {/* Ambient lighting & grid */}
        <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
        <div aria-hidden className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-boeing/20 blur-[150px]" />
        <div aria-hidden className="absolute -right-40 top-80 h-[500px] w-[500px] rounded-full bg-aero/20 blur-[150px]" />

        {/* Page Hero */}
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-ping">
              <span className="rounded border border-ping/40 bg-ping/10 px-2 py-0.5">Product Catalog</span>
              <span>In-House Manufacturing</span>
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Precision components &amp; <span className="text-ping">engineered assemblies</span>.
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-steel">
              Browse our range of precision-manufactured automotive upgrades, workshop tooling, electronic enclosures, and bespoke components. Inquire directly or request custom variations for your production run.
            </p>
          </div>
        </div>

        {/* Catalog Client Component */}
        <div className="relative">
          <ProductCatalogClient initialProducts={products} />
        </div>
      </main>
      <Footer />
    </SiteProvider>
  );
}

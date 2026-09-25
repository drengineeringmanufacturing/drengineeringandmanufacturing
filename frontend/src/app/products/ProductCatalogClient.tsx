"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag, ArrowRight, Package, X, Check, ShoppingBag, ExternalLink } from "lucide-react";
import { useSite } from "@/components/SiteProvider";
import { productCategories, Product, ProductCategory } from "@/data/products";
import { MagneticButton } from "@/components/ui/MagneticButton";

import { getCatalogProducts } from "@/lib/products-api";

interface Props {
  initialProducts: Product[];
}

export function ProductCatalogClient({ initialProducts }: Props) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { requestQuote } = useSite();

  // Fetch live products from Superadmin API
  useEffect(() => {
    let isMounted = true;
    getCatalogProducts().then((items) => {
      if (isMounted && items && items.length > 0) {
        setProductsList(items);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return ["All", "Automotive", "Tooling", "Prototypes", "Home & Office", "Custom"];
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.code.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  const handleInquire = (product: Product) => {
    requestQuote();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-midnight/80 p-4 backdrop-blur-xl shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-aero text-navy-950 font-semibold shadow-md shadow-aero/20"
                  : "bg-white/5 text-silver hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or tags..."
            className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:border-aero focus:outline-none focus:ring-1 focus:ring-aero transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</span>
        {selectedCategory !== "All" && (
          <span>Category: <strong className="text-white">{selectedCategory}</strong></span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-midnight/40 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">No products found</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
            We couldn't find any products matching your active filters. Try searching with different terms.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-midnight/70 backdrop-blur-md hover:border-aero/50 hover:shadow-xl hover:shadow-aero/5 transition-all duration-300"
            >
              {/* Product Thumbnail */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-black/40 cursor-pointer"
              >
                <Image
                  src={product.image || "/products/dr-showcase-hero.jpg"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-60" />

                {/* Price Pill */}
                {Boolean(product.price) && (
                  <div className="absolute top-3 right-3 rounded-lg border border-white/15 bg-black/70 px-2.5 py-1 backdrop-blur-md">
                    <span className="font-mono text-xs font-bold text-aero">
                      £{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Code Pill */}
                <div className="absolute top-3 left-3 rounded-lg border border-white/15 bg-black/70 px-2 py-0.5 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-slate-300">
                    {product.code}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-aero/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-aero">
                    {product.category}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedProduct(product)}
                  className="mt-2.5 font-display text-base font-semibold text-white hover:text-aero transition-colors cursor-pointer line-clamp-1"
                >
                  {product.title}
                </h3>

                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
                  {product.summary}
                </p>

                {/* Tags */}
                {product.process && product.process.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.process.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-white/5 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleInquire(product)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-aero px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-sky-300 transition-colors shadow-sm"
                  >
                    <span>Order / Inquire</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-obsidian text-silver overflow-hidden shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 rounded-full border border-white/10 bg-black/60 p-2 text-slate-300 hover:text-white hover:bg-black/90 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                <Image
                  src={selectedProduct.image || "/products/dr-showcase-hero.jpg"}
                  alt={selectedProduct.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                  <span className="font-mono text-xs text-aero font-bold">
                    £{Number(selectedProduct.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded-full bg-aero/10 px-2.5 py-0.5 text-aero font-medium">
                    {selectedProduct.category}
                  </span>
                  <span className="text-slate-400">{selectedProduct.code}</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-white">
                  {selectedProduct.title}
                </h2>

                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedProduct.summary}
                </p>

                {/* Process Steps / Tags */}
                {selectedProduct.process && selectedProduct.process.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-aero mb-2">
                      Capabilities &amp; Process
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.process.map((p, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer action */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-slate-400">Manufactured in-house</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      DR Engineering &amp; Manufacturing
                    </span>
                  </div>

                  <MagneticButton
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      handleInquire(prod);
                    }}
                  >
                    Order / Request Quote <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

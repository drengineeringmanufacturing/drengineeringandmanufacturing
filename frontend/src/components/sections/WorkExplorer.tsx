"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Modal } from "@/components/ui/Modal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import { productCategories, products, type Product } from "@/data/products";
import { cn } from "@/lib/cn";

type Filter = (typeof productCategories)[number];

export function WorkExplorer() {
  const [productList, setProductList] = useState<Product[]>(products);
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<{ index: number; dir: number } | null>(null);
  const { requestQuote } = useSite();

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.products && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const visible = useMemo(
    () => (filter === "All" ? productList : productList.filter((p) => p.category === filter)),
    [filter, productList]
  );

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((o) => (o ? { index: (o.index + dir + visible.length) % visible.length, dir } : o)),
    [visible.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open ? visible[open.index] : null;

  return (
    <section id="work" className="relative overflow-hidden bg-paper py-24 text-navy-950 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid-light mask-fade-y" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <SectionHeading
            tone="light"
            index="02"
            eyebrow="Recent builds"
            title={
              <>
                Parts that leave the screen <span className="text-aero">and work in the real world.</span>
              </>
            }
            description="A cross-section of recent builds — automotive fitments, shop tooling, prototypes and custom pieces. Click any build to inspect details."
          />

          {/* Main Showcase Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60"
          >
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              <div className="relative min-h-[340px] sm:min-h-[420px] overflow-hidden bg-slate-100">
                <Image
                  src="/products/dr-showcase-hero.jpg"
                  alt="Manufactured parts by DR Engineering & Manufacturing"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="font-mono text-xs font-semibold text-white">Made by DR Engineering &amp; Manufacturing</span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-aero">
                  <span className="h-2 w-2 rounded-full bg-aero animate-pulse" />
                  Workshop Showcase
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl lg:text-4xl">
                  Real parts engineered, printed &amp; manufactured in-house.
                </h3>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                  A cross-section of actual physical production parts and assemblies crafted in our workshop — including precision mounting brackets, functional drill jigs, multi-stage gear demonstrators, and custom relief emblems.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] text-slate-700">
                    3D CAD &amp; Reverse Eng.
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] text-slate-700">
                    PET-CF · ASA · PETG · PLA
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] text-slate-700">
                    Finished Assemblies
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <div role="tablist" aria-label="Filter work" className="flex w-max gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              {productCategories.map((c) => {
                const on = filter === c;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(c)}
                    className={cn(
                      "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      on ? "text-white" : "text-slate-600 hover:text-navy-950"
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="work-pill"
                        className="absolute inset-0 rounded-full bg-boeing shadow-[0_6px_20px_-6px_rgba(0,51,160,0.7)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div layout className="mt-14 grid auto-rows-[300px] grid-flow-dense gap-4 sm:grid-cols-2 lg:auto-rows-[280px] lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const featured = filter === "All" && i === 0;
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 150, damping: 22, delay: Math.min(i, 8) * 0.04 }}
                  className={cn(featured && "sm:col-span-2 sm:row-span-2")}
                >
                  <WorkCard product={p} featured={featured} onOpen={() => setOpen({ index: i, dir: 0 })} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <Modal open={!!current} onClose={close} tone="light" labelledBy="work-modal-title" className="sm:max-w-6xl">
        {current && open && (
          <WorkDetail
            product={current}
            dir={open.dir}
            position={`${String(open.index + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onQuote={() => {
              close();
              requestQuote(current.process.includes("Reverse Engineering") ? "reverse" : "printing");
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function WorkCard({ product, featured, onOpen }: { product: Product; featured: boolean; onOpen: () => void }) {
  return (
    <TiltCard max={featured ? 4 : 7} glare="light" className="group h-full rounded-2xl">
      <button
        onClick={onOpen}
        className="relative block h-full w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_0_rgba(0,34,68,0.04),0_20px_50px_-30px_rgba(0,34,68,0.45)] ring-1 ring-slate-200 transition-shadow duration-500 hover:shadow-[0_30px_70px_-30px_rgba(0,51,160,0.55)] focus-visible:outline-2 focus-visible:outline-aero"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes={featured ? "(min-width:1280px) 50vw, (min-width:640px) 66vw, 100vw" : "(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
          className={cn(
            "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]",
            product.contain ? "object-contain p-8" : "object-cover"
          )}
          style={product.focus ? { objectPosition: product.focus } : undefined}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 via-40% to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-boeing backdrop-blur">
            {product.category}
          </span>
        </div>
        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-boeing opacity-0 transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5" style={{ transform: "translateZ(40px)" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">{product.code}</p>
          <h3 className={cn("mt-1.5 font-display font-semibold leading-tight text-white", featured ? "text-2xl sm:text-3xl" : "text-lg")}>
            {product.title}
          </h3>
          {featured && <p className="mt-2 hidden max-w-md text-sm text-white/75 sm:block">{product.summary}</p>}
          <div className="mt-3 flex max-h-0 flex-wrap gap-1.5 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100">
            {product.process.map((p) => (
              <span key={p} className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/90 backdrop-blur">
                {p}
              </span>
            ))}
          </div>
        </div>
      </button>
    </TiltCard>
  );
}

interface WorkDetailProps {
  product: Product;
  dir: number;
  position: string;
  onPrev: () => void;
  onNext: () => void;
  onQuote: () => void;
}

function WorkDetail({ product, dir, position, onPrev, onNext, onQuote }: WorkDetailProps) {
  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[620px]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={product.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNext();
              else if (info.offset.x > 80) onPrev();
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              quality={90}
              draggable={false}
              className={cn("pointer-events-none select-none", product.contain ? "object-contain p-10" : "object-cover")}
              style={product.focus ? { objectPosition: product.focus } : undefined}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <button onClick={onPrev} aria-label="Previous part" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy-950 shadow backdrop-blur transition hover:bg-white hover:text-aero">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={onNext} aria-label="Next part" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy-950 shadow backdrop-blur transition hover:bg-white hover:text-aero">
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="rounded-full bg-navy-950/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white backdrop-blur">{position}</span>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col p-6 sm:p-10"
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className="rounded-full bg-boeing/10 px-2.5 py-1 text-boeing">{product.category}</span>
            <span className="text-slate-500">{product.code}</span>
          </div>
          <h3 id="work-modal-title" className="mt-5 font-display text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            {product.title}
          </h3>
          <p className="mt-4 leading-relaxed text-slate-600">{product.summary}</p>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-aero">Process chain</p>
          <ol className="mt-3 flex flex-wrap items-center gap-1.5">
            {product.process.map((p, i) => (
              <li key={p} className="flex items-center gap-1.5">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="rounded-lg border border-slate-200 bg-paper px-2.5 py-1.5 text-xs font-medium text-navy-950"
                >
                  <span className="mr-1.5 font-mono text-[10px] text-aero">{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </motion.span>
                {i < product.process.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
              </li>
            ))}
          </ol>

          <div className="mt-auto pt-10">
            <MagneticButton onClick={onQuote}>
              Start a similar project <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { navLinks, site, type NavId } from "@/data/site";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  // Scroll-spy
  useEffect(() => {
    const ids = [...navLinks.map((l) => l.id), "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as NavId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    const top = document.getElementById("top");
    const topObs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "-45% 0px -50% 0px" });
    if (top) topObs.observe(top);
    return () => {
      obs.disconnect();
      topObs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "relative mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:px-4",
            scrolled || open
              ? "border-white/10 bg-obsidian/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border-white/[0.06] bg-obsidian/30 backdrop-blur-md"
          )}
        >
          <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <span className="relative grid h-10 w-10 place-items-center">
              <motion.span
                aria-hidden
                className="absolute -inset-1 rounded-full border border-dashed border-ping/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
              <motion.span whileHover={{ rotate: -12, scale: 1.06 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="relative block h-10 w-10">
                <Image src="/logo/dr-badge.png" alt="" fill sizes="40px" className="rounded-full bg-white object-contain" preload />
              </motion.span>
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] font-semibold tracking-tight text-white">DR Engineering</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.28em] text-slate-steel">&amp; Manufacturing</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const on = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className={cn(
                      "relative block px-3.5 py-2 text-sm font-medium transition-colors",
                      on ? "text-white" : "text-slate-steel hover:text-white"
                    )}
                  >
                    {l.label}
                    {on && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-aero to-ping shadow-[0_0_12px_rgba(56,189,248,0.9)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <MagneticButton href="#contact" className="px-5 py-2.5">
                Start a Project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* scroll progress */}
          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-4 -bottom-px h-px origin-left bg-gradient-to-r from-boeing via-aero to-ping"
          />
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-obsidian/95 backdrop-blur-xl lg:hidden"
          >
            <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
              className="relative flex h-full flex-col justify-center gap-2 px-6"
            >
              {[...navLinks, { id: "contact" as const, label: "Contact" }].map((l, i) => (
                <motion.li
                  key={l.id}
                  variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/[0.06] py-4 font-display text-3xl font-semibold text-white"
                  >
                    <span className="font-mono text-xs text-ping">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mt-8">
                <MagneticButton href="#contact" onClick={() => setOpen(false)}>
                  Start a Project <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

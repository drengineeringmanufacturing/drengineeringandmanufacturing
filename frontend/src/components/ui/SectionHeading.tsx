"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "dark",
  align = "left",
  className,
  children,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <motion.div
        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        className={cn(
          "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em]",
          dark ? "text-ping" : "text-aero"
        )}
      >
        <span className={cn("rounded border px-1.5 py-0.5", dark ? "border-ping/30 bg-ping/5" : "border-aero/30 bg-aero/5")}>
          {index}
        </span>
        <span className={cn("h-px w-8", dark ? "bg-ping/40" : "bg-aero/40")} />
        <span>{eyebrow}</span>
      </motion.div>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 24 },
          show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
        }}
        className={cn(
          "text-balance max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-navy-950"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-slate-steel" : "text-slate-600"
          )}
        >
          {description}
        </motion.p>
      )}
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "light";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  strength?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(110deg,#0033A0,#0066CC_45%,#00A3E0_70%,#0066CC)] bg-[length:220%_100%] bg-left hover:bg-right shadow-[0_10px_40px_-10px_rgba(0,102,204,0.8)] border border-white/10",
  ghost:
    "text-silver bg-white/[0.03] hover:bg-white/[0.08] border border-white/15 hover:border-ping/50 backdrop-blur-md",
  light:
    "text-boeing bg-white hover:bg-silver border border-white shadow-[0_10px_40px_-12px_rgba(255,255,255,0.5)]",
};

export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  strength = 0.35,
  disabled,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      {variant === "primary" && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(56,189,248,0.0)",
              "0 0 0 6px rgba(56,189,248,0.18)",
              "0 0 0 0 rgba(56,189,248,0.0)",
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const shared = cn(
    "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-[background-position,background-color,border-color,color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ping disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-flex"
    >
      {href ? (
        <motion.a
          href={href}
          onClick={onClick}
          aria-label={ariaLabel}
          className={shared}
          whileTap={{ scale: 0.96 }}
        >
          {inner}
        </motion.a>
      ) : (
        <motion.button
          type={type}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          className={shared}
          whileTap={{ scale: 0.96 }}
        >
          {inner}
        </motion.button>
      )}
    </motion.div>
  );
}

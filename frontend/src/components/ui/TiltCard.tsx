"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  glare?: "dark" | "light";
}

export function TiltCard({
  children,
  className,
  max = 8,
  glare = "dark",
  onPointerMove,
  onPointerLeave,
  style,
  ...rest
}: TiltCardProps) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 180, damping: 18 });
  const smy = useSpring(my, { stiffness: 180, damping: 18 });

  const rotateX = useTransform(smy, [0, 1], [max, -max]);
  const rotateY = useTransform(smx, [0, 1], [-max, max]);
  const gx = useTransform(smx, (v) => `${v * 100}%`);
  const gy = useTransform(smy, (v) => `${v * 100}%`);
  const glareColor = glare === "dark" ? "rgba(56,189,248,0.16)" : "rgba(0,102,204,0.10)";
  const background = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, ${glareColor}, transparent 60%)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      {...rest}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, ...style }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
    </motion.div>
  );
}

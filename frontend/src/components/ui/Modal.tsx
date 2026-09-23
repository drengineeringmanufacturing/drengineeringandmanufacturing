"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  tone?: "dark" | "light";
  className?: string;
}

export function Modal({ open, onClose, children, labelledBy, tone = "dark", className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="Close dialog"
            onClick={onClose}
            className={cn(
              "absolute inset-0 cursor-default backdrop-blur-md",
              tone === "dark" ? "bg-obsidian/80" : "bg-navy-950/60"
            )}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={cn(
              "relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl outline-none hud-scroll sm:max-w-5xl sm:rounded-3xl",
              tone === "dark"
                ? "border border-ping/15 bg-midnight shadow-[0_40px_140px_-30px_rgba(0,102,204,0.6)]"
                : "bg-white shadow-[0_40px_140px_-30px_rgba(0,34,68,0.6)]",
              className
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className={cn(
                "absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border transition-colors",
                tone === "dark"
                  ? "border-white/10 bg-white/5 text-silver hover:border-ping/50 hover:text-white"
                  : "border-slate-200 bg-white/90 text-navy-950 hover:border-aero hover:text-aero"
              )}
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

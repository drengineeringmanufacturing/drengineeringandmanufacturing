"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface SiteState {
  hudOpen: boolean;
  hudMaterial: string;
  openHud: (materialId?: string) => void;
  closeHud: () => void;
  setHudMaterial: (id: string) => void;
  quoteService: string;
  setQuoteService: (id: string) => void;
  requestQuote: (serviceId?: string) => void;
}

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [hudOpen, setHudOpen] = useState(false);
  const [hudMaterial, setHudMaterial] = useState("petg");
  const [quoteService, setQuoteService] = useState("");

  const openHud = useCallback((materialId?: string) => {
    if (materialId) setHudMaterial(materialId);
    setHudOpen(true);
  }, []);

  const closeHud = useCallback(() => setHudOpen(false), []);

  const requestQuote = useCallback((serviceId?: string) => {
    if (serviceId) setQuoteService(serviceId);
    setHudOpen(false);
    // let any open modal / drawer release the scroll lock first
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  const value = useMemo(
    () => ({ hudOpen, hudMaterial, openHud, closeHud, setHudMaterial, quoteService, setQuoteService, requestQuote }),
    [hudOpen, hudMaterial, openHud, closeHud, quoteService, requestQuote]
  );

  return (
    <SiteContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}

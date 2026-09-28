"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ArrowRight,
  Globe2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Building2,
  Compass,
} from "lucide-react";
import { locationsData, globalOverview, FacilityLocation } from "@/data/locations";
import { cn } from "@/lib/cn";

type TabMode = "all" | "dallas" | "preston";

interface LocationsSectionProps {
  id?: string;
  isFullPage?: boolean;
}

export function LocationsSection({ id = "locations", isFullPage = false }: LocationsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("all");
  const [hoveredPin, setHoveredPin] = useState<TabMode | null>(null);

  const tabs: { id: TabMode; label: string; mobileLabel: string; flag?: string; subtitle?: string }[] = [
    { id: "all", label: "Worldwide", mobileLabel: "Worldwide", flag: "🌐", subtitle: "Dual-Facility" },
    { id: "dallas", label: "Dallas, Texas", mobileLabel: "Dallas, TX", flag: "🇺🇸", subtitle: "North America" },
    { id: "preston", label: "Preston, UK", mobileLabel: "Preston, UK", flag: "🇬🇧", subtitle: "Global HQ & Plant" },
  ];

  const activeFacility: FacilityLocation | null =
    activeTab === "all" ? null : locationsData[activeTab];

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-[#001f4d] via-[#003882] to-[#060b14] text-white",
        isFullPage ? "pt-24 pb-20 sm:pt-32 sm:pb-28" : "py-20 sm:py-28"
      )}
    >
      {/* Background Blueprint Grid & Lighting */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[800px] rounded-full bg-ping/15 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-boeing/30 blur-[140px] pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Compass className="h-4 w-4 text-ping animate-spin-slow" />
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-ping">
              Global Operations
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-xs text-white/90">2 Facilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            DR Locations
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200"
          >
            Operating across North America and Europe to ensure fast prototyping lead times,
            localized client support, and precision engineering delivery.
          </motion.p>
        </div>

        {/* Navigation Tabs (Inspired by Stolle Locations) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}
          className="mt-8 sm:mt-10 w-full max-w-xl mx-auto px-2"
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center justify-center gap-2 rounded-full border px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 backdrop-blur-xl shadow-lg",
                  isSelected
                    ? "border-ping/60 bg-gradient-to-r from-aero to-boeing text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-105"
                    : "border-white/15 bg-midnight/80 text-slate-300 hover:border-white/30 hover:bg-midnight hover:text-white"
                )}
              >
                <span className="text-sm sm:text-base shrink-0">{tab.flag}</span>
                <span>{tab.label}</span>
                {tab.subtitle && (
                  <span
                    className={cn(
                      "hidden sm:inline-block rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wide",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-slate-400"
                    )}
                  >
                    {tab.subtitle}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Interactive World Map Canvas */}
        <div className="relative mt-10 rounded-3xl border border-white/20 bg-gradient-to-b from-[#00427a]/90 via-[#002f5e]/90 to-[#001e3d]/90 p-4 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Subtle World Map background image */}
          <div className="relative w-full h-[220px] sm:h-[360px] md:h-[440px] lg:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-[#003868]/40 border border-white/10">
            <Image
              src="/images/dr-world-map.png"
              alt="DR Engineering & Manufacturing Global Facilities Map"
              fill
              className="object-contain object-center opacity-85 select-none pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />

            {/* Connecting Arc SVG between Dallas & Preston */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00a3e0" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Curved line connecting Dallas (20.0%, 42.0%) and Preston (49.1%, 26.0%) */}
              <motion.path
                d="M 20.0 42.0 Q 34 16 49.1 26.0"
                fill="none"
                stroke="url(#bridgeGradient)"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: activeTab === "all" ? 0.9 : 0.4 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </svg>

            {/* Dallas, Texas Pin (x=20.0%, y=42.0%) */}
            <div
              className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group"
              style={{ left: "20.0%", top: "42.0%" }}
              onClick={() => setActiveTab("dallas")}
              onMouseEnter={() => setHoveredPin("dallas")}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div className="relative flex items-center justify-center">
                {/* Concentric radar rings */}
                <span
                  className={cn(
                    "absolute -inset-3 rounded-full bg-ping/30 animate-ping",
                    activeTab === "dallas" || activeTab === "all" ? "opacity-100" : "opacity-30"
                  )}
                />
                {(activeTab === "dallas" || hoveredPin === "dallas") && (
                  <span className="absolute -inset-6 rounded-full border border-ping/60 animate-pulse" />
                )}
                {/* Center marker */}
                <div
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 transition-transform duration-300 flex items-center justify-center",
                    activeTab === "dallas"
                      ? "bg-ping border-white scale-125 shadow-[0_0_20px_#38bdf8]"
                      : "bg-[#00a3e0] border-white/80 group-hover:scale-125"
                  )}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-obsidian" />
                </div>
              </div>

              {/* Pin Tooltip/Label */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-7 sm:top-8 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-medium shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none",
                  activeTab === "dallas"
                    ? "border-ping bg-navy-950/95 text-white scale-105 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                    : "border-white/20 bg-midnight/90 text-slate-200"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span>🇺🇸</span>
                  <span className="font-semibold">Dallas, Texas</span>
                </div>
              </motion.div>
            </div>

            {/* Preston, UK Pin (x=49.1%, y=26.0%) */}
            <div
              className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20 group"
              style={{ left: "49.1%", top: "26.0%" }}
              onClick={() => setActiveTab("preston")}
              onMouseEnter={() => setHoveredPin("preston")}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div className="relative flex items-center justify-center">
                {/* Concentric radar rings */}
                <span
                  className={cn(
                    "absolute -inset-3 rounded-full bg-ping/30 animate-ping",
                    activeTab === "preston" || activeTab === "all" ? "opacity-100" : "opacity-30"
                  )}
                />
                {(activeTab === "preston" || hoveredPin === "preston") && (
                  <span className="absolute -inset-6 rounded-full border border-ping/60 animate-pulse" />
                )}
                {/* Center marker */}
                <div
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 transition-transform duration-300 flex items-center justify-center",
                    activeTab === "preston"
                      ? "bg-ping border-white scale-125 shadow-[0_0_20px_#38bdf8]"
                      : "bg-[#00a3e0] border-white/80 group-hover:scale-125"
                  )}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-obsidian" />
                </div>
              </div>

              {/* Pin Tooltip/Label */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-7 sm:top-8 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-medium shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none",
                  activeTab === "preston"
                    ? "border-ping bg-navy-950/95 text-white scale-105 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                    : "border-white/20 bg-midnight/90 text-slate-200"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span className="font-semibold">Preston, UK</span>
                </div>
              </motion.div>
            </div>

            {/* Quick Map Legend (Bottom Right) */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-3 rounded-lg border border-white/10 bg-navy-950/80 px-3 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ping shadow-[0_0_6px_#38bdf8]" />
                Active Facility
              </span>
              <span className="text-white/20">|</span>
              <span className="hidden sm:inline text-slate-400">Click pins to inspect</span>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activeTab === "all" ? (
                /* Global Overview Panel */
                <motion.div
                  key="all"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
                >
                  <div className="rounded-2xl border border-white/10 bg-midnight/60 p-6 sm:p-8 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-ping/20 p-2 text-ping">
                        <Globe2 className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                          {globalOverview.title}
                        </h3>
                        <p className="font-mono text-xs uppercase tracking-wider text-ping">
                          {globalOverview.eyebrow}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-300">
                      {globalOverview.paragraphs.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab("dallas")}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        <span>🇺🇸</span> Explore Dallas Hub <ArrowRight className="h-3.5 w-3.5 text-ping" />
                      </button>
                      <button
                        onClick={() => setActiveTab("preston")}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        <span>🇬🇧</span> Explore Preston HQ <ArrowRight className="h-3.5 w-3.5 text-ping" />
                      </button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Dallas summary card */}
                    <div
                      onClick={() => setActiveTab("dallas")}
                      className="group cursor-pointer rounded-2xl border border-white/10 bg-midnight/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-ping/50 hover:bg-midnight/90"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🇺🇸</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-ping">
                          North America
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-ping transition-colors">
                        Dallas, Texas
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-300 line-clamp-2">
                        {locationsData.dallas.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                        <span>Central Time (CT)</span>
                        <span className="text-ping font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View Hub <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                    {/* Preston summary card */}
                    <div
                      onClick={() => setActiveTab("preston")}
                      className="group cursor-pointer rounded-2xl border border-white/10 bg-midnight/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-ping/50 hover:bg-midnight/90"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🇬🇧</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-ping">
                          Europe &amp; UK
                        </span>
                      </div>
                      <h4 className="mt-3 font-display text-lg font-bold text-white group-hover:text-ping transition-colors">
                        Preston, UK
                      </h4>
                      <p className="mt-1.5 text-xs text-slate-300 line-clamp-2">
                        {locationsData.preston.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                        <span>Greenwich Mean (GMT)</span>
                        <span className="text-ping font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          View HQ <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                    {/* Stats banner spanning 2 columns */}
                    <div className="sm:col-span-2 rounded-2xl border border-ping/20 bg-gradient-to-r from-boeing/40 via-midnight to-ping/10 p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {globalOverview.stats.map((s) => (
                          <div key={s.label}>
                            <p className="font-display text-xl sm:text-2xl font-bold text-white">
                              {s.value}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-300 mt-0.5">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Facility Specific Panel (Dallas or Preston) */
                activeFacility && (
                  <motion.div
                    key={activeFacility.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-6 lg:grid-cols-[1.3fr_1fr]"
                  >
                    {/* Facility Details */}
                    <div className="rounded-2xl border border-white/10 bg-midnight/70 p-6 sm:p-8 backdrop-blur-md">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl sm:text-4xl">{activeFacility.flag}</span>
                          <div>
                            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                              {activeFacility.name}
                            </h3>
                            <p className="font-mono text-xs uppercase tracking-wider text-ping">
                              {activeFacility.role}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active Operational Facility
                        </span>
                      </div>

                      <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-200">
                        {activeFacility.description}
                      </p>

                      {/* Key Capabilities */}
                      <div className="mt-6">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ping">
                          Key Capabilities &amp; Workflows
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {activeFacility.capabilities.map((cap) => (
                            <div
                              key={cap}
                              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-slate-200"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-ping shrink-0" />
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact / Inquire Action */}
                      <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ping to-aero px-5 py-2.5 text-xs font-semibold text-obsidian shadow-lg shadow-ping/20 hover:brightness-110 transition-all"
                        >
                          Inquire with {activeFacility.name} Team <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <a
                          href={`mailto:${activeFacility.email}?subject=Inquiry%20regarding%20${encodeURIComponent(activeFacility.name)}%20facility`}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5 text-ping" /> Direct Email
                        </a>
                      </div>
                    </div>

                    {/* Facility Stats & Operating Card */}
                    <div className="flex flex-col gap-4">
                      {/* Operational Info Card */}
                      <div className="rounded-2xl border border-white/10 bg-midnight/70 p-6 backdrop-blur-md">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ping">
                          Operational Profile
                        </p>
                        <h4 className="mt-1 font-display text-xl font-bold text-white">
                          Facility Highlights
                        </h4>

                        <dl className="mt-5 space-y-3">
                          {activeFacility.features.map((feat) => (
                            <div
                              key={feat.label}
                              className="flex items-center justify-between border-b border-white/[0.07] pb-2 text-xs"
                            >
                              <dt className="text-slate-400">{feat.label}</dt>
                              <dd className="font-semibold text-white text-right">{feat.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      {/* Schedule & Timezone Card */}
                      <div className="rounded-2xl border border-white/10 bg-midnight/70 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-ping/20 p-2 text-ping">
                            <Clock className="h-5 w-5" />
                          </span>
                          <div>
                            <h4 className="font-display text-base font-semibold text-white">
                              Operating Hours &amp; Timezone
                            </h4>
                            <p className="font-mono text-xs text-slate-300">
                              {activeFacility.timezone} ({activeFacility.utcOffset})
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                          {activeFacility.hours}
                        </p>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[11px] text-slate-300">
                          <span className="font-semibold text-white">Rapid Quoting:</span> RFQ and CAD
                          submissions are monitored continuously across both Dallas and Preston operating windows.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

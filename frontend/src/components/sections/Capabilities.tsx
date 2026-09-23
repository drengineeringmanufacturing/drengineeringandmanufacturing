"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, MessagesSquare } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSite } from "@/components/SiteProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Modal } from "@/components/ui/Modal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceGlyph } from "@/components/ui/ServiceGlyph";
import { TiltCard } from "@/components/ui/TiltCard";
import { serviceGroups, services, type Service } from "@/data/services";
import { cn } from "@/lib/cn";

type Filter = (typeof serviceGroups)[number];

export function Capabilities() {
  const [filter, setFilter] = useState<Filter>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const { requestQuote } = useSite();

  const visible = useMemo(
    () => (filter === "All" ? services : services.filter((s) => s.group === filter)),
    [filter]
  );
  const active = services.find((s) => s.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  return (
    <section id="capabilities" className="relative overflow-hidden bg-obsidian py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-50 mask-fade-y" />
      <div aria-hidden className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-boeing/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="01"
            eyebrow="Capabilities"
            title={
              <>
                An end-to-end engineering cell —{" "}
                <span className="text-slate-steel">from first sketch to final finish.</span>
              </>
            }
            description="Seven disciplines, one accountable team. Pick a capability to inspect its deliverables, specs and turnaround."
          />

          {/* Filter pills */}
          <div className="-mx-4 shrink-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Filter capabilities" className="flex w-max gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
            {serviceGroups.map((g) => {
              const on = filter === g;
              const count = g === "All" ? services.length : services.filter((s) => s.group === g).length;
              return (
                <button
                  key={g}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(g)}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    on ? "text-white" : "text-slate-steel hover:text-silver"
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="cap-pill"
                      className="absolute inset-0 rounded-full border border-ping/30 bg-gradient-to-r from-boeing/80 to-aero/80"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {g}
                    <span className={cn("font-mono text-[10px]", on ? "text-ping" : "text-slate-steel/70")}>{String(count).padStart(2, "0")}</span>
                  </span>
                </button>
              );
            })}
          </div>
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 160, damping: 22, delay: i * 0.04 }}
              >
                <ServiceCard service={s} onOpen={() => setOpenId(s.id)} />
              </motion.div>
            ))}
            {filter === "All" && (
              <motion.div
                key="cta-tile"
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.3 }}
                className="flex"
              >
                <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-aero/40 bg-gradient-to-br from-boeing via-aero to-aero-bright p-6">
                  <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
                  <div className="relative">
                    <MessagesSquare className="h-6 w-6 text-white" />
                    <h3 className="mt-5 font-display text-xl font-semibold text-white">Not sure which service you need?</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      Describe the problem, not the process. An engineer will recommend the fastest route to a working part.
                    </p>
                  </div>
                  <button
                    onClick={() => requestQuote()}
                    className="relative mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-boeing transition-transform hover:translate-x-1"
                  >
                    Talk to an engineer <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <Modal open={!!active} onClose={close} labelledBy="service-modal-title">
        {active && <ServiceDetail service={active} onQuote={() => { close(); requestQuote(active.id); }} />}
      </Modal>
    </section>
  );
}

function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  return (
    <TiltCard className="group h-full rounded-2xl">
      <button
        onClick={onOpen}
        className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 text-left transition-colors duration-300 hover:border-ping/40 focus-visible:outline-2 focus-visible:outline-ping"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ping/0 to-transparent transition-all duration-500 group-hover:via-ping/70" />
        <div className="flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-ping/25 bg-ping/[0.07] text-ping transition-all duration-300 group-hover:bg-ping/15 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            <ServiceGlyph icon={service.icon} className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-steel">{service.code}</span>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ping/80">{service.group}</p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-white">{service.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-steel">{service.summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {service.chips.map((c) => (
            <span key={c} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-silver/80">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-sm font-medium text-silver">
          <span>Inspect specs</span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 transition-all duration-300 group-hover:rotate-45 group-hover:border-ping/60 group-hover:bg-ping/10 group-hover:text-ping">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </button>
    </TiltCard>
  );
}

function ServiceDetail({ service, onQuote }: { service: Service; onQuote: () => void }) {
  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr]">
      <div className="relative p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-ping/30 bg-ping/10 text-ping">
            <ServiceGlyph icon={service.icon} className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-steel">
            <p className="text-ping">{service.code}</p>
            <p>{service.group}</p>
          </div>
        </div>
        <h3 id="service-modal-title" className="mt-6 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {service.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-slate-steel">{service.detail}</p>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-ping">Deliverables</p>
        <ul className="mt-3 grid gap-2.5">
          {service.deliverables.map((d, i) => (
            <motion.li
              key={d}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex items-start gap-3 text-sm text-silver"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/15 text-signal">
                <Check className="h-3 w-3" />
              </span>
              {d}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="relative border-t border-white/[0.06] bg-obsidian/60 p-6 sm:p-10 lg:border-l lg:border-t-0">
        <div aria-hidden className="absolute inset-0 bg-grid-fine" />
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-steel">Spec sheet</p>
          <dl className="mt-4 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-midnight/80">
            {service.specs.map((sp, i) => (
              <motion.div
                key={sp.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex flex-col gap-1 px-4 py-3.5"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-steel">{sp.label}</dt>
                <dd className="text-sm font-medium text-white">{sp.value}</dd>
              </motion.div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton onClick={onQuote}>
              Quote this service <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}

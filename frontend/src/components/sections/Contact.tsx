"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileUp, LoaderCircle, Mail, MapPin, Paperclip, Phone, RotateCcw, Send, X } from "lucide-react";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { useSite } from "@/components/SiteProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent";

const inputCls =
  "peer w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 pb-2.5 pt-6 text-sm text-white placeholder-transparent outline-none transition-colors focus:border-white/60 focus:bg-white/[0.1]";
const labelCls =
  "pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors peer-focus:text-white";

export function Contact() {
  const { quoteService, setQuoteService } = useSite();
  const [status, setStatus] = useState<Status>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((f) => [...f, ...Array.from(list)].slice(0, 6));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Frontend-only: simulate a request until the backend endpoint exists.
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 1400);
  };

  const reset = () => {
    formRef.current?.reset();
    setFiles([]);
    setQuoteService("");
    setStatus("idle");
  };

  const contactItems = [
    site.contact.email && { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    site.contact.phone && { icon: Phone, label: "Phone", value: site.contact.phone, href: `tel:${site.contact.phone.replace(/\s/g, "")}` },
    site.contact.location && { icon: MapPin, label: "Workshop", value: site.contact.location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-boeing via-[#0047B3] to-aero py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-grid opacity-40" />
      <div aria-hidden className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-aero-bright/40 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-40 -left-20 h-[480px] w-[480px] rounded-full bg-navy-900/70 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white/80"
          >
            <span className="rounded border border-white/30 bg-white/10 px-1.5 py-0.5">05</span>
            <span className="h-px w-8 bg-white/40" />
            Contact Us &amp; Start a project
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="text-balance mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Have a part in mind? Let&apos;s engineer it.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/80"
          >
            Send a sketch, a photo, a broken part or a full CAD assembly. An engineer reviews every request and comes back with
            the fastest route to a working part.
          </motion.p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { k: "01", t: "Share anything", d: "Sketches, photos, STEP/STL or the part itself." },
              { k: "02", t: "Engineer review", d: "Feasibility, process and material recommendation." },
              { k: "03", t: "Clear quote", d: "Scope, lead time and price — no surprises." },
            ].map((s, i) => (
              <motion.li
                key={s.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/60">{s.k}</p>
                <p className="mt-2 font-semibold text-white">{s.t}</p>
                <p className="mt-1 text-sm text-white/70">{s.d}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" /> {site.contact.email}
            </a>
            {site.contact.infoEmail && (
              <a
                href={`mailto:${site.contact.infoEmail}`}
                className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> {site.contact.infoEmail}
              </a>
            )}
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              Instagram (@drengineeringandmanufacturing)
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-navy-900/60 p-6 shadow-[0_40px_120px_-30px_rgba(0,20,60,0.8)] backdrop-blur-xl sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status !== "sent" ? (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <input id="cf-name" name="name" required placeholder="Name" autoComplete="name" className={inputCls} />
                      <label htmlFor="cf-name" className={labelCls}>Name *</label>
                    </div>
                    <div className="relative">
                      <input id="cf-email" name="email" type="email" required placeholder="Email" autoComplete="email" className={inputCls} />
                      <label htmlFor="cf-email" className={labelCls}>Email *</label>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <select
                        id="cf-service"
                        name="service"
                        value={quoteService}
                        onChange={(e) => setQuoteService(e.target.value)}
                        className={cn(inputCls, "appearance-none")}
                      >
                        <option value="" className="bg-navy-950">Not sure yet</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id} className="bg-navy-950">
                            {s.title}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="cf-service" className={labelCls}>Service</label>
                    </div>
                    <div className="relative">
                      <select id="cf-qty" name="quantity" defaultValue="1-10" className={cn(inputCls, "appearance-none")}>
                        {["1-10", "10-100", "100-1,000", "1,000-10,000", "10,000+"].map((q) => (
                          <option key={q} value={q} className="bg-navy-950">
                            {q} units
                          </option>
                        ))}
                      </select>
                      <label htmlFor="cf-qty" className={labelCls}>Quantity</label>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea id="cf-msg" name="message" required rows={4} placeholder="Project" className={cn(inputCls, "resize-none")} />
                    <label htmlFor="cf-msg" className={labelCls}>Tell us about the part *</label>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed px-4 py-4 transition-colors",
                      dragging ? "border-white bg-white/15" : "border-white/25 hover:border-white/50 hover:bg-white/[0.05]"
                    )}
                  >
                    <motion.span animate={dragging ? { y: -3, scale: 1.08 } : { y: 0, scale: 1 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-white">
                      <FileUp className="h-5 w-5" />
                    </motion.span>
                    <div className="text-sm">
                      <p className="font-medium text-white">Drop CAD files, drawings or photos</p>
                      <p className="text-white/60">STEP, STL, 3MF, DWG, PDF, JPG — up to 6 files</p>
                    </div>
                    <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                  </div>
                  <AnimatePresence initial={false}>
                    {files.length > 0 && (
                      <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 overflow-hidden">
                        {files.map((f, i) => (
                          <motion.li key={`${f.name}-${i}`} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 rounded-lg bg-white/10 py-1 pl-2.5 pr-1 text-xs text-white">
                            <Paperclip className="h-3 w-3" />
                            <span className="max-w-40 truncate">{f.name}</span>
                            <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} className="grid h-5 w-5 place-items-center rounded hover:bg-white/15">
                              <X className="h-3 w-3" />
                            </button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-xs text-xs text-white/60">Your files are used only to scope and quote your project.</p>
                    <MagneticButton type="submit" variant="light" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" /> Transmitting…
                        </>
                      ) : (
                        <>
                          Send request <Send className="h-4 w-4" />
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="relative grid h-24 w-24 place-items-center">
                    <motion.span className="absolute inset-0 rounded-full border border-white/30" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                    <motion.span className="absolute inset-0 rounded-full border border-white/30" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }} />
                    <svg viewBox="0 0 52 52" className="h-24 w-24">
                      <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#fff" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
                      <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.5 }} />
                    </svg>
                  </div>
                  <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Transmission received</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold text-white">Thanks — we&apos;re on it.</h3>
                  <p className="mt-3 max-w-sm text-white/75">An engineer will review your brief and files and get back to you with next steps.</p>
                  <button onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10">
                    <RotateCcw className="h-4 w-4" /> Send another request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

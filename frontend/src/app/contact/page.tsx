import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/sections/Contact";
import { SiteProvider } from "@/components/SiteProvider";

export const metadata: Metadata = {
  title: "Contact Us | DR Engineering & Manufacturing",
  description:
    "Direct contact details, emails, and social media for Danial Raja and DR Engineering & Manufacturing.",
};

export default function ContactPage() {
  return (
    <SiteProvider>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-obsidian pt-16 text-silver">
        <Contact />
      </main>
      <Footer />
    </SiteProvider>
  );
}

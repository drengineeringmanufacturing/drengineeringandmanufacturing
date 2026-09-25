import { SpecHud } from "@/components/hud/SpecHud";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Materials } from "@/components/sections/Materials";
import { Process } from "@/components/sections/Process";
import { StatsBand } from "@/components/sections/StatsBand";
import { WorkExplorer } from "@/components/sections/WorkExplorer";
import { SiteProvider } from "@/components/SiteProvider";

export default function Home() {
  return (
    <SiteProvider>
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <Capabilities />
        <WorkExplorer />
        <Process />
        <Materials />
        <Contact />
      </main>
      <Footer />
      <SpecHud />
    </SiteProvider>
  );
}

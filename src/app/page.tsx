"use client";

import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import LandingModules from "@/components/landing/LandingModules";
import LandingNav from "@/components/landing/LandingNav";
import LandingWorkflow from "@/components/landing/LandingWorkflow";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 theme-scrollbar overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingModules />
        <LandingWorkflow />
      </main>
      <LandingFooter />
    </div>
  );
}

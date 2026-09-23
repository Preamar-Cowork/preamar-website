"use client";

import { useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Problem } from "@/components/sections/Problem";
import { Space } from "@/components/sections/Space";
import { Plans } from "@/components/sections/Plans";
import { Fiscal } from "@/components/sections/Fiscal";
import { NextPhase } from "@/components/sections/NextPhase";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/layout/Footer";
import { TideProgressLine } from "@/components/ui/TideProgressLine";
import type { HeroSettings } from "@/lib/heroSettings";
import type { HighTide } from "@/lib/tideFormat";
import { folioOf, type SiteSections } from "@/lib/content/schema";

export function Landing({
  heroVideoUrl,
  heroSettings,
  sections: c,
  tides,
}: {
  heroVideoUrl: string | null;
  heroSettings: HeroSettings;
  sections: SiteSections;
  tides: HighTide[];
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  // Order here must match SECTION_DEFS (lib/content/schema.ts) — it numbers the folios.
  return (
    <main className="bg-pm-bg text-pm-ink font-body relative overflow-x-hidden">
      <TideProgressLine />
      <Hero onReserve={scrollToForm} videoUrl={heroVideoUrl} settings={heroSettings} tides={tides} />
      <Problem content={c.problem} n={folioOf("problem")} />
      <Space content={c.space} n={folioOf("space")} />
      <Plans content={c.plans} n={folioOf("plans")} />
      <Fiscal content={c.fiscal} n={folioOf("fiscal")} />
      <About content={c.about} n={folioOf("about")} />
      <NextPhase content={c.next} n={folioOf("next")} />
      <ReservationForm ref={formRef} content={c.form} n={folioOf("form")} />
      <FAQ content={c.faq} n={folioOf("faq")} />
      <Footer content={c.footer} />
    </main>
  );
}

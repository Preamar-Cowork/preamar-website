"use client";

import { useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Problem } from "@/components/sections/Problem";
import { Space } from "@/components/sections/Space";
import { Plans } from "@/components/sections/Plans";
import { Fiscal } from "@/components/sections/Fiscal";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/layout/Footer";
import { TideProgressLine } from "@/components/ui/TideProgressLine";
import type { HeroSettings } from "@/lib/heroSettings";
import type { HighTide } from "@/lib/tideFormat";
import type { SiteSections } from "@/lib/content/schema";

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

  // Keep in the same order as SECTION_DEFS (lib/content/schema.ts) — it drives the admin menu.
  return (
    <main className="bg-pm-bg text-pm-ink font-body relative overflow-x-hidden">
      <TideProgressLine />
      <Hero onReserve={scrollToForm} videoUrl={heroVideoUrl} settings={heroSettings} tides={tides} />
      <Problem content={c.problem} />
      <Space content={c.space} />
      <Plans content={c.plans} />
      <Fiscal content={c.fiscal} />
      <About content={c.about} />
      <ReservationForm ref={formRef} content={c.form} />
      <FAQ content={c.faq} />
      <Footer content={c.footer} />
    </main>
  );
}

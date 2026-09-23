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

export function Landing({
  heroVideoUrl,
  heroSettings,
}: {
  heroVideoUrl: string | null;
  heroSettings: HeroSettings;
}) {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="bg-pm-bg text-pm-ink font-body relative overflow-x-hidden">
      <TideProgressLine />
      <Hero onReserve={scrollToForm} videoUrl={heroVideoUrl} settings={heroSettings} />
      <About />
      <Problem />
      <Space />
      <Plans />
      <Fiscal />
      <NextPhase />
      <ReservationForm ref={formRef} />
      <FAQ />
      <Footer />
    </main>
  );
}

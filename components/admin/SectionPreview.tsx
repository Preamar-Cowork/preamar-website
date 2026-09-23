"use client";

import { Problem } from "@/components/sections/Problem";
import { Space } from "@/components/sections/Space";
import { Plans } from "@/components/sections/Plans";
import { Fiscal } from "@/components/sections/Fiscal";
import { About } from "@/components/sections/About";
import { NextPhase } from "@/components/sections/NextPhase";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/layout/Footer";
import { folioOf, type SectionKey, type SiteSections } from "@/lib/content/schema";

/** Renders one section with draft content — the live preview in /admin. */
export function SectionPreview({ sectionKey, content }: { sectionKey: SectionKey; content: unknown }) {
  const n = folioOf(sectionKey);
  switch (sectionKey) {
    case "problem":
      return <Problem content={content as SiteSections["problem"]} n={n} />;
    case "space":
      return <Space content={content as SiteSections["space"]} n={n} />;
    case "plans":
      return <Plans content={content as SiteSections["plans"]} n={n} />;
    case "fiscal":
      return <Fiscal content={content as SiteSections["fiscal"]} n={n} />;
    case "about":
      return <About content={content as SiteSections["about"]} n={n} />;
    case "next":
      return <NextPhase content={content as SiteSections["next"]} n={n} />;
    case "form":
      return <ReservationForm content={content as SiteSections["form"]} n={n} />;
    case "faq":
      return <FAQ content={content as SiteSections["faq"]} n={n} />;
    case "footer":
      return <Footer content={content as SiteSections["footer"]} />;
  }
}

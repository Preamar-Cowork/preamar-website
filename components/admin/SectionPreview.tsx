"use client";

import { Problem } from "@/components/sections/Problem";
import { Space } from "@/components/sections/Space";
import { Plans } from "@/components/sections/Plans";
import { Fiscal } from "@/components/sections/Fiscal";
import { About } from "@/components/sections/About";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/layout/Footer";
import type { SectionKey, SiteSections } from "@/lib/content/schema";

/** Renders one section with draft content — the live preview in /admin. */
export function SectionPreview({ sectionKey, content }: { sectionKey: SectionKey; content: unknown }) {
  switch (sectionKey) {
    case "problem":
      return <Problem content={content as SiteSections["problem"]} />;
    case "space":
      return <Space content={content as SiteSections["space"]} />;
    case "plans":
      return <Plans content={content as SiteSections["plans"]} />;
    case "fiscal":
      return <Fiscal content={content as SiteSections["fiscal"]} />;
    case "about":
      return <About content={content as SiteSections["about"]} />;
    case "form":
      return <ReservationForm content={content as SiteSections["form"]} />;
    case "faq":
      return <FAQ content={content as SiteSections["faq"]} />;
    case "footer":
      return <Footer content={content as SiteSections["footer"]} />;
  }
}

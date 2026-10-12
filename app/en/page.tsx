import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/HomePage";

// English version of the home page (texts edited in /admin → EN).
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return homeMetadata("en");
}

export default function HomeEn() {
  return <HomePage locale="en" />;
}

import type { Metadata } from "next";
import { HomePage, homeMetadata } from "@/components/HomePage";

// Read the content on every request, so changes saved in /admin show up
// immediately (and with no flash of default values).
export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return homeMetadata("pt");
}

export default function Home() {
  return <HomePage locale="pt" />;
}

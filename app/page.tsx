import { Landing } from "@/components/Landing";
import { getSiteContent } from "@/lib/siteContent";

// Read the hero video + settings on every request, so changes saved in
// /admin show up immediately (and with no flash of default values).
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return <Landing heroVideoUrl={content.heroVideoUrl} heroSettings={content.heroSettings} />;
}

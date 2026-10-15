import { PrivacyPage, privacyMetadata } from "@/components/PrivacyPage";

export const dynamic = "force-dynamic";
export const metadata = privacyMetadata("en");

export default function Privacy() {
  return <PrivacyPage locale="en" />;
}

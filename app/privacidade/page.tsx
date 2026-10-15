import { PrivacyPage, privacyMetadata } from "@/components/PrivacyPage";

export const dynamic = "force-dynamic";
export const metadata = privacyMetadata("pt");

export default function Privacidade() {
  return <PrivacyPage locale="pt" />;
}

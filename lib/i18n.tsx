"use client";

import { createContext, useContext } from "react";
import { UI, type Locale, type UIStrings } from "@/lib/locale";

const LocaleContext = createContext<Locale>("pt");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, t: UI[locale] as UIStrings };
}

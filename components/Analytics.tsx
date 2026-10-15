"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { PRIVACY_PATH } from "@/lib/locale";
import { ADS_ID, GTAG_INIT, readConsent, setConsent } from "@/lib/analytics";

export const OPEN_COOKIES_EVENT = "pm-open-cookies";

/** Google tag (public pages only) + the cookie banner. */
export function Analytics() {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIES_EVENT, reopen);
  }, []);

  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setOpen(false);
  };

  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">
        {GTAG_INIT}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t.cookieLink}
          className="fixed z-50 bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[420px] bg-pm-ink text-pm-bg p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <p className="text-[14px] leading-relaxed m-0 mb-5 text-[#DADDDE]">
            {t.cookieText}{" "}
            <a
              href={`${PRIVACY_PATH[locale]}#cookies`}
              style={{ color: "inherit" }}
              className="underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              {t.cookieMore}
            </a>
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="flex-1 bg-pm-bg text-pm-ink py-2.5 font-label font-bold text-[12px] tracking-[0.14em] uppercase"
            >
              {t.cookieAccept}
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="flex-1 border border-pm-bg/60 text-pm-bg py-2.5 font-label font-bold text-[12px] tracking-[0.14em] uppercase hover:border-pm-bg"
            >
              {t.cookieDecline}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

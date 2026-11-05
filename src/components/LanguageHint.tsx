import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  currentLanguage,
  preferredLanguage,
  savePreferredLanguage,
  t,
  type Language
} from "../lib/i18n";
import { isKnownPage, localizePath, pagePath } from "../lib/paths";

const DISMISSED_KEY = "lang-hint-dismissed";

/**
 * Small framed window offering the visitor's own language when the page is in another one
 * (e.g. an English browser landing on the Spanish "/"). It never redirects by itself.
 * Decided after mount, so the HTML generated at build time stays identical for everyone.
 */
export default function LanguageHint() {
  const location = useLocation();
  const pageLanguage = currentLanguage();
  const [suggested, setSuggested] = useState<Language | null>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    } catch {
      dismissed = false;
    }
    const preferred = preferredLanguage();
    setSuggested(!dismissed && preferred !== pageLanguage ? preferred : null);
  }, [pageLanguage]);

  if (!suggested) {
    return null;
  }

  const page = pagePath(location.pathname);
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Storage unavailable: the hint just shows again next time.
    }
    setSuggested(null);
  };

  return (
    <aside className="lang-hint" lang={suggested} role="dialog" aria-label={t("language_label", { lng: suggested })}>
      <button type="button" className="photo-window-button lang-hint-close" onClick={dismiss} aria-label={t("close", { lng: suggested })}>
        x
      </button>
      <p>{t("lang_hint_text", { lng: suggested })}</p>
      <Link
        className="lang-hint-action"
        to={localizePath(isKnownPage(page) ? page : "/", suggested) + location.hash}
        hrefLang={suggested}
        onClick={() => savePreferredLanguage(suggested)}
      >
        [ {t("lang_hint_action", { lng: suggested })} ]
      </Link>
    </aside>
  );
}

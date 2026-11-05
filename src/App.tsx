import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import Desktop from "./desktop/Desktop";
import { preferredLanguage, setActiveLanguage, t, DEFAULT_LANGUAGE } from "./lib/i18n";
import { trackPageview } from "./lib/analytics";
import { SECRET_PATH, isKnownPage, languageFromPath, normalizePath, pagePath } from "./lib/paths";

// The game (code, CSS, sounds) only downloads when someone opens /nv.
const KuromiGamePage = lazy(() => import("./pages/KuromiGamePage"));

function pageTitle(page: string, isSecret: boolean): string {
  if (isSecret) return t("kuromi_page_title");
  if (page === "/diary") return `${t("diary_title")} — SantiiRepair`;
  if (page === "/favorites") return `${t("favorites_title")} — SantiiRepair`;
  if (page === "/trips") return "we are infinite — SantiiRepair";
  if (!isKnownPage(page)) return "404 — SantiiRepair";
  return `${t("title")} | SantiiRepair`;
}

export default function App() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const isSecret = currentPath === SECRET_PATH;

  // The URL decides the language ("/en/trips" -> English). The secret game has no
  // language prefix, so it uses the visitor's preference. Set before anything renders.
  const lang = isSecret
    ? typeof window === "undefined"
      ? DEFAULT_LANGUAGE
      : preferredLanguage()
    : languageFromPath(currentPath);
  setActiveLanguage(lang);

  const page = isSecret ? SECRET_PATH : pagePath(currentPath);
  useAnimatedTitle(page, pageTitle(page, isSecret));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    trackPageview();
  }, [currentPath]);

  if (isSecret) {
    return (
      <Suspense fallback={null}>
        <KuromiGamePage />
      </Suspense>
    );
  }

  return <Desktop />;
}

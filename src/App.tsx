import { Fragment, lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import SiteLayout from "./layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import TripsPage from "./pages/TripsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { preferredLanguage, setActiveLanguage, t, DEFAULT_LANGUAGE } from "./lib/i18n";
import { trackPageview } from "./lib/analytics";
import {
  SECRET_PATH,
  isKnownPage,
  languageFromPath,
  languagePrefixes,
  normalizePath,
  pagePath
} from "./lib/paths";

// Loaded only when visited: the game (code, CSS, sounds) and the logbook (all its texts).
const KuromiGamePage = lazy(() => import("./pages/KuromiGamePage"));
const DiaryPage = lazy(() => import("./pages/DiaryPage"));

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
  // language prefix, so it uses the visitor's preference. Set before any page renders.
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

  return (
    <Routes>
      <Route
        path={SECRET_PATH}
        element={
          <Suspense fallback={null}>
            <KuromiGamePage />
          </Suspense>
        }
      />
      {/* One layout for every page, so the chat and the snow stay put while navigating */}
      <Route element={<SiteLayout />}>
        {languagePrefixes().map((prefix) => (
          <Fragment key={prefix || "default"}>
            <Route path={`${prefix}/`} element={<AboutPage />} />
            <Route path={`${prefix}/favorites`} element={<FavoritesPage />} />
            <Route path={`${prefix}/trips`} element={<TripsPage />} />
            <Route
              path={`${prefix}/diary`}
              element={
                <Suspense fallback={null}>
                  <DiaryPage />
                </Suspense>
              }
            />
          </Fragment>
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

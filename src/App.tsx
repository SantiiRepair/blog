import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import SiteLayout from "./layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import TripsPage from "./pages/TripsPage";
import DiaryPage from "./pages/DiaryPage";
import NotFoundPage from "./pages/NotFoundPage";
import { currentLanguage, onLanguageChange, t } from "./lib/i18n";
import { KNOWN_PATHS, SECRET_PATH, normalizePath } from "./lib/paths";

// The game (code, CSS and sounds) only downloads when someone opens /nv.
const KuromiGamePage = lazy(() => import("./pages/KuromiGamePage"));

type UmamiWindow = Window & {
  umami?: {
    track: () => void;
  };
};

export default function App() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);
  const [language, setLanguage] = useState(currentLanguage);

  // Pages read texts with t() while rendering, so re-render everything when the language changes.
  useEffect(() => onLanguageChange(setLanguage), []);

  const title = useMemo(() => {
    if (currentPath === SECRET_PATH) {
      return t("kuromi_page_title");
    }

    if (currentPath === "/diary") {
      return `${t("diary_title")} — SantiiRepair`;
    }

    if (currentPath === "/favorites") {
      return `${t("favorites_title")} — SantiiRepair`;
    }

    if (currentPath === "/trips") {
      return "we are infinite — SantiiRepair";
    }

    if (!KNOWN_PATHS.includes(currentPath)) {
      return "404 — SantiiRepair";
    }

    return `${t("title")} | SantiiRepair`;
  }, [currentPath, language]);

  useAnimatedTitle(currentPath, title);

  useEffect(() => {
    const umamiWindow = window as UmamiWindow;

    if (typeof umamiWindow.umami?.track === "function") {
      umamiWindow.umami.track();
    }
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
      <Route
        path="/"
        element={
          <SiteLayout>
            <AboutPage />
          </SiteLayout>
        }
      />
      <Route
        path="/favorites"
        element={
          <SiteLayout>
            <FavoritesPage />
          </SiteLayout>
        }
      />
      <Route
        path="/trips"
        element={
          <SiteLayout>
            <TripsPage />
          </SiteLayout>
        }
      />
      <Route
        path="/diary"
        element={
          <SiteLayout>
            <DiaryPage />
          </SiteLayout>
        }
      />
      <Route
        path="*"
        element={
          <SiteLayout>
            <NotFoundPage />
          </SiteLayout>
        }
      />
    </Routes>
  );
}

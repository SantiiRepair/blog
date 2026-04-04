import { useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import SiteLayout from "./layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import KuromiGamePage from "./pages/KuromiGamePage";
import TripsPage from "./pages/TripsPage";
import { t } from "./lib/i18n";

const SECRET_PATH = "/valen-game";
const INITIAL_HASH_PATH = (() => {
  const initialHash = window.location.hash.replace(/^#/, "");

  if (!initialHash) {
    return "/";
  }

  return initialHash.startsWith("/") ? initialHash : `/${initialHash}`;
})();

type UmamiWindow = Window & {
  umami?: {
    track: () => void;
  };
};

export default function App() {
  const location = useLocation();
  const isSecretRoute = location.pathname === SECRET_PATH;
  const allowSecretRoute = INITIAL_HASH_PATH === SECRET_PATH;

  const title = useMemo(() => {
    if (location.pathname === SECRET_PATH) {
      return t("kuromi_page_title");
    }

    if (location.pathname === "/favorites") {
      return t("favorites_title");
    }

    if (location.pathname === "/trips") {
      return "we are infinite";
    }

    return t("title");
  }, [location.pathname]);

  useAnimatedTitle(location.pathname, title);

  useEffect(() => {
    const umamiWindow = window as UmamiWindow;

    if (typeof umamiWindow.umami?.track === "function") {
      umamiWindow.umami.track();
    }
  }, [location.pathname]);

  if (isSecretRoute) {
    if (!allowSecretRoute) {
      return <Navigate to="/" replace />;
    }

    return <KuromiGamePage />;
  }

  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

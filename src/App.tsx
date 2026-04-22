import { useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import SiteLayout from "./layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import KuromiGamePage from "./pages/KuromiGamePage";
import TripsPage from "./pages/TripsPage";
import { t } from "./lib/i18n";

const SECRET_PATH = "/nv";
const normalizePath = (path: string): string => {
  const pathWithoutQuery = path.split("?")[0];
  const pathWithoutHash = pathWithoutQuery.split("#")[0];

  if (!pathWithoutHash) {
    return "/";
  }

  const withLeadingSlash = pathWithoutHash.startsWith("/")
    ? pathWithoutHash
    : `/${pathWithoutHash}`;

  if (withLeadingSlash === "/") {
    return withLeadingSlash;
  }

  return withLeadingSlash.replace(/\/+$/, "");
};

type UmamiWindow = Window & {
  umami?: {
    track: () => void;
  };
};

export default function App() {
  const location = useLocation();
  const currentPath = normalizePath(location.pathname);

  const title = useMemo(() => {
    if (currentPath === SECRET_PATH) {
      return t("kuromi_page_title");
    }

    if (currentPath === "/favorites") {
      return t("favorites_title");
    }

    if (currentPath === "/trips") {
      return "we are infinite";
    }

    return t("title");
  }, [currentPath]);

  useAnimatedTitle(currentPath, title);

  useEffect(() => {
    const umamiWindow = window as UmamiWindow;

    if (typeof umamiWindow.umami?.track === "function") {
      umamiWindow.umami.track();
    }
  }, [currentPath]);

  return (
    <Routes>
      <Route path="/nv" element={<KuromiGamePage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

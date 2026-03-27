import { useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import useAnimatedTitle from "./hooks/useAnimatedTitle";
import SiteLayout from "./layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import TripsPage from "./pages/TripsPage";
import { t } from "./lib/i18n";

export default function App() {
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname === "/favorites") {
      return t("favorites_title");
    }

    if (location.pathname === "/trips") {
      return "we are infinite";
    }

    return t("title");
  }, [location.pathname]);

  useAnimatedTitle(location.pathname, title);

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

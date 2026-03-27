import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { t } from "../lib/i18n";
import welcumImg from "../../images/welcum.png";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="container">
      <div className="header">
        <img src={welcumImg} alt={t("welcum_alt")} style={{ width: "27%", maxWidth: "100%" }} />
      </div>

      <div className="flex-container">
        <aside className="sidebar sidebar-left">
          <br />
          <Link to="/">{t("about_title")}</Link>
          <br />
          <Link to="/favorites">{t("favorites")}</Link>
          <br />
          <Link to="/trips">{t("trips")}</Link>
          <br />
          <a href="https://i.pinimg.com/originals/2a/2f/a0/2a2fa0db3179d4b4ec39d1a8a1eeda7d.jpg" target="_blank" rel="noopener noreferrer">
            {t("contact")}
          </a>
        </aside>

        <main className="main-content">{children}</main>

        <aside className="sidebar sidebar-right" id="cbox-container">
          <iframe
            title={t("chat_title")}
            src="https://www3.cbox.ws/box/?boxid=3550520&boxtag=1VI7sn"
            width="100%"
            height="100%"
            allow="autoplay"
            style={{ border: "none", minHeight: "400px" }}
          />
        </aside>
      </div>
    </div>
  );
}

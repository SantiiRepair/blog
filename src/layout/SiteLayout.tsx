import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { t } from "../lib/i18n";
import welcumImg from "../../images/welcum.png";
import PixelSnow from "../components/PixelSnow";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <PixelSnow />

      <div className="container site-layout-root">
        <div className="header">
          <img src={welcumImg} alt={t("welcum_alt")} className="header-logo" />
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
            <Link to="/diary">{t("diary")}</Link>
          </aside>

          <main className="main-content">{children}</main>

          <aside className="sidebar sidebar-right" id="cbox-container">
            <iframe
              className="chat-iframe"
              title={t("chat_title")}
              src="https://www3.cbox.ws/box/?boxid=3550520&boxtag=1VI7sn"
              width="100%"
              height="100%"
              allow="autoplay"
              style={{ border: "none" }}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { t } from "../lib/i18n";
import PixelSnow from "../components/PixelSnow";

const welcumImg = "/images/welcum.png";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <PixelSnow />

      <div className="container site-layout-root">
        <div className="header">
          <img
            src={welcumImg}
            alt={t("welcum_alt")}
            className="header-logo"
            width="280"
            height="70"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="flex-container">
          <aside className="sidebar sidebar-left">
            <nav aria-label="Site Navigation">
              <br />
              <Link to="/">{t("about_title")}</Link>
              <br />
              <Link to="/favorites">{t("favorites")}</Link>
              <br />
              <Link to="/trips">{t("trips")}</Link>
              <br />
              <Link to="/diary">{t("diary")}</Link>
              <br />
              <a
                href="https://github.com/SantiiRepair"
                target="_blank"
                rel="me noopener noreferrer"
                title="Santiago Ramirez on GitHub"
              >
                GitHub
              </a>
            </nav>
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

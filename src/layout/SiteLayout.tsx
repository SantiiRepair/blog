import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SUPPORTED_LANGUAGES, currentLanguage, setLanguage, t } from "../lib/i18n";
import PixelSnow from "../components/PixelSnow";

const welcumImg = "/images/welcum.png";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const activeLanguage = currentLanguage();

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
              <NavLink to="/" end>
                {t("about_title")}
              </NavLink>
              <br />
              <NavLink to="/favorites">{t("favorites")}</NavLink>
              <br />
              <NavLink to="/trips">{t("trips")}</NavLink>
              <br />
              <NavLink to="/diary">{t("diary")}</NavLink>
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

            <div className="lang-switch" role="group" aria-label={t("language_label")}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  lang={lang}
                  aria-pressed={activeLanguage === lang}
                  onClick={() => void setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
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
              loading="lazy"
              style={{ border: "none" }}
            />
          </aside>
        </div>

        {/* Old-web 88x31 buttons, drawn with CSS */}
        <footer className="badges">
          <a className="badge88" href="/" title="santiirepair.dev">
            <span className="badge88-icon">SR</span>
            <span className="badge88-text">burn the ships</span>
          </a>
          <span className="badge88 badge88-alt">
            <span className="badge88-icon">800</span>
            <span className="badge88-text">best viewed 800x600</span>
          </span>
          <span className="badge88">
            <span className="badge88-icon">c[_]</span>
            <span className="badge88-text">powered by coffee</span>
          </span>
          <a
            className="badge88 badge88-alt"
            href="https://github.com/SantiiRepair"
            target="_blank"
            rel="me noopener noreferrer"
            title="GitHub"
          >
            <span className="badge88-icon">&lt;/&gt;</span>
            <span className="badge88-text">open source</span>
          </a>
        </footer>
      </div>
    </>
  );
}

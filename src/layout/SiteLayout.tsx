import { Link, Outlet, useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES, currentLanguage, savePreferredLanguage, t } from "../lib/i18n";
import { isKnownPage, localizePath, pagePath, type Page } from "../lib/paths";
import PixelSnow from "../components/PixelSnow";
import LanguageHint from "../components/LanguageHint";

const welcumImg = "/images/welcum.webp";

export default function SiteLayout() {
  const location = useLocation();
  const activeLanguage = currentLanguage();
  const page = pagePath(location.pathname);

  const navLink = (target: Page, label: string) => (
    <Link
      to={localizePath(target, activeLanguage)}
      aria-current={page === target ? "page" : undefined}
    >
      {label}
    </Link>
  );

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
            <nav className="site-nav" aria-label="Site Navigation">
              <br />
              {navLink("/", t("about_title"))}
              <br />
              {navLink("/favorites", t("favorites"))}
              <br />
              {navLink("/trips", t("trips"))}
              <br />
              {navLink("/diary", t("diary"))}
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

            {/* Same page in each language; real links so search engines find every version */}
            <nav className="lang-switch" aria-label={t("language_label")}>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <Link
                  key={lang}
                  to={localizePath(isKnownPage(page) ? page : "/", lang) + location.hash}
                  lang={lang}
                  hrefLang={lang}
                  aria-current={activeLanguage === lang ? "true" : undefined}
                  onClick={() => savePreferredLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="main-content">
            <Outlet />
          </main>

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
          <Link className="badge88" to={localizePath("/", activeLanguage)} title="santiirepair.dev">
            <span className="badge88-icon">SR</span>
            <span className="badge88-text">burn the ships</span>
          </Link>
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

      <LanguageHint />
    </>
  );
}

import { lazy, Suspense, useEffect, useReducer, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { currentLanguage, t } from "../lib/i18n";
import { localizePath, normalizePath, pagePath } from "../lib/paths";
import PixelSnow from "../components/PixelSnow";
import LanguageHint from "../components/LanguageHint";
import AboutPage from "../pages/AboutPage";
import FavoritesPage from "../pages/FavoritesPage";
import TripsPage from "../pages/TripsPage";
import NotFoundPage from "../pages/NotFoundPage";
import PixelIcon from "./PixelIcon";
import Taskbar, { type DesktopEntry } from "./Taskbar";
import Window, { PHONE_QUERY } from "./Window";
import {
  PAGE_OF_WINDOW,
  WINDOW_ICONS,
  WINDOW_RENDER_ORDER,
  initialWindows,
  topWindow,
  windowForPage,
  windowsReducer,
  type PageWindowId,
  type WindowId
} from "./windowManager";

// The logbook (all its texts) only downloads when its window opens.
const DiaryPage = lazy(() => import("../pages/DiaryPage"));

const GITHUB_URL = "https://github.com/SantiiRepair";

function windowContent(id: PageWindowId): ReactNode {
  switch (id) {
    case "about":
      return <AboutPage />;
    case "favorites":
      return <FavoritesPage />;
    case "trips":
      return <TripsPage />;
    case "diary":
      return (
        <Suspense fallback={null}>
          <DiaryPage />
        </Suspense>
      );
    case "notfound":
      return <NotFoundPage />;
  }
}

function Badges() {
  const lang = currentLanguage();
  return (
    <footer className="badges desktop-badges">
      <Link className="badge88" to={localizePath("/", lang)} title="santiirepair.dev">
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
      <a className="badge88 badge88-alt" href={GITHUB_URL} target="_blank" rel="me noopener noreferrer" title="GitHub">
        <span className="badge88-icon">&lt;/&gt;</span>
        <span className="badge88-text">open source</span>
      </a>
    </footer>
  );
}

/**
 * The whole site as a retro desktop: icons, windows (one per section, the URL decides
 * which one is in front), an always-open chat window and a taskbar. On phones the icons
 * are a grid, a section opens full screen and the chat sits under the icons.
 */
export default function Desktop() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = currentLanguage();
  const urlWindow = windowForPage(pagePath(location.pathname));
  const [windows, dispatch] = useReducer(windowsReducer, urlWindow, initialWindows);
  const active = topWindow(windows);

  // Every navigation (a link, back/forward, even the same URL again) brings the URL's
  // window to the front. A "not found" window goes away once a real page opens.
  useEffect(() => {
    dispatch({ type: "open", id: urlWindow });
    if (urlWindow !== "notfound") {
      dispatch({ type: "close", id: "notfound" });
    }
    // Keyed on location.key on purpose: urlWindow is derived from that same location.
  }, [location.key]);

  const urlOf = (id: WindowId): string | null => {
    if (id === "chat") return null;
    const page = PAGE_OF_WINDOW[id];
    return page === null ? null : localizePath(page, lang);
  };

  // Bring a window to the front; the address bar follows the window in front.
  const activate = (id: WindowId) => {
    if (active === id) return;
    dispatch({ type: "open", id });
    const url = urlOf(id);
    if (url && normalizePath(url) !== normalizePath(location.pathname)) {
      navigate(url, { replace: true });
    }
  };

  // Close or minimize; if it was the URL's window, the address bar moves to the next one in front.
  const hide = (id: WindowId, how: "close" | "minimize") => {
    dispatch({ type: how, id });
    if (id !== urlWindow) return;
    const next = [...windows.order]
      .reverse()
      .find((other) => other !== id && other !== "chat" && !windows.minimized.includes(other));
    const url = next ? urlOf(next) : null;
    if (url) navigate(url, { replace: true });
  };

  const showChat = () => {
    if (window.matchMedia(PHONE_QUERY).matches) {
      // On phones the chat lives under the icons: hide the full-screen section and scroll there.
      if (active && active !== "chat") hide(active, "minimize");
      document.querySelector(".window-chat")?.scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      activate("chat");
    }
  };

  const titles: Record<WindowId, string> = {
    about: t("about_title"),
    favorites: t("favorites"),
    trips: t("trips"),
    diary: t("diary"),
    notfound: "404",
    chat: t("chat_window_title")
  };

  const pageEntry = (id: Exclude<PageWindowId, "notfound">): DesktopEntry => ({
    key: id,
    label: titles[id],
    icon: WINDOW_ICONS[id],
    to: urlOf(id) ?? "/"
  });

  const entries: DesktopEntry[] = [
    pageEntry("about"),
    pageEntry("favorites"),
    pageEntry("trips"),
    pageEntry("diary"),
    { key: "chat", label: titles.chat, icon: "chat", onSelect: showChat },
    { key: "github", label: "GitHub", icon: "code", href: GITHUB_URL }
  ];

  const openWindows = WINDOW_RENDER_ORDER.filter((id) => windows.order.includes(id));

  return (
    <>
      <PixelSnow />

      <div className="desktop">
        <img
          className="desktop-logo"
          src="/images/welcum.webp"
          alt={t("welcum_alt")}
          width="376"
          height="116"
          decoding="async"
        />

        <nav className="desktop-icons" aria-label="Site Navigation">
          {entries.map((entry) => {
            const content = (
              <>
                <PixelIcon name={entry.icon} />
                <span className="desktop-icon-label">{entry.label}</span>
              </>
            );
            if (entry.to) {
              return (
                <Link
                  key={entry.key}
                  className="desktop-icon"
                  to={entry.to}
                  aria-current={entry.key === active ? "page" : undefined}
                >
                  {content}
                </Link>
              );
            }
            if (entry.href) {
              return (
                <a key={entry.key} className="desktop-icon" href={entry.href} target="_blank" rel="me noopener noreferrer">
                  {content}
                </a>
              );
            }
            return (
              <button key={entry.key} type="button" className="desktop-icon" onClick={entry.onSelect}>
                {content}
              </button>
            );
          })}
        </nav>

        <main className="desktop-windows">
          {openWindows.map((id) => (
            <Window
              key={id}
              id={id}
              title={titles[id]}
              className={id === "chat" ? "window-chat" : `window-page window-${id}`}
              active={active === id}
              zIndex={10 + windows.order.indexOf(id)}
              minimized={windows.minimized.includes(id)}
              collapsed={windows.collapsed.includes(id)}
              maximized={windows.maximized.includes(id)}
              closable={id !== "chat"}
              offset={windows.offsets[id]}
              onActivate={() => activate(id)}
              onClose={() => hide(id, "close")}
              onToggleCollapse={() => dispatch({ type: "toggleCollapse", id })}
              onToggleMaximize={() => dispatch({ type: "toggleMaximize", id })}
              onMove={(offset) => dispatch({ type: "move", id, offset })}
            >
              {id === "chat" ? (
                <iframe
                  className="chat-iframe"
                  title={t("chat_title")}
                  src="https://www3.cbox.ws/box/?boxid=3550520&boxtag=1VI7sn"
                  allow="autoplay"
                  loading="lazy"
                />
              ) : (
                <div className="window-content">{windowContent(id)}</div>
              )}
            </Window>
          ))}
        </main>

        <Badges />
      </div>

      <Taskbar
        entries={entries}
        tasks={openWindows
          .filter((id): id is PageWindowId => id !== "chat")
          .map((id) => ({ id, title: titles[id], icon: WINDOW_ICONS[id] }))}
        activeWindow={active}
        onTask={(id) => (active === id ? hide(id, "minimize") : activate(id))}
      />

      <LanguageHint />
    </>
  );
}

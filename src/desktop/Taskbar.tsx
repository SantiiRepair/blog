import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES, currentLanguage, savePreferredLanguage, t } from "../lib/i18n";
import { isKnownPage, localizePath, pagePath } from "../lib/paths";
import PixelIcon from "./PixelIcon";
import type { IconName } from "./icons";
import type { WindowId } from "./windowManager";

export type DesktopEntry = {
  key: string;
  label: string;
  icon: IconName;
  /** Internal page path, an external URL, or an action. */
  to?: string;
  href?: string;
  onSelect?: () => void;
};

type TaskbarProps = {
  entries: DesktopEntry[];
  tasks: { id: WindowId; title: string; icon: IconName }[];
  activeWindow?: WindowId;
  onTask: (id: WindowId) => void;
};

function Clock() {
  const lang = currentLanguage();
  // Shown only after mount: the time at build time would be wrong (and differ from the browser's).
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" });
    const update = () => setTime(format.format(new Date()));
    update();
    const timer = window.setInterval(update, 15_000);
    return () => window.clearInterval(timer);
  }, [lang]);

  return <span className="taskbar-clock">{time ?? "--:--"}</span>;
}

function StartMenu({ entries, onClose }: { entries: DesktopEntry[]; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on a click outside or Escape; focus the first item when opened.
  useEffect(() => {
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!menuRef.current?.contains(target) && !target.closest(".taskbar-start")) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="start-menu" id="start-menu" ref={menuRef}>
      <div className="start-menu-strip" aria-hidden="true">
        santii<b>repair</b>
      </div>
      <ul>
        {entries.map((entry) => {
          const content = (
            <>
              <PixelIcon name={entry.icon} size={24} />
              <span>{entry.label}</span>
            </>
          );
          return (
            <li key={entry.key}>
              {entry.to ? (
                <Link to={entry.to} onClick={onClose}>
                  {content}
                </Link>
              ) : entry.href ? (
                <a href={entry.href} target="_blank" rel="me noopener noreferrer" onClick={onClose}>
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    entry.onSelect?.();
                    onClose();
                  }}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Taskbar({ entries, tasks, activeWindow, onTask }: TaskbarProps) {
  const location = useLocation();
  const lang = currentLanguage();
  const page = pagePath(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  // A new page closes the menu (e.g. after picking an entry).
  useEffect(() => setMenuOpen(false), [location.key]);

  return (
    <>
      {menuOpen && <StartMenu entries={entries} onClose={() => setMenuOpen(false)} />}
      <footer className="taskbar">
        <button
          type="button"
          className="taskbar-start"
          aria-expanded={menuOpen}
          aria-controls="start-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="taskbar-start-logo" aria-hidden="true">
            SR
          </span>
          <span className="taskbar-start-label">{t("start_menu")}</span>
        </button>

        <div className="taskbar-tasks">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className="taskbar-task"
              aria-pressed={activeWindow === task.id}
              onClick={() => onTask(task.id)}
            >
              <PixelIcon name={task.icon} size={16} />
              <span>{task.title}</span>
            </button>
          ))}
        </div>

        <div className="taskbar-tray">
          {/* Same page in each language; real links so search engines find every version */}
          <nav className="tray-langs" aria-label={t("language_label")}>
            {SUPPORTED_LANGUAGES.map((code) => (
              <Link
                key={code}
                to={localizePath(isKnownPage(page) ? page : "/", code) + location.hash}
                lang={code}
                hrefLang={code}
                aria-current={lang === code ? "true" : undefined}
                onClick={() => savePreferredLanguage(code)}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </nav>
          <Clock />
        </div>
      </footer>
    </>
  );
}

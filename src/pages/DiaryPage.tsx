import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { t, currentLanguage } from "../lib/i18n";
import { diaryEntries, type DiaryEntry } from "../lib/diary";

type LogbookEntryProps = {
  entry: DiaryEntry;
  date: string;
  initiallyOpen: boolean;
};

function LogbookEntry({ entry, date, initiallyOpen }: LogbookEntryProps) {
  const { slug, title, text, hidden } = entry;
  const [isOpen, setIsOpen] = useState(initiallyOpen && !hidden);

  return (
    <div
      id={hidden ? undefined : slug}
      className={`diary-entry ${hidden ? "diary-entry-hidden" : ""}`}
      data-hidden={hidden ? "true" : undefined}
    >
      <div className="diary-entry-header">
        <button
          type="button"
          className="diary-entry-toggle"
          onClick={() => {
            if (!hidden) {
              setIsOpen(!isOpen);
            }
          }}
          aria-expanded={hidden ? undefined : isOpen}
          aria-disabled={hidden ? true : undefined}
        >
          <span>
            <span className="diary-entry-date">[{date}]</span>
            <span className="diary-entry-title">{title}</span>
          </span>
          <span className="diary-entry-state">
            {hidden ? "[hidden]" : isOpen ? "[-]" : "[+]"}
          </span>
        </button>
        {!hidden && (
          <a
            className="diary-entry-anchor"
            href={`#${slug}`}
            title={t("diary_entry_link")}
            aria-label={`${t("diary_entry_link")}: ${title}`}
            onClick={() => setIsOpen(true)}
          >
            [#]
          </a>
        )}
      </div>

      <div
        className="diary-entry-body"
        aria-hidden={hidden || !isOpen}
        hidden={hidden || !isOpen}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function DiaryPage() {
  const lang = currentLanguage();
  const { hash } = useLocation();
  const linkedSlug = decodeURIComponent(hash.replace(/^#/, ""));

  const dateFormat = new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Opening /diary/#maracaibo scrolls to that entry (it renders already open).
  useEffect(() => {
    if (linkedSlug) {
      document.getElementById(linkedSlug)?.scrollIntoView({ block: "start" });
    }
  }, [linkedSlug]);

  return (
    <div className="text-container">
      <div className="diary">
        <h1 className="about-title diary-heading">
          {">"} {t("diary_title")}
        </h1>
        <p className="about-lead diary-subtitle">{t("diary_subtitle")}</p>

        <div className="diary-entries">
          {diaryEntries(lang).map((entry) => (
            <LogbookEntry
              key={entry.slug}
              entry={entry}
              // T12:00:00 avoids the date shifting a day in some time zones
              date={dateFormat.format(new Date(`${entry.date}T12:00:00`))}
              initiallyOpen={entry.slug === linkedSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

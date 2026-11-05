import { t, exists, currentLanguage } from "../lib/i18n";
import { useState } from "react";

interface LogbookEntryProps {
  date: string;
  rawDate: string;
  title: string;
  content: string;
  hidden?: boolean;
}

function LogbookEntry({ date, rawDate, title, content, hidden = false }: LogbookEntryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`diary-entry ${hidden ? "diary-entry-hidden" : ""}`}
      data-hidden={hidden ? "true" : undefined}
    >
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

      <div
        className="diary-entry-body"
        aria-hidden={hidden || !isOpen}
        hidden={hidden || !isOpen}
      >
        <p>{content}</p>
      </div>
    </div>
  );
}

export default function DiaryPage() {
  const entries = [];
  let i = 1;

  while (exists(`diary_entry_${i}_date`)) {
    const rawDate = t(`diary_entry_${i}_date`);
    // Formateamos la fecha usando Intl.DateTimeFormat para que sea internacional
    const formattedDate = new Intl.DateTimeFormat(currentLanguage(), {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(rawDate + "T12:00:00")); // T12:00:00 evita desfases por zona horaria

    const isHidden =
      (exists(`diary_entry_${i}_hidden`) && t(`diary_entry_${i}_hidden`) === "true") ||
      i === 5 ||
      i === 6;

    entries.push({
      date: formattedDate,
      rawDate,
      title: t(`diary_entry_${i}_title`),
      content: t(`diary_entry_${i}_text`),
      hidden: isHidden,
    });
    i++;
  }

  const reversedEntries = [...entries].reverse();

  return (
    <div className="text-container">
      <div className="diary">
        <h1 className="about-title diary-heading">
          {">"} {t("diary_title")}
        </h1>
        <p className="about-lead diary-subtitle">{t("diary_subtitle")}</p>

        <div className="diary-entries">
          {reversedEntries.map((entry, index) => (
            <LogbookEntry
              key={entry.rawDate || index}
              date={entry.date}
              rawDate={entry.rawDate}
              title={entry.title}
              content={entry.content}
              hidden={entry.hidden}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

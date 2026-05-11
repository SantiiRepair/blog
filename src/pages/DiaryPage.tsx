import { t, exists, currentLanguage } from "../lib/i18n";
import { useState } from "react";

interface LogbookEntryProps {
  date: string;
  title: string;
  content: string;
}

function LogbookEntry({ date, title, content }: LogbookEntryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        border: "1px solid #333",
        borderRadius: "4px",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "1rem",
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "inherit",
        }}
      >
        <span>
          <span style={{ color: "#666", marginRight: "1rem", fontFamily: "monospace" }}>[{date}]</span>
          <span style={{ fontWeight: "bold", color: "var(--accent-color, #f5c764)" }}>{title}</span>
        </span>
        <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>{isOpen ? "[-]" : "[+]"}</span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 1rem 1rem 1rem",
            borderTop: "1px solid #222",
            lineHeight: "1.6",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{content}</p>
        </div>
      )}
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

    entries.push({
      date: formattedDate,
      title: t(`diary_entry_${i}_title`),
      content: t(`diary_entry_${i}_text`),
    });
    i++;
  }

  const reversedEntries = [...entries].reverse();

  return (
    <div className="text-container">
      <div style={{ textAlign: "left", marginTop: "2rem" }}>
        <h1 className="about-title" style={{ fontSize: "1.5rem", color: "var(--accent-color, #f5c764)" }}>
          {">"} {t("diary_title")}
        </h1>
        <p className="about-lead" style={{ marginBottom: "3rem", opacity: 0.8 }}>
          {t("diary_subtitle")}
        </p>

        <div className="diary-entries">
          {reversedEntries.map((entry, index) => (
            <LogbookEntry
              key={index}
              date={entry.date}
              title={entry.title}
              content={entry.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
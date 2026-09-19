import { t } from "../lib/i18n";

const aboutImg = "/images/about.png";

export default function AboutPage() {
  return (
    <div className="text-container">
      <div className="about-intro" style={{ textAlign: "center" }}>
        <br />
        <br />
        <img
          src={aboutImg}
          alt={`Santiago Ramirez (SantiiRepair) - ${t("about_intro_title")}`}
          className="about-avatar"
          width="160"
          height="160"
          loading="eager"
          decoding="async"
        />
        <h1 className="about-title">{t("about_intro_title")}</h1>
        <div className="about-author-badge" style={{ marginTop: "0.25rem", marginBottom: "0.75rem", color: "var(--accent-color, #f5c764)", fontFamily: "monospace", fontSize: "0.95rem" }}>
          Santiago Ramirez &bull; <a href="https://github.com/SantiiRepair" target="_blank" rel="me noopener noreferrer" style={{ color: "#48bfe3" }}>@SantiiRepair</a>
        </div>
        <p className="about-lead">{t("about_intro_lead")}</p>
        <br />
        <p>{t("about_text_short")}</p>
        <div className="about-tags" aria-label={t("about_title")}>
          <span>{t("about_tag_road")}</span>
          <span>{t("about_tag_code")}</span>
          <span>{t("about_tag_coffee")}</span>
        </div>
        <p className="ps-note">{t("ps_note")}</p>
      </div>
    </div>
  );
}

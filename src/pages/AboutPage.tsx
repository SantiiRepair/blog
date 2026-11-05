import { t } from "../lib/i18n";
import { photoAttributes } from "../lib/media";

// Matches .about-avatar widths in style.css (30% of the column, 45% / up to 260px on small screens).
const AVATAR_SIZES = "(max-width: 600px) 260px, (max-width: 1000px) 45vw, 170px";

export default function AboutPage() {
  return (
    <div className="text-container">
      <div className="about-intro">
        <br />
        <br />
        <img
          {...photoAttributes("about", AVATAR_SIZES)}
          alt={`Santiago Ramirez (SantiiRepair) - ${t("about_intro_title")}`}
          className="about-avatar"
          loading="eager"
          decoding="async"
        />
        <h1 className="about-title">{t("about_intro_title")}</h1>
        <div className="about-author-badge">
          Santiago Ramirez &bull;{" "}
          <a href="https://github.com/SantiiRepair" target="_blank" rel="me noopener noreferrer">
            @SantiiRepair
          </a>
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

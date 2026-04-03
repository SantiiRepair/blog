import { t } from "../lib/i18n";
import aboutImg from "../../images/about.png";

export default function AboutPage() {
  return (
    <div className="text-container">
      <div className="about-intro" style={{ textAlign: "center" }}>
        <br />
        <br />
        <img src={aboutImg} alt={t("about_image_alt")} className="about-avatar" />
        <h1 className="about-title">{t("about_intro_title")}</h1>
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

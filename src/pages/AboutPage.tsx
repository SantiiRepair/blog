import { t } from "../lib/i18n";
import aboutImg from "../../images/about.png";

export default function AboutPage() {
  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <img src={aboutImg} alt={t("about_image_alt")} style={{ width: "30%" }} />
        <br />
        <p>{t("about_text")}</p>
        <p className="ps-note">{t("ps_note")}</p>
      </div>
    </div>
  );
}

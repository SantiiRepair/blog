import { t } from "../lib/i18n";

import selfImg from "../../images/self.webp";
import picoImg from "../../images/pico.webp";
import beachImg from "../../images/beach.webp";
import mitoImg from "../../images/mito.webp";
import paraglidingImg from "../../images/paragliding.webp";
import morroImg from "../../images/morro.webp";
import azulitaImg from "../../images/azulita.webp";
import alambiqueImg from "../../images/alambique.webp";
import bodegonImg from "../../images/bodegon.webp";

export default function TripsPage() {
  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "large" }}>{t("memory_quote")}</h1>
        <div className="image-gallery">
          <div className="image-row">
            <div className="image-item">
              <img src={selfImg} alt={t("paramo_alt")} />
            </div>
            <div className="image-item">
              <img src={picoImg} alt={t("pico_alt")} />
            </div>
            <div className="image-item">
              <img src={beachImg} alt={t("beach_alt")} />
            </div>
          </div>

          <div className="image-row">
            <div className="image-item">
              <img src={mitoImg} alt={t("mito_alt")} />
            </div>
            <div className="image-item">
              <img src={paraglidingImg} alt={t("paragliding_alt")} />
            </div>
            <div className="image-item">
              <img src={morroImg} alt={t("morro_alt")} />
            </div>
          </div>

          <p style={{ fontSize: "large" }}>{t("friends_quote")}</p>
          <div className="image-row">
            <div className="image-item">
              <img src={azulitaImg} alt={t("azulita_alt")} />
            </div>
            <div className="image-item">
              <img src={alambiqueImg} alt={t("alambique_alt")} />
            </div>
            <div className="image-item">
              <img src={bodegonImg} alt={t("cata_alt")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

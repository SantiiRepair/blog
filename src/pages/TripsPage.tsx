import { t } from "../lib/i18n";

const selfImg = "/images/self.webp";
const picoImg = "/images/pico.webp";
const beachImg = "/images/beach.webp";
const mitoImg = "/images/mito.webp";
const paraglidingImg = "/images/paragliding.webp";
const morroImg = "/images/morro.webp";
const azulitaImg = "/images/azulita.webp";
const alambiqueImg = "/images/alambique.webp";
const bodegonImg = "/images/bodegon.webp";

export default function TripsPage() {
  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "large" }}>{t("memory_quote")}</h1>
        <div className="image-gallery">
          <div className="image-row">
            <div className="image-item">
              <img src={selfImg} alt={t("paramo_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={picoImg} alt={t("pico_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={beachImg} alt={t("beach_alt")} loading="lazy" decoding="async" />
            </div>
          </div>

          <div className="image-row">
            <div className="image-item">
              <img src={mitoImg} alt={t("mito_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={paraglidingImg} alt={t("paragliding_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={morroImg} alt={t("morro_alt")} loading="lazy" decoding="async" />
            </div>
          </div>

          <p style={{ fontSize: "large" }}>{t("friends_quote")}</p>
          <div className="image-row">
            <div className="image-item">
              <img src={azulitaImg} alt={t("azulita_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={alambiqueImg} alt={t("alambique_alt")} loading="lazy" decoding="async" />
            </div>
            <div className="image-item">
              <img src={bodegonImg} alt={t("cata_alt")} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

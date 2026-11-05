import { t } from "../lib/i18n";
import Photo from "../components/Photo";

export default function TripsPage() {
  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "large" }}>{t("memory_quote")}</h1>
        <div className="image-gallery">
          <div className="image-row">
            <div className="image-item">
              <Photo zoomable name="self" alt={t("paramo_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="pico" alt={t("pico_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="beach" alt={t("beach_alt")} />
            </div>
          </div>

          <div className="image-row">
            <div className="image-item">
              <Photo zoomable name="mito" alt={t("mito_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="paragliding" alt={t("paragliding_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="morro" alt={t("morro_alt")} />
            </div>
          </div>

          <p style={{ fontSize: "large" }}>{t("friends_quote")}</p>
          <div className="image-row">
            <div className="image-item">
              <Photo zoomable name="azulita" alt={t("azulita_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="alambique" alt={t("alambique_alt")} />
            </div>
            <div className="image-item">
              <Photo zoomable name="bodegon" alt={t("cata_alt")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

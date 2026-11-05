import { t } from "../lib/i18n";
import { useGallery } from "../components/Gallery";

export default function TripsPage() {
  const { thumb, viewer } = useGallery([
    { name: "self", alt: t("paramo_alt") },
    { name: "pico", alt: t("pico_alt") },
    { name: "beach", alt: t("beach_alt") },
    { name: "mito", alt: t("mito_alt") },
    { name: "paragliding", alt: t("paragliding_alt") },
    { name: "morro", alt: t("morro_alt") },
    { name: "azulita", alt: t("azulita_alt") },
    { name: "alambique", alt: t("alambique_alt") },
    { name: "bodegon", alt: t("cata_alt") }
  ]);

  const row = (indexes: number[]) => (
    <div className="image-row">
      {indexes.map((index) => (
        <div className="image-item" key={index}>
          {thumb(index)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "large" }}>{t("memory_quote")}</h1>
        <div className="image-gallery">
          {row([0, 1, 2])}
          {row([3, 4, 5])}
          <p style={{ fontSize: "large" }}>{t("friends_quote")}</p>
          {row([6, 7, 8])}
        </div>
        {viewer}
      </div>
    </div>
  );
}

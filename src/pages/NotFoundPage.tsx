import { Link } from "react-router-dom";
import { t } from "../lib/i18n";

export default function NotFoundPage() {
  return (
    <div className="text-container not-found">
      {/* React hoists this into <head>; keeps unknown URLs out of search results */}
      <meta name="robots" content="noindex" />
      <br />
      <br />
      <h1 className="about-title">404 // SYSTEM ERROR</h1>
      <p className="about-lead">{t("not_found_text")}</p>
      <p>
        <Link to="/" className="not-found-link">
          {t("not_found_link")}
        </Link>
      </p>
    </div>
  );
}

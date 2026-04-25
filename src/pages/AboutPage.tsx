import { useRef } from "react";
import { t } from "../lib/i18n";
import aboutImg from "../../images/about.png";
import sunsetVideo from "../../videos/sunset.mp4";

export default function AboutPage() {
  const LOOP_SECONDS = 2;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoTimeUpdate = (): void => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.currentTime >= LOOP_SECONDS) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // Keep silent if browser interrupts autoplay.
      });
    }
  };

  return (
    <div className="text-container about-main-page">
      <video
        ref={videoRef}
        className="about-main-bg-video"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleVideoTimeUpdate}
        aria-hidden="true"
      >
        <source src={sunsetVideo} type="video/mp4" />
      </video>

      <div className="about-main-content">
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
    </div>
  );
}

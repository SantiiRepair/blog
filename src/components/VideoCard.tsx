import { t } from "../lib/i18n";

type VideoCardProps = {
  noteKey: string;
  titleKey: string;
  src: string;
};

export default function VideoCard({ noteKey, titleKey, src }: VideoCardProps) {
  return (
    <div className="video-container">
      <p className="ps-note">{t(noteKey)}</p>
      <video
        src={src}
        title={t(titleKey)}
        autoPlay
        muted
        loop
        style={{ pointerEvents: "none" }}
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture
        onMouseEnter={(event) => {
          event.currentTarget.muted = false;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.muted = true;
        }}
        onTouchStart={(event) => {
          event.currentTarget.muted = false;
        }}
        onTouchEnd={(event) => {
          event.currentTarget.muted = true;
        }}
      />
    </div>
  );
}

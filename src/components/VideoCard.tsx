import { useRef } from "react";
import { t } from "../lib/i18n";

type VideoCardProps = {
  noteKey: string;
  titleKey: string;
  src: string;
};

export default function VideoCard({ noteKey, titleKey, src }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.pause();
    }
  };

  return (
    <div className="video-container">
      <p className="ps-note">{t(noteKey)}</p>
      <video
        ref={videoRef}
        src={src}
        title={t(titleKey)}
        muted
        loop
        playsInline
        preload="auto"
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      />
    </div>
  );
}

import { useRef } from "react";
import { t } from "../lib/i18n";
import { posterUrl, type PosterName } from "../lib/media";

type VideoCardProps = {
  noteKey: string;
  titleKey: string;
  src: string;
  poster: PosterName;
};

export default function VideoCard({ noteKey, titleKey, src, poster }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastPointerType = useRef<string>("mouse");

  const play = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
    }
  };

  const stop = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.pause();
    }
  };

  const toggle = () => {
    if (videoRef.current?.paused) {
      play();
    } else {
      stop();
    }
  };

  return (
    <div className="video-container">
      <p className="ps-note">{t(noteKey)}</p>
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl(poster)}
        title={t(titleKey)}
        aria-label={t(titleKey)}
        tabIndex={0}
        muted
        loop
        playsInline
        preload="none"
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        disablePictureInPicture
        // Mouse: plays while hovering. Touch/pen: each tap toggles. Keyboard: Enter/Space toggle.
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") play();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") stop();
        }}
        onPointerDown={(event) => {
          lastPointerType.current = event.pointerType;
        }}
        onClick={() => {
          if (lastPointerType.current !== "mouse") toggle();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        onBlur={stop}
      />
    </div>
  );
}

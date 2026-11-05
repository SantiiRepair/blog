import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { t } from "../lib/i18n";
import { enlargedAttributes, photoAttributes, type PhotoName } from "../lib/media";

// Matches .image-item widths in style.css (260px desktop, 220px tablet, full width on phones).
const GALLERY_SIZES = "(max-width: 480px) calc(100vw - 40px), (max-width: 768px) 220px, 260px";

export type GalleryPhoto = {
  name: PhotoName;
  alt: string;
};

/**
 * Thumbnails that open in one shared window (site frame) where you can move
 * through the whole gallery with the arrow buttons or the keyboard.
 * Pages keep their own layout: render `thumb(i)` where each photo goes, and `viewer` once.
 */
export function useGallery(photos: GalleryPhoto[]): {
  thumb: (index: number) => ReactNode;
  viewer: ReactNode;
} {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);

  const open = (index: number) => {
    setCurrent(index);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (delta: number) => setCurrent((index) => (index + delta + photos.length) % photos.length),
    [photos.length]
  );

  const thumb = (index: number) => {
    const photo = photos[index];
    return (
      <button
        type="button"
        className="photo-zoom"
        aria-label={`${photo.alt} — ${t("photo_open")}`}
        onClick={() => open(index)}
      >
        <img
          {...photoAttributes(photo.name, GALLERY_SIZES)}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      </button>
    );
  };

  const photo = photos[current];
  const { aspectRatio, ...enlarged } = enlargedAttributes(photo.name);

  const viewer = (
    <dialog
      ref={dialogRef}
      className="photo-window"
      aria-label={photo.alt}
      // A click on the dimmed area around the window lands on the <dialog> itself.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") step(-1);
        if (event.key === "ArrowRight") step(1);
      }}
    >
      <div className="photo-window-bar">
        <span className="photo-window-title">{photo.alt}</span>
        <span className="photo-window-controls">
          {photos.length > 1 && (
            <>
              <span className="photo-window-count">
                {current + 1}/{photos.length}
              </span>
              <button type="button" className="photo-window-button" onClick={() => step(-1)} aria-label={t("photo_prev")}>
                {"<"}
              </button>
              <button type="button" className="photo-window-button" onClick={() => step(1)} aria-label={t("photo_next")}>
                {">"}
              </button>
            </>
          )}
          <button type="button" className="photo-window-button" onClick={close} aria-label={t("close")}>
            x
          </button>
        </span>
      </div>
      <img
        // key: show the new photo right away instead of keeping the previous one until it loads
        key={photo.name}
        {...enlarged}
        alt={photo.alt}
        // lazy: nothing downloads while the window is closed
        loading="lazy"
        decoding="async"
        style={{ "--photo-ratio": aspectRatio } as CSSProperties}
      />
    </dialog>
  );

  return { thumb, viewer };
}

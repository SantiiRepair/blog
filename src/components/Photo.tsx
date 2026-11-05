import { useRef, type CSSProperties } from "react";
import { t } from "../lib/i18n";
import { enlargedAttributes, photoAttributes, type PhotoName } from "../lib/media";

// Matches .image-item widths in style.css (260px desktop, 220px tablet, full width on phones).
const GALLERY_SIZES = "(max-width: 480px) calc(100vw - 40px), (max-width: 768px) 220px, 260px";

type PhotoProps = {
  name: PhotoName;
  alt: string;
  sizes?: string;
  className?: string;
  /** Clicking the photo opens it larger in a window with the site's frame. */
  zoomable?: boolean;
};

export default function Photo({ name, alt, sizes = GALLERY_SIZES, className, zoomable = false }: PhotoProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const thumbnail = (
    <img
      {...photoAttributes(name, sizes)}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );

  if (!zoomable) {
    return thumbnail;
  }

  const { aspectRatio, ...enlarged } = enlargedAttributes(name);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="photo-zoom"
        aria-label={`${alt} — ${t("photo_open")}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        {thumbnail}
      </button>

      <dialog
        ref={dialogRef}
        className="photo-window"
        aria-label={alt}
        // A click on the dimmed area around the window lands on the <dialog> itself.
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="photo-window-bar">
          <span className="photo-window-title">{alt}</span>
          <button type="button" className="photo-window-close" onClick={close} aria-label={t("close")}>
            x
          </button>
        </div>
        <img
          {...enlarged}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ "--photo-ratio": aspectRatio } as CSSProperties}
        />
      </dialog>
    </>
  );
}

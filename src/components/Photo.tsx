import { photoAttributes, type PhotoName } from "../lib/media";

type PhotoProps = {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
};

/** A resized photo that doesn't open larger (galleries use useGallery instead). */
export default function Photo({ name, alt, sizes, className }: PhotoProps) {
  return (
    <img
      {...photoAttributes(name, sizes)}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

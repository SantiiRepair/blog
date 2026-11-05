import { t } from "../lib/i18n";
import Photo from "../components/Photo";
import { useGallery } from "../components/Gallery";
import VideoCard from "../components/VideoCard";

import harryVideo from "../../videos/harry_hermione_dance_to_forget_their_worries.mp4";
import joeVideo from "../../videos/meet_joe_black_1998_coffee_shop_scene_part_2.mp4";
import wolfVideo from "../../videos/wolf_of_wall_street_motivational_speech.mp4";
import breakingVideo from "../../videos/yeahhh_come_on_baby.mp4";
import officeVideo from "../../videos/every_that_s_what_she_said_ever.mp4";

// The bike is shown at 40% of the main column.
const MOTO_SIZES = "(max-width: 1000px) 40vw, 240px";

export default function FavoritesPage() {
  const tobby = useGallery([
    { name: "tobby", alt: t("tobby1_alt") },
    { name: "tobby2", alt: t("tobby2_alt") },
    { name: "tobby3", alt: t("tobby3_alt") }
  ]);

  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <Photo name="moto" alt={t("moto_alt")} sizes={MOTO_SIZES} className="favorites-moto" />
        <br />
        <p>{t("intro_text")}</p>

        <p>{t("pets_title")}</p>
        <p className="ps-note">{t("tobby_note")}</p>
        <div className="image-gallery">
          <div className="image-row">
            <div className="image-item">{tobby.thumb(0)}</div>
            <div className="image-item">{tobby.thumb(1)}</div>
            <div className="image-item">{tobby.thumb(2)}</div>
          </div>
        </div>
        {tobby.viewer}

        <p>{t("movies_title")}</p>
        <VideoCard
          noteKey="harry_note"
          titleKey="harry_title"
          src={harryVideo}
          poster="harry_hermione_dance_to_forget_their_worries"
        />
        <VideoCard
          noteKey="joe_note"
          titleKey="joe_title"
          src={joeVideo}
          poster="meet_joe_black_1998_coffee_shop_scene_part_2"
        />
        <VideoCard
          noteKey="wolf_note"
          titleKey="wolf_title"
          src={wolfVideo}
          poster="wolf_of_wall_street_motivational_speech"
        />

        <p>{t("series_title")}</p>
        <VideoCard
          noteKey="breaking_note"
          titleKey="breaking_title"
          src={breakingVideo}
          poster="yeahhh_come_on_baby"
        />
        <VideoCard
          noteKey="office_note"
          titleKey="office_title"
          src={officeVideo}
          poster="every_that_s_what_she_said_ever"
        />

        <p>{t("music_title")}</p>
        <div className="spotify-container">
          <div className="spotify-embed">
            <iframe
              title={t("spotify_title")}
              data-testid="embed-iframe"
              className="spotify-iframe"
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/playlist/1g9TavmxITZQDnaooVzEIy?utm_source=generator"
              width="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { t } from "../lib/i18n";
import VideoCard from "../components/VideoCard";

import motoImg from "../../images/moto.png";
import tobby1Img from "../../images/tobby.webp";
import tobby2Img from "../../images/tobby2.webp";
import tobby3Img from "../../images/tobby3.webp";

import harryVideo from "../../videos/harry_hermione_dance_to_forget_their_worries.mp4";
import joeVideo from "../../videos/meet_joe_black_1998_coffee_shop_scene_part_2.mp4";
import wolfVideo from "../../videos/wolf_of_wall_street_motivational_speech.mp4";
import breakingVideo from "../../videos/yeahhh_come_on_baby.mp4";
import officeVideo from "../../videos/every_that_s_what_she_said_ever.mp4";

export default function FavoritesPage() {
  return (
    <div className="text-container">
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <img src={motoImg} alt={t("moto_alt")} style={{ width: "40%" }} />
        <br />
        <p>{t("intro_text")}</p>

        <p>{t("pets_title")}</p>
        <p className="ps-note">{t("tobby_note")}</p>
        <div className="image-gallery">
          <div className="image-row">
            <div className="image-item">
              <img src={tobby1Img} alt={t("tobby1_alt")} />
            </div>
            <div className="image-item">
              <img src={tobby2Img} alt={t("tobby2_alt")} />
            </div>
            <div className="image-item">
              <img src={tobby3Img} alt={t("tobby3_alt")} />
            </div>
          </div>
        </div>

        <p>{t("movies_title")}</p>
        <VideoCard noteKey="harry_note" titleKey="harry_title" src={harryVideo} />
        <VideoCard noteKey="joe_note" titleKey="joe_title" src={joeVideo} />
        <VideoCard noteKey="wolf_note" titleKey="wolf_title" src={wolfVideo} />

        <p>{t("series_title")}</p>
        <VideoCard noteKey="breaking_note" titleKey="breaking_title" src={breakingVideo} />
        <VideoCard noteKey="office_note" titleKey="office_title" src={officeVideo} />

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

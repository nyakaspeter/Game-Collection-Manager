/**
 *  game controller
 */

import { factories } from "@strapi/strapi";
import axios from "axios";

interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: Date;
}

const IGDB_API_URL = "https://api.igdb.com/v4";

const IGDB_FIELDS = [
  "name",
  "slug",
  "summary",
  "total_rating",
  "first_release_date",
  "genres.*",
  "cover.*",
  "videos.*",
];

const IGDB_FIELDS_EXTENDED = [...IGDB_FIELDS, "screenshots.*"];

const IGDB_COVER_SIZES = ["cover_small", "cover_big", "720p", "1080p"];

const IGDB_SCREENSHOT_SIZES = [
  "screenshot_med",
  "screenshot_big",
  "screenshot_huge",
  "720p",
  "1080p",
];

const getAuthHeaders = async () => {
  const { data: authResponse } = await axios.post<AuthResponse>(
    "https://id.twitch.tv/oauth2/token?" +
      new URLSearchParams({
        client_id: strapi.config.api.igdb.twitchApiClientId,
        client_secret: strapi.config.api.igdb.twitchApiClientSecret,
        grant_type: "client_credentials",
      })
  );

  return {
    "Client-ID": strapi.config.api.igdb.twitchApiClientId,
    Authorization: `Bearer ${authResponse?.access_token}`,
  };
};

const mapGameData = (game, extended: boolean = false) => ({
  id: game.id,
  name: game.name,
  slug: game.slug,
  summary: game.summary,
  rating: game.total_rating,
  releaseDate: game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString()
    : undefined,
  genres: game.genres?.map((genre) => ({
    name: genre.name,
    slug: genre.slug,
  })),
  cover: Object.fromEntries(
    IGDB_COVER_SIZES.map((size) => [
      size,
      `https://images.igdb.com/igdb/image/upload/t_${size}/${game.cover.image_id}.jpg`,
    ])
  ),
  videos: game.videos?.map((video) => ({
    name: video.name,
    url: `https://www.youtube.com/watch?v=${video.video_id}`,
  })),
  ...(extended && {
    screenshots: game.screenshots?.map((screenshot) =>
      Object.fromEntries(
        IGDB_SCREENSHOT_SIZES.map((size) => [
          size,
          `https://images.igdb.com/igdb/image/upload/t_${size}/${screenshot.image_id}.jpg`,
        ])
      )
    ),
  }),
});

const fetchIgdbGame = async (igdbId: string) => {
  const { data } = await axios.post(
    `${IGDB_API_URL}/games`,
    `fields ${IGDB_FIELDS_EXTENDED.join(
      ","
    )}; where id = ${igdbId}; limit 500;`,
    { headers: await getAuthHeaders() }
  );

  return data?.length ? mapGameData(data[0], true) : undefined;
};

const fetchIgdbGames = async (igdbIds: string[]) => {
  const { data } = await axios.post(
    `${IGDB_API_URL}/games`,
    `fields ${IGDB_FIELDS.join(",")}; where id = (${igdbIds.join(
      ","
    )}); limit 500;`,
    { headers: await getAuthHeaders() }
  );

  return data?.map((game) => mapGameData(game));
};

export default factories.createCoreController(
  "api::game.game",
  ({ strapi }) => ({
    async find(ctx) {
      // Calling the default core action
      const { data, meta } = await super.find(ctx);

      // Enriching the results with data from IGDB
      const igdbIds = data.map((game) => game.attributes.igdbId);
      const igdbGames = await fetchIgdbGames(igdbIds);

      data.forEach((game) => {
        const igdbGame = igdbGames.find(
          (data) => data.id == game.attributes.igdbId
        );

        if (igdbGame) {
          const { id, ...igdbAttributes } = igdbGame;
          game.attributes = { ...igdbAttributes, ...game.attributes };
        }
      });

      return { data, meta };
    },
    async findOne(ctx) {
      // Calling the default core action
      const data = await super.findOne(ctx);

      // Enriching the result with data from IGDB
      const igdbGame = await fetchIgdbGame(data.data.attributes.igdbId);

      if (igdbGame) {
        const { id, ...igdbAttributes } = igdbGame;
        data.data.attributes = { ...igdbAttributes, ...data.attributes };
      }

      return data;
    },
  })
);

import { Game } from "./json";

interface TwitchApiKey {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
}

interface TwitchAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: Date;
}

const mapGameData = (game: any): Game => ({
  id: game.id,
  name: game.name,
  slug: game.slug,
  summary: game.summary,
  rating: game.total_rating,
  releaseDate: game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString()
    : undefined,
  genres:
    game.genres?.map((genre) => ({
      name: genre.name,
      slug: genre.slug,
    })) || undefined,
  cover: game.cover
    ? {
        original: `https://images.igdb.com/igdb/image/upload/t_original/${game.cover.image_id}.jpg`,
        small: `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`,
        big: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
        hd: `https://images.igdb.com/igdb/image/upload/t_720p/${game.cover.image_id}.jpg`,
        fhd: `https://images.igdb.com/igdb/image/upload/t_1080p/${game.cover.image_id}.jpg`,
      }
    : undefined,
  artworks:
    game.screenshots?.map((artwork) => ({
      original: `https://images.igdb.com/igdb/image/upload/t_original/${artwork.image_id}.jpg`,
      medium: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${artwork.image_id}.jpg`,
      big: `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${artwork.image_id}.jpg`,
      huge: `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${artwork.image_id}.jpg`,
      hd: `https://images.igdb.com/igdb/image/upload/t_720p/${artwork.image_id}.jpg`,
      fhd: `https://images.igdb.com/igdb/image/upload/t_1080p/${artwork.image_id}.jpg`,
    })) || undefined,
  screenshots:
    game.screenshots?.map((screenshot) => ({
      original: `https://images.igdb.com/igdb/image/upload/t_original/${screenshot.image_id}.jpg`,
      medium: `https://images.igdb.com/igdb/image/upload/t_screenshot_med/${screenshot.image_id}.jpg`,
      big: `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshot.image_id}.jpg`,
      huge: `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${screenshot.image_id}.jpg`,
      hd: `https://images.igdb.com/igdb/image/upload/t_720p/${screenshot.image_id}.jpg`,
      fhd: `https://images.igdb.com/igdb/image/upload/t_1080p/${screenshot.image_id}.jpg`,
    })) || undefined,
  videos:
    game.videos?.map((video) => ({
      name: video.name,
      url: `https://www.youtube.com/watch?v=${video.video_id}`,
    })) || undefined,
});

const chunkArray = (array: any[], size: number) => {
  const chunks: any[][] = [];
  let i = 0;
  let n = array.length;

  while (i < n) {
    chunks.push(array.slice(i, (i += size)));
  }

  return chunks;
};

const getAuthHeaders = async (twitchApiKey: TwitchApiKey) => {
  const { twitchApiClientId, twitchApiClientSecret } = twitchApiKey;
  const authResponse = await $fetch<TwitchAuthResponse>(
    "https://id.twitch.tv/oauth2/token",
    {
      method: "POST",
      params: {
        client_id: twitchApiClientId,
        client_secret: twitchApiClientSecret,
        grant_type: "client_credentials",
      },
    }
  );

  return {
    "Client-ID": twitchApiClientId,
    Authorization: `Bearer ${authResponse?.access_token}`,
  };
};

export const getIgdbGames = async (
  igdbSlugs: string[],
  twitchApiKey: TwitchApiKey
) => {
  const fields = [
    "name",
    "slug",
    "summary",
    "total_rating",
    "first_release_date",
    "genres.*",
    "cover.*",
    "artworks.*",
    "screenshots.*",
    "videos.*",
  ];
  const fieldsString = fields.join(",");
  const authHeaders = await getAuthHeaders(twitchApiKey);

  const games: Game[] = [];
  const chunks = chunkArray(igdbSlugs, 500);

  for (const slugs of chunks) {
    try {
      const slugsString = (slugs as string[])
        .map((slug) => `"${slug}"`)
        .join(",");

      const data = await $fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        body: `fields ${fieldsString}; where slug = (${slugsString}); limit 500;`,
        headers: authHeaders,
      });

      (data as any[]).forEach((game) => games.push(mapGameData(game)));
    } catch {}
  }

  return games;
};

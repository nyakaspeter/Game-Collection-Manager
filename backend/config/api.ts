export default ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  igdb: {
    twitchApiClientId: env("TWITCH_API_CLIENT_ID", ""),
    twitchApiClientSecret: env("TWITCH_API_CLIENT_SECRET", ""),
  },
});

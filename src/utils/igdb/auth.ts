import { fetch } from "@tauri-apps/api/http";

export interface IgdbAuthHeaders {
  "Client-ID": string;
  Authorization: string;
}

interface TwitchAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: Date;
}

export const fetchIgdbAuthHeaders = async (): Promise<IgdbAuthHeaders> => {
  const twitchApiClientId = import.meta.env.VITE_TWITCH_API_CLIENT_ID;
  const twitchApiClientSecret = import.meta.env.VITE_TWITCH_API_CLIENT_SECRET;

  if (!twitchApiClientId || !twitchApiClientSecret)
    throw new Error("Twitch credentials missing");

  const response = await fetch<TwitchAuthResponse>(
    "https://id.twitch.tv/oauth2/token?" +
      new URLSearchParams({
        client_id: twitchApiClientId,
        client_secret: twitchApiClientSecret,
        grant_type: "client_credentials",
      }),
    { method: "POST" }
  );

  if (!response.ok) throw new Error("Twitch auth failed");

  return {
    "Client-ID": twitchApiClientId,
    Authorization: `Bearer ${response.data.access_token}`,
  };
};

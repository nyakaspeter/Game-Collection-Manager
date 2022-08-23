import { fetch } from "@tauri-apps/api/http";
import { getSettings } from "../../stores/settings";

export interface IgdbAuthHeaders {
  "Client-ID": string;
  Authorization: string;
}

interface TwitchAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: Date;
}

export const getIgdbAuthHeaders = async (): Promise<IgdbAuthHeaders> => {
  const { twitchApiClientId, twitchApiClientSecret } = await getSettings();

  if (!twitchApiClientId || !twitchApiClientSecret)
    throw new Error("Twitch credentials missing");

  const authResponse = await fetch<TwitchAuthResponse>(
    "https://id.twitch.tv/oauth2/token?" +
      new URLSearchParams({
        client_id: twitchApiClientId,
        client_secret: twitchApiClientSecret,
        grant_type: "client_credentials",
      }),
    { method: "POST" }
  );

  if (!authResponse.ok) throw new Error("Twitch auth failed");

  return {
    "Client-ID": twitchApiClientId,
    Authorization: `Bearer ${authResponse.data.access_token}`,
  };
};

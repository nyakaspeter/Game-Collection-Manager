/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWITCH_API_CLIENT_ID: string;
  readonly VITE_TWITCH_API_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

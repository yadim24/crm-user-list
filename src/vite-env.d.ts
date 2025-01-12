/// <reference types="vite/client" />

interface ImportMetaEnv {
  // env variables
  readonly VITE_API_URL: string;
  readonly VITE_PROXY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

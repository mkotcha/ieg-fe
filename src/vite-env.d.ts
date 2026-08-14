/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_URL: string;
  readonly VITE_REACT_APP_URL: string;
  readonly VITE_REACT_APP_PERSIST_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

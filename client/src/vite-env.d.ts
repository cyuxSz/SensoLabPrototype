/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODEL_VIEWER_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

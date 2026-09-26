/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_ENABLE_MOCK_DEMO_CASES?: string;
  readonly VITE_SLA_TARGET_MS?: string;
  readonly VITE_MAPTILER_API_KEY?: string;
  readonly VITE_MAP_STYLE_URL?: string;
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Centralized Environment Configuration for AShielder
 * Provides validated runtime configuration with safe production fallbacks.
 */

const isProd = import.meta.env.PROD;

export const ENV = {
  /** Backend API base URL */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (isProd ? 'https://api.ashielder.soc:8000' : 'http://localhost:8000'),

  /** MapTiler API Key (public client key) */
  MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY || '',

  /** Map style URL (defaults to MapTiler Dataviz Dark) */
  MAP_STYLE_URL: import.meta.env.VITE_MAP_STYLE_URL || 'https://api.maptiler.com/maps/dataviz-dark/style.json',

  /** Demo / Offline mode toggle */
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true',

  /** Production build flag */
  IS_PROD: isProd,
} as const;

export default ENV;

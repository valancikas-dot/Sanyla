export const CONTENT_TYPES = {
  STRATEGY: 'STRATEGY',
  CALENDAR: 'CALENDAR',
  POST: 'POST',
  REEL_SCRIPT: 'REEL_SCRIPT',
  INSIGHT: 'INSIGHT',
} as const;

export const LANGUAGES = [
  'LITHUANIAN',    // 🇱🇹 Lietuvių
  'ENGLISH',       // 🇬🇧 Anglų
  'LATVIAN',       // 🇱🇻 Latvių
  'ESTONIAN',      // 🇪🇪 Estų
  'RUSSIAN',       // 🇷🇺 Rusų
  'POLISH',        // 🇵🇱 Lenkų
  'GERMAN',        // 🇩🇪 Vokiečių
  'FRENCH',        // 🇫🇷 Prancūzų
  'SPANISH',       // 🇪🇸 Ispanų
  'ITALIAN',       // 🇮🇹 Italų
  'PORTUGUESE',    // 🇵🇹 Portugalų
  'DUTCH',         // 🇳🇱 Olandų
  'SWEDISH',       // 🇸🇪 Švedų
  'NORWEGIAN',     // 🇳🇴 Norvegų
  'DANISH',        // 🇩🇰 Danų
  'FINNISH',       // 🇫🇮 Suomių
  'CZECH',         // 🇨🇿 Čekų
] as const;

export type Language = typeof LANGUAGES[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  LITHUANIAN: 'Lietuvių',
  ENGLISH: 'English',
  LATVIAN: 'Latviešu',
  ESTONIAN: 'Eesti',
  RUSSIAN: 'Русский',
  POLISH: 'Polski',
  GERMAN: 'Deutsch',
  FRENCH: 'Français',
  SPANISH: 'Español',
  ITALIAN: 'Italiano',
  PORTUGUESE: 'Português',
  DUTCH: 'Nederlands',
  SWEDISH: 'Svenska',
  NORWEGIAN: 'Norsk',
  DANISH: 'Dansk',
  FINNISH: 'Suomi',
  CZECH: 'Čeština',
};

export const PLATFORM_TYPES = {
  GENERIC: 'GENERIC',
  META: 'META',
  TIKTOK: 'TIKTOK',
  LINKEDIN: 'LINKEDIN',
  YOUTUBE: 'YOUTUBE',
} as const;

export const SCHEDULE_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  POSTED: 'POSTED',
  FAILED: 'FAILED',
} as const;

export const INTEGRATION_TYPES = {
  GA4: 'GA4',
  META: 'META',
  TIKTOK: 'TIKTOK',
  LINKEDIN: 'LINKEDIN',
  YOUTUBE: 'YOUTUBE',
} as const;

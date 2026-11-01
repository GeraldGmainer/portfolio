export type Locale = 'de' | 'en'

// Page copy and data are written as `{ de, en }` pairs next to the code that
// shows them; only shared UI strings live in i18n/locales/*.json.
export type Localized<T = string> = Record<Locale, T>

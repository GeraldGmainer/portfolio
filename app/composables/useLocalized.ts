import type { Locale, Localized } from '#shared/types/localized'

/** Returns a picker for the current locale's value of a `{ de, en }` pair. */
export function useLocalized() {
  const { locale } = useI18n()
  return <T>(value: Localized<T>): T => value[locale.value as Locale]
}

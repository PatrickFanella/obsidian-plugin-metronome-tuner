import * as Obsidian from "obsidian";
import { resolveLocale, type LanguagePreference, type Locale } from "../i18n";

export function resolveLanguagePreference(
  preference: LanguagePreference,
  detector: () => Locale = detectLocale,
): Locale {
  return preference === "auto" ? detector() : preference;
}

export function detectLocale(): Locale {
  try {
    const languageApi: unknown = Reflect.get(Obsidian, "getLanguage");
    const language = isLanguageSource(languageApi) ? languageApi() : undefined;
    if (typeof language === "string" && language) return resolveLocale(language);
  } catch {
    // Continue through compatibility sources when an Obsidian API is unavailable.
  }

  try {
    const language = typeof Obsidian.moment?.locale === "function" ? Obsidian.moment.locale() : undefined;
    if (language) return resolveLocale(language);
  } catch {
    // Continue through compatibility sources when the configured locale is unavailable.
  }

  try {
    if (typeof navigator !== "undefined" && navigator.language) return resolveLocale(navigator.language);
  } catch {
    // Use English when the host language cannot be read.
  }

  return "en";
}

function isLanguageSource(value: unknown): value is () => unknown {
  return typeof value === "function";
}

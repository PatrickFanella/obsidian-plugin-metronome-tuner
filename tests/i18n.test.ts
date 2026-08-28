import { describe, expect, it } from "vitest";
import { beatMeasureMessage, centsDescription, createTranslator, DICTIONARIES, LANGUAGE_LOCALE_ORDER, LANGUAGE_NAMES, resolveLocale, SUPPORTED_LOCALES } from "../src/i18n";

describe("locale resolution", () => {
  it.each([
    ["de-DE", "de"],
    ["es_MX", "es"],
    ["pt-BR", "pt-BR"],
    ["pt", "pt-BR"],
    ["pt-PT", "en"],
    ["zh", "zh-CN"],
    ["zh-CN", "zh-CN"],
    ["zh-SG", "zh-CN"],
    ["zh-TW", "en"],
    ["zh-HK", "en"],
    ["zh-Hant", "en"],
    ["xx-YY", "en"],
    [undefined, "en"],
  ])("resolves %s to %s", (language, expected) => {
    expect(resolveLocale(language)).toBe(expected);
  });
});

describe("dictionaries", () => {
  it("keeps language options aligned with supported locales", () => {
    expect(new Set(LANGUAGE_LOCALE_ORDER)).toEqual(new Set(SUPPORTED_LOCALES));
    expect(Object.keys(LANGUAGE_NAMES)).toEqual(expect.arrayContaining([...SUPPORTED_LOCALES]));
  });

  it("contains every English key with matching placeholders", () => {
    const englishMessages = Object.values(DICTIONARIES.en);
    const placeholders = (message: string) => [...message.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();

    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(DICTIONARIES[locale]).sort()).toEqual(Object.keys(DICTIONARIES.en).sort());
      const localizedMessages = Object.values(DICTIONARIES[locale]);
      for (let index = 0; index < englishMessages.length; index++) {
        expect(placeholders(localizedMessages[index])).toEqual(placeholders(englishMessages[index]));
      }
    }
  });

  it("interpolates known named placeholders and preserves missing ones", () => {
    const i18n = createTranslator("en");
    expect(i18n.t("bpmAria", { bpm: 120 })).toBe("120 beats per minute");
    expect(i18n.t("bpmAria")).toBe("{{bpm}} beats per minute");
  });

  it.each([
    ["en", "1 beat per measure", "1 beat per measure, first beat accented"],
    ["de", "1 Schlag pro Takt", "1 Schlag pro Takt, erster Schlag betont"],
    ["es", "1 pulso por compás", "1 pulso por compás, primero acentuado"],
    ["fr", "1 temps par mesure", "1 temps par mesure, premier temps accentué"],
    ["it", "1 battito per misura", "1 battito per misura, primo accentato"],
    ["pt-BR", "1 batida por compasso", "1 batida por compasso, primeira acentuada"],
    ["nl", "1 slag per maat", "1 slag per maat, eerste slag benadrukt"],
    ["pl", "1 uderzenie w takcie", "1 uderzenie w takcie, pierwsze akcentowane"],
    ["hr", "1 otkucaj po taktu", "1 otkucaj po taktu, prvi naglašen"],
    ["zh-CN", "每小节 1 拍", "每小节 1 拍，第一拍重音"],
  ] as const)("uses complete singular beat messages in %s", (locale, plain, accented) => {
    const i18n = createTranslator(locale);
    expect(beatMeasureMessage(i18n, 1, false)).toBe(plain);
    expect(beatMeasureMessage(i18n, 1, true)).toBe(accented);
  });

  it("uses Polish few-category beat messages", () => {
    const i18n = createTranslator("pl");
    expect(beatMeasureMessage(i18n, 3, false)).toBe("3 uderzenia w takcie");
    expect(beatMeasureMessage(i18n, 3, true)).toBe("3 uderzenia w takcie, pierwsze akcentowane");
  });

  it("uses Polish cent plural categories in both directions", () => {
    const i18n = createTranslator("pl");
    expect(DICTIONARIES.pl.centFlatOne).toBe("{{count}} cent za nisko");
    expect(DICTIONARIES.pl.centSharpOne).toBe("{{count}} cent za wysoko");
    expect(centsDescription(i18n, -3)).toBe("3 centy za nisko");
    expect(centsDescription(i18n, -5)).toBe("5 centów za nisko");
    expect(centsDescription(i18n, 3)).toBe("3 centy za wysoko");
    expect(centsDescription(i18n, 5)).toBe("5 centów za wysoko");
  });

  it("translates localized portfolio names", () => {
    expect(createTranslator("es").t("portfolio")).toBe("Portafolio");
    expect(createTranslator("pt-BR").t("portfolio")).toBe("Portfólio");
  });
});

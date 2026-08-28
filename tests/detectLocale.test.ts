import { afterEach, describe, expect, it, vi } from "vitest";
import type { Locale } from "../src/i18n";

afterEach(() => {
  vi.doUnmock("obsidian");
  vi.resetModules();
  vi.unstubAllGlobals();
});

async function detectWith(getLanguage: unknown, momentLocale: unknown): Promise<string> {
  vi.doMock("obsidian", () => ({
    getLanguage,
    moment: { locale: momentLocale },
  }));
  const { detectLocale } = await import("../src/i18n/detectLocale");
  return detectLocale();
}

async function loadLanguagePreferenceResolver() {
  vi.doMock("obsidian", () => ({ moment: { locale: undefined } }));
  const { resolveLanguagePreference } = await import("../src/i18n/detectLocale");
  return resolveLanguagePreference;
}

describe("locale detection", () => {
  it("calls the detector for automatic language preference", async () => {
    const detector = vi.fn((): Locale => "de");
    const resolveLanguagePreference = await loadLanguagePreferenceResolver();

    expect(resolveLanguagePreference("auto", detector)).toBe("de");
    expect(detector).toHaveBeenCalledOnce();
  });

  it("returns an explicit locale without calling the detector", async () => {
    const detector = vi.fn((): Locale => "de");
    const resolveLanguagePreference = await loadLanguagePreferenceResolver();

    expect(resolveLanguagePreference("fr", detector)).toBe("fr");
    expect(detector).not.toHaveBeenCalled();
  });

  it("prefers Obsidian getLanguage", async () => {
    vi.stubGlobal("navigator", { language: "fr-FR" });
    expect(await detectWith(() => "de-DE", () => "es-ES")).toBe("de");
  });

  it("uses moment's configured locale when getLanguage is unavailable", async () => {
    vi.stubGlobal("navigator", { language: "fr-FR" });
    expect(await detectWith(undefined, () => "es-ES")).toBe("es");
  });

  it("uses navigator then English without leaking source errors", async () => {
    vi.stubGlobal("navigator", { language: "nl-NL" });
    expect(await detectWith(() => { throw new Error("native detail"); }, () => { throw new Error("native detail"); })).toBe("nl");

    vi.stubGlobal("navigator", {});
    expect(await detectWith(undefined, undefined)).toBe("en");
  });
});

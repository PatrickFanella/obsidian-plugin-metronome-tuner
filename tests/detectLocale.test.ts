import { afterEach, describe, expect, it, vi } from "vitest";

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

describe("locale detection", () => {
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

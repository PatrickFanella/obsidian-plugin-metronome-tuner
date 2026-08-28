import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "../src/i18n";
import { DEFAULT_SETTINGS, parseMetronomeSettings, parseSettings } from "../src/settingsParsing";

describe("settings parsing", () => {
  it("returns independent defaults for invalid input", () => {
    const parsed = parseSettings(null);
    expect(parsed).toEqual(DEFAULT_SETTINGS);
    expect(parsed).not.toBe(DEFAULT_SETTINGS);
    expect(parsed.metronome).not.toBe(DEFAULT_SETTINGS.metronome);
  });

  it("bounds numbers and rejects invalid enum values", () => {
    expect(parseSettings({
      tunerA4: 900,
      metronome: { bpm: Infinity, meterNumerator: 99, meterDenominator: 3, volume: -2, accent: "yes", tone: "noise" }
    })).toEqual({
      language: "auto",
      tunerA4: 466,
      metronome: { bpm: 120, meterNumerator: 16, meterDenominator: 4, volume: 0, accent: true, tone: "woodblock" }
    });
  });

  it.each(["auto", ...SUPPORTED_LOCALES])("preserves the %s language preference", (language) => {
    expect(parseSettings({ language }).language).toBe(language);
  });

  it.each([
    [{}, "missing"],
    [{ language: "unknown" }, "invalid string"],
    [{ language: 42 }, "non-string"],
  ])("normalizes $1 language preference to auto", (value, _label) => {
    expect(parseSettings(value).language).toBe("auto");
  });

  it("sanitizes direct metronome controller settings", () => {
    const parsed = parseMetronomeSettings({ ...DEFAULT_SETTINGS.metronome, bpm: Number.NaN, volume: 2 });
    expect(parsed.bpm).toBe(120);
    expect(parsed.volume).toBe(1);
  });
});

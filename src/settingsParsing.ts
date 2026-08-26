import { TONE_PRESETS } from "./metronome/TonePresets";
import type { MeterDenominator, TonePresetId } from "./metronome/types";

export interface MetronomeSettings {
  bpm: number;
  meterNumerator: number;
  meterDenominator: MeterDenominator;
  accent: boolean;
  volume: number;
  tone: TonePresetId;
}

export interface PluginSettings {
  metronome: MetronomeSettings;
  tunerA4: number;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  metronome: { bpm: 120, meterNumerator: 4, meterDenominator: 4, accent: true, volume: 0.65, tone: "woodblock" },
  tunerA4: 440
};

export function parseSettings(value: unknown): PluginSettings {
  if (!isRecord(value)) return structuredClone(DEFAULT_SETTINGS);
  return {
    metronome: parseMetronomeSettings(value.metronome),
    tunerA4: boundedInteger(value.tunerA4, 415, 466, DEFAULT_SETTINGS.tunerA4)
  };
}

export function parseMetronomeSettings(value: unknown): MetronomeSettings {
  const settings = isRecord(value) ? value : {};
  return {
    bpm: boundedNumber(settings.bpm, 30, 300, DEFAULT_SETTINGS.metronome.bpm),
    meterNumerator: boundedInteger(settings.meterNumerator, 1, 16, DEFAULT_SETTINGS.metronome.meterNumerator),
    meterDenominator: isMeterDenominator(settings.meterDenominator) ? settings.meterDenominator : DEFAULT_SETTINGS.metronome.meterDenominator,
    accent: typeof settings.accent === "boolean" ? settings.accent : DEFAULT_SETTINGS.metronome.accent,
    volume: boundedNumber(settings.volume, 0, 1, DEFAULT_SETTINGS.metronome.volume),
    tone: isToneId(settings.tone) ? settings.tone : DEFAULT_SETTINGS.metronome.tone
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedNumber(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function boundedInteger(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function isMeterDenominator(value: unknown): value is MeterDenominator {
  return value === 2 || value === 4 || value === 8 || value === 16;
}

export function isToneId(value: unknown): value is TonePresetId {
  return typeof value === "string" && TONE_PRESETS.some((preset) => preset.id === value);
}

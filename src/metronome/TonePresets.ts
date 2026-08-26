import type { TonePreset, TonePresetId } from "./types";

export const TONE_PRESETS: readonly TonePreset[] = [
  { id: "woodblock", name: "Woodblock", waveform: "sine", frequency: 780, accentFrequency: 1050, duration: 0.055, attack: 0.002, brightness: 0.45 },
  { id: "mechanical", name: "Mechanical", waveform: "square", frequency: 1100, accentFrequency: 1450, duration: 0.025, attack: 0.001, brightness: 0.3 },
  { id: "rimshot", name: "Rimshot", waveform: "sawtooth", frequency: 520, accentFrequency: 720, duration: 0.04, attack: 0.001, brightness: 0.8 },
  { id: "claves", name: "Claves", waveform: "triangle", frequency: 1750, accentFrequency: 2100, duration: 0.035, attack: 0.001, brightness: 0.65 },
  { id: "cowbell", name: "Cowbell", waveform: "square", frequency: 560, accentFrequency: 845, duration: 0.09, attack: 0.002, brightness: 0.4 },
  { id: "soft-digital", name: "Soft digital", waveform: "triangle", frequency: 880, accentFrequency: 1175, duration: 0.08, attack: 0.006, brightness: 0.15 },
  { id: "sine-pulse", name: "Sine pulse", waveform: "sine", frequency: 1000, accentFrequency: 1320, duration: 0.05, attack: 0.003, brightness: 0 }
] as const;

export function getTonePreset(id: TonePresetId): TonePreset {
  return TONE_PRESETS.find((preset) => preset.id === id) ?? TONE_PRESETS[0];
}

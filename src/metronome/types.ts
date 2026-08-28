export type MeterDenominator = 2 | 4 | 8 | 16;

export interface Meter {
  numerator: number;
  denominator: MeterDenominator;
}

export type TonePresetId =
  | "woodblock"
  | "mechanical"
  | "rimshot"
  | "claves"
  | "cowbell"
  | "soft-digital"
  | "sine-pulse";

export interface TonePreset {
  id: TonePresetId;
  waveform: OscillatorType;
  frequency: number;
  accentFrequency: number;
  duration: number;
  attack: number;
  brightness: number;
}

export interface ScheduledBeat {
  index: number;
  time: number;
  accented: boolean;
}

export interface MetronomeState {
  running: boolean;
  currentBeat: number | null;
}

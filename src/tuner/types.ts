export interface PitchDetection {
  frequency: number;
  confidence: number;
  rms: number;
}

export interface TunerReading extends PitchDetection {
  note: string;
  octave: number;
  cents: number;
}

export type TunerStatus = "idle" | "starting" | "listening" | "error";

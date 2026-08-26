import type { TunerReading } from "./types";

const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"] as const;

export function describePitch(frequency: number, a4 = 440): Pick<TunerReading, "note" | "octave" | "cents"> {
  const midiFloat = 69 + 12 * Math.log2(frequency / a4);
  const midi = Math.round(midiFloat);
  const noteIndex = ((midi % 12) + 12) % 12;
  return {
    note: NOTE_NAMES[noteIndex],
    octave: Math.floor(midi / 12) - 1,
    cents: Math.round((midiFloat - midi) * 100) || 0
  };
}

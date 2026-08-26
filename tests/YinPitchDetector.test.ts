import { describe, expect, it } from "vitest";
import { YinPitchDetector } from "../src/tuner/YinPitchDetector";

const SAMPLE_RATE = 48_000;

function sine(frequency: number, amplitude = 0.5, dcOffset = 0): Float32Array {
  return Float32Array.from({ length: 8192 }, (_, index) => dcOffset + amplitude * Math.sin(2 * Math.PI * frequency * index / SAMPLE_RATE));
}

function complexTone(frequency: number): Float32Array {
  let seed = 7;
  return Float32Array.from({ length: 8192 }, (_, index) => {
    seed = (seed * 16807) % 2147483647;
    const noise = (seed / 2147483647 - 0.5) * 0.08;
    return 0.4 * Math.sin(2 * Math.PI * frequency * index / SAMPLE_RATE)
      + 0.22 * Math.sin(4 * Math.PI * frequency * index / SAMPLE_RATE)
      + noise;
  });
}

describe("YinPitchDetector", () => {
  it.each([40, 82.41, 220, 440, 1000, 2000])("detects a generated %s Hz sine", (frequency) => {
    const result = new YinPitchDetector(SAMPLE_RATE).detect(sine(frequency));
    expect(result).not.toBeNull();
    expect(result!.frequency).toBeCloseTo(frequency, 0);
    expect(result!.confidence).toBeGreaterThanOrEqual(0.8);
    expect(result!.rms).toBeGreaterThan(0.3);
  });

  it("removes DC offset before RMS and detection", () => {
    const detector = new YinPitchDetector(SAMPLE_RATE);
    const result = detector.detect(sine(440, 0.2, 0.7));
    expect(result!.frequency).toBeCloseTo(440, 0);
    expect(result!.rms).toBeCloseTo(Math.SQRT1_2 * 0.2, 2);
  });

  it("rejects silence and signals below its frequency bound", () => {
    const detector = new YinPitchDetector(SAMPLE_RATE);
    expect(detector.detect(new Float32Array(8192))).toBeNull();
    expect(detector.detect(sine(30))).toBeNull();
  });

  it("reuses its difference buffer across analyses", () => {
    const detector = new YinPitchDetector(SAMPLE_RATE);
    detector.detect(sine(220));
    const storage = (detector as unknown as { difference: Float32Array }).difference;
    detector.detect(sine(440));
    expect((detector as unknown as { difference: Float32Array }).difference).toBe(storage);
  });

  it("detects a noisy tone with a strong harmonic", () => {
    const result = new YinPitchDetector(SAMPLE_RATE).detect(complexTone(196));
    expect(result).not.toBeNull();
    expect(result!.frequency).toBeCloseTo(196, 0);
  });

  it("uses trailing samples for a changing signal", () => {
    const signal = sine(440);
    signal.set(sine(220).subarray(4096), 4096);
    const result = new YinPitchDetector(SAMPLE_RATE).detect(signal);
    expect(result!.frequency).toBeCloseTo(220, 0);
  });
});

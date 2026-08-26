import type { PitchDetection } from "./types";

const YIN_THRESHOLD = 0.15;

export class YinPitchDetector {
  private difference = new Float32Array(0);
  private downsampled = new Float32Array(0);

  constructor(
    private readonly sampleRate: number,
    private readonly minFrequency = 40,
    private readonly maxFrequency = 2000,
    private readonly minRms = 0.01,
    private readonly minConfidence = 0.8
  ) {}

  detect(buffer: Float32Array): PitchDetection | null {
    if (buffer.length < 4) return null;
    const downsampledLength = Math.floor(buffer.length / 2);
    if (this.downsampled.length !== downsampledLength) this.downsampled = new Float32Array(downsampledLength);
    for (let index = 0; index < downsampledLength; index++) {
      this.downsampled[index] = (buffer[index * 2] + buffer[index * 2 + 1]) * 0.5;
    }
    const samples = this.downsampled;
    const effectiveSampleRate = this.sampleRate / 2;
    let mean = 0;
    for (const sample of samples) mean += sample;
    mean /= samples.length;

    let squareSum = 0;
    for (const sample of samples) {
      const centered = sample - mean;
      squareSum += centered * centered;
    }
    const rms = Math.sqrt(squareSum / samples.length);
    if (rms < this.minRms) return null;

    const minTau = Math.max(2, Math.floor(effectiveSampleRate / this.maxFrequency));
    const maxTau = Math.min(Math.floor(effectiveSampleRate / this.minFrequency), Math.floor(samples.length / 2));
    if (maxTau <= minTau) return null;
    const comparisonLength = Math.min(maxTau, samples.length - maxTau);
    const start = samples.length - comparisonLength - maxTau;

    if (this.difference.length < maxTau + 1) this.difference = new Float32Array(maxTau + 1);
    const difference = this.difference;
    for (let tau = 1; tau <= maxTau; tau++) {
      let sum = 0;
      for (let index = 0; index < comparisonLength; index++) {
        const delta = samples[start + index] - samples[start + index + tau];
        sum += delta * delta;
      }
      difference[tau] = sum;
    }

    let runningSum = 0;
    difference[0] = 1;
    for (let tau = 1; tau <= maxTau; tau++) {
      runningSum += difference[tau];
      difference[tau] = runningSum === 0 ? 1 : (difference[tau] * tau) / runningSum;
    }

    let tau = minTau;
    while (tau <= maxTau) {
      if (difference[tau] < YIN_THRESHOLD) {
        while (tau + 1 <= maxTau && difference[tau + 1] < difference[tau]) tau++;
        break;
      }
      tau++;
    }
    if (tau > maxTau) return null;

    const confidence = 1 - difference[tau];
    if (confidence < this.minConfidence) return null;
    const refinedTau = this.parabolicTau(difference, tau, maxTau);
    const frequency = effectiveSampleRate / refinedTau;
    if (frequency < this.minFrequency || frequency > this.maxFrequency) return null;
    return { frequency, confidence, rms };
  }

  private parabolicTau(values: Float32Array, tau: number, maxTau: number): number {
    if (tau <= 1 || tau >= maxTau) return tau;
    const left = values[tau - 1];
    const center = values[tau];
    const right = values[tau + 1];
    if (center < 0.000001) return tau;
    const denominator = 2 * (2 * center - right - left);
    return denominator === 0 ? tau : tau + (right - left) / denominator;
  }
}

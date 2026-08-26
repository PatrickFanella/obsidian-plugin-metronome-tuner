import { describe, expect, it } from "vitest";
import { TapTempo } from "../src/metronome/TapTempo";

describe("TapTempo", () => {
  it("returns a median tempo and ignores an outlier", () => {
    const taps = new TapTempo();
    expect(taps.tap(0)).toBeNull();
    expect(taps.tap(500)).toBe(120);
    taps.tap(1000);
    taps.tap(1900);
    expect(taps.tap(2400)).toBe(120);
  });

  it("resets after a long pause and bounds output", () => {
    const taps = new TapTempo();
    taps.tap(0);
    expect(taps.tap(100)).toBe(300);
    expect(taps.tap(3000)).toBeNull();
  });

  it("accepts jitter at the 30 BPM boundary", () => {
    const taps = new TapTempo();
    taps.tap(0);
    expect(taps.tap(2_400)).toBe(30);
  });
});

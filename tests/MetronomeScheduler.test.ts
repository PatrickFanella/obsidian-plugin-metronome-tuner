import { afterEach, describe, expect, it, vi } from "vitest";
import { MetronomeScheduler, beatDurationSeconds } from "../src/metronome/MetronomeScheduler";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("beatDurationSeconds", () => {
  it("accounts for tempo and meter beat unit", () => {
    expect(beatDurationSeconds(120, 4)).toBe(0.5);
    expect(beatDurationSeconds(120, 8)).toBe(0.25);
  });

  it("sanitizes direct invalid inputs", () => {
    expect(beatDurationSeconds(Number.NaN, 3)).toBe(0.5);
    expect(beatDurationSeconds(0, 4)).toBe(2);
  });
});

describe("MetronomeScheduler", () => {
  it("skips overdue beats without resetting the beat index", () => {
    vi.useFakeTimers();
    vi.stubGlobal("window", globalThis);
    const clock = { currentTime: 0 };
    const context = clock as AudioContext;
    const beats: Array<{ index: number; time: number }> = [];
    const scheduler = new MetronomeScheduler(context, 120, 4, 4, (beat) => beats.push(beat));

    scheduler.start();
    expect(beats).toMatchObject([{ index: 0, time: 0.05 }]);
    clock.currentTime = 1.5;
    vi.advanceTimersByTime(25);

    expect(beats).toMatchObject([{ index: 0, time: 0.05 }, { index: 3, time: 1.55 }]);
    scheduler.stop();
  });
});

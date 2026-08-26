import type { ScheduledBeat } from "./types";

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SECONDS = 0.1;
const START_DELAY_SECONDS = 0.05;

export class MetronomeScheduler {
  private timer: number | null = null;
  private nextBeatTime = 0;
  private beatIndex = 0;
  private visualTimers = new Set<number>();

  constructor(
    private readonly context: AudioContext,
    private bpm: number,
    private beatsPerBar: number,
    private beatUnit: number,
    private readonly scheduleBeat: (beat: ScheduledBeat) => void,
    private readonly presentBeat: (beat: ScheduledBeat) => void = () => undefined
  ) {
    this.bpm = sanitizeBpm(bpm);
    this.beatsPerBar = sanitizeBeatsPerBar(beatsPerBar);
    this.beatUnit = sanitizeBeatUnit(beatUnit);
  }

  get running(): boolean {
    return this.timer !== null;
  }

  start(): void {
    if (this.running) return;
    this.beatIndex = 0;
    this.nextBeatTime = this.context.currentTime + START_DELAY_SECONDS;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  stop(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    for (const timer of this.visualTimers) window.clearTimeout(timer);
    this.visualTimers.clear();
    this.beatIndex = 0;
  }

  setTempo(bpm: number): void {
    this.bpm = sanitizeBpm(bpm);
  }

  setMeter(beatsPerBar: number, beatUnit: number): void {
    this.beatsPerBar = sanitizeBeatsPerBar(beatsPerBar);
    this.beatUnit = sanitizeBeatUnit(beatUnit);
    this.beatIndex %= this.beatsPerBar;
  }

  private tick(): void {
    const now = this.context.currentTime;
    const duration = beatDurationSeconds(this.bpm, this.beatUnit);
    while (this.nextBeatTime < now) {
      this.nextBeatTime += duration;
      this.beatIndex = (this.beatIndex + 1) % this.beatsPerBar;
    }

    while (this.nextBeatTime < now + SCHEDULE_AHEAD_SECONDS) {
      const beat = { index: this.beatIndex, time: this.nextBeatTime, accented: this.beatIndex === 0 };
      this.scheduleBeat(beat);
      const delay = Math.max(0, (beat.time - this.context.currentTime) * 1000);
      const visualTimer = window.setTimeout(() => {
        this.visualTimers.delete(visualTimer);
        if (this.running) this.presentBeat(beat);
      }, delay);
      this.visualTimers.add(visualTimer);
      this.nextBeatTime += duration;
      this.beatIndex = (this.beatIndex + 1) % this.beatsPerBar;
    }
  }
}

export function beatDurationSeconds(bpm: number, beatUnit: number): number {
  return (60 / sanitizeBpm(bpm)) * (4 / sanitizeBeatUnit(beatUnit));
}

function sanitizeBpm(value: number): number {
  return Number.isFinite(value) ? Math.min(300, Math.max(30, value)) : 120;
}

function sanitizeBeatsPerBar(value: number): number {
  return Number.isInteger(value) ? Math.min(16, Math.max(1, value)) : 4;
}

function sanitizeBeatUnit(value: number): number {
  return value === 2 || value === 4 || value === 8 || value === 16 ? value : 4;
}

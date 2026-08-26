const RESET_AFTER_MS = 2_500;
const MAX_INTERVALS = 7;

export class TapTempo {
  private lastTap: number | null = null;
  private intervals: number[] = [];

  tap(timeMs = performance.now()): number | null {
    if (this.lastTap === null || timeMs - this.lastTap > RESET_AFTER_MS) {
      this.intervals = [];
      this.lastTap = timeMs;
      return null;
    }

    const interval = timeMs - this.lastTap;
    this.lastTap = timeMs;
    if (interval <= 0) return null;
    this.intervals.push(interval);
    if (this.intervals.length > MAX_INTERVALS) this.intervals.shift();

    const sorted = [...this.intervals].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    return Math.round(Math.min(300, Math.max(30, 60_000 / median)));
  }

  reset(): void {
    this.lastTap = null;
    this.intervals = [];
  }
}

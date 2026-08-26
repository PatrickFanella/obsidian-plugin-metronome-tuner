import type { TonePreset } from "./types";

export interface ScheduledVoice {
  cancel(): void;
  onEnded?(listener: () => void): () => void;
}

export class ClickSynth {
  schedule(context: AudioContext, time: number, preset: TonePreset, volume: number, accented: boolean): ScheduledVoice | null {
    if (volume <= 0) return null;
    const start = Math.max(time, context.currentTime);
    const end = start + preset.duration;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    oscillator.type = preset.waveform;
    oscillator.frequency.setValueAtTime(accented ? preset.accentFrequency : preset.frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, preset.frequency * 0.65), end);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800 + preset.brightness * 7000, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * (accented ? 1 : 0.72)), start + preset.attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(filter).connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.01);
    const endedListeners = new Set<() => void>();
    let ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      oscillator.disconnect();
      filter.disconnect();
      gain.disconnect();
      for (const listener of endedListeners) listener();
      endedListeners.clear();
    };
    oscillator.addEventListener("ended", finish, { once: true });
    return {
      cancel: () => {
        if (ended) return;
        try {
          oscillator.stop();
        } catch {
          finish();
          return;
        }
        finish();
      },
      onEnded: (listener) => {
        if (ended) {
          listener();
          return () => undefined;
        }
        endedListeners.add(listener);
        return () => endedListeners.delete(listener);
      }
    };
  }
}

import { AudioRuntime } from "../audio/AudioRuntime";
import { parseMetronomeSettings, type MetronomeSettings } from "../settingsParsing";
import { ClickSynth } from "./ClickSynth";
import { MetronomeScheduler } from "./MetronomeScheduler";
import { TapTempo } from "./TapTempo";
import { getTonePreset } from "./TonePresets";
import type { MetronomeState } from "./types";
import type { ScheduledVoice } from "./ClickSynth";

export class MetronomeController {
  private readonly synth = new ClickSynth();
  private readonly tapTempo = new TapTempo();
  private scheduler: MetronomeScheduler | null = null;
  private currentBeatValue: number | null = null;
  private readonly listeners = new Set<(state: MetronomeState) => void>();
  private previewVoices: ScheduledVoice[] = [];
  private previewSession = 0;
  private metronomeVoices = new Set<ScheduledVoice>();
  private generation = 0;
  private starting = false;

  constructor(private readonly audio: AudioRuntime, private settings: MetronomeSettings) {
    this.settings = parseMetronomeSettings(settings);
  }

  get running(): boolean {
    return this.starting || (this.scheduler?.running ?? false);
  }

  get currentBeat(): number | null { return this.currentBeatValue; }

  subscribe(listener: (state: MetronomeState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state());
    return () => this.listeners.delete(listener);
  }

  async start(): Promise<void> {
    if (this.running) return;
    const generation = ++this.generation;
    this.starting = true;
    this.emit();
    let context: AudioContext;
    try {
      context = await this.audio.getContext();
    } catch (error: unknown) {
      if (generation === this.generation) {
        this.starting = false;
        this.emit();
      }
      throw error;
    }
    if (generation !== this.generation || !this.starting) return;
    const scheduler = new MetronomeScheduler(context, this.settings.bpm, this.settings.meterNumerator, this.settings.meterDenominator, (beat) => {
      if (generation !== this.generation) return;
      const voice = this.synth.schedule(
        context,
        beat.time,
        getTonePreset(this.settings.tone),
        this.settings.volume,
        this.settings.accent && beat.accented
      );
      if (voice) this.trackVoice(voice, this.metronomeVoices);
    }, (beat) => {
      this.currentBeatValue = beat.index;
      this.emit();
    });
    this.scheduler = scheduler;
    this.starting = false;
    scheduler.start();
    this.emit();
  }

  stop(): void {
    this.generation++;
    this.starting = false;
    this.scheduler?.stop();
    this.scheduler = null;
    for (const voice of this.metronomeVoices) voice.cancel();
    this.metronomeVoices.clear();
    this.currentBeatValue = null;
    this.emit();
  }

  async toggle(): Promise<void> {
    if (this.running) this.stop();
    else await this.start();
  }

  updateSettings(settings: MetronomeSettings): void {
    this.settings = parseMetronomeSettings(settings);
    this.scheduler?.setTempo(this.settings.bpm);
    this.scheduler?.setMeter(this.settings.meterNumerator, this.settings.meterDenominator);
  }

  tap(timeMs?: number): number | null {
    return this.tapTempo.tap(timeMs);
  }

  async preview(): Promise<void> {
    this.cancelPreview();
    const session = this.previewSession;
    const context = await this.audio.getContext();
    if (session !== this.previewSession) return;
    const preset = getTonePreset(this.settings.tone);
    const interval = (60 / this.settings.bpm) * (4 / this.settings.meterDenominator);
    const start = context.currentTime + 0.01;
    for (let index = 0; index < 3; index++) {
      const voice = this.synth.schedule(context, start + interval * index, preset, this.settings.volume, this.settings.accent && index === 0);
      if (voice) {
        this.previewVoices.push(voice);
        voice.onEnded?.(() => {
          const voiceIndex = this.previewVoices.indexOf(voice);
          if (voiceIndex >= 0) this.previewVoices.splice(voiceIndex, 1);
        });
      }
    }
  }

  dispose(): void {
    this.stop();
    this.cancelPreview();
    this.tapTempo.reset();
  }

  private state(): MetronomeState {
    return { running: this.running, currentBeat: this.currentBeatValue };
  }

  private emit(): void {
    const state = this.state();
    for (const listener of this.listeners) listener(state);
  }

  private cancelPreview(): void {
    this.previewSession++;
    const voices = this.previewVoices;
    this.previewVoices = [];
    for (const voice of voices) voice.cancel();
  }

  private trackVoice(voice: ScheduledVoice, voices: Set<ScheduledVoice>): void {
    voices.add(voice);
    voice.onEnded?.(() => voices.delete(voice));
  }
}

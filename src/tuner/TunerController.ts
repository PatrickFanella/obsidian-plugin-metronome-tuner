import { AudioRuntime } from "../audio/AudioRuntime";
import { describePitch } from "./NoteMath";
import type { TunerReading, TunerStatus } from "./types";
import { YinPitchDetector } from "./YinPitchDetector";

const ANALYSIS_INTERVAL_MS = 100;
const SMOOTHING_WINDOW = 5;
const READING_HOLD_MS = 550;
const DEFAULT_A4 = 440;

export class TunerOwner {
  private readonly identity = Symbol();

  private constructor() {}

  static create(): TunerOwner {
    return new TunerOwner();
  }
}

interface SessionResources {
  stream: MediaStream | null;
  source: MediaStreamAudioSourceNode | null;
  analyser: AnalyserNode | null;
  timer: number | null;
  trackEndedListeners: Map<MediaStreamTrack, () => void>;
}

interface TunerSession {
  owner: TunerOwner;
  resources: SessionResources;
}

export class TunerController {
  private midiPitches: number[] = [];
  private lastReliableAt = 0;
  private statusValue: TunerStatus = "idle";
  private errorValue: string | null = null;
  private readingValue: TunerReading | null = null;
  private activeSession: TunerSession | null = null;

  constructor(private readonly audio: AudioRuntime, private a4: number) {
    this.a4 = sanitizeA4(a4);
  }

  get status(): TunerStatus { return this.statusValue; }
  get error(): string | null { return this.errorValue; }
  get reading(): TunerReading | null { return this.readingValue; }

  isOwnedBy(owner: TunerOwner): boolean {
    return this.activeSession?.owner === owner;
  }

  setA4(a4: number): void {
    this.a4 = sanitizeA4(a4);
    this.midiPitches = [];
    this.readingValue = null;
    this.lastReliableAt = 0;
  }

  async start(owner: TunerOwner): Promise<boolean> {
    if (this.activeSession) return this.activeSession.owner === owner;

    const session: TunerSession = {
      owner,
      resources: {
        stream: null,
        source: null,
        analyser: null,
        timer: null,
        trackEndedListeners: new Map()
      }
    };
    this.activeSession = session;
    this.statusValue = "starting";
    this.errorValue = null;

    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone access is not available on this device.");
      // Creating/resuming here, before the first await, preserves mobile user activation.
      const contextResultPromise = this.audio.getContext().then(
        (context) => ({ context, error: null }),
        (error: unknown) => ({ context: null, error })
      );
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      session.resources.stream = stream;
      for (const track of stream.getTracks()) {
        const onEnded = () => this.handleTrackEnded(session);
        track.addEventListener("ended", onEnded);
        session.resources.trackEndedListeners.set(track, onEnded);
      }
      if (this.activeSession !== session) {
        this.stopResources(session.resources);
        return false;
      }

      const contextResult = await contextResultPromise;
      if (contextResult.error) throw contextResult.error;
      const context = contextResult.context;
      if (!context) throw new Error("Could not start audio.");
      if (this.activeSession !== session) {
        this.stopResources(session.resources);
        return false;
      }

      const analyser = context.createAnalyser();
      analyser.fftSize = 8192;
      analyser.smoothingTimeConstant = 0;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      session.resources.source = source;
      session.resources.analyser = analyser;
      this.statusValue = "listening";
      const detector = new YinPitchDetector(context.sampleRate);
      const buffer = new Float32Array(new ArrayBuffer(analyser.fftSize * Float32Array.BYTES_PER_ELEMENT));
      session.resources.timer = window.setInterval(() => this.analyze(session, detector, buffer), ANALYSIS_INTERVAL_MS);
      return true;
    } catch (error: unknown) {
      this.stopResources(session.resources);
      if (this.activeSession !== session) return false;
      this.activeSession = null;
      this.statusValue = "error";
      this.errorValue = microphoneErrorMessage(error);
      return false;
    }
  }

  stop(owner: TunerOwner): boolean {
    const session = this.activeSession;
    if (!session || session.owner !== owner) return false;
    this.activeSession = null;
    this.stopResources(session.resources);
    this.resetState();
    return true;
  }

  dispose(): void {
    const session = this.activeSession;
    this.activeSession = null;
    if (session) this.stopResources(session.resources);
    this.resetState();
  }

  private resetState(): void {
    this.statusValue = "idle";
    this.errorValue = null;
    this.readingValue = null;
    this.midiPitches = [];
    this.lastReliableAt = 0;
  }

  private analyze(session: TunerSession, detector: YinPitchDetector, buffer: Float32Array<ArrayBuffer>): void {
    const analyser = session.resources.analyser;
    if (this.activeSession !== session || !analyser) return;
    analyser.getFloatTimeDomainData(buffer);
    const detection = detector.detect(buffer);
    if (!detection) {
      if (performance.now() - this.lastReliableAt >= READING_HOLD_MS) {
        this.readingValue = null;
        this.midiPitches = [];
      }
      return;
    }
    this.lastReliableAt = performance.now();
    this.midiPitches.push(69 + 12 * Math.log2(detection.frequency / this.a4));
    if (this.midiPitches.length > SMOOTHING_WINDOW) this.midiPitches.shift();
    const sorted = [...this.midiPitches].sort((a, b) => a - b);
    const midiPitch = sorted[Math.floor(sorted.length / 2)];
    const frequency = this.a4 * 2 ** ((midiPitch - 69) / 12);
    this.readingValue = { ...detection, frequency, ...describePitch(frequency, this.a4) };
  }

  private stopResources(resources: SessionResources): void {
    if (resources.timer !== null) window.clearInterval(resources.timer);
    resources.timer = null;
    resources.source?.disconnect();
    resources.analyser?.disconnect();
    resources.stream?.getTracks().forEach((track) => {
      const listener = resources.trackEndedListeners.get(track);
      if (listener) track.removeEventListener("ended", listener);
      track.stop();
    });
    resources.trackEndedListeners.clear();
    resources.source = null;
    resources.analyser = null;
    resources.stream = null;
  }

  private handleTrackEnded(session: TunerSession): void {
    if (this.activeSession !== session) return;
    this.activeSession = null;
    this.stopResources(session.resources);
    this.readingValue = null;
    this.midiPitches = [];
    this.statusValue = "error";
    this.errorValue = "The microphone disconnected. Reconnect it and try again.";
  }
}

function sanitizeA4(value: number): number {
  return Number.isFinite(value) ? Math.min(466, Math.max(415, value)) : DEFAULT_A4;
}

function microphoneErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") return "Microphone permission was denied. Allow microphone access in your system or Obsidian settings.";
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") return "No microphone was found. Connect an input device and try again.";
    if (error.name === "NotReadableError" || error.name === "TrackStartError") return "The microphone is busy or unavailable. Close other audio apps and try again.";
    if (error.name === "OverconstrainedError") return "The microphone does not support the requested audio settings.";
  }
  return error instanceof Error ? error.message : "Could not start the microphone.";
}

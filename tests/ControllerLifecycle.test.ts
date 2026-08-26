import { afterEach, describe, expect, it, vi } from "vitest";
import type { AudioRuntime } from "../src/audio/AudioRuntime";
import { MetronomeController } from "../src/metronome/MetronomeController";
import { TunerController, TunerOwner } from "../src/tuner/TunerController";

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TunerController lifecycle", () => {
  it("stops an acquired stream when cancelled while audio context startup is pending", async () => {
    const context = deferred<AudioContext>();
    const stop = vi.fn();
    const track = {
      stop,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaStreamTrack;
    const stream = { getTracks: () => [track] } as unknown as MediaStream;
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn().mockResolvedValue(stream) } });
    const audio = { getContext: () => context.promise } as unknown as AudioRuntime;
    const tuner = new TunerController(audio, 440);
    const owner = TunerOwner.create();

    const starting = tuner.start(owner);
    await Promise.resolve();
    await Promise.resolve();
    tuner.stop(owner);

    expect(stop).toHaveBeenCalledOnce();
    expect(track.removeEventListener).toHaveBeenCalledOnce();
    context.resolve({} as AudioContext);
    await starting;
    expect(tuner.status).toBe("idle");
  });

  it("keeps a retry live when the cancelled session's audio context resumes", async () => {
    const oldContext = deferred<AudioContext>();
    const oldStop = vi.fn();
    const newStop = vi.fn();
    const newRemoveEventListener = vi.fn();
    const oldTrack = {
      stop: oldStop,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaStreamTrack;
    const newTrack = {
      stop: newStop,
      addEventListener: vi.fn(),
      removeEventListener: newRemoveEventListener
    } as unknown as MediaStreamTrack;
    const oldStream = { getTracks: () => [oldTrack] } as unknown as MediaStream;
    const newStream = { getTracks: () => [newTrack] } as unknown as MediaStream;
    const analyser = {
      fftSize: 0,
      smoothingTimeConstant: 0,
      disconnect: vi.fn(),
      getFloatTimeDomainData: vi.fn()
    } as unknown as AnalyserNode;
    const source = { connect: vi.fn(), disconnect: vi.fn() } as unknown as MediaStreamAudioSourceNode;
    const currentContext = {
      sampleRate: 48000,
      createAnalyser: vi.fn(() => analyser),
      createMediaStreamSource: vi.fn(() => source)
    } as unknown as AudioContext;
    const getUserMedia = vi.fn()
      .mockResolvedValueOnce(oldStream)
      .mockResolvedValueOnce(newStream);
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    vi.stubGlobal("window", { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    const getContext = vi.fn()
      .mockImplementationOnce(() => oldContext.promise)
      .mockResolvedValueOnce(currentContext);
    const tuner = new TunerController({ getContext } as unknown as AudioRuntime, 440);
    const owner = TunerOwner.create();

    const cancelledStart = tuner.start(owner);
    await Promise.resolve();
    await Promise.resolve();
    expect(tuner.stop(owner)).toBe(true);

    await tuner.start(owner);
    expect(tuner.status).toBe("listening");
    expect(newTrack.addEventListener).toHaveBeenCalledOnce();

    oldContext.resolve(currentContext);
    await cancelledStart;

    expect(oldStop).toHaveBeenCalledOnce();
    expect(newStop).not.toHaveBeenCalled();
    expect(newRemoveEventListener).not.toHaveBeenCalled();
    expect(source.disconnect).not.toHaveBeenCalled();
    expect(tuner.status).toBe("listening");

    tuner.stop(owner);
  });

  it("does not stop or replace a session owned by another view", async () => {
    const stop = vi.fn();
    const track = {
      stop,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    } as unknown as MediaStreamTrack;
    const stream = { getTracks: () => [track] } as unknown as MediaStream;
    const analyser = {
      fftSize: 0,
      smoothingTimeConstant: 0,
      disconnect: vi.fn(),
      getFloatTimeDomainData: vi.fn()
    } as unknown as AnalyserNode;
    const source = { connect: vi.fn(), disconnect: vi.fn() } as unknown as MediaStreamAudioSourceNode;
    const context = {
      sampleRate: 48000,
      createAnalyser: vi.fn(() => analyser),
      createMediaStreamSource: vi.fn(() => source)
    } as unknown as AudioContext;
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    vi.stubGlobal("window", { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    const tuner = new TunerController({ getContext: vi.fn().mockResolvedValue(context) } as unknown as AudioRuntime, 440);
    const owner = TunerOwner.create();
    const otherView = TunerOwner.create();

    await tuner.start(owner);

    expect(tuner.stop(otherView)).toBe(false);
    expect(await tuner.start(otherView)).toBe(false);
    expect(tuner.isOwnedBy(owner)).toBe(true);
    expect(tuner.status).toBe("listening");
    expect(stop).not.toHaveBeenCalled();
    expect(getUserMedia).toHaveBeenCalledOnce();

    tuner.stop(owner);
  });
});

describe("MetronomeController lifecycle", () => {
  it("deduplicates concurrent starts and cancels a stop during startup", async () => {
    const context = deferred<AudioContext>();
    const getContext = vi.fn(() => context.promise);
    const controller = new MetronomeController({ getContext } as unknown as AudioRuntime, {
      bpm: 120,
      meterNumerator: 4,
      meterDenominator: 4,
      volume: 0.7,
      accent: true,
      tone: "woodblock"
    });
    const schedule = vi.fn();
    (controller as unknown as { synth: { schedule: typeof schedule } }).synth = { schedule };

    const first = controller.start();
    const second = controller.start();
    controller.stop();
    context.resolve({} as AudioContext);
    await Promise.all([first, second]);

    expect(getContext).toHaveBeenCalledOnce();
    expect(schedule).not.toHaveBeenCalled();
    expect(controller.running).toBe(false);
  });
});

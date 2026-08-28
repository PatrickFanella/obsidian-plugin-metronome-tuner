import { Notice, Plugin } from "obsidian";
import { AudioRuntime } from "./audio/AudioRuntime";
import { createTranslator, type Translator } from "./i18n";
import { resolveLanguagePreference } from "./i18n/detectLocale";
import { MetronomeController } from "./metronome/MetronomeController";
import type { TonePresetId } from "./metronome/types";
import { DEFAULT_SETTINGS, MetronomeTunerSettingTab, parseSettings, type PluginSettings } from "./settings";
import { TunerController } from "./tuner/TunerController";
import { MetronomeTunerView, VIEW_TYPE_METRONOME_TUNER } from "./view";

export default class MetronomeTunerPlugin extends Plugin {
  settings: PluginSettings = structuredClone(DEFAULT_SETTINGS);
  readonly audio = new AudioRuntime();
  metronome!: MetronomeController;
  tuner!: TunerController;
  i18n!: Translator;
  private saveQueue: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    const loadedSettings: unknown = await this.loadData();
    this.settings = parseSettings(loadedSettings);
    this.i18n = createTranslator(resolveLanguagePreference(this.settings.language));
    this.metronome = new MetronomeController(this.audio, this.settings.metronome);
    this.tuner = new TunerController(this.audio, this.settings.tunerA4);
    this.registerView(VIEW_TYPE_METRONOME_TUNER, (leaf) => new MetronomeTunerView(leaf, this));
    this.addRibbonIcon("audio-waveform", this.i18n.t("openView"), () => void this.activateView());
    this.addCommand({ id: "open-view", name: this.i18n.t("commandOpen"), callback: () => void this.activateView() });
    this.addCommand({ id: "start-metronome", name: this.i18n.t("commandStart"), callback: () => void this.metronome.start().catch((error: unknown) => {
      console.error("Could not start metronome", error);
      new Notice(this.i18n.t("errorMetronome"));
    }) });
    this.addCommand({ id: "stop-metronome", name: this.i18n.t("commandStop"), callback: () => this.metronome.stop() });
    this.addSettingTab(new MetronomeTunerSettingTab(this.app, this));
  }

  onunload(): void {
    this.metronome.dispose();
    this.tuner.dispose();
    void this.audio.dispose();
  }

  async activateView(): Promise<void> {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_METRONOME_TUNER)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf(true);
      await leaf.setViewState({ type: VIEW_TYPE_METRONOME_TUNER, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
  }

  async updateSettings(settings: PluginSettings): Promise<void> {
    const previousA4 = this.settings.tunerA4;
    this.settings = parseSettings(settings);
    this.metronome.updateSettings(this.settings.metronome);
    if (this.settings.tunerA4 !== previousA4) this.tuner.setA4(this.settings.tunerA4);
    const snapshot = structuredClone(this.settings);
    this.saveQueue = this.saveQueue.catch(() => undefined).then(() => this.saveData(snapshot));
    await this.saveQueue;
  }

  async setBpm(bpm: number): Promise<void> {
    await this.updateSettings({ ...this.settings, metronome: { ...this.settings.metronome, bpm } });
  }

  async setTone(tone: TonePresetId): Promise<void> {
    await this.updateSettings({ ...this.settings, metronome: { ...this.settings.metronome, tone } });
  }
}

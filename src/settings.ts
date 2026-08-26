import { App, PluginSettingTab, Setting } from "obsidian";
import type MetronomeTunerPlugin from "./main";
import type { MeterDenominator } from "./metronome/types";
import { TONE_PRESETS } from "./metronome/TonePresets";
export { DEFAULT_SETTINGS, isToneId, parseSettings } from "./settingsParsing";
export type { MetronomeSettings, PluginSettings } from "./settingsParsing";
import { isToneId } from "./settingsParsing";

const DENOMINATORS: readonly MeterDenominator[] = [2, 4, 8, 16];

export class MetronomeTunerSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: MetronomeTunerPlugin) {
    super(app, plugin);
  }

  display(): void {
    this.containerEl.empty();
    new Setting(this.containerEl).setName("Default tempo").setDesc("Tempo used when Obsidian starts.").addSlider((slider) => slider
      .setLimits(30, 300, 1).setDynamicTooltip().setValue(this.plugin.settings.metronome.bpm)
      .onChange((value) => this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, bpm: value } })));
    new Setting(this.containerEl).setName("A4 reference").setDesc("Concert pitch in hertz.").addSlider((slider) => slider
      .setLimits(415, 466, 1).setDynamicTooltip().setValue(this.plugin.settings.tunerA4)
      .onChange((value) => this.plugin.updateSettings({ ...this.plugin.settings, tunerA4: value })));
    new Setting(this.containerEl).setName("Meter numerator").addSlider((slider) => slider
      .setLimits(1, 16, 1).setDynamicTooltip().setValue(this.plugin.settings.metronome.meterNumerator)
      .onChange((value) => this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, meterNumerator: value } })));
    new Setting(this.containerEl).setName("Meter denominator").addDropdown((dropdown) => {
      for (const denominator of DENOMINATORS) dropdown.addOption(String(denominator), String(denominator));
      dropdown.setValue(String(this.plugin.settings.metronome.meterDenominator)).onChange((value) => {
        const denominator = Number(value);
        if (isMeterDenominator(denominator)) void this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, meterDenominator: denominator } });
      });
    });
    new Setting(this.containerEl).setName("Accent first beat").addToggle((toggle) => toggle
      .setValue(this.plugin.settings.metronome.accent)
      .onChange((value) => this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, accent: value } })));
    new Setting(this.containerEl).setName("Click volume").addSlider((slider) => slider
      .setLimits(0, 1, 0.01).setDynamicTooltip().setValue(this.plugin.settings.metronome.volume)
      .onChange((value) => this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, volume: value } })));
    new Setting(this.containerEl).setName("Click sound").addDropdown((dropdown) => {
      for (const preset of TONE_PRESETS) dropdown.addOption(preset.id, preset.name);
      dropdown.setValue(this.plugin.settings.metronome.tone).onChange((value) => {
        if (isToneId(value)) void this.plugin.updateSettings({ ...this.plugin.settings, metronome: { ...this.plugin.settings.metronome, tone: value } });
      });
    });
  }
}

function isMeterDenominator(value: unknown): value is MeterDenominator {
  return value === 2 || value === 4 || value === 8 || value === 16;
}

import { App, PluginSettingTab, Setting } from "obsidian";
import type { SettingDefinition, SettingDefinitionItem } from "obsidian";
import type MetronomeTunerPlugin from "./main";
import type { MeterDenominator } from "./metronome/types";
import { TONE_PRESETS } from "./metronome/TonePresets";
export { DEFAULT_SETTINGS, isToneId, parseSettings } from "./settingsParsing";
export type { MetronomeSettings, PluginSettings } from "./settingsParsing";
import { isToneId } from "./settingsParsing";

const DENOMINATORS: readonly MeterDenominator[] = [2, 4, 8, 16];

interface AboutLink {
  name: string;
  description: string;
  label: string;
  href: string;
  external?: boolean;
}

interface SettingSpec {
  name: string;
  description: string;
  configure: (setting: Setting) => void;
}

const ABOUT_LINKS: readonly AboutLink[] = [
  {
    name: "Portfolio",
    description: "Selected work by Patrick Fanella.",
    label: "Visit portfolio",
    href: "https://patrickfanella.co",
    external: true,
  },
  {
    name: "Subcult",
    description: "Music, film, and independent culture projects.",
    label: "Visit Subcult",
    href: "https://subcult.tv",
    external: true,
  },
  {
    name: "GitHub",
    description: "Browse Patrick's open-source work.",
    label: "View GitHub",
    href: "https://github.com/patrickfanella",
    external: true,
  },
  {
    name: "Email",
    description: "Questions, feedback, or collaboration.",
    label: "Send email",
    href: "mailto:patrick@subcult.tv",
  },
];

export class MetronomeTunerSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: MetronomeTunerPlugin) {
    super(app, plugin);
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        type: "group",
        heading: "Defaults",
        items: this.getDefaultDefinitions(),
      },
      {
        type: "group",
        heading: "About & support",
        items: ABOUT_LINKS.map((link) => ({
          name: link.name,
          desc: link.description,
          render: (setting: Setting) => this.configureAboutLink(setting, link),
        })),
      },
    ];
  }

  display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl).setName("Defaults").setHeading();
    this.addDefaultSettings();

    new Setting(this.containerEl).setName("About & support").setHeading();
    for (const link of ABOUT_LINKS) {
      this.configureAboutLink(new Setting(this.containerEl), link);
    }
  }

  private getDefaultDefinitions(): SettingDefinition[] {
    return this.getDefaultSettings().map((spec) => ({
      name: spec.name,
      desc: spec.description,
      render: (setting: Setting) => {
        setting.setName(spec.name).setDesc(spec.description);
        spec.configure(setting);
      },
    }));
  }

  private addDefaultSettings(): void {
    for (const spec of this.getDefaultSettings()) {
      const setting = new Setting(this.containerEl)
        .setName(spec.name)
        .setDesc(spec.description);
      spec.configure(setting);
    }
  }

  private getDefaultSettings(): SettingSpec[] {
    return [
      {
        name: "Default tempo",
        description: "Tempo used when Obsidian starts.",
        configure: (setting) => this.configureDefaultTempo(setting),
      },
      {
        name: "A4 reference",
        description: "Concert pitch in hertz.",
        configure: (setting) => this.configureA4Reference(setting),
      },
      {
        name: "Meter numerator",
        description: "Number of beats in each measure.",
        configure: (setting) => this.configureMeterNumerator(setting),
      },
      {
        name: "Meter denominator",
        description: "Note value represented by each beat.",
        configure: (setting) => this.configureMeterDenominator(setting),
      },
      {
        name: "Accent first beat",
        description: "Emphasize the first beat of each measure.",
        configure: (setting) => this.configureAccent(setting),
      },
      {
        name: "Click volume",
        description: "Set the metronome's startup volume.",
        configure: (setting) => this.configureClickVolume(setting),
      },
      {
        name: "Click sound",
        description: "Choose the metronome's startup sound.",
        configure: (setting) => this.configureClickSound(setting),
      },
    ];
  }

  private configureDefaultTempo(setting: Setting): void {
    setting.addSlider((slider) => slider
      .setLimits(30, 300, 1)
      .setValue(this.plugin.settings.metronome.bpm)
      .setDynamicTooltip()
      .onChange((value) => {
        void this.plugin.updateSettings({
          ...this.plugin.settings,
          metronome: { ...this.plugin.settings.metronome, bpm: value },
        });
      }));
  }

  private configureA4Reference(setting: Setting): void {
    setting.addSlider((slider) => slider
      .setLimits(415, 466, 1)
      .setValue(this.plugin.settings.tunerA4)
      .setDynamicTooltip()
      .onChange((value) => {
        void this.plugin.updateSettings({
          ...this.plugin.settings,
          tunerA4: value,
        });
      }));
  }

  private configureMeterNumerator(setting: Setting): void {
    setting.addSlider((slider) => slider
      .setLimits(1, 16, 1)
      .setValue(this.plugin.settings.metronome.meterNumerator)
      .setDynamicTooltip()
      .onChange((value) => {
        void this.plugin.updateSettings({
          ...this.plugin.settings,
          metronome: {
            ...this.plugin.settings.metronome,
            meterNumerator: value,
          },
        });
      }));
  }

  private configureMeterDenominator(setting: Setting): void {
    setting.addDropdown((dropdown) => {
      for (const denominator of DENOMINATORS) {
        dropdown.addOption(String(denominator), String(denominator));
      }
      dropdown
        .setValue(String(this.plugin.settings.metronome.meterDenominator))
        .onChange((value) => {
          const denominator = Number(value);
          if (isMeterDenominator(denominator)) {
            void this.plugin.updateSettings({
              ...this.plugin.settings,
              metronome: {
                ...this.plugin.settings.metronome,
                meterDenominator: denominator,
              },
            });
          }
        });
    });
  }

  private configureAccent(setting: Setting): void {
    setting.addToggle((toggle) => toggle
      .setValue(this.plugin.settings.metronome.accent)
      .onChange((value) => {
        void this.plugin.updateSettings({
          ...this.plugin.settings,
          metronome: { ...this.plugin.settings.metronome, accent: value },
        });
      }));
  }

  private configureClickVolume(setting: Setting): void {
    setting.addSlider((slider) => slider
      .setLimits(0, 1, 0.01)
      .setValue(this.plugin.settings.metronome.volume)
      .setDynamicTooltip()
      .onChange((value) => {
        void this.plugin.updateSettings({
          ...this.plugin.settings,
          metronome: { ...this.plugin.settings.metronome, volume: value },
        });
      }));
  }

  private configureClickSound(setting: Setting): void {
    setting.addDropdown((dropdown) => {
      for (const preset of TONE_PRESETS) {
        dropdown.addOption(preset.id, preset.name);
      }
      dropdown
        .setValue(this.plugin.settings.metronome.tone)
        .onChange((value) => {
          if (isToneId(value)) {
            void this.plugin.updateSettings({
              ...this.plugin.settings,
              metronome: { ...this.plugin.settings.metronome, tone: value },
            });
          }
        });
    });
  }

  private configureAboutLink(setting: Setting, link: AboutLink): void {
    setting.setName(link.name).setDesc(link.description);
    const anchor = setting.controlEl.createEl("a", {
      text: link.label,
      href: link.href,
    });

    if (link.external) {
      anchor.setAttrs({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    }
  }
}

function isMeterDenominator(value: unknown): value is MeterDenominator {
  return value === 2 || value === 4 || value === 8 || value === 16;
}

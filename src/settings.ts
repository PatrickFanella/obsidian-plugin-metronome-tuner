import { App, PluginSettingTab, Setting } from "obsidian";
import type { SettingDefinition, SettingDefinitionItem } from "obsidian";
import type MetronomeTunerPlugin from "./main";
import { LANGUAGE_LOCALE_ORDER, LANGUAGE_NAMES, toneName, type MessageKey } from "./i18n";
import type { MeterDenominator } from "./metronome/types";
import { TONE_PRESETS } from "./metronome/TonePresets";
export { DEFAULT_SETTINGS, isLanguagePreference, isToneId, parseSettings } from "./settingsParsing";
export type { MetronomeSettings, PluginSettings } from "./settingsParsing";
import { isLanguagePreference, isToneId } from "./settingsParsing";

const DENOMINATORS: readonly MeterDenominator[] = [2, 4, 8, 16];

interface AboutLink {
  name: MessageKey | "Subcult" | "GitHub";
  descriptionKey: MessageKey;
  labelKey: MessageKey;
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
    name: "portfolio",
    descriptionKey: "portfolioDesc",
    labelKey: "visitPortfolio",
    href: "https://patrickfanella.co",
    external: true,
  },
  {
    name: "Subcult",
    descriptionKey: "subcultDesc",
    labelKey: "visitSubcult",
    href: "https://subcult.tv",
    external: true,
  },
  {
    name: "GitHub",
    descriptionKey: "githubDesc",
    labelKey: "viewGithub",
    href: "https://github.com/patrickfanella",
    external: true,
  },
  {
    name: "email",
    descriptionKey: "emailDesc",
    labelKey: "sendEmail",
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
        heading: this.plugin.i18n.t("general"),
        items: [this.getLanguageDefinition()],
      },
      {
        type: "group",
        heading: this.plugin.i18n.t("defaults"),
        items: this.getDefaultDefinitions(),
      },
      {
        type: "group",
        heading: this.plugin.i18n.t("aboutSupport"),
        items: ABOUT_LINKS.map((link) => ({
          name: this.aboutLinkName(link),
          desc: this.plugin.i18n.t(link.descriptionKey),
          render: (setting: Setting) => this.configureAboutLink(setting, link),
        })),
      },
    ];
  }

  display(): void {
    this.containerEl.empty();

    new Setting(this.containerEl).setName(this.plugin.i18n.t("general")).setHeading();
    this.configureLanguage(new Setting(this.containerEl)
      .setName(this.plugin.i18n.t("language"))
      .setDesc(this.plugin.i18n.t("languageDesc")));

    new Setting(this.containerEl).setName(this.plugin.i18n.t("defaults")).setHeading();
    this.addDefaultSettings();

    new Setting(this.containerEl).setName(this.plugin.i18n.t("aboutSupport")).setHeading();
    for (const link of ABOUT_LINKS) {
      this.configureAboutLink(new Setting(this.containerEl), link);
    }
  }

  private getLanguageDefinition(): SettingDefinition {
    const name = this.plugin.i18n.t("language");
    const description = this.plugin.i18n.t("languageDesc");
    return {
      name,
      desc: description,
      render: (setting: Setting) => {
        setting.setName(name).setDesc(description);
        this.configureLanguage(setting);
      },
    };
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

  private configureLanguage(setting: Setting): void {
    setting.addDropdown((dropdown) => {
      dropdown.addOption("auto", this.plugin.i18n.t("automaticObsidian"));
      for (const locale of LANGUAGE_LOCALE_ORDER) {
        dropdown.addOption(locale, LANGUAGE_NAMES[locale]);
      }
      dropdown
        .setValue(this.plugin.settings.language)
        .onChange((value) => {
          if (isLanguagePreference(value)) {
            void this.plugin.updateSettings({ ...this.plugin.settings, language: value });
          }
        });
    });
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
        name: this.plugin.i18n.t("defaultTempo"),
        description: this.plugin.i18n.t("defaultTempoDesc"),
        configure: (setting) => this.configureDefaultTempo(setting),
      },
      {
        name: this.plugin.i18n.t("a4Reference"),
        description: this.plugin.i18n.t("a4ReferenceDesc"),
        configure: (setting) => this.configureA4Reference(setting),
      },
      {
        name: this.plugin.i18n.t("meterNumerator"),
        description: this.plugin.i18n.t("meterNumeratorDesc"),
        configure: (setting) => this.configureMeterNumerator(setting),
      },
      {
        name: this.plugin.i18n.t("meterDenominator"),
        description: this.plugin.i18n.t("meterDenominatorDesc"),
        configure: (setting) => this.configureMeterDenominator(setting),
      },
      {
        name: this.plugin.i18n.t("accentFirstBeat"),
        description: this.plugin.i18n.t("accentFirstBeatDesc"),
        configure: (setting) => this.configureAccent(setting),
      },
      {
        name: this.plugin.i18n.t("clickVolume"),
        description: this.plugin.i18n.t("clickVolumeDesc"),
        configure: (setting) => this.configureClickVolume(setting),
      },
      {
        name: this.plugin.i18n.t("clickSound"),
        description: this.plugin.i18n.t("clickSoundDesc"),
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
        dropdown.addOption(preset.id, toneName(this.plugin.i18n, preset.id));
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
    setting.setName(this.aboutLinkName(link)).setDesc(this.plugin.i18n.t(link.descriptionKey));
    const anchor = setting.controlEl.createEl("a", {
      text: this.plugin.i18n.t(link.labelKey),
      href: link.href,
    });

    if (link.external) {
      anchor.setAttrs({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    }
  }

  private aboutLinkName(link: AboutLink): string {
    return link.name === "Subcult" || link.name === "GitHub" ? link.name : this.plugin.i18n.t(link.name);
  }
}

function isMeterDenominator(value: unknown): value is MeterDenominator {
  return value === 2 || value === 4 || value === 8 || value === 16;
}

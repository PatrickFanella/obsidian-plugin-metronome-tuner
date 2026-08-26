import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import type MetronomeTunerPlugin from "./main";
import { TONE_PRESETS } from "./metronome/TonePresets";
import type { MetronomeState, MeterDenominator } from "./metronome/types";
import { isToneId } from "./settings";
import { TunerOwner } from "./tuner/TunerController";

export const VIEW_TYPE_METRONOME_TUNER = "metronome-tuner-view";

type TabName = "metronome" | "tuner";

let viewId = 0;

export class MetronomeTunerView extends ItemView {
  private activeTab: TabName = "metronome";
  private abortController: AbortController | null = null;
  private unsubscribeMetronome: (() => void) | null = null;
  private tunerTimer: number | null = null;
  private lastTunerStatus = "";
  private lastTunerAnnouncement = "";
  private lastTunerAnnouncedAt = 0;
  private readonly idPrefix = `tempo-tune-${++viewId}`;
  private readonly tunerOwner = TunerOwner.create();
  private beatMarkers: HTMLElement[] = [];
  private startButton: HTMLButtonElement | null = null;

  constructor(leaf: WorkspaceLeaf, private readonly plugin: MetronomeTunerPlugin) {
    super(leaf);
  }

  getViewType(): string { return VIEW_TYPE_METRONOME_TUNER; }
  getDisplayText(): string { return "Tempo & Tune"; }
  getIcon(): string { return "audio-waveform"; }

  async onOpen(): Promise<void> {
    this.abortController = new AbortController();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.plugin.tuner.stop(this.tunerOwner);
        this.updateTunerReading(true);
      }
    }, { signal: this.abortController.signal });
    this.render();
    this.unsubscribeMetronome = this.plugin.metronome.subscribe((state) => this.updateMetronomeState(state));
    this.tunerTimer = window.setInterval(() => this.updateTunerReading(), 100);
  }

  async onClose(): Promise<void> {
    this.abortController?.abort();
    this.abortController = null;
    this.unsubscribeMetronome?.();
    this.unsubscribeMetronome = null;
    if (this.tunerTimer !== null) window.clearInterval(this.tunerTimer);
    this.tunerTimer = null;
    this.plugin.tuner.stop(this.tunerOwner);
    this.beatMarkers = [];
    this.startButton = null;
    this.contentEl.empty();
  }

  private render(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass("metronome-tuner-view");
    root.createEl("header", { cls: "tempo-tune-header" }).createEl("h1", { text: "Tempo & Tune" });

    const tabList = root.createDiv({ cls: "tempo-tune-tabs", attr: { role: "tablist", "aria-label": "Tempo and tuning tools" } });
    const panels = root.createDiv({ cls: "tempo-tune-panels" });
    const tabs: HTMLButtonElement[] = [];

    for (const tabName of ["metronome", "tuner"] as const) {
      const tabId = `${this.idPrefix}-${tabName}-tab`;
      const panelId = `${this.idPrefix}-${tabName}-panel`;
      const tab = tabList.createEl("button", {
        cls: "tempo-tune-tab",
        text: tabName === "metronome" ? "Metronome" : "Tuner",
        attr: { id: tabId, role: "tab", "aria-controls": panelId, type: "button" }
      });
      const panel = panels.createEl("section", {
        cls: "tempo-tune-panel",
        attr: { id: panelId, role: "tabpanel", "aria-labelledby": tabId, tabindex: "0" }
      });
      tabs.push(tab);
      this.listen(tab, "click", () => this.selectTab(tabName, tabs, panels));
      if (tabName === "metronome") this.renderMetronome(panel);
      else this.renderTuner(panel);
    }

    this.listen(tabList, "keydown", (event) => this.handleTabKeydown(event, tabs, panels));
    this.listen(root, "keydown", (event) => this.handleViewKeydown(event));
    this.selectTab(this.activeTab, tabs, panels, false);
    this.updateTunerReading(true);
  }

  private renderMetronome(panel: HTMLElement): void {
    panel.addClass("metronome-panel");
    panel.createEl("p", { cls: "tempo-tune-kicker", text: "Keep time" });

    const hero = panel.createDiv({ cls: "metronome-hero" });
    const readout = hero.createDiv({ cls: "bpm-readout", attr: { "aria-label": `${this.plugin.settings.metronome.bpm} beats per minute` } });
    readout.createSpan({ cls: "bpm-value", text: String(this.plugin.settings.metronome.bpm), attr: { "data-bpm-readout": "" } });
    readout.createSpan({ cls: "bpm-unit", text: "BPM" });
    const beatGroup = hero.createDiv({ cls: "beat-group", attr: { "aria-label": "Beats in measure" } });
    this.renderBeatMarkers(beatGroup);

    this.startButton = panel.createEl("button", {
      cls: "metronome-start mod-cta",
      text: this.plugin.metronome.running ? "Stop metronome" : "Start metronome",
      attr: { type: "button", "aria-pressed": String(this.plugin.metronome.running) }
    });
    this.listen(this.startButton, "click", () => void this.toggleMetronome());

    const tempoGroup = panel.createEl("div", { cls: "tempo-control-group", attr: { role: "group", "aria-labelledby": `${this.idPrefix}-tempo-label` } });
    tempoGroup.createEl("span", { cls: "control-label", text: "Tempo", attr: { id: `${this.idPrefix}-tempo-label` } });
    const stepper = tempoGroup.createDiv({ cls: "tempo-stepper" });
    const minus = stepper.createEl("button", { text: "−", attr: { type: "button", "aria-label": "Decrease tempo" } });
    const bpm = stepper.createEl("input", { type: "number", attr: { "aria-label": "Tempo in beats per minute", inputmode: "numeric" } });
    bpm.min = "30";
    bpm.max = "300";
    bpm.step = "1";
    bpm.value = String(this.plugin.settings.metronome.bpm);
    const plus = stepper.createEl("button", { text: "+", attr: { type: "button", "aria-label": "Increase tempo" } });
    const range = tempoGroup.createEl("input", { type: "range", cls: "tempo-range", attr: { "aria-label": "Tempo slider" } });
    range.min = "30";
    range.max = "300";
    range.step = "1";
    range.value = bpm.value;

    const setTempo = (value: number) => {
      const next = this.boundedInteger(value, 30, 300, this.plugin.settings.metronome.bpm);
      bpm.value = String(next);
      range.value = String(next);
      this.setBpmReadout(next);
      void this.plugin.setBpm(next);
    };
    this.listen(minus, "click", () => setTempo(Number(bpm.value) - 1));
    this.listen(plus, "click", () => setTempo(Number(bpm.value) + 1));
    this.listen(bpm, "change", () => setTempo(Number(bpm.value)));
    this.listen(range, "input", () => {
      bpm.value = range.value;
      this.setBpmReadout(Number(range.value));
    });
    this.listen(range, "change", () => setTempo(Number(range.value)));

    const tap = panel.createEl("button", { cls: "tap-tempo", text: "Tap tempo", attr: { type: "button" } });
    this.listen(tap, "click", () => {
      const tapped = this.plugin.metronome.tap();
      if (tapped !== null) setTempo(tapped);
    });

    const details = panel.createEl("details", { cls: "metronome-details" });
    details.open = true;
    details.createEl("summary", { text: "Meter & sound" });
    const secondary = details.createDiv({ cls: "metronome-secondary" });
    const meterFieldset = secondary.createEl("fieldset", { cls: "meter-settings" });
    meterFieldset.createEl("legend", { text: "Time signature" });
    const meterRow = meterFieldset.createDiv({ cls: "meter-row" });
    const numerator = this.createLabeledInput(meterRow, "Numerator", "number");
    numerator.min = "1";
    numerator.max = "16";
    numerator.step = "1";
    numerator.value = String(this.plugin.settings.metronome.meterNumerator);
    const denominatorWrap = meterRow.createEl("label", { cls: "field" });
    denominatorWrap.createSpan({ text: "Denominator" });
    const denominator = denominatorWrap.createEl("select");
    for (const value of [2, 4, 8, 16]) denominator.createEl("option", { text: String(value), value: String(value) });
    denominator.value = String(this.plugin.settings.metronome.meterDenominator);
    this.listen(numerator, "change", () => {
      const value = this.boundedInteger(Number(numerator.value), 1, 16, this.plugin.settings.metronome.meterNumerator);
      numerator.value = String(value);
      void this.updateMetronomeSettings({ meterNumerator: value });
      this.renderBeatMarkers(beatGroup);
    });
    this.listen(denominator, "change", () => void this.updateMetronomeSettings({ meterDenominator: Number(denominator.value) as MeterDenominator }));

    const accentLabel = meterFieldset.createEl("label", { cls: "toggle-field" });
    const accent = accentLabel.createEl("input", { type: "checkbox" });
    accent.checked = this.plugin.settings.metronome.accent;
    accentLabel.createSpan({ text: "Accent first beat" });
    this.listen(accent, "change", () => {
      void this.updateMetronomeSettings({ accent: accent.checked });
      this.renderBeatMarkers(beatGroup);
    });

    const soundFieldset = secondary.createEl("fieldset", { cls: "sound-settings" });
    soundFieldset.createEl("legend", { text: "Click sound" });
    const toneLabel = soundFieldset.createEl("label", { cls: "field" });
    toneLabel.createSpan({ text: "Sound" });
    const tone = toneLabel.createEl("select");
    for (const preset of TONE_PRESETS) tone.createEl("option", { text: preset.name, value: preset.id });
    tone.value = this.plugin.settings.metronome.tone;
    this.listen(tone, "change", () => { if (isToneId(tone.value)) void this.plugin.setTone(tone.value); });
    const volumeLabel = soundFieldset.createEl("label", { cls: "field" });
    volumeLabel.createSpan({ text: "Volume" });
    const volume = volumeLabel.createEl("input", { type: "range" });
    volume.min = "0";
    volume.max = "1";
    volume.step = "0.01";
    volume.value = String(this.plugin.settings.metronome.volume);
    this.listen(volume, "change", () => void this.updateMetronomeSettings({ volume: Number(volume.value) }));
    const preview = soundFieldset.createEl("button", { text: "Preview sound", attr: { type: "button" } });
    this.listen(preview, "click", () => void this.plugin.metronome.preview().catch((error: unknown) => this.showAudioError(error, "Could not preview the click sound.")));
  }

  private renderTuner(panel: HTMLElement): void {
    panel.addClass("tuner-panel");
    panel.createEl("p", { cls: "tempo-tune-kicker", text: "Find the pitch" });
    panel.createEl("p", { cls: "tuner-intro", text: "Play one clear note near your microphone." });

    const micCard = panel.createDiv({ cls: "microphone-card" });
    const micCopy = micCard.createDiv();
    micCopy.createEl("span", { cls: "microphone-label", text: "Microphone" });
    micCopy.createEl("p", { cls: "microphone-status", attr: { "data-tuner-status": "", role: "status", "aria-live": "polite", "aria-atomic": "true" } });
    const tunerButton = micCard.createEl("button", { cls: "microphone-action mod-cta", attr: { type: "button", "data-tuner-action": "" } });
    this.listen(tunerButton, "click", () => this.toggleTuner());

    const display = panel.createDiv({ cls: "tuner-display", attr: { "data-tuner-display": "" } });
    const pitch = display.createDiv({ cls: "pitch-readout" });
    pitch.createSpan({ cls: "pitch-note", text: "–", attr: { "data-note": "" } });
    pitch.createSpan({ cls: "pitch-octave", text: "", attr: { "data-octave": "" } });
    const measurements = display.createDiv({ cls: "pitch-measurements" });
    const frequency = measurements.createDiv();
    frequency.createSpan({ cls: "measurement-value", text: "—", attr: { "data-frequency": "" } });
    frequency.createSpan({ cls: "measurement-label", text: "Frequency" });
    const confidence = measurements.createDiv();
    confidence.createSpan({ cls: "measurement-value", text: "—", attr: { "data-confidence": "" } });
    confidence.createSpan({ cls: "measurement-label", text: "Confidence" });

    const gauge = panel.createDiv({ cls: "tuner-gauge" });
    const scale = gauge.createDiv({
      cls: "gauge-scale",
      attr: { role: "meter", "aria-label": "Pitch accuracy", "aria-valuemin": "-50", "aria-valuemax": "50", "aria-valuenow": "0", "aria-valuetext": "No pitch detected", "data-gauge": "" }
    });
    scale.createDiv({ cls: "gauge-center" });
    scale.createDiv({ cls: "gauge-needle", attr: { "data-gauge-needle": "" } });
    const ticks = gauge.createDiv({ cls: "gauge-ticks", attr: { "aria-hidden": "true" } });
    for (const label of ["−50", "−25", "0", "+25", "+50"]) ticks.createSpan({ text: label });
    gauge.createEl("p", { cls: "cents-description", text: "Waiting for a note", attr: { "data-cents-description": "" } });

    const reference = panel.createDiv({ cls: "tuner-reference" });
    const a4 = this.createLabeledInput(reference, "A4 reference (Hz)", "number");
    a4.min = "415";
    a4.max = "466";
    a4.step = "1";
    a4.value = String(this.plugin.settings.tunerA4);
    this.listen(a4, "change", () => {
      const value = this.boundedInteger(Number(a4.value), 415, 466, this.plugin.settings.tunerA4);
      a4.value = String(value);
      void this.plugin.updateSettings({ ...this.plugin.settings, tunerA4: value });
    });
    panel.createDiv({ cls: "sr-only", attr: { "aria-live": "polite", "aria-atomic": "true", "data-tuner-live": "" } });
  }

  private selectTab(name: TabName, tabs: HTMLButtonElement[], panels: HTMLElement, moveFocus = false): void {
    if (name !== "tuner") this.plugin.tuner.stop(this.tunerOwner);
    this.activeTab = name;
    tabs.forEach((tab, index) => {
      const selected = (index === 0 ? "metronome" : "tuner") === name;
      tab.setAttr("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels.children[index] as HTMLElement | undefined;
      if (panel) panel.hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }

  private handleTabKeydown(event: KeyboardEvent, tabs: HTMLButtonElement[], panels: HTMLElement): void {
    const current = tabs.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    this.selectTab(next === 0 ? "metronome" : "tuner", tabs, panels, true);
  }

  private handleViewKeydown(event: KeyboardEvent): void {
    if (event.code !== "Space" || this.activeTab !== "metronome" || this.isInteractive(event.target)) return;
    event.preventDefault();
    void this.toggleMetronome();
  }

  private isInteractive(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest("button, input, select, textarea, summary, a, [contenteditable='true'], [role='tab']"));
  }

  private async toggleMetronome(): Promise<void> {
    try {
      await this.plugin.metronome.toggle();
    } catch (error: unknown) {
      this.showAudioError(error, "Could not start the metronome.");
    }
  }

  private toggleTuner(): void {
    const active = this.plugin.tuner.status === "listening" || this.plugin.tuner.status === "starting";
    if (active && !this.plugin.tuner.isOwnedBy(this.tunerOwner)) return;
    if (active) {
      this.plugin.tuner.stop(this.tunerOwner);
      this.updateTunerReading(true);
      return;
    }
    const starting = this.plugin.tuner.start(this.tunerOwner);
    this.updateTunerReading(true);
    void starting.then(() => this.updateTunerReading(true));
  }

  private updateMetronomeState(state: MetronomeState): void {
    if (this.startButton) {
      this.startButton.setText(state.running ? "Stop metronome" : "Start metronome");
      this.startButton.setAttr("aria-pressed", String(state.running));
      this.startButton.toggleClass("is-running", state.running);
    }
    this.beatMarkers.forEach((marker, index) => marker.toggleClass("is-current", state.running && state.currentBeat === index));
  }

  private renderBeatMarkers(container: HTMLElement): void {
    container.empty();
    this.beatMarkers = [];
    const { meterNumerator, accent } = this.plugin.settings.metronome;
    container.setAttr("aria-label", `${meterNumerator} beats per measure${accent ? ", first beat accented" : ""}`);
    for (let index = 0; index < meterNumerator; index++) {
      const marker = container.createSpan({
        cls: `beat-marker${accent && index === 0 ? " is-accent" : ""}`,
        attr: { "aria-hidden": "true" }
      });
      this.beatMarkers.push(marker);
    }
    this.updateMetronomeState({ running: this.plugin.metronome.running, currentBeat: this.plugin.metronome.currentBeat });
  }

  private updateTunerReading(forceAnnouncement = false): void {
    const statusElement = this.contentEl.querySelector<HTMLElement>("[data-tuner-status]");
    const button = this.contentEl.querySelector<HTMLButtonElement>("[data-tuner-action]");
    if (!statusElement || !button) return;

    const status = this.plugin.tuner.status;
    const activeElsewhere = (status === "starting" || status === "listening") && !this.plugin.tuner.isOwnedBy(this.tunerOwner);
    const reading = this.plugin.tuner.reading;
    const error = this.plugin.tuner.error;
    const statusText = activeElsewhere ? "Microphone active in another Tempo & Tune view." : error ?? (status === "starting"
      ? "Requesting microphone permission…"
      : status === "listening"
        ? reading ? "Microphone active." : "Listening for a steady note…"
        : "Microphone off. Start listening to tune.");
    if (statusText !== this.lastTunerStatus) {
      statusElement.setText(statusText);
      this.lastTunerStatus = statusText;
    }
    button.disabled = activeElsewhere;
    button.setText(activeElsewhere ? "Microphone in use" : status === "starting" ? "Cancel microphone request" : status === "listening" ? "Stop listening" : status === "error" ? "Try microphone again" : "Use microphone");

    const note = this.contentEl.querySelector<HTMLElement>("[data-note]");
    const octave = this.contentEl.querySelector<HTMLElement>("[data-octave]");
    const frequency = this.contentEl.querySelector<HTMLElement>("[data-frequency]");
    const confidence = this.contentEl.querySelector<HTMLElement>("[data-confidence]");
    const gauge = this.contentEl.querySelector<HTMLElement>("[data-gauge]");
    const needle = this.contentEl.querySelector<HTMLElement>("[data-gauge-needle]");
    const description = this.contentEl.querySelector<HTMLElement>("[data-cents-description]");
    if (!note || !octave || !frequency || !confidence || !gauge || !needle || !description) return;

    if (!reading) {
      this.contentEl.querySelector<HTMLElement>("[data-tuner-live]")?.setText("");
      this.lastTunerAnnouncement = "";
      this.lastTunerAnnouncedAt = 0;
      note.setText("–");
      octave.setText("");
      frequency.setText("—");
      confidence.setText("—");
      needle.style.setProperty("--cents-position", "50%");
      needle.toggleClass("has-reading", false);
      gauge.setAttr("aria-valuenow", "0");
      gauge.setAttr("aria-valuetext", status === "listening" ? "No signal" : "Tuner inactive");
      description.setText(status === "listening" ? "No signal yet" : "Waiting for a note");
      return;
    }

    const cents = Math.max(-50, Math.min(50, reading.cents));
    const centsText = this.centsDescription(reading.cents);
    note.setText(reading.note);
    octave.setText(String(reading.octave));
    frequency.setText(`${reading.frequency.toFixed(1)} Hz`);
    confidence.setText(`${Math.round(reading.confidence * 100)}%`);
    needle.style.setProperty("--cents-position", `${cents + 50}%`);
    needle.toggleClass("has-reading", true);
    gauge.setAttr("aria-valuenow", String(cents));
    gauge.setAttr("aria-valuetext", centsText);
    description.setText(centsText);

    const announcement = `${reading.note}${reading.octave}, ${centsText}`;
    const now = performance.now();
    if ((forceAnnouncement || now - this.lastTunerAnnouncedAt >= 1500) && announcement !== this.lastTunerAnnouncement) {
      this.contentEl.querySelector<HTMLElement>("[data-tuner-live]")?.setText(announcement);
      this.lastTunerAnnouncement = announcement;
      this.lastTunerAnnouncedAt = now;
    }
  }

  private centsDescription(cents: number): string {
    if (Math.abs(cents) <= 2) return "In tune";
    const amount = Math.abs(Math.round(cents));
    return `${amount} ${amount === 1 ? "cent" : "cents"} ${cents < 0 ? "flat" : "sharp"}`;
  }

  private setBpmReadout(value: number): void {
    const readout = this.contentEl.querySelector<HTMLElement>("[data-bpm-readout]");
    if (readout) {
      readout.setText(String(value));
      readout.parentElement?.setAttr("aria-label", `${value} beats per minute`);
    }
  }

  private createLabeledInput(parent: HTMLElement, label: string, type: string): HTMLInputElement {
    const wrapper = parent.createEl("label", { cls: "field" });
    wrapper.createSpan({ text: label });
    return wrapper.createEl("input", { type });
  }

  private async updateMetronomeSettings(changes: Partial<typeof this.plugin.settings.metronome>): Promise<void> {
    await this.plugin.updateSettings({
      ...this.plugin.settings,
      metronome: { ...this.plugin.settings.metronome, ...changes }
    });
  }

  private boundedInteger(value: number, min: number, max: number, fallback: number): number {
    return Number.isFinite(value) ? Math.round(Math.min(max, Math.max(min, value))) : fallback;
  }

  private listen<K extends keyof HTMLElementEventMap>(element: HTMLElement, type: K, listener: (event: HTMLElementEventMap[K]) => void): void {
    element.addEventListener(type, listener, { signal: this.abortController?.signal });
  }

  private showAudioError(error: unknown, fallback: string): void {
    new Notice(error instanceof Error ? error.message : fallback);
  }
}

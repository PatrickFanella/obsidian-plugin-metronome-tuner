export class AudioRuntime {
  private context: AudioContext | null = null;

  async getContext(): Promise<AudioContext> {
    if (!this.context || this.context.state === "closed") {
      this.context = new AudioContext();
    }
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
    return this.context;
  }

  peekContext(): AudioContext | null {
    return this.context;
  }

  async dispose(): Promise<void> {
    const context = this.context;
    this.context = null;
    if (context && context.state !== "closed") {
      await context.close();
    }
  }
}

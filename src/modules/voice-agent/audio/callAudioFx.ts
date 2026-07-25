/**
 * Soft kalimba-like call cues (FM pluck) — warm, short, clear on phone speakers.
 * Connect: bright open pluck + tiny answering note.
 * Disconnect: muted lower pluck that settles.
 */
export class CallAudioFx {
  private ctx: AudioContext | null = null;
  private disposed = false;
  private connectedPlayed = false;

  private ensureCtx(): AudioContext | null {
    if (this.disposed) return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  /** Open — bright wooden pluck, then a soft reply. */
  playConnected(): void {
    if (this.connectedPlayed) return;
    this.connectedPlayed = true;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Main pluck (C5)
    this.pluck(ctx, { start: t, freq: 523.25, peak: 0.085, dur: 0.55, brightness: 1.15 });
    // Tiny octave sparkle
    this.pluck(ctx, { start: t + 0.01, freq: 1046.5, peak: 0.022, dur: 0.28, brightness: 1.4 });
    // Answering note (E5) — the “personality”
    this.pluck(ctx, { start: t + 0.14, freq: 659.25, peak: 0.055, dur: 0.5, brightness: 1.05 });
  }

  /** Close — lower, softer settle. */
  playDisconnected(): void {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    this.pluck(ctx, { start: t, freq: 392.0, peak: 0.06, dur: 0.45, brightness: 0.85 });
    this.pluck(ctx, { start: t + 0.1, freq: 293.66, peak: 0.04, dur: 0.55, brightness: 0.7 });
  }

  playDisconnectedIfConnected(): void {
    if (!this.connectedPlayed) return;
    this.playDisconnected();
  }

  /**
   * Simple FM kalimba: modulator decays fast → metallic attack,
   * then pure-ish sine tail (wood / thumb-piano).
   */
  private pluck(
    ctx: AudioContext,
    opts: { start: number; freq: number; peak: number; dur: number; brightness: number },
  ): void {
    const { start, freq, peak, dur, brightness } = opts;
    const end = start + dur;

    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(freq, start);

    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.setValueAtTime(freq * 2.01, start); // slightly inharmonic = wooden

    const modGain = ctx.createGain();
    // Index of modulation: high at strike, collapses quickly
    modGain.gain.setValueAtTime(freq * 2.2 * brightness, start);
    modGain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

    const out = ctx.createGain();
    // Percussive envelope
    out.gain.setValueAtTime(0.0001, start);
    out.gain.exponentialRampToValueAtTime(peak, start + 0.008);
    out.gain.exponentialRampToValueAtTime(peak * 0.35, start + 0.09);
    out.gain.exponentialRampToValueAtTime(0.0001, end);

    // Soft lowpass so it never sounds harsh on earpieces
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400 * brightness, start);
    lp.frequency.exponentialRampToValueAtTime(900, start + 0.2);
    lp.Q.value = 0.7;

    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(lp).connect(out).connect(ctx.destination);

    carrier.start(start);
    mod.start(start);
    carrier.stop(end + 0.02);
    mod.stop(end + 0.02);
  }

  dispose(): void {
    this.disposed = true;
    if (this.ctx) {
      void this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
  }
}

/* =========================================================
   audio.js — Web Audio API ile Masalsı Oyun Ses Efektleri
   ========================================================= */
(function (global) {
  'use strict';

  class SoundManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    ensureContext() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.playClick();
      }
      return this.enabled;
    }

    playClick() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.06);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }

    playHop(isBoarding) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      if (isBoarding) {
        osc.frequency.setValueAtTime(290, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.21);
      } else {
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.16);
      }
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    playRowSplash() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Yumuşak su hışırtısı (filtrelenmiş beyaz gürültü)
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.exponentialRampToValueAtTime(1150, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(480, now + 0.44);
      filter.Q.value = 1.6;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.46);
    }

    playWarn() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.setValueAtTime(195, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    playFail(type) {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Komik inişli çizgi film trombon / uyarı sesi
      const notes = type === 'wolf-sheep'
        ? [392, 370, 349, 261.6]
        : [440, 392, 330, 277.2];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.16;
        const dur = idx === notes.length - 1 ? 0.42 : 0.15;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        if (idx === notes.length - 1) {
          osc.frequency.exponentialRampToValueAtTime(freq * 0.82, start + dur);
        }
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    }

    playWin() {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Neşeli zafer fanfarı (C5 - E5 - G5 - C6 - G5 - C6)
      const melody = [
        { f: 523.25, t: 0.0, d: 0.14 },
        { f: 659.25, t: 0.12, d: 0.14 },
        { f: 783.99, t: 0.24, d: 0.14 },
        { f: 1046.5, t: 0.38, d: 0.24 },
        { f: 783.99, t: 0.62, d: 0.14 },
        { f: 1046.5, t: 0.76, d: 0.55 }
      ];

      melody.forEach((n) => {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        osc2.frequency.setValueAtTime(n.f * 2, now + n.t);
        gain.gain.setValueAtTime(0.14, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc2.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
        osc2.stop(now + n.t + n.d + 0.02);
      });
    }
  }

  global.SoundManager = SoundManager;
})(window);

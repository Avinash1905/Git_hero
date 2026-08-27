/**
 * AudioVisualizer
 * Canvas-based real-time audio oscilloscope and frequency spectrum visualizer
 * hooked into the procedural Web Audio API synthesizer.
 */

export class AudioVisualizer {
  constructor(canvasEl = null, audioCtx = null) {
    this.canvas = canvasEl;
    this.ctx = canvasEl ? canvasEl.getContext('2d') : null;
    this.audioCtx = audioCtx;
    this.analyser = null;
    this.dataArray = null;
    this.animId = null;
    this.isActive = false;
    this.init();
  }

  init() {
    if (this.audioCtx && typeof this.audioCtx.createAnalyser === 'function') {
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    }
  }

  start() {
    this.isActive = true;
    if (this.canvas && this.ctx && typeof requestAnimationFrame === 'function') {
      const render = () => {
        if (!this.isActive) return;
        this.drawBars();
        this.animId = requestAnimationFrame(render);
      };
      this.animId = requestAnimationFrame(render);
    }
  }

  stop() {
    this.isActive = false;
    if (this.animId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  drawBars() {
    if (!this.ctx || !this.canvas) return;

    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
    } else {
      // Procedural mock wave when audio context is detached
      if (!this.dataArray) this.dataArray = new Uint8Array(32);
      for (let i = 0; i < this.dataArray.length; i++) {
        this.dataArray[i] = Math.floor(Math.random() * 40);
      }
    }

    const width = this.canvas.width || 300;
    const height = this.canvas.height || 60;
    this.ctx.clearRect(0, 0, width, height);

    const barWidth = (width / this.dataArray.length) * 1.5;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = (this.dataArray[i] / 255) * height;
      this.ctx.fillStyle = '#00ffcc';
      this.ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  }

  static renderVisualizerHtml() {
    return `
      <div class="glass-panel p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-3 font-terminal-code text-xs">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px] text-primary">graphic_eq</span>
          <span class="font-bold text-on-surface text-[11px] uppercase">Acoustic Synthesizer Spectrum</span>
        </div>
        <canvas id="audio-visualizer-canvas" width="160" height="24" class="rounded bg-surface-container-lowest border border-outline-variant/20"></canvas>
      </div>
    `;
  }
}

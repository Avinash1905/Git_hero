/**
 * GitQuest Frontend - Audio Visualizer Bridge
 * Links audio synthesizer output to canvas spectrum visualizers and particle reactives.
 */

export class AudioVisualizerBridge {
  constructor(canvas = null) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.frequencyBands = new Array(16).fill(0);
    this.isActive = false;
  }

  triggerAudioImpulse(frequencyBandIndex = 0, magnitude = 1.0) {
    const idx = Math.max(0, Math.min(this.frequencyBands.length - 1, frequencyBandIndex));
    this.frequencyBands[idx] = Math.min(1.0, this.frequencyBands[idx] + magnitude);
  }

  decay(rate = 0.05) {
    for (let i = 0; i < this.frequencyBands.length; i++) {
      this.frequencyBands[i] = Math.max(0, this.frequencyBands[i] - rate);
    }
  }

  renderSpectrum() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const barWidth = width / this.frequencyBands.length;

    this.ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.frequencyBands.length; i++) {
      const val = this.frequencyBands[i];
      const barHeight = val * height;
      const x = i * barWidth;
      const y = height - barHeight;

      this.ctx.fillStyle = `hsl(${190 + i * 5}, 100%, ${50 + val * 20}%)`;
      this.ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
    }
  }
}

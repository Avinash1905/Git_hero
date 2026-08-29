/**
 * GitQuest Feature: 2D Canvas Particle Physics & Cyberpunk Visual FX Engine
 */

import { MathUtils } from '../../utils/MathUtils.js';

export class Particle {
  constructor(x, y, vx, vy, color, size, lifeMs) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = lifeMs;
    this.remainingLife = lifeMs;
    this.alpha = 1;
  }

  update(deltaMs) {
    this.remainingLife -= deltaMs;
    this.x += (this.vx * deltaMs) / 1000;
    this.y += (this.vy * deltaMs) / 1000;
    this.alpha = Math.max(0, this.remainingLife / this.maxLife);
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticlePhysicsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.lastTime = performance.now();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this._loop();
  }

  stop() {
    this.isRunning = false;
  }

  _loop() {
    if (!this.isRunning) return;
    const now = performance.now();
    const deltaMs = Math.min(50, now - this.lastTime);
    this.lastTime = now;

    this.update(deltaMs);
    this.render();

    requestAnimationFrame(() => this._loop());
  }

  spawnBurst(x, y, count = 20, color = '#4edea3', speed = 120) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = MathUtils.randomRange(speed * 0.5, speed * 1.5);
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd;
      const size = MathUtils.randomRange(2, 5);
      const life = MathUtils.randomRange(400, 800);
      this.particles.push(new Particle(x, y, vx, vy, color, size, life));
    }
  }

  spawnCommitShockwave(x, y) {
    this.spawnBurst(x, y, 40, '#4edea3', 200);
    this.spawnBurst(x, y, 20, '#ffffff', 140);
  }

  spawnLaserSparks(x, y) {
    this.spawnBurst(x, y, 8, '#adc6ff', 80);
  }

  update(deltaMs) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(deltaMs);
      if (p.remainingLife <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const p of this.particles) {
      p.draw(this.ctx);
    }
  }

  clear() {
    this.particles = [];
  }
}

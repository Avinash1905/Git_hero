/**
 * GitQuest Frontend - Particle Effect Engine
 * Visual particle fx system for git commit explosions, portal swirls,
 * XP bursts, laser impacts, and player trail mechanics.
 */

export class Particle {
  constructor(x, y, vx, vy, color = '#38bdf8', life = 30, size = 3, gravity = 0.05) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.maxLife = life;
    this.life = life;
    this.size = size;
    this.gravity = gravity;
    this.isDead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
    if (this.life <= 0) {
      this.isDead = true;
    }
  }

  get opacity() {
    return Math.max(0, this.life / this.maxLife);
  }
}

export class ParticleEffectEngine {
  constructor(canvas = null) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.maxParticles = 500;
  }

  emitCommitBurst(x, y, count = 25) {
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#fef08a'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const life = 20 + Math.floor(Math.random() * 30);
      const size = 2 + Math.random() * 3;

      this.addParticle(new Particle(x, y, vx, vy, color, life, size, 0.08));
    }
  }

  emitPortalSwirl(x, y, count = 15) {
    const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#e879f9'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.random() * 15;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      const vx = -Math.sin(angle) * 1.5;
      const vy = Math.cos(angle) * 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const life = 15 + Math.floor(Math.random() * 20);

      this.addParticle(new Particle(px, py, vx, vy, color, life, 2, 0.0));
    }
  }

  emitLaserImpact(x, y, directionAngle = 0, count = 10) {
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 1.2;
      const angle = directionAngle + Math.PI + spread;
      const speed = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const life = 10 + Math.floor(Math.random() * 15);

      this.addParticle(new Particle(x, y, vx, vy, '#ef4444', life, 2.5, 0.02));
    }
  }

  addParticle(particle) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(particle);
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.isDead) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }
}

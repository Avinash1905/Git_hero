/**
 * QuantumPortalAnimator
 * Teleportation particle engine rendering swirling energy loops on portal entry/exit coordinates.
 */

export class QuantumPortalAnimator {
  constructor() {
    this.particles = [];
    this.maxParticles = 20;
  }

  emitPortalParticles(portalPos, color = '#a855f7') {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: portalPos.x + (Math.random() - 0.5) * 0.4,
        y: portalPos.y + (Math.random() - 0.5) * 0.4,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        life: 1.0,
        color
      });
    }
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }
  }

  update(dt = 0.016) {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt * 1.5;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }
}

export const quantumPortalAnimator = new QuantumPortalAnimator();

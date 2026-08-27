/**
 * GitQuest Engine - Time Trial Decay & Gravity Inversion Engine
 * Unstable decaying commit nodes, speedrun countdown gates, and inverted gravity zones.
 */

export class TimeDecayCommitNode {
  constructor(id, x, y, timeLimitSeconds = 30) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.timeLimitSeconds = timeLimitSeconds;
    this.remainingSeconds = timeLimitSeconds;
    this.isDecayed = false;
    this.isHarvested = false;
  }

  tick(dt) {
    if (this.isDecayed || this.isHarvested) return;

    this.remainingSeconds = Math.max(0, this.remainingSeconds - dt);
    if (this.remainingSeconds === 0) {
      this.isDecayed = true;
    }
  }

  harvest() {
    if (!this.isDecayed) {
      this.isHarvested = true;
      return true;
    }
    return false;
  }
}

export class GravityInversionZone {
  constructor(bounds, invertedAxes = { invertX: false, invertY: true }) {
    this.bounds = bounds;
    this.invertX = invertedAxes.invertX;
    this.invertY = invertedAxes.invertY;
  }

  contains(x, y) {
    return (
      x >= this.bounds.minX &&
      x <= this.bounds.maxX &&
      y >= this.bounds.minY &&
      y <= this.bounds.maxY
    );
  }

  transformDirection(dx, dy) {
    return {
      dx: this.invertX ? -dx : dx,
      dy: this.invertY ? -dy : dy
    };
  }
}

export class GravityInversionEngine {
  constructor() {
    this.zones = [];
  }

  addZone(zone) {
    this.zones.push(zone);
  }

  getEffectiveMovement(playerX, playerY, dx, dy) {
    for (const z of this.zones) {
      if (z.contains(playerX, playerY)) {
        return z.transformDirection(dx, dy);
      }
    }
    return { dx, dy };
  }
}

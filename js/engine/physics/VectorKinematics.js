/**
 * GitQuest Engine - Vector Kinematics & Continuous Collision
 * Kinetic simulation for sliding ice tiles, friction, swept AABB collision, and momentum.
 */

import { Vector2D } from '../core/Types.js';
import { Direction, DirectionVectors } from '../core/Constants.js';

export class KinematicBody {
  constructor(options = {}) {
    this.position = options.position ? Vector2D.from(options.position) : new Vector2D(0, 0);
    this.velocity = options.velocity ? Vector2D.from(options.velocity) : new Vector2D(0, 0);
    this.friction = options.friction ?? 0.8;
    this.mass = options.mass ?? 1.0;
    this.isSliding = Boolean(options.isSliding);
  }

  applyImpulse(fx, fy) {
    this.velocity.x += fx / this.mass;
    this.velocity.y += fy / this.mass;
  }

  update() {
    this.position.x += Math.round(this.velocity.x);
    this.position.y += Math.round(this.velocity.y);
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0;
    if (Math.abs(this.velocity.y) < 0.05) this.velocity.y = 0;
  }
}

export class ContinuousCollision {
  /**
   * Swept box collision detection along a trajectory
   */
  static sweepBox(startPos, velocity, boxSize = { w: 1, h: 1 }, isBlockedFn) {
    const start = Vector2D.from(startPos);
    const vel = Vector2D.from(velocity);
    const steps = Math.max(Math.abs(vel.x), Math.abs(vel.y), 1);

    const stepX = vel.x / steps;
    const stepY = vel.y / steps;

    let current = start.clone();
    let collisionDetected = false;
    let collisionCoord = null;

    for (let i = 1; i <= steps; i++) {
      const nextX = Math.round(start.x + stepX * i);
      const nextY = Math.round(start.y + stepY * i);

      if (isBlockedFn(nextX, nextY)) {
        collisionDetected = true;
        collisionCoord = new Vector2D(nextX, nextY);
        break;
      }
      current = new Vector2D(nextX, nextY);
    }

    return {
      collided: collisionDetected,
      collisionCoord,
      finalPos: collisionDetected ? current : new Vector2D(start.x + vel.x, start.y + vel.y)
    };
  }
}

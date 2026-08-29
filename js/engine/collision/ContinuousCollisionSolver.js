/**
 * GitQuest Game Engine - Continuous Collision Solver
 * Swept AABB collision detection, time-of-impact (TOI) calculations,
 * kinematic response solver, and velocity dampening.
 */

import { Vector2D } from '../core/MathUtils.js';

export class AABBBox {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  overlaps(other) {
    return (
      this.minX < other.maxX &&
      this.maxX > other.minX &&
      this.minY < other.maxY &&
      this.maxY > other.minY
    );
  }

  expand(vector) {
    const minX = vector.x < 0 ? this.minX + vector.x : this.minX;
    const maxX = vector.x > 0 ? this.maxX + vector.x : this.maxX;
    const minY = vector.y < 0 ? this.minY + vector.y : this.minY;
    const maxY = vector.y > 0 ? this.maxY + vector.y : this.maxY;
    return new AABBBox(minX, minY, maxX, maxY);
  }
}

export class ContinuousCollisionSolver {
  constructor() {
    this.staticObstacles = [];
    this.restitution = 0.0; // Inelastic by default
  }

  addStaticObstacle(minX, minY, maxX, maxY, tag = 'WALL') {
    this.staticObstacles.push({
      box: new AABBBox(minX, minY, maxX, maxY),
      tag
    });
  }

  sweptAABB(movingBox, velocity, obstacleBox) {
    let invEntryX, invEntryY;
    let invExitX, invExitY;

    if (velocity.x > 0.0) {
      invEntryX = obstacleBox.minX - movingBox.maxX;
      invExitX = obstacleBox.maxX - movingBox.minX;
    } else {
      invEntryX = obstacleBox.maxX - movingBox.minX;
      invExitX = obstacleBox.minX - movingBox.maxX;
    }

    if (velocity.y > 0.0) {
      invEntryY = obstacleBox.minY - movingBox.maxY;
      invExitY = obstacleBox.maxY - movingBox.minY;
    } else {
      invEntryY = obstacleBox.maxY - movingBox.minY;
      invExitY = obstacleBox.minY - movingBox.maxY;
    }

    let entryX, entryY;
    let exitX, exitY;

    entryX = velocity.x === 0.0 ? -Infinity : invEntryX / velocity.x;
    exitX = velocity.x === 0.0 ? Infinity : invExitX / velocity.x;

    entryY = velocity.y === 0.0 ? -Infinity : invEntryY / velocity.y;
    exitY = velocity.y === 0.0 ? Infinity : invExitY / velocity.y;

    const entryTime = Math.max(entryX, entryY);
    const exitTime = Math.min(exitX, exitY);

    if (entryTime > exitTime || (entryX < 0.0 && entryY < 0.0) || entryX > 1.0 || entryY > 1.0) {
      return { hit: false, time: 1.0, normal: Vector2D.zero() };
    }

    let normalX = 0;
    let normalY = 0;
    if (entryX > entryY) {
      normalX = invEntryX < 0.0 ? 1.0 : -1.0;
    } else {
      normalY = invEntryY < 0.0 ? 1.0 : -1.0;
    }

    return {
      hit: true,
      time: Math.max(0.0, entryTime),
      normal: new Vector2D(normalX, normalY)
    };
  }

  resolveMovement(startPos, boxSize, velocity) {
    const movingBox = new AABBBox(startPos.x, startPos.y, startPos.x + boxSize, startPos.y + boxSize);
    let nearestHit = null;
    let minTime = 1.0;

    for (const obs of this.staticObstacles) {
      const result = this.sweptAABB(movingBox, velocity, obs.box);
      if (result.hit && result.time < minTime) {
        minTime = result.time;
        nearestHit = { ...result, obstacle: obs };
      }
    }

    if (!nearestHit) {
      // Unobstructed
      return {
        finalPos: startPos.add(velocity),
        collided: false,
        remainingVelocity: Vector2D.zero()
      };
    }

    // Move to time of impact (with small epsilon safety buffer)
    const epsilon = 0.001;
    const safeTime = Math.max(0, nearestHit.time - epsilon);
    const impactPos = startPos.add(velocity.multiply(safeTime));

    // Slide along normal
    const remainingTime = 1.0 - safeTime;
    const dot = velocity.x * nearestHit.normal.x + velocity.y * nearestHit.normal.y;
    const slideVelocity = velocity.subtract(nearestHit.normal.multiply(dot)).multiply(remainingTime);

    return {
      finalPos: impactPos,
      collided: true,
      impactNormal: nearestHit.normal,
      slideVelocity,
      obstacle: nearestHit.obstacle
    };
  }

  clear() {
    this.staticObstacles = [];
  }
}

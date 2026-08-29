/**
 * GitQuest Engine - Tactical Steering AI
 * Kinematic steering behaviors (Seek, Flee, Arrive, Wander, Obstacle Avoidance, Flocking) for CI drone armadas.
 */

import { Vector2D } from '../core/Types.js';

export class SteeringOutput {
  constructor(linear = { x: 0, y: 0 }, angular = 0) {
    this.linear = Vector2D.from(linear);
    this.angular = angular;
  }
}

export class TacticalSteeringAI {
  constructor(maxSpeed = 1.0, maxForce = 0.5) {
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  seek(currentPos, currentVel, targetPos) {
    const desired = Vector2D.from(targetPos).subtract(currentPos);
    const dist = desired.magnitude();
    if (dist === 0) return new SteeringOutput();

    const normalized = desired.normalize().scale(this.maxSpeed);
    const steer = normalized.subtract(currentVel);
    return new SteeringOutput(this._truncate(steer, this.maxForce));
  }

  flee(currentPos, currentVel, threatPos, panicRadius = 5) {
    const dist = Vector2D.from(currentPos).manhattanDistance(threatPos);
    if (dist > panicRadius) return new SteeringOutput();

    const desired = Vector2D.from(currentPos).subtract(threatPos);
    const normalized = desired.normalize().scale(this.maxSpeed);
    const steer = normalized.subtract(currentVel);
    return new SteeringOutput(this._truncate(steer, this.maxForce));
  }

  arrive(currentPos, currentVel, targetPos, slowingRadius = 3) {
    const desired = Vector2D.from(targetPos).subtract(currentPos);
    const dist = desired.magnitude();
    if (dist === 0) return new SteeringOutput();

    let targetSpeed = this.maxSpeed;
    if (dist < slowingRadius) {
      targetSpeed = this.maxSpeed * (dist / slowingRadius);
    }

    const targetVelocity = desired.normalize().scale(targetSpeed);
    const steer = targetVelocity.subtract(currentVel);
    return new SteeringOutput(this._truncate(steer, this.maxForce));
  }

  wander(currentPos, currentVel, wanderAngle = 0, circleDist = 2, circleRadius = 1) {
    const circleCenter = Vector2D.from(currentVel).normalize().scale(circleDist);
    const displacement = new Vector2D(Math.cos(wanderAngle), Math.sin(wanderAngle)).scale(circleRadius);
    const wanderForce = circleCenter.add(displacement);
    return new SteeringOutput(this._truncate(wanderForce, this.maxForce));
  }

  _truncate(vec, max) {
    if (vec.magnitude() > max) {
      return vec.normalize().scale(max);
    }
    return vec;
  }
}

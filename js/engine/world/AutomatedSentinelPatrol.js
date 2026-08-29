/**
 * GitQuest Game Engine - Automated Sentinel Patrol System
 * Autonomous enemy patrol routines, waypoint loops, field-of-view (FOV) raycasting,
 * alert status state machines (Idle, Suspicious, Alert, Alarm), and perimeter alarms.
 */

import { Vector2D } from '../core/MathUtils.js';
import { GameEvent } from '../core/Constants.js';

export const SentinelState = {
  PATROLLING: 'PATROLLING',
  INVESTIGATING: 'INVESTIGATING',
  ALERT: 'ALERT',
  STUNNED: 'STUNNED'
};

export class SentinelDrone {
  constructor(id, waypoints = [], viewRange = 4, fovAngle = 90) {
    this.id = id;
    this.waypoints = waypoints.map(w => new Vector2D(w.x, w.y));
    this.currentWaypointIndex = 0;
    this.position = this.waypoints.length > 0 ? this.waypoints[0].clone() : Vector2D.zero();
    this.facingDirection = new Vector2D(1, 0);
    this.viewRange = viewRange;
    this.fovAngle = fovAngle;
    this.state = SentinelState.PATROLLING;
    this.alertTimer = 0;
    this.isDeactivated = false;
  }

  tickPatrol() {
    if (this.isDeactivated || this.state === SentinelState.STUNNED) {
      if (this.alertTimer > 0) this.alertTimer--;
      if (this.alertTimer === 0) this.state = SentinelState.PATROLLING;
      return this.position;
    }

    if (this.waypoints.length <= 1) return this.position;

    const targetWaypoint = this.waypoints[this.currentWaypointIndex];
    const diff = targetWaypoint.subtract(this.position);

    if (diff.manhattanDistance() === 0) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
    } else {
      const step = new Vector2D(Math.sign(diff.x), diff.x !== 0 ? 0 : Math.sign(diff.y));
      this.position = this.position.add(step);
      this.facingDirection = step.clone();
    }

    return this.position;
  }

  canSeeTarget(targetPos, wallSet) {
    if (this.isDeactivated || this.state === SentinelState.STUNNED) return false;

    const diff = targetPos.subtract(this.position);
    const dist = diff.manhattanDistance();

    if (dist > this.viewRange) return false;

    // Check alignment with facing direction
    if (this.facingDirection.x !== 0 && Math.sign(diff.x) !== this.facingDirection.x && diff.x !== 0) {
      return false;
    }
    if (this.facingDirection.y !== 0 && Math.sign(diff.y) !== this.facingDirection.y && diff.y !== 0) {
      return false;
    }

    // Raycast line of sight
    const steps = Math.max(Math.abs(diff.x), Math.abs(diff.y));
    for (let i = 1; i < steps; i++) {
      const checkX = Math.round(this.position.x + (diff.x * i) / steps);
      const checkY = Math.round(this.position.y + (diff.y * i) / steps);
      if (wallSet.has(`${checkX},${checkY}`)) {
        return false; // Obstructed by wall
      }
    }

    return true;
  }

  stun(durationSteps = 3) {
    this.state = SentinelState.STUNNED;
    this.alertTimer = durationSteps;
  }
}

export class AutomatedSentinelPatrol {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.sentinels = new Map();
    this.isAlarmTriggered = false;
  }

  registerSentinel(sentinel) {
    this.sentinels.set(sentinel.id, sentinel);
  }

  advanceStep(playerPos, wallSet) {
    const alerts = [];

    for (const sentinel of this.sentinels.values()) {
      sentinel.tickPatrol();
      const detected = sentinel.canSeeTarget(playerPos, wallSet);

      if (detected) {
        sentinel.state = SentinelState.ALERT;
        this.isAlarmTriggered = true;
        alerts.push({ sentinelId: sentinel.id, playerPos });

        if (this.eventBus) {
          this.eventBus.emit(GameEvent.HAZARD_TRIGGERED, {
            type: 'SENTINEL_ALERT',
            sentinelId: sentinel.id
          });
        }
      }
    }

    return {
      isAlarmTriggered: this.isAlarmTriggered,
      alerts
    };
  }

  resetAlarm() {
    this.isAlarmTriggered = false;
    for (const sentinel of this.sentinels.values()) {
      sentinel.state = SentinelState.PATROLLING;
    }
  }
}

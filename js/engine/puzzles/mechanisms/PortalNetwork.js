/**
 * GitQuest Engine - Portal Network & Autonomous CI Bot Patrol Engine
 * Teleportation channels and autonomous waypoint patrol AI with line-of-sight alerts.
 */

import { Vector2D } from '../../core/Types.js';
import { Direction, DirectionVectors } from '../../core/Constants.js';

export class PortalChannel {
  constructor(channelId, fromCoord, toCoord, options = {}) {
    this.channelId = channelId;
    this.from = Vector2D.from(fromCoord);
    this.to = Vector2D.from(toCoord);
    this.isTwoWay = options.isTwoWay !== false;
    this.requiredKeyId = options.requiredKeyId || null;
    this.isLocked = Boolean(options.isLocked);
    this.channelColor = options.channelColor || 'purple';
  }
}

export class PortalNetwork {
  constructor() {
    this.channels = new Map(); // channelId -> PortalChannel
    this.coordinateLookup = new Map(); // "x,y" -> PortalChannel
  }

  registerChannel(channel) {
    this.channels.set(channel.channelId, channel);
    this.coordinateLookup.set(`${channel.from.x},${channel.from.y}`, channel);
    if (channel.isTwoWay) {
      this.coordinateLookup.set(`${channel.to.x},${channel.to.y}`, channel);
    }
  }

  getPortalAt(x, y) {
    return this.coordinateLookup.get(`${x},${y}`) || null;
  }

  teleport(entity, currentCoord) {
    const portal = this.getPortalAt(currentCoord.x, currentCoord.y);
    if (!portal || portal.isLocked) return null;

    let targetCoord = portal.to;
    if (portal.isTwoWay && currentCoord.x === portal.to.x && currentCoord.y === portal.to.y) {
      targetCoord = portal.from;
    }

    return targetCoord.clone();
  }
}

export class PatrolWaypoint {
  constructor(x, y, waitSeconds = 0) {
    this.coord = new Vector2D(x, y);
    this.waitSeconds = waitSeconds;
  }
}

export class MovingPatrolEngine {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.patrols = new Map(); // entityId -> { waypoints, currentIndex, timer, state }
  }

  registerPatrol(entityId, waypoints, speedSeconds = 1.0) {
    this.patrols.set(entityId, {
      waypoints: waypoints.map(w => (w instanceof PatrolWaypoint ? w : new PatrolWaypoint(w.x, w.y, w.waitSeconds))),
      currentIndex: 0,
      timer: 0,
      speedSeconds,
      isAlerted: false
    });
  }

  step(dt, playerCoord = null) {
    for (const [entId, patrol] of this.patrols.entries()) {
      const entity = this.entityManager.get(entId);
      if (!entity || !entity.active) continue;

      patrol.timer += dt;
      if (patrol.timer >= patrol.speedSeconds) {
        patrol.timer -= patrol.speedSeconds;
        patrol.currentIndex = (patrol.currentIndex + 1) % patrol.waypoints.length;

        const nextPoint = patrol.waypoints[patrol.currentIndex];
        if (this.world.isWalkable(nextPoint.coord.x, nextPoint.coord.y, entity)) {
          this.entityManager.updatePosition(entity, nextPoint.coord.x, nextPoint.coord.y);
        }
      }

      // Line of sight alert check
      if (playerCoord) {
        const dist = Vector2D.from(entity.position).manhattanDistance(playerCoord);
        patrol.isAlerted = dist <= 2;
      }
    }
  }
}

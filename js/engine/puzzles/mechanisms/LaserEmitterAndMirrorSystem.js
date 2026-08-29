/**
 * GitQuest Engine - Laser Emitter, Mirrors & Conveyor Systems
 * Optical puzzles (reflection, refraction, beam splitting) and automated momentum conveyors.
 */

import { Direction, DirectionVectors } from '../../core/Constants.js';
import { Vector2D } from '../../core/Types.js';

export class LaserBeamSegment {
  constructor(start, end, direction, color = 'emerald') {
    this.start = Vector2D.from(start);
    this.end = Vector2D.from(end);
    this.direction = direction;
    this.color = color;
  }
}

export class LaserEmitterSystem {
  constructor(world, maxRange = 30) {
    this.world = world;
    this.maxRange = maxRange;
    this.activeBeams = []; // Array<LaserBeamSegment>
    this.receptors = new Map(); // "x,y" -> { powered: boolean, targetDoorId: string }
  }

  registerReceptor(x, y, targetDoorId) {
    this.receptors.set(`${x},${y}`, { powered: false, targetDoorId });
  }

  traceBeam(startCoord, initialDirection, color = 'emerald', mirrors = new Map()) {
    let current = Vector2D.from(startCoord);
    let dir = initialDirection;
    let range = 0;
    const segments = [];

    while (range < this.maxRange) {
      range++;
      const dirVec = DirectionVectors[dir] || DirectionVectors[Direction.UP];
      const nextCoord = current.add(dirVec);

      // Check wall or barrier
      if (this.world.isWall(nextCoord.x, nextCoord.y)) {
        segments.push(new LaserBeamSegment(current, nextCoord, dir, color));
        break;
      }

      // Check mirror at nextCoord
      const mirrorKey = `${nextCoord.x},${nextCoord.y}`;
      if (mirrors.has(mirrorKey)) {
        const mirrorAngle = mirrors.get(mirrorKey); // '/' or '\'
        segments.push(new LaserBeamSegment(current, nextCoord, dir, color));
        current = nextCoord;

        // Calculate reflection
        if (mirrorAngle === '/') {
          if (dir === Direction.UP) dir = Direction.RIGHT;
          else if (dir === Direction.RIGHT) dir = Direction.UP;
          else if (dir === Direction.DOWN) dir = Direction.LEFT;
          else if (dir === Direction.LEFT) dir = Direction.DOWN;
        } else if (mirrorAngle === '\\') {
          if (dir === Direction.UP) dir = Direction.LEFT;
          else if (dir === Direction.LEFT) dir = Direction.UP;
          else if (dir === Direction.DOWN) dir = Direction.RIGHT;
          else if (dir === Direction.RIGHT) dir = Direction.DOWN;
        }
        continue;
      }

      // Check receptor
      if (this.receptors.has(mirrorKey)) {
        this.receptors.get(mirrorKey).powered = true;
        segments.push(new LaserBeamSegment(current, nextCoord, dir, color));
        break;
      }

      current = nextCoord;
    }

    this.activeBeams.push(...segments);
    return segments;
  }

  clear() {
    this.activeBeams = [];
    for (const r of this.receptors.values()) {
      r.powered = false;
    }
  }
}

export class ConveyorBeltSystem {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.conveyors = new Map(); // "x,y" -> Direction (e.g. Direction.RIGHT)
  }

  registerBelt(x, y, direction) {
    this.conveyors.set(`${x},${y}`, direction);
  }

  step() {
    const movedEntities = new Set();

    for (const [key, dir] of this.conveyors.entries()) {
      const [x, y] = key.split(',').map(Number);
      const entitiesOnTile = this.entityManager.getAt(x, y);

      for (const ent of entitiesOnTile) {
        if (movedEntities.has(ent)) continue;

        const dirVec = DirectionVectors[dir];
        const nextX = x + dirVec.x;
        const nextY = y + dirVec.y;

        if (this.world.isWalkable(nextX, nextY, ent)) {
          this.entityManager.updatePosition(ent, nextX, nextY);
          movedEntities.add(ent);
        }
      }
    }

    return movedEntities.size;
  }
}

/**
 * GitQuest Engine - Fluid Simulation (Merge Stream Currents)
 * Simulates data stream currents and conveyor force vectors in hydrodynamic puzzle corridors.
 */

import { Direction, DirectionVectors } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class StreamCurrentCell {
  constructor(x, y, flowDirection, speed = 1) {
    this.coord = new Vector2D(x, y);
    this.flowDirection = flowDirection;
    this.speed = speed;
  }
}

export class MergeStreamEngine {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.streamGrid = new Map(); // "x,y" -> StreamCurrentCell
  }

  addCurrent(x, y, direction, speed = 1) {
    const cell = new StreamCurrentCell(x, y, direction, speed);
    this.streamGrid.set(`${x},${y}`, cell);
    return cell;
  }

  tick() {
    const moved = [];

    for (const [key, cell] of this.streamGrid.entries()) {
      const [x, y] = key.split(',').map(Number);
      const entities = this.entityManager.getAt(x, y);

      for (const ent of entities) {
        if (moved.includes(ent)) continue;

        const dirVec = DirectionVectors[cell.flowDirection];
        const nextX = x + dirVec.x * cell.speed;
        const nextY = y + dirVec.y * cell.speed;

        if (this.world.isWalkable(nextX, nextY, ent)) {
          this.entityManager.updatePosition(ent, nextX, nextY);
          moved.push(ent);
        }
      }
    }

    return moved;
  }

  clear() {
    this.streamGrid.clear();
  }
}

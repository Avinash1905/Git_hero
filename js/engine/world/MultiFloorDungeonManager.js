/**
 * GitQuest Game Engine - Multi-Floor Dungeon Manager
 * Manages vertical elevation layers (Z-levels), stairwells, elevator shafts,
 * gravity chute drops, and inter-floor visibility projections.
 */

import { Vector2D } from '../core/MathUtils.js';
import { GameEvent } from '../core/Constants.js';

export class DungeonFloor {
  constructor(floorNumber, name, width = 10, height = 10) {
    this.floorNumber = floorNumber;
    this.name = name;
    this.width = width;
    this.height = height;
    this.walls = new Set();
    this.hazards = new Set();
    this.stairwells = new Map(); // id -> { pos, targetFloor, targetPos, direction: 'UP'|'DOWN' }
    this.elevatorShafts = new Map(); // id -> { pos, floors: [1, 2, 3], currentFloor: 1 }
    this.chutes = new Map(); // id -> { pos, targetFloor, targetPos }
    this.crates = new Map(); // crateId -> pos
    this.doors = new Map(); // doorId -> { pos, isUnlocked }
  }

  addWall(x, y) {
    this.walls.add(`${x},${y}`);
  }

  isWall(x, y) {
    return this.walls.has(`${x},${y}`);
  }

  addHazard(x, y, type = 'LAVA') {
    this.hazards.add(`${x},${y}`);
  }

  isHazard(x, y) {
    return this.hazards.has(`${x},${y}`);
  }

  addStairwell(id, pos, targetFloor, targetPos, direction = 'UP') {
    this.stairwells.set(id, {
      id,
      pos: new Vector2D(pos.x, pos.y),
      targetFloor,
      targetPos: new Vector2D(targetPos.x, targetPos.y),
      direction
    });
  }

  addChute(id, pos, targetFloor, targetPos) {
    this.chutes.set(id, {
      id,
      pos: new Vector2D(pos.x, pos.y),
      targetFloor,
      targetPos: new Vector2D(targetPos.x, targetPos.y)
    });
  }
}

export class MultiFloorDungeonManager {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.floors = new Map();
    this.currentFloorNumber = 1;
  }

  addFloor(floor) {
    this.floors.set(floor.floorNumber, floor);
  }

  get currentFloor() {
    return this.floors.get(this.currentFloorNumber);
  }

  switchFloor(targetFloorNumber) {
    if (this.floors.has(targetFloorNumber)) {
      const prev = this.currentFloorNumber;
      this.currentFloorNumber = targetFloorNumber;
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.ROOM_ENTERED, {
          previousFloor: prev,
          newFloor: targetFloorNumber,
          floorName: this.currentFloor?.name
        });
      }
      return true;
    }
    return false;
  }

  checkStairwellTransition(playerPos) {
    const floor = this.currentFloor;
    if (!floor) return null;

    for (const stair of floor.stairwells.values()) {
      if (stair.pos.x === playerPos.x && stair.pos.y === playerPos.y) {
        this.switchFloor(stair.targetFloor);
        return {
          transited: true,
          type: 'STAIRWELL',
          targetFloor: stair.targetFloor,
          newPosition: stair.targetPos
        };
      }
    }
    return null;
  }

  checkChuteDrop(cratePos) {
    const floor = this.currentFloor;
    if (!floor) return null;

    for (const chute of floor.chutes.values()) {
      if (chute.pos.x === cratePos.x && chute.pos.y === cratePos.y) {
        const targetFloor = this.floors.get(chute.targetFloor);
        if (targetFloor) {
          return {
            dropped: true,
            type: 'GRAVITY_CHUTE',
            targetFloor: chute.targetFloor,
            targetPosition: chute.targetPos
          };
        }
      }
    }
    return null;
  }

  isCellBlockedOnCurrentFloor(x, y) {
    const floor = this.currentFloor;
    if (!floor) return true;
    if (x < 0 || x >= floor.width || y < 0 || y >= floor.height) return true;
    if (floor.isWall(x, y)) return true;

    for (const door of floor.doors.values()) {
      if (door.pos.x === x && door.pos.y === y && !door.isUnlocked) {
        return true;
      }
    }
    return false;
  }

  exportState() {
    return {
      currentFloorNumber: this.currentFloorNumber,
      floors: Array.from(this.floors.values()).map(f => ({
        floorNumber: f.floorNumber,
        crates: Array.from(f.crates.entries()).map(([k, v]) => ({ id: k, x: v.x, y: v.y })),
        doors: Array.from(f.doors.entries()).map(([k, v]) => ({ id: k, isUnlocked: v.isUnlocked }))
      }))
    };
  }

  restoreState(state) {
    if (!state) return;
    this.currentFloorNumber = state.currentFloorNumber || 1;
    if (state.floors) {
      for (const fs of state.floors) {
        const floor = this.floors.get(fs.floorNumber);
        if (floor) {
          if (fs.doors) {
            for (const d of fs.doors) {
              const door = floor.doors.get(d.id);
              if (door) door.isUnlocked = d.isUnlocked;
            }
          }
        }
      }
    }
  }
}

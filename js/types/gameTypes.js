/**
 * GitHero Game Entity & Coordinate Types
 * Defines the core geometries and entity rules for the GitHero puzzle arena.
 */

export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

export const DIRECTION_VECTORS = {
  [DIRECTIONS.UP]: { dx: 0, dy: -1 },
  [DIRECTIONS.DOWN]: { dx: 0, dy: 1 },
  [DIRECTIONS.LEFT]: { dx: -1, dy: 0 },
  [DIRECTIONS.RIGHT]: { dx: 1, dy: 0 }
};

export class Coordinate {
  constructor(x = 0, y = 0) {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }

  equals(other) {
    return other && this.x === other.x && this.y === other.y;
  }

  add(vector) {
    return new Coordinate(this.x + vector.dx, this.y + vector.dy);
  }

  manhattanDistance(other) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  isAdjacent(other) {
    return this.manhattanDistance(other) === 1;
  }
}

export class GameGate {
  constructor(data = {}) {
    this.id = data.id || 'gate_' + Math.random().toString(36).substring(2, 7);
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.isOpen = !!data.isOpen;
    this.linkedSwitchId = data.linkedSwitchId || null;
    this.label = data.label || 'FIREWALL';
  }
}

export class GameSwitch {
  constructor(data = {}) {
    this.id = data.id || 'switch_' + Math.random().toString(36).substring(2, 7);
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.isActive = !!data.isActive;
    this.type = data.type || 'toggle'; // 'toggle', 'pressure', 'commit-key'
  }
}

export class GameHazard {
  constructor(data = {}) {
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.type = data.type || 'deadlock'; // 'deadlock', 'laser', 'leak'
    this.damage = data.damage || 1;
  }
}

export class GameCheckpoint {
  constructor(data = {}) {
    this.id = data.id || 'cp_1';
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.isReached = !!data.isReached;
    this.commitHash = data.commitHash || 'a1b2c3d';
  }
}

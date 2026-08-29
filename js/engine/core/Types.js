/**
 * GitQuest Engine - Core Types and Data Models
 * Clean, lightweight object structures, math helpers, and result wrappers.
 */

import { Direction, DirectionVectors } from './Constants.js';

export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = Math.round(x);
    this.y = Math.round(y);
  }

  static from(obj) {
    if (!obj) return new Vector2D(0, 0);
    if (obj instanceof Vector2D) return new Vector2D(obj.x, obj.y);
    return new Vector2D(obj.x ?? 0, obj.y ?? 0);
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  add(other) {
    const o = Vector2D.from(other);
    return new Vector2D(this.x + o.x, this.y + o.y);
  }

  subtract(other) {
    const o = Vector2D.from(other);
    return new Vector2D(this.x - o.x, this.y - o.y);
  }

  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }

  equals(other) {
    if (!other) return false;
    return this.x === other.x && this.y === other.y;
  }

  manhattanDistance(other) {
    const o = Vector2D.from(other);
    return Math.abs(this.x - o.x) + Math.abs(this.y - o.y);
  }

  euclideanDistance(other) {
    const o = Vector2D.from(other);
    const dx = this.x - o.x;
    const dy = this.y - o.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isAdjacent(other, includeDiagonals = false) {
    const o = Vector2D.from(other);
    const dx = Math.abs(this.x - o.x);
    const dy = Math.abs(this.y - o.y);
    if (includeDiagonals) {
      return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
    }
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  directionTo(other) {
    const o = Vector2D.from(other);
    const dx = o.x - this.x;
    const dy = o.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else if (dy !== 0) {
      return dy > 0 ? Direction.DOWN : Direction.UP;
    }
    return Direction.NONE;
  }

  step(direction, distance = 1) {
    const vec = DirectionVectors[direction] || DirectionVectors[Direction.NONE];
    return new Vector2D(this.x + vec.x * distance, this.y + vec.y * distance);
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export class BoundingBox {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  get width() {
    return this.maxX - this.minX + 1;
  }

  get height() {
    return this.maxY - this.minY + 1;
  }

  contains(x, y) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  containsVector(vec) {
    return this.contains(vec.x, vec.y);
  }

  intersects(other) {
    return !(
      other.minX > this.maxX ||
      other.maxX < this.minX ||
      other.minY > this.maxY ||
      other.maxY < this.minY
    );
  }

  expand(amount = 1) {
    return new BoundingBox(
      this.minX - amount,
      this.minY - amount,
      this.maxX + amount,
      this.maxY + amount
    );
  }

  toJSON() {
    return { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY };
  }
}

export class ActionResult {
  constructor(success, payload = {}) {
    this.success = Boolean(success);
    this.reason = payload.reason || null;
    this.code = payload.code ?? 0;
    this.message = payload.message || '';
    this.events = payload.events || [];
    this.data = payload.data || {};
    Object.assign(this, payload);
  }

  static ok(payload = {}) {
    return new ActionResult(true, payload);
  }

  static fail(reason, code = 1, message = '', extra = {}) {
    return new ActionResult(false, { reason, code, message, ...extra });
  }
}

export class MovementResult extends ActionResult {
  constructor(success, payload = {}) {
    super(success, payload);
    this.from = payload.from ? Vector2D.from(payload.from) : null;
    this.to = payload.to ? Vector2D.from(payload.to) : null;
    this.direction = payload.direction || Direction.NONE;
    this.pushed = Boolean(payload.pushed);
    this.pushedEntity = payload.pushedEntity || null;
    this.onGoal = Boolean(payload.onGoal);
    this.hazardTriggered = Boolean(payload.hazardTriggered);
  }
}

export class PullResult extends ActionResult {
  constructor(success, payload = {}) {
    super(success, payload);
    this.direction = payload.direction || Direction.NONE;
    this.pulled = Boolean(payload.pulled);
    this.pulledEntity = payload.pulledEntity || null;
    this.playerFrom = payload.playerFrom ? Vector2D.from(payload.playerFrom) : null;
    this.playerTo = payload.playerTo ? Vector2D.from(payload.playerTo) : null;
    this.boxFrom = payload.boxFrom ? Vector2D.from(payload.boxFrom) : null;
    this.boxTo = payload.boxTo ? Vector2D.from(payload.boxTo) : null;
    this.onGoal = Boolean(payload.onGoal);
  }
}

export class CommandExecutionResult extends ActionResult {
  constructor(success, payload = {}) {
    super(success, payload);
    this.command = payload.command || '';
    this.subCommand = payload.subCommand || '';
    this.args = payload.args || [];
    this.output = payload.output || '';
    this.logs = payload.logs || [];
    this.levelComplete = Boolean(payload.levelComplete);
    this.switchedLevel = payload.switchedLevel || null;
  }
}

export class RaycastResult {
  constructor(hit, hitEntity = null, hitCoord = null, distance = 0, path = []) {
    this.hit = Boolean(hit);
    this.hitEntity = hitEntity;
    this.hitCoord = hitCoord ? Vector2D.from(hitCoord) : null;
    this.distance = distance;
    this.path = path.map(p => Vector2D.from(p));
  }
}

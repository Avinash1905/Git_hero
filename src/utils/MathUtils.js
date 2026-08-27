/**
 * GitQuest Utility: Vector2D Math & Spatial Operations
 */

export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
  }

  static from(obj) {
    if (!obj) return new Vector2D(0, 0);
    return new Vector2D(obj.x ?? 0, obj.y ?? 0);
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    if (scalar === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  equals(v) {
    if (!v) return false;
    return this.x === v.x && this.y === v.y;
  }

  manhattanDistance(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  euclideanDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return this.divide(mag);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  clamp(minX, maxX, minY, maxY) {
    return new Vector2D(
      Math.max(minX, Math.min(maxX, this.x)),
      Math.max(minY, Math.min(maxY, this.y))
    );
  }

  toObject() {
    return { x: this.x, y: this.y };
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export class MathUtils {
  static clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  static lerp(start, end, t) {
    return start + (end - start) * MathUtils.clamp(t, 0, 1);
  }

  static degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  static radToDeg(radians) {
    return (radians * 180) / Math.PI;
  }

  static isInBounds(x, y, width, height) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  static aabbIntersects(boxA, boxB) {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  }

  static randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

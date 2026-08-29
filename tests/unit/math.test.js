/**
 * Unit Tests: MathUtils & Vector2D Operations
 */

import assert from 'node:assert';
import { Vector2D, MathUtils } from '../../src/utils/MathUtils.js';

export function runMathTests() {
  console.log('Running Math & Vector2D Unit Tests...');

  // Vector basic math
  const v1 = new Vector2D(3, 4);
  assert.strictEqual(v1.magnitude(), 5);

  const v2 = new Vector2D(1, 2);
  const sum = v1.add(v2);
  assert.strictEqual(sum.x, 4);
  assert.strictEqual(sum.y, 6);

  const diff = v1.subtract(v2);
  assert.strictEqual(diff.x, 2);
  assert.strictEqual(diff.y, 2);

  // Distances
  assert.strictEqual(v1.manhattanDistance(v2), 4);
  assert.strictEqual(v1.euclideanDistance(new Vector2D(3, 7)), 3);

  // Normalization
  const norm = new Vector2D(0, 10).normalize();
  assert.strictEqual(norm.x, 0);
  assert.strictEqual(norm.y, 1);

  // Clamp & Bounds
  assert.strictEqual(MathUtils.clamp(15, 0, 10), 10);
  assert.strictEqual(MathUtils.clamp(-5, 0, 10), 0);
  assert.strictEqual(MathUtils.isInBounds(5, 5, 10, 10), true);
  assert.strictEqual(MathUtils.isInBounds(10, 5, 10, 10), false);

  console.log('  ✓ MathUtils & Vector2D tests passed successfully.');
}

if (process.argv[1]?.endsWith('math.test.js')) {
  runMathTests();
}

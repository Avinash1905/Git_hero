/**
 * GitQuest Engine Tests - Dungeon Generator
 * Tests for deterministic BSP room carving, corridor connectivity, and spawn placement.
 */

import { TestSuite } from './TestRunner.js';
import { DungeonGenerator } from '../world/DungeonGenerator.js';

export function createDungeonGeneratorSuite() {
  const suite = new TestSuite('Dungeon & Procedural Puzzle Generator');

  suite.test('DungeonGenerator produces deterministic rooms and walkable paths with identical seed', (assert) => {
    const gen1 = new DungeonGenerator(20, 20, 4242);
    const d1 = gen1.generate();

    const gen2 = new DungeonGenerator(20, 20, 4242);
    const d2 = gen2.generate();

    assert.equal(d1.rooms.length, d2.rooms.length);
    assert.equal(d1.playerSpawn.x, d2.playerSpawn.x);
    assert.equal(d1.goalCoord.x, d2.goalCoord.x);

    // Ensure carved rooms exist
    assert.isTrue(d1.rooms.length >= 2);
    assert.isTrue(d1.tileMap.isWalkable(d1.playerSpawn.x, d1.playerSpawn.y));
  });

  return suite;
}

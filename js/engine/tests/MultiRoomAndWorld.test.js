/**
 * GitQuest Engine Tests - Multi-Room & World Map
 * Tests for Room, RoomGraph, PathFinder, and SpatialIndex in large multi-chamber puzzle layouts.
 */

import { TestSuite } from './TestRunner.js';
import { Room } from '../world/Room.js';
import { RoomGraph } from '../world/RoomGraph.js';
import { TileMap } from '../world/TileMap.js';
import { PathFinder } from '../world/PathFinder.js';
import { SpatialIndex } from '../world/SpatialIndex.js';
import { BoundingBox } from '../core/Types.js';

export function createMultiRoomAndWorldSuite() {
  const suite = new TestSuite('Multi-Room & World Map');

  suite.test('Room contains coordinates within its bounding box', (assert) => {
    const roomA = new Room({
      id: 'room_a',
      name: 'Staging Room',
      bounds: new BoundingBox(0, 0, 5, 5)
    });

    assert.isTrue(roomA.contains(2, 2));
    assert.isTrue(roomA.contains(0, 0));
    assert.isTrue(roomA.contains(5, 5));
    assert.isFalse(roomA.contains(6, 5));
  });

  suite.test('RoomGraph finds topological path across interconnected rooms', (assert) => {
    const graph = new RoomGraph();
    const rA = new Room({ id: 'rA', name: 'Start' });
    const rB = new Room({ id: 'rB', name: 'Corridor' });
    const rC = new Room({ id: 'rC', name: 'Vault' });

    graph.addRoom(rA);
    graph.addRoom(rB);
    graph.addRoom(rC);

    graph.connect('rA', 'rB', { x: 5, y: 2 }, { x: 6, y: 2 });
    graph.connect('rB', 'rC', { x: 10, y: 5 }, { x: 11, y: 5 });

    const path = graph.findPathBetweenRooms('rA', 'rC');
    assert.exists(path);
    assert.equal(path.length, 3);
    assert.equal(path[0], 'rA');
    assert.equal(path[1], 'rB');
    assert.equal(path[2], 'rC');
  });

  suite.test('PathFinder A* finds shortest path around wall obstacles', (assert) => {
    const tileMap = new TileMap(10, 10, 'floor');
    tileMap.setPerimeter('wall');

    // Create a vertical dividing wall with an opening at (5, 8)
    for (let y = 1; y < 8; y++) {
      tileMap.setTile(5, y, 'wall');
    }

    const pathFinder = new PathFinder(tileMap);
    const path = pathFinder.findPath({ x: 2, y: 2 }, { x: 8, y: 2 });

    assert.exists(path);
    assert.isTrue(path.length > 0);
    // Start is at (2,2), End is at (8,2)
    assert.equal(path[0].x, 2);
    assert.equal(path[0].y, 2);
    assert.equal(path[path.length - 1].x, 8);
    assert.equal(path[path.length - 1].y, 2);

    // Ensure path route goes through the opening at (5,8)
    const passedOpening = path.some(p => p.x === 5 && p.y === 8);
    assert.isTrue(passedOpening);
  });

  suite.test('SpatialIndex performs fast radius and box spatial queries', (assert) => {
    const index = new SpatialIndex(1);
    const e1 = { id: 'ent1', position: { x: 2, y: 2 } };
    const e2 = { id: 'ent2', position: { x: 3, y: 2 } };
    const e3 = { id: 'ent3', position: { x: 10, y: 10 } };

    index.insert(e1);
    index.insert(e2);
    index.insert(e3);

    const radiusHits = index.queryRadius(2, 2, 2);
    assert.equal(radiusHits.length, 2); // e1 and e2
    assert.isTrue(radiusHits.includes(e1));
    assert.isTrue(radiusHits.includes(e2));
    assert.isFalse(radiusHits.includes(e3));
  });

  return suite;
}

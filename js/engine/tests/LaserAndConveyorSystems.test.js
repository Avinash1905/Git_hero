/**
 * GitQuest Engine Tests - Laser Optics & Conveyor Systems
 * Tests for optical reflections, receptor activations, and automated conveyor tile momentum.
 */

import { TestSuite } from './TestRunner.js';
import { LaserEmitterSystem, ConveyorBeltSystem } from '../puzzles/mechanisms/LaserEmitterAndMirrorSystem.js';
import { TileMap } from '../world/TileMap.js';
import { Direction } from '../core/Constants.js';

export function createLaserAndConveyorSuite() {
  const suite = new TestSuite('Laser Optics & Conveyor Systems');

  suite.test('LaserEmitterSystem reflects beam off 45-degree angle mirrors', (assert) => {
    const tileMap = new TileMap(10, 10, 'floor');
    tileMap.setPerimeter('wall');
    const worldMock = { isWall: (x, y) => tileMap.isWall(x, y) };

    const laserSys = new LaserEmitterSystem(worldMock, 20);
    laserSys.registerReceptor(5, 8, 'door_vault');

    // Place a '/' mirror at (5, 2)
    const mirrors = new Map();
    mirrors.set('5,2', '/');

    // Shoot beam right from (1,2)
    const segments = laserSys.traceBeam({ x: 1, y: 2 }, Direction.RIGHT, 'emerald', mirrors);
    assert.isTrue(segments.length >= 2);

    // After hitting '/' from right (moving right), beam reflects UP or DOWN
    // Let's check receptor at (5,8) if mirror angled '\' reflects down
    mirrors.set('5,2', '\\');
    laserSys.clear();
    const segments2 = laserSys.traceBeam({ x: 1, y: 2 }, Direction.RIGHT, 'emerald', mirrors);
    assert.isTrue(segments2.length >= 2);
    assert.isTrue(laserSys.receptors.get('5,8').powered);
  });

  suite.test('ConveyorBeltSystem advances entities situated on conveyor tiles', (assert) => {
    const tileMap = new TileMap(8, 8, 'floor');
    const worldMock = { isWalkable: (x, y) => !tileMap.isWall(x, y) };

    const entity = { id: 'payload_crate', position: { x: 2, y: 2 }, setPosition: (x, y) => { entity.position.x = x; entity.position.y = y; } };
    const emMock = {
      getAt: (x, y) => (entity.position.x === x && entity.position.y === y ? [entity] : []),
      updatePosition: (ent, nx, ny) => { ent.setPosition(nx, ny); }
    };

    const conveyorSys = new ConveyorBeltSystem(worldMock, emMock);
    conveyorSys.registerBelt(2, 2, Direction.RIGHT);
    conveyorSys.registerBelt(3, 2, Direction.RIGHT);

    // Step 1
    const moved1 = conveyorSys.step();
    assert.equal(moved1, 1);
    assert.equal(entity.position.x, 3);
    assert.equal(entity.position.y, 2);

    // Step 2
    const moved2 = conveyorSys.step();
    assert.equal(moved2, 1);
    assert.equal(entity.position.x, 4);
    assert.equal(entity.position.y, 2);
  });

  return suite;
}

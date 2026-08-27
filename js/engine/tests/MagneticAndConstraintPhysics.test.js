/**
 * GitQuest Engine Tests - Magnetic Fields, Constraints & Flow Fields
 * Tests for magnetic polarity attraction/repulsion, distance constraints, and Dijkstra vector flow fields.
 */

import { TestSuite } from './TestRunner.js';
import { MagneticNode, MagneticPolarity, MagneticFieldEngine, DistanceConstraint } from '../physics/MagneticFieldEngine.js';
import { FlowFieldPathfinder } from '../world/HierarchicalPathFinder.js';
import { TileMap } from '../world/TileMap.js';

export function createMagneticAndConstraintPhysicsSuite() {
  const suite = new TestSuite('Magnetic Physics & Flow Field Vectors');

  suite.test('MagneticNode attracts opposite polarity and repels identical polarity', (assert) => {
    const northNode = new MagneticNode('mag_north', 10, 10, MagneticPolarity.NORTH, 5);

    // South box at (10, 12) -> Attracted upward (-dy)
    const attractForce = northNode.calculateForce({ x: 10, y: 12 }, MagneticPolarity.SOUTH);
    assert.equal(attractForce.fx, 0);
    assert.equal(attractForce.fy, -1);

    // North box at (10, 12) -> Repelled downward (+dy)
    const repelForce = northNode.calculateForce({ x: 10, y: 12 }, MagneticPolarity.NORTH);
    assert.equal(repelForce.fx, 0);
    assert.equal(repelForce.fy, 1);
  });

  suite.test('DistanceConstraint pulls tethered entity when distance exceeds threshold', (assert) => {
    const worldMock = { isWalkable: () => true };
    const entA = { position: { x: 2, y: 2 } };
    const entB = { position: { x: 6, y: 2 } }; // dist = 4 > maxDistance 2

    const emMock = {
      updatePosition: (ent, nx, ny) => {
        ent.position.x = nx;
        ent.position.y = ny;
      }
    };

    const constraint = new DistanceConstraint(entA, entB, 2);
    const solved = constraint.solve(worldMock, emMock);

    assert.isTrue(solved);
    assert.equal(entB.position.x, 5); // pulled left toward entA
  });

  suite.test('FlowFieldPathfinder calculates directional vectors pointing to target', (assert) => {
    const tileMap = new TileMap(8, 8, 'floor');
    tileMap.setPerimeter('wall');

    const flowField = new FlowFieldPathfinder(tileMap);
    flowField.generateField({ x: 4, y: 4 });

    // Cell at (2,4) should point RIGHT (+dx) towards (4,4)
    const vecLeft = flowField.getVectorAt(2, 4);
    assert.equal(vecLeft.dx, 1);
    assert.equal(vecLeft.dy, 0);

    // Cell at (4,2) should point DOWN (+dy) towards (4,4)
    const vecAbove = flowField.getVectorAt(4, 2);
    assert.equal(vecAbove.dx, 0);
    assert.equal(vecAbove.dy, 1);
  });

  return suite;
}

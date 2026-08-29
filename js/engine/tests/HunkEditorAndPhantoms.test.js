/**
 * GitQuest Engine Tests - Merge Conflict Hunks & Clone Branch Phantoms
 * Tests for in-world hunk resolution, synchronized clone phantom steps, time decay nodes, and gravity zones.
 */

import { TestSuite } from './TestRunner.js';
import { MergeConflictHunkEditor, CloneBranchPhantom, CloneBranchPhantomEngine } from '../puzzles/mechanisms/MergeConflictHunkEditor.js';
import { TimeDecayCommitNode, GravityInversionZone, GravityInversionEngine } from '../puzzles/mechanisms/TimeTrialAndGravity.js';
import { BoundingBox } from '../core/Types.js';

export function createHunkEditorAndPhantomsSuite() {
  const suite = new TestSuite('Conflict Hunks, Phantoms & Gravity');

  suite.test('MergeConflictHunkEditor unlocks merge door once all hunks resolved', (assert) => {
    const editor = new MergeConflictHunkEditor('door_merge_1');
    editor.addHunk('h1', 'const a = 1;', 'const a = 2;');
    editor.addHunk('h2', 'return true;', 'return false;');

    assert.isFalse(editor.isAllResolved());

    editor.resolveHunk('h1', 'union');
    assert.isFalse(editor.isAllResolved());

    editor.resolveHunk('h2', 'ours');
    assert.isTrue(editor.isAllResolved());
  });

  suite.test('CloneBranchPhantom calculates mirrored movement along X and Y axes', (assert) => {
    const phantom = new CloneBranchPhantom('clone_1', 10, 10, 'both');
    const move = phantom.calculateMovement(1, -1);

    // X was +1 -> mirrored -1 => 9
    // Y was -1 -> mirrored +1 => 11
    assert.equal(move.targetX, 9);
    assert.equal(move.targetY, 11);
  });

  suite.test('TimeDecayCommitNode decays upon expiration and rejects harvesting', (assert) => {
    const node = new TimeDecayCommitNode('node_decay_1', 5, 5, 2.0);
    assert.isFalse(node.isDecayed);

    node.tick(1.0);
    assert.equal(node.remainingSeconds, 1.0);
    assert.isFalse(node.isDecayed);

    node.tick(1.5);
    assert.isTrue(node.isDecayed);
    assert.isFalse(node.harvest());
  });

  suite.test('GravityInversionEngine inverts movement vectors within designated gravity zones', (assert) => {
    const engine = new GravityInversionEngine();
    const zone = new GravityInversionZone(new BoundingBox(5, 5, 15, 15), { invertX: false, invertY: true });
    engine.addZone(zone);

    // Outside zone (2,2) -> normal
    const outMove = engine.getEffectiveMovement(2, 2, 0, -1);
    assert.equal(outMove.dy, -1);

    // Inside zone (8,8) -> inverted Y
    const inMove = engine.getEffectiveMovement(8, 8, 0, -1);
    assert.equal(inMove.dy, 1);
  });

  return suite;
}

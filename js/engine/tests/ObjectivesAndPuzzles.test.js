/**
 * GitQuest Engine Tests - Objectives & Puzzle Mechanisms
 * Tests for condition combinators (AND, OR, NOT, SEQUENCE), StageMachine, and mechanisms.
 */

import { TestSuite } from './TestRunner.js';
import { AndCondition, OrCondition, NotCondition, SequenceCondition } from '../objectives/Condition.js';
import { LocationCondition, CommandCondition, BoxOnGoalCondition } from '../objectives/SpecificConditions.js';
import { Objective, ObjectiveManager } from '../objectives/ObjectiveManager.js';
import { StageMachine, PuzzleStage } from '../puzzles/StageMachine.js';
import { LockAndKeyMechanism, PressureWireMechanism } from '../puzzles/PuzzleSystem.js';
import { DoorEntity } from '../entities/Door.js';
import { PressurePlateEntity, WireEntity } from '../entities/Switch.js';
import { Inventory } from '../state/PlayerState.js';

export function createObjectivesAndPuzzlesSuite() {
  const suite = new TestSuite('Objectives & Puzzle Mechanisms');

  suite.test('AndCondition requires all sub-conditions to be true', (assert) => {
    const cond1 = new LocationCondition({ x: 2, y: 2 });
    const cond2 = new BoxOnGoalCondition();
    const andCond = new AndCondition([cond1, cond2]);

    const state1 = { player: { x: 2, y: 2 }, checkGoal: () => false };
    assert.isFalse(andCond.evaluate(state1));

    const state2 = { player: { x: 2, y: 2 }, checkGoal: () => true };
    assert.isTrue(andCond.evaluate(state2));
  });

  suite.test('SequenceCondition evaluates in exact sequential order', (assert) => {
    const cond1 = new CommandCondition('git status');
    const cond2 = new CommandCondition('git commit');
    const seq = new SequenceCondition([cond1, cond2]);

    // Executing step 2 before step 1 fails
    assert.isFalse(seq.evaluate({}, { executedCommand: 'git commit' }));

    // Executing step 1 advances sequence
    assert.isFalse(seq.evaluate({}, { executedCommand: 'git status' }));

    // Executing step 2 finishes sequence
    assert.isTrue(seq.evaluate({}, { executedCommand: 'git commit' }));
  });

  suite.test('ObjectiveManager tracks completion percentage and fires stage complete', (assert) => {
    const mgr = new ObjectiveManager();
    const obj1 = new Objective({
      id: 'o1',
      title: 'Inspect',
      condition: new CommandCondition('git status')
    });
    const obj2 = new Objective({
      id: 'o2',
      title: 'Goal',
      condition: new BoxOnGoalCondition()
    });

    mgr.add(obj1);
    mgr.add(obj2);

    const res1 = mgr.evaluateAll({ checkGoal: () => false }, { executedCommand: 'git status' });
    assert.isFalse(res1.allComplete);
    assert.equal(res1.requiredDone, 1);
    assert.equal(res1.progressPercent, 50);

    const res2 = mgr.evaluateAll({ checkGoal: () => true }, {});
    assert.isTrue(res2.allComplete);
    assert.equal(res2.progressPercent, 100);
  });

  suite.test('LockAndKeyMechanism unlocks door when key is in inventory', (assert) => {
    const door = new DoorEntity({ id: 'door_vault', isLocked: true, requiredKeyId: 'key_ssh' });
    const inventory = new Inventory();
    const mockEM = { get: (id) => (id === 'door_vault' ? door : null) };

    const mech = new LockAndKeyMechanism('door_vault', 'key_ssh');
    assert.isFalse(mech.evaluate(inventory, mockEM));
    assert.isTrue(door.isLocked);

    inventory.addItem('key_ssh');
    assert.isTrue(mech.evaluate(inventory, mockEM));
    assert.isFalse(door.isLocked);
    assert.isTrue(door.isOpen);
  });

  suite.test('PressureWireMechanism powers circuit and opens target gate', (assert) => {
    const plate = new PressurePlateEntity({ id: 'plate_1', requiredWeight: 1 });
    const wire = new WireEntity({ id: 'wire_1' });
    const door = new DoorEntity({ id: 'gate_1', isOpen: false });

    const mockEM = {
      get: (id) => {
        if (id === 'plate_1') return plate;
        if (id === 'wire_1') return wire;
        if (id === 'gate_1') return door;
        return null;
      }
    };

    const mech = new PressureWireMechanism('plate_1', 'wire_1', 'gate_1');

    // Initially unpressed
    mech.evaluate(mockEM);
    assert.isFalse(wire.isPowered);
    assert.isFalse(door.isOpen);

    // Step on plate
    plate.evaluateOccupants([{ type: 'player' }]);
    assert.isTrue(plate.isPressed);

    mech.evaluate(mockEM);
    assert.isTrue(wire.isPowered);
    assert.isTrue(door.isOpen);
  });

  return suite;
}

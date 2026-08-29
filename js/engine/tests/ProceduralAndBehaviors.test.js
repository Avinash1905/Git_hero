/**
 * GitQuest Engine Tests - Procedural Generation, Daily Challenges & Behavior Trees
 * Tests for ProceduralLevelGenerator, DailyChallengeEngine, BehaviorTree AI, and ScriptTriggers.
 */

import { TestSuite } from './TestRunner.js';
import { ProceduralLevelGenerator } from '../procedural/ProceduralLevelGenerator.js';
import { DailyChallengeEngine, PuzzleDifficultyEstimator } from '../procedural/DailyChallengeEngine.js';
import { SequenceNode, SelectorNode, ConditionNode, ActionNode, NodeStatus, StateMachineComponent } from '../entities/behaviors/BehaviorTree.js';
import { ScriptTrigger, DialogueAndCutsceneEngine } from '../scripting/ScriptTriggerEngine.js';
import { BoundingBox } from '../core/Types.js';

export function createProceduralAndBehaviorsSuite() {
  const suite = new TestSuite('Procedural Systems, Behavior Trees & Scripting');

  suite.test('ProceduralLevelGenerator generates solvable level with valid perimeter and player/goal', (assert) => {
    const gen = new ProceduralLevelGenerator(999);
    const lvl = gen.generateLevel({ width: 10, height: 10 });

    assert.exists(lvl);
    assert.equal(lvl.player.x, 1);
    assert.equal(lvl.player.y, 1);
    assert.equal(lvl.goal.x, 8);
    assert.equal(lvl.goal.y, 8);
  });

  suite.test('DailyChallengeEngine calculates deterministic daily seed and modifier', (assert) => {
    const d1 = new Date('2026-08-27T00:00:00Z');
    const d2 = new Date('2026-08-27T12:00:00Z');

    assert.equal(DailyChallengeEngine.getDailySeed(d1), DailyChallengeEngine.getDailySeed(d2));
    assert.equal(DailyChallengeEngine.getDailyModifier(d1), DailyChallengeEngine.getDailyModifier(d2));

    const dailyLevel = DailyChallengeEngine.generateDailyLevel(d1);
    assert.exists(dailyLevel);
    assert.exists(dailyLevel.dailyModifier);
  });

  suite.test('BehaviorTree processes sequences and selectors with proper node statuses', (assert) => {
    let actionExecuted = false;

    const condition = new ConditionNode('IsNearPlayer', (ctx) => ctx.dist <= 2);
    const action = new ActionNode('AlertDrone', (ctx) => {
      actionExecuted = true;
      return NodeStatus.SUCCESS;
    });

    const seq = new SequenceNode('PatrolAlertSeq', [condition, action]);

    // Dist = 5 -> Failure (Action not executed)
    const res1 = seq.tick({ dist: 5 });
    assert.equal(res1, NodeStatus.FAILURE);
    assert.isFalse(actionExecuted);

    // Dist = 1 -> Success (Action executed)
    const res2 = seq.tick({ dist: 1 });
    assert.equal(res2, NodeStatus.SUCCESS);
    assert.isTrue(actionExecuted);
  });

  suite.test('StateMachineComponent transitions states based on guarded conditions', (assert) => {
    const sm = new StateMachineComponent('patrol');
    sm.addState('patrol');
    sm.addState('alert');
    sm.addState('chase');

    sm.addTransition('patrol', 'alert', (ctx) => ctx.sawPlayer);

    assert.equal(sm.currentState, 'patrol');
    sm.update({ sawPlayer: true });
    assert.equal(sm.currentState, 'alert');
  });

  suite.test('ScriptTrigger and DialogueEngine advance story sequences upon player entrance', (assert) => {
    let triggered = false;
    const trigger = new ScriptTrigger('trig_1', new BoundingBox(2, 2, 4, 4), () => {
      triggered = true;
    });

    // Outside bounds
    trigger.evaluate(1, 1);
    assert.isFalse(triggered);

    // Inside bounds
    trigger.evaluate(3, 3);
    assert.isTrue(triggered);

    const dialog = new DialogueAndCutsceneEngine();
    let currentSpeaker = '';
    dialog.onDialogueChange = (line) => {
      currentSpeaker = line.speaker;
    };

    dialog.playSequence([
      { speaker: 'Terminal AI', text: 'Welcome, engineer.' },
      { speaker: 'Git Daemon', text: 'Initiating rebase protocol.' }
    ]);

    assert.equal(currentSpeaker, 'Terminal AI');
    dialog.advance();
    assert.equal(currentSpeaker, 'Git Daemon');
  });

  return suite;
}

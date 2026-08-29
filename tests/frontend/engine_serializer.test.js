// Frontend Unit Tests: Engine State Serializer & Replayer
import assert from 'node:assert';
import { EngineStateSerializer } from '../../src/adapters/EngineStateSerializer.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runEngineSerializerTests() {
  console.log('\n[Suite 35: Engine State Serializer & Timeline Replayer]');

  const mockState1 = {
    levelId: '01',
    moves: 1,
    elapsedSeconds: 5,
    player: { x: 1, y: 1, facing: 'down' },
    box: { x: 2, y: 2 },
    goal: { x: 5, y: 5 },
    isGoalReached: false,
    isCommitted: false
  };

  const mockState2 = {
    levelId: '01',
    moves: 2,
    elapsedSeconds: 10,
    player: { x: 1, y: 2, facing: 'down' },
    box: { x: 5, y: 5 },
    goal: { x: 5, y: 5 },
    isGoalReached: true,
    isCommitted: true
  };

  it('Should serialize complete engine snapshot', () => {
    const snap1 = EngineStateSerializer.serializeSnapshot(mockState1);
    assert.ok(snap1 !== null, 'Snapshot must not be null');
    assert.strictEqual(snap1.levelId, '01', 'LevelId must match');
    assert.strictEqual(snap1.player.x, 1, 'Player coordinates must be preserved');
  });

  it('Should accurately compute delta differences between snapshots', () => {
    const snap1 = EngineStateSerializer.serializeSnapshot(mockState1);
    const snap2 = EngineStateSerializer.serializeSnapshot(mockState2);
    const delta = EngineStateSerializer.computeDelta(snap1, snap2);
    assert.strictEqual(delta.movesDiff, 1, 'Moves diff must be 1');
    assert.strictEqual(delta.playerMoved, true, 'Player movement must be detected');
    assert.strictEqual(delta.boxMoved, true, 'Box movement must be detected');
    assert.strictEqual(delta.goalReachedChanged, true, 'Goal reached change must be flagged');
  });

  it('Should provide step-by-step timeline scrubber replayer', () => {
    const snap1 = EngineStateSerializer.serializeSnapshot(mockState1);
    const snap2 = EngineStateSerializer.serializeSnapshot(mockState2);
    const replayer = EngineStateSerializer.createTimelineReplayer([snap1, snap2]);
    assert.strictEqual(replayer.getTotalSteps(), 2, 'Total steps must be 2');
    assert.strictEqual(replayer.getCurrentIndex(), 0, 'Initial index must be 0');
    const stepped = replayer.stepForward();
    assert.strictEqual(stepped.moves, 2, 'Stepping forward should advance state');
  });

  it('Should export serialized JSON session replay package', () => {
    const snap1 = EngineStateSerializer.serializeSnapshot(mockState1);
    const snap2 = EngineStateSerializer.serializeSnapshot(mockState2);
    const jsonRec = EngineStateSerializer.exportSessionRecording('01', [snap1, snap2], { score: 1000 });
    assert.ok(jsonRec.includes('GITQUEST_REC_V1'), 'Exported session must have valid signature');
  });

  return { passed, total };
}

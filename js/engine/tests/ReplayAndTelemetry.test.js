/**
 * GitQuest Engine Tests - Replay Recorder & Telemetry
 * Tests for deterministic session recording, keyframes, replay playback, and spatial heatmaps.
 */

import { TestSuite } from './TestRunner.js';
import { ReplayRecorder, ReplayPlayer } from '../telemetry/ReplayRecorder.js';
import { HeatmapTracker } from '../telemetry/HeatmapTracker.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createReplayAndTelemetrySuite() {
  const suite = new TestSuite('Replay Recorder & Spatial Telemetry');

  suite.test('ReplayRecorder captures frames and ReplayPlayer plays back deterministically', (assert) => {
    const recorder = new ReplayRecorder('01');
    recorder.recordAction(1, 'git down', { x: 1, y: 1, dir: 'up' }, { x: 2, y: 2 });
    recorder.recordAction(2, 'git right', { x: 1, y: 2, dir: 'down' }, { x: 2, y: 2 });

    const serialized = recorder.stop();
    assert.equal(serialized.levelId, '01');
    assert.equal(serialized.totalFrames, 2);

    const engine = new GitQuestEngine();
    const player = new ReplayPlayer(serialized, engine);
    player.start();

    // Step 1
    const f1 = player.step();
    assert.equal(f1.command, 'git down');
    assert.equal(engine.player.y, 2);

    // Step 2
    const f2 = player.step();
    assert.equal(f2.command, 'git right');
    assert.isTrue(player.isFinished());
  });

  suite.test('HeatmapTracker accurately records footstep hotspots and choke points', (assert) => {
    const heatmap = new HeatmapTracker(10, 10);
    heatmap.recordFootstep(3, 3);
    heatmap.recordFootstep(3, 3);
    heatmap.recordFootstep(3, 3);
    heatmap.recordPush(3, 3);

    const top = heatmap.getMostVisitedTile();
    assert.equal(top.x, 3);
    assert.equal(top.y, 3);
    assert.equal(top.count, 3);

    const hotspotScore = heatmap.getHotspot(3, 3);
    assert.equal(hotspotScore, 5); // 3 footsteps + 1 push * 2 = 5
  });

  return suite;
}

/**
 * GitQuest Engine Tests - Git Garbage Collection & Sensory Perception
 * Tests for git gc reachability graph pruning and acoustic wave propagation across spatial grids.
 */

import { TestSuite } from './TestRunner.js';
import { GitRepo } from '../git/GitRepo.js';
import { GitGarbageCollector } from '../git/GitGarbageCollector.js';
import { SensoryPerceptionGrid } from '../world/SensoryPerceptionGrid.js';
import { TileMap } from '../world/TileMap.js';

export function createGarbageCollectorAndPerceptionSuite() {
  const suite = new TestSuite('Git Garbage Collection & Sensory Perception');

  suite.test('GitGarbageCollector retains reachable objects and prunes dangling commits', (assert) => {
    const repo = new GitRepo();
    repo.commit('Reachable Commit 1');

    // Create orphaned commit object manually
    const orphanHash = 'deadbeef1234567890abcdef1234567890abcdef';
    repo.objects.set(orphanHash, { type: 'commit', message: 'Orphaned payload' });

    assert.isTrue(repo.objects.has(orphanHash));

    const gc = new GitGarbageCollector(repo);
    const result = gc.collect({ pruneDangling: true });

    assert.isTrue(result.prunedCount >= 1);
    assert.isFalse(repo.objects.has(orphanHash));
  });

  suite.test('SensoryPerceptionGrid propagates acoustic waves and calculates audible volume by distance', (assert) => {
    const tileMap = new TileMap(10, 10, 'floor');
    const grid = new SensoryPerceptionGrid(tileMap);

    // Emit sound at (2, 2) with volume 6
    grid.emitSound(2, 2, 6, 'box_impact');

    // Listener at (2, 2) -> dist = 0 -> volume 6
    const volAtOrigin = grid.getAudibleVolume({ x: 2, y: 2 });
    assert.equal(volAtOrigin, 6);

    // Listener at (4, 2) -> dist = 2 -> volume 4
    const volAtDistance = grid.getAudibleVolume({ x: 4, y: 2 });
    assert.equal(volAtDistance, 4);

    // Listener at (10, 10) -> dist > 6 -> volume 0
    const volFar = grid.getAudibleVolume({ x: 10, y: 10 });
    assert.equal(volFar, 0);
  });

  return suite;
}

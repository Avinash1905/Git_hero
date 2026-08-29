/**
 * Automated Frontend Test Suite: Submodules, Worktrees, Stash & Tags
 * Tests: Submodule gitlinks, worktree multi-branch trees, LIFO stash stack, SemVer tags
 */

import assert from 'node:assert';
import { SubmoduleManager } from '../../src/features/submodules/SubmoduleManager.js';
import { WorktreeManager } from '../../src/features/worktrees/WorktreeManager.js';
import { StashCabinet } from '../../src/features/stash/StashCabinet.js';
import { TagManager } from '../../src/features/tags/TagManager.js';

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

export async function runSubmoduleWorktreeTests() {
  console.log('\n[Suite 25: Submodules, Worktrees, Stash & Release Tags]');

  it('SubmoduleManager should add new submodules and prevent duplicate paths', () => {
    const manager = new SubmoduleManager();
    const res = manager.addSubmodule('vendor/analytics', 'https://github.com/gitquest/analytics.git');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.submodule.path, 'vendor/analytics');

    const duplicate = manager.addSubmodule('vendor/analytics', 'https://github.com/gitquest/analytics.git');
    assert.strictEqual(duplicate.success, false);
  });

  it('WorktreeManager should add linked trees and protect primary root from deletion', () => {
    const manager = new WorktreeManager();
    const addRes = manager.addWorktree('/d/Projects/Git/Git_hero-exp', 'experiment/physics');
    assert.strictEqual(addRes.success, true);

    const deletePrimary = manager.removeWorktree('/d/Projects/Git/Git_hero');
    assert.strictEqual(deletePrimary, false, 'Primary root worktree cannot be pruned');

    const deleteLinked = manager.removeWorktree('/d/Projects/Git/Git_hero-exp');
    assert.strictEqual(deleteLinked, true);
  });

  it('StashCabinet should manage LIFO stack and re-index elements on push and pop', () => {
    const cabinet = new StashCabinet();
    const initialLen = cabinet.stashes.length;

    cabinet.pushStash('Urgent bugfix patch', 'main');
    assert.strictEqual(cabinet.stashes[0].id, 'stash@{0}');
    assert.strictEqual(cabinet.stashes[1].id, 'stash@{1}');

    const popped = cabinet.popStash();
    assert.strictEqual(popped.message, 'Urgent bugfix patch');
    assert.strictEqual(cabinet.stashes.length, initialLen);
  });

  it('TagManager should create annotated and lightweight tags with validation', () => {
    const tagger = new TagManager();
    const res = tagger.createTag('v2.0.0', 'commit-sha-999', 'Major 250 sector release', true);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.tag.signed, true);

    const dup = tagger.createTag('v2.0.0', 'commit-sha-999');
    assert.strictEqual(dup.success, false);

    const deleted = tagger.deleteTag('v2.0.0');
    assert.strictEqual(deleted, true);
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('submodule_worktree.test.js')) {
  runSubmoduleWorktreeTests().then(() => console.log(`\nAll ${passed}/${total} Submodule & Worktree tests passed.`));
}

/**
 * Automated Frontend Test Suite: Interactive Rebase & Cherry-Pick Workbenches
 * Tests: RebaseState compilation, action modifications, commit reordering, CherryPickWorkbench toggle
 */

import assert from 'node:assert';
import { RebaseState } from '../../src/features/rebase/RebaseState.js';
import { RebaseWorkbench } from '../../src/features/rebase/RebaseWorkbench.js';
import { CherryPickWorkbench } from '../../src/features/cherrypick/CherryPickWorkbench.js';
import { renderConflictResolverPage } from '../../src/pages/ConflictResolverPage.js';
import { renderRebaseWorkbenchPage } from '../../src/pages/RebaseWorkbenchPage.js';
import { renderCherryPickPage } from '../../src/pages/CherryPickPage.js';

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

export async function runRebaseCherryPickTests() {
  console.log('\n[Suite 23: Interactive Rebase & Cherry-Pick Workbenches]');

  it('RebaseState should initialize with default commit sequence', () => {
    const rebase = new RebaseState();
    assert.strictEqual(rebase.commits.length, 4);
    assert.strictEqual(rebase.commits[0].action, 'pick');
  });

  it('RebaseState should reorder commits and update actions', () => {
    const rebase = new RebaseState();
    const firstHash = rebase.commits[0].hash;
    const secondHash = rebase.commits[1].hash;

    rebase.moveCommit(0, 1);
    assert.strictEqual(rebase.commits[0].hash, secondHash);
    assert.strictEqual(rebase.commits[1].hash, firstHash);

    rebase.setAction(0, 'reword');
    assert.strictEqual(rebase.commits[0].action, 'reword');
  });

  it('RebaseState compileLinearHistory should squash consecutive commits cleanly', () => {
    const rebase = new RebaseState();
    // Commit 0: pick
    // Commit 1: squash
    // Commit 2: drop
    // Commit 3: pick
    rebase.setAction(1, 'squash');
    rebase.setAction(2, 'drop');

    const history = rebase.compileLinearHistory();
    assert.strictEqual(history.length, 2, 'Should result in 2 consolidated commits');
    assert.strictEqual(history[0].squashedHashes.length, 2, 'First commit should contain 2 squashed hashes');
    assert.ok(history[0].message.includes('* style: format tile spacing'));
  });

  it('CherryPickWorkbench should toggle staged picks across branches', () => {
    const cp = new CherryPickWorkbench();
    assert.strictEqual(cp.stagedPicks.length, 0);

    const toggled = cp.togglePick('cp-81');
    assert.strictEqual(toggled, true);
    assert.strictEqual(cp.stagedPicks.length, 1);
    assert.strictEqual(cp.stagedPicks[0].hash, 'cp-81');

    // Toggle off
    cp.togglePick('cp-81');
    assert.strictEqual(cp.stagedPicks.length, 0);
  });

  it('Workbench pages should render semantic HTML', () => {
    const conflictHtml = renderConflictResolverPage();
    assert.ok(conflictHtml.includes('3-Way Merge Workbench'));

    const rebaseHtml = renderRebaseWorkbenchPage();
    assert.ok(rebaseHtml.includes('Interactive Git Rebase'));

    const cpHtml = renderCherryPickPage();
    assert.ok(cpHtml.includes('Git Cherry-Pick Matrix'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('rebase_cherrypick.test.js')) {
  runRebaseCherryPickTests().then(() => console.log(`\nAll ${passed}/${total} Rebase & Cherry-Pick tests passed.`));
}

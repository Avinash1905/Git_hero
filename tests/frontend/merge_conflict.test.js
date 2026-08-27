/**
 * Automated Frontend Test Suite: 3-Way Merge Conflict Resolver
 * Tests: Hunk parsing, decision state transitions, resolved file generation
 */

import assert from 'node:assert';
import { MergeConflictState } from '../../src/features/merge/MergeConflictState.js';
import { MergeConflictResolver } from '../../src/features/merge/MergeConflictResolver.js';

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

export async function runMergeConflictTests() {
  console.log('\n[Suite 13: 3-Way Merge Conflict Resolver]');

  it('MergeConflictState should load default conflict hunks', () => {
    const state = new MergeConflictState();
    state.loadDefaultHunk();
    assert.ok(state.hunks.length >= 2, 'Default state must have at least 2 conflict hunks');
    assert.strictEqual(state.isFullyResolved(), false, 'State should start unresolved');
    assert.strictEqual(state.resolvedCount, 0);
  });

  it('Resolving hunks should update resolution count and complete when all resolved', () => {
    const state = new MergeConflictState();
    state.loadDefaultHunk();

    state.resolveHunk('hunk-1', 'CURRENT');
    assert.strictEqual(state.resolvedCount, 1);
    assert.strictEqual(state.isFullyResolved(), false);

    state.resolveHunk('hunk-2', 'INCOMING');
    assert.strictEqual(state.resolvedCount, 2);
    assert.strictEqual(state.isFullyResolved(), true);
  });

  it('generateResolvedFile should combine selected branches cleanly', () => {
    const state = new MergeConflictState();
    state.loadDefaultHunk();

    state.resolveHunk('hunk-1', 'CURRENT');
    state.resolveHunk('hunk-2', 'INCOMING');

    const result = state.generateResolvedFile();
    assert.ok(result);
    assert.ok(result.includes('maxVelocity = 12'), 'Current change for hunk 1 must be present');
    assert.ok(result.includes('crypto.subtle.digest'), 'Incoming change for hunk 2 must be present');
  });

  it('MergeConflictResolver should render HTML with conflict header and buttons', () => {
    const resolver = new MergeConflictResolver();
    const html = resolver.renderHtml();
    assert.ok(html.includes('MERGE CONFLICT'));
    assert.ok(html.includes('Accept Current'));
    assert.ok(html.includes('Accept Incoming'));
    assert.ok(html.includes('Accept Both'));
    assert.ok(html.includes('btn-finalize-merge'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('merge_conflict.test.js')) {
  runMergeConflictTests().then(() => console.log(`\nAll ${passed}/${total} Merge Conflict tests passed.`));
}

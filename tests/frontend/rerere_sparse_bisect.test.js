/**
 * Automated Frontend Test Suite: RERERE, Sparse-Checkout & Bisect
 * Tests: RERERE auto-replay, Sparse-Checkout cone compilation, Bisect binary search steps
 */

import assert from 'node:assert';
import { RerereWorkbench } from '../../src/features/rerere/RerereWorkbench.js';
import { SparseCheckoutManager } from '../../src/features/sparse/SparseCheckoutManager.js';
import { BisectWorkbench } from '../../src/features/bisect/BisectWorkbench.js';
import { renderRererePage } from '../../src/pages/RererePage.js';
import { renderSparseCheckoutPage } from '../../src/pages/SparseCheckoutPage.js';
import { renderBisectPage } from '../../src/pages/BisectPage.js';

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

export async function runRerereSparseBisectTests() {
  console.log('\n[Suite 28: RERERE, Sparse-Checkout & Bisect Assistant]');

  it('RerereWorkbench should record resolution and auto-replay on matching conflict hunk', () => {
    const rr = new RerereWorkbench();
    const conflict = '<<<<<<< HEAD\nconst speed = 10;\n=======\nconst speed = 15;\n>>>>>>> fast';
    const resolution = 'const speed = 12;';

    rr.recordResolution('src/speed.js', conflict, resolution);
    const autoResolved = rr.matchAndAutoResolve(conflict);

    assert.strictEqual(autoResolved, resolution);
    const entry = rr.recordedResolutions.find(r => r.conflictHunk === conflict);
    assert.strictEqual(entry.timesReplayed, 1);
  });

  it('SparseCheckoutManager should compile cone mode patterns and calculate disk savings', () => {
    const sparse = new SparseCheckoutManager();
    const patterns = sparse.compileSparsePatterns();
    assert.ok(patterns.includes('/src/adapters/'));
    assert.ok(patterns.includes('/src/features/'));

    const savings = sparse.calculateDiskSavings();
    assert.ok(Number(savings) >= 400.0, 'Excluded archives should save > 400 MB');
  });

  it('BisectWorkbench should calculate logarithmic steps and advance midpoint', () => {
    const bisect = new BisectWorkbench();
    const initialSteps = bisect.calculateRemainingSteps();
    assert.ok(initialSteps <= 3, 'Log2 of 5 unknowns is <= 3');
    assert.strictEqual(bisect.currentMidpoint, 'c104');

    bisect.markRevision('c104', 'GOOD');
    assert.ok(bisect.currentMidpoint !== 'c104', 'Midpoint must update after marking good');
  });

  it('Pages should render HTML successfully without errors', () => {
    assert.ok(renderRererePage().includes('Git RERERE Workbench'));
    assert.ok(renderSparseCheckoutPage().includes('Git Sparse-Checkout Studio'));
    assert.ok(renderBisectPage().includes('Git Bisect Assistant'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('rerere_sparse_bisect.test.js')) {
  runRerereSparseBisectTests().then(() => console.log(`\nAll ${passed}/${total} RERERE, Sparse, Bisect tests passed.`));
}

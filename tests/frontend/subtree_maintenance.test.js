/**
 * Automated Frontend Test Suite: Git Subtree & Maintenance Automation
 * Tests: Subtree adding/splitting, GitMaintenanceCenter task scheduling and commit-graph status
 */

import assert from 'node:assert';
import { SubtreeManager } from '../../src/features/subtree/SubtreeManager.js';
import { GitMaintenanceCenter } from '../../src/features/maintenance/GitMaintenanceCenter.js';
import { renderSubtreePage } from '../../src/pages/SubtreePage.js';
import { renderGitMaintenancePage } from '../../src/pages/GitMaintenancePage.js';

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

export async function runSubtreeMaintenanceTests() {
  console.log('\n[Suite 30: Git Subtrees & Repository Maintenance Automation]');

  it('SubtreeManager should embed external repos and split histories cleanly', () => {
    const manager = new SubtreeManager();
    const addRes = manager.addSubtree('packages/ui-components', 'https://github.com/gitquest/ui.git');
    assert.strictEqual(addRes.success, true);
    assert.strictEqual(addRes.subtree.prefix, 'packages/ui-components');

    const duplicate = manager.addSubtree('packages/ui-components', 'https://github.com/gitquest/ui.git');
    assert.strictEqual(duplicate.success, false);

    const splitRes = manager.splitSubtree('packages/ui-components', 'split/ui-release');
    assert.strictEqual(splitRes.success, true);
    assert.strictEqual(splitRes.branch, 'split/ui-release');
  });

  it('GitMaintenanceCenter should manage maintenance tasks and report packfile metrics', () => {
    const center = new GitMaintenanceCenter();
    assert.strictEqual(center.tasks.find(t => t.name === 'loose-objects').status, 'PENDING');

    center.runTask('loose-objects');
    assert.strictEqual(center.tasks.find(t => t.name === 'loose-objects').status, 'COMPLETED');
    assert.strictEqual(center.metrics.commitGraphValid, true);
  });

  it('Pages should render HTML successfully without exceptions', () => {
    assert.ok(renderSubtreePage().includes('Git Subtree Matrix'));
    assert.ok(renderGitMaintenancePage().includes('Git Maintenance & Commit-Graph Studio'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('subtree_maintenance.test.js')) {
  runSubtreeMaintenanceTests().then(() => console.log(`\nAll ${passed}/${total} Subtree & Maintenance tests passed.`));
}

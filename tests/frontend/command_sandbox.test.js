/**
 * Automated Frontend Test Suite: Command Sandbox & DAG Visualizer
 * Tests: Sandbox command execution, branch creation, commit history, and DAG rendering
 */

import assert from 'node:assert';
import { CommandSandbox } from '../../src/features/manual/CommandSandbox.js';
import { InteractiveGitDag } from '../../src/features/manual/InteractiveGitDag.js';

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

export async function runCommandSandboxTests() {
  console.log('\n[Suite 18: Command Sandbox & DAG Visualizer]');

  const sandbox = new CommandSandbox('test-dag');
  sandbox.init();

  it('Initial sandbox state should contain root commit on main', () => {
    assert.strictEqual(sandbox.commits.length, 1);
    assert.strictEqual(sandbox.currentBranch, 'main');
    assert.strictEqual(sandbox.headCommit, 'c1');
  });

  it('Executing git commit should create new commit node and advance HEAD', () => {
    const res = sandbox.execute('git commit Add index.html');
    assert.strictEqual(res.success, true);
    assert.strictEqual(sandbox.commits.length, 2);
    assert.strictEqual(sandbox.headCommit, 'c2');
    assert.strictEqual(sandbox.commits[1].parents[0], 'c1');
  });

  it('Executing git branch should branch from current HEAD without switching', () => {
    const res = sandbox.execute('git branch feature');
    assert.strictEqual(res.success, true);
    assert.ok(sandbox.branches.has('feature'));
    assert.strictEqual(sandbox.currentBranch, 'main');
  });

  it('Executing git switch should switch active branch and point HEAD to branch tip', () => {
    const res = sandbox.execute('git switch feature');
    assert.strictEqual(res.success, true);
    assert.strictEqual(sandbox.currentBranch, 'feature');

    // Commit on feature branch
    sandbox.execute('git commit Work on feature');
    assert.strictEqual(sandbox.commits.length, 3);
    assert.strictEqual(sandbox.commits[2].branch, 'feature');
  });

  it('InteractiveGitDag should generate SVG markup containing nodes and edges', () => {
    const svg = sandbox.render();
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('<circle'));
    assert.ok(svg.includes('c1'));
    assert.ok(svg.includes('c2'));
    assert.ok(svg.includes('HEAD'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('command_sandbox.test.js')) {
  runCommandSandboxTests().then(() => console.log(`\nAll ${passed}/${total} Command Sandbox tests passed.`));
}

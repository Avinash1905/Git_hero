/**
 * Automated Frontend Test Suite: Git Config, Patch Mailbox, Blame & Bundles
 * Tests: GitConfigManager aliases, PatchWorkbench git am, GitBlameInspector lines, GitBundleManager verification
 */

import assert from 'node:assert';
import { GitConfigManager } from '../../src/features/config/GitConfigManager.js';
import { PatchWorkbench } from '../../src/features/patch/PatchWorkbench.js';
import { GitBlameInspector } from '../../src/features/blame/GitBlameInspector.js';
import { GitBundleManager } from '../../src/features/bundle/GitBundleManager.js';
import { renderGitConfigPage } from '../../src/pages/GitConfigPage.js';
import { renderPatchWorkbenchPage } from '../../src/pages/PatchWorkbenchPage.js';
import { renderGitBlamePage } from '../../src/pages/GitBlamePage.js';
import { renderGitBundlePage } from '../../src/pages/GitBundlePage.js';

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

export async function runConfigPatchBlameTests() {
  console.log('\n[Suite 27: Git Config, Patch Mailbox, Blame & Bundles]');

  it('GitConfigManager should manage global/local keys and custom aliases', () => {
    const config = new GitConfigManager();
    assert.strictEqual(config.get('user.name', 'global'), 'Commander Alpha');

    config.set('user.name', 'Operative Delta', 'global');
    assert.strictEqual(config.get('user.name', 'global'), 'Operative Delta');

    config.addAlias('ci', 'commit -v', 'Commit with unified diff inline');
    assert.ok(config.aliases.some(a => a.alias === 'ci'));

    config.removeAlias('ci');
    assert.ok(!config.aliases.some(a => a.alias === 'ci'));
  });

  it('PatchWorkbench should update patch status on apply or reject', () => {
    const bench = new PatchWorkbench();
    assert.strictEqual(bench.patches[0].status, 'PENDING');

    bench.applyPatch('patch-0001');
    assert.strictEqual(bench.patches[0].status, 'APPLIED');
  });

  it('GitBlameInspector should extract unique authors and annotate lines', () => {
    const blame = new GitBlameInspector();
    const authors = blame.getAuthors();
    assert.ok(authors.includes('Commander Alpha'));
    assert.ok(authors.includes('Operative Beta'));

    const html = blame.renderHtml();
    assert.ok(html.includes('c101a'));
    assert.ok(html.includes('export function updatePhysics'));
  });

  it('GitBundleManager should create and verify offline bundle archives', () => {
    const bundles = new GitBundleManager();
    const res = bundles.createBundle('world-20-trial.bundle', 'refs/heads/trial');
    assert.strictEqual(res.success, true);

    const dup = bundles.createBundle('world-20-trial.bundle', 'refs/heads/trial');
    assert.strictEqual(dup.success, false);

    const verifyRes = bundles.verifyBundle('world-20-trial.bundle');
    assert.strictEqual(verifyRes.valid, true);
  });

  it('Pages should render HTML successfully', () => {
    assert.ok(renderGitConfigPage().includes('Git Configuration & Aliases'));
    assert.ok(renderPatchWorkbenchPage().includes('Git Patch Mailbox (git-am)'));
    assert.ok(renderGitBlamePage().includes('Git Blame Inspector'));
    assert.ok(renderGitBundlePage().includes('Git Bundle Packaging Center'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('config_patch_blame.test.js')) {
  runConfigPatchBlameTests().then(() => console.log(`\nAll ${passed}/${total} Config, Patch, Blame tests passed.`));
}

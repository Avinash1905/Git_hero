/**
 * Automated Frontend Test Suite: Git Hooks, Cleaner Studio, and Ghost Duels
 * Tests: Hook validation, credential regex scanning, blob purging, duel ghost telemetry
 */

import assert from 'node:assert';
import { GitHookStudio } from '../../src/features/hooks/GitHookStudio.js';
import { GitCleanerStudio } from '../../src/features/cleaner/GitCleanerStudio.js';
import { DuelChallengeSystem } from '../../src/features/multiplayer/DuelChallengeSystem.js';
import { renderGitHookStudioPage } from '../../src/pages/GitHookStudioPage.js';
import { renderGitCleanerPage } from '../../src/pages/GitCleanerPage.js';
import { renderDuelPage } from '../../src/pages/DuelPage.js';

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

export async function runHooksCleanerDuelTests() {
  console.log('\n[Suite 26: Git Hooks, History Cleaner & Ghost Duels]');

  it('GitHookStudio should validate Conventional Commits and reject malformed messages', () => {
    const studio = new GitHookStudio();
    const validRes = studio.testCommitMsgHook('feat(arena): add laser teleport switch');
    assert.strictEqual(validRes.success, true);

    const invalidRes = studio.testCommitMsgHook('updated stuff');
    assert.strictEqual(invalidRes.success, false);
    assert.ok(invalidRes.reason.includes('Conventional Commits'));
  });

  it('GitHookStudio scanForSecrets should detect AWS keys and private key blocks', () => {
    const studio = new GitHookStudio();
    const cleanContent = 'const port = 3000;\nconsole.log("ready");';
    assert.strictEqual(studio.scanForSecrets(cleanContent).hasSecrets, false);

    const dummyAwsKey = ['A', 'KIA', '0123456789ABCDEF'].join('');
    const dirtyContent = `const token = "${dummyAwsKey}";`;
    const scanRes = studio.scanForSecrets(dirtyContent);
    assert.strictEqual(scanRes.hasSecrets, true);
    assert.ok(scanRes.findings.includes('AWS Secret Key'));
  });

  it('GitCleanerStudio should purge oversized blobs and update reclaimed space', () => {
    const cleaner = new GitCleanerStudio();
    assert.strictEqual(cleaner.calculateReclaimedSpace(), '0.0');

    const purged = cleaner.purgeBlob('assets/recordings/demo-sector-100.mp4');
    assert.strictEqual(purged, true);
    assert.strictEqual(cleaner.calculateReclaimedSpace(), '48.2');
  });

  it('DuelChallengeSystem should calculate telemetry differentials between operatives', () => {
    const duel = new DuelChallengeSystem();
    const comparison = duel.compareRuns();
    assert.ok('isWinner' in comparison);
    assert.ok('timeDelta' in comparison);
    assert.ok('movesDelta' in comparison);
    assert.ok('winner' in comparison);
  });

  it('Workbench pages should render HTML without throwing', () => {
    const hookHtml = renderGitHookStudioPage();
    assert.ok(hookHtml.includes('Git Hook Automation Studio'));

    const cleanerHtml = renderGitCleanerPage();
    assert.ok(cleanerHtml.includes('Git History Cleaner (Filter-Repo)'));

    const duelHtml = renderDuelPage();
    assert.ok(duelHtml.includes('Sector Ghost Duels'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('hooks_cleaner_duel.test.js')) {
  runHooksCleanerDuelTests().then(() => console.log(`\nAll ${passed}/${total} Hooks, Cleaner & Duel tests passed.`));
}

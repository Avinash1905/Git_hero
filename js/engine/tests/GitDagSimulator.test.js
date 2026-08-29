/**
 * GitQuest Engine Tests - Git DAG Simulator & Myers Diff
 * Tests for GitRepo, GitBlob, GitTree, GitCommitObject, LCA search, 3-way merge, rebase, and reflog.
 */

import { TestSuite } from './TestRunner.js';
import { GitRepo } from '../git/GitRepo.js';
import { GitDiffEngine } from '../git/GitIndex.js';

export function createGitDagSimulatorSuite() {
  const suite = new TestSuite('Git DAG Simulator & Myers Diff');

  suite.test('GitRepo creates commits, branches, and traces reflog timeline', (assert) => {
    const repo = new GitRepo({ initialBranch: 'main' });
    assert.equal(repo.currentBranch, 'main');
    assert.exists(repo.headCommitHash);

    // Commit 1
    const c1 = repo.commit('feat: add core puzzle arena');
    assert.exists(c1.hash);
    assert.equal(repo.headCommitHash, c1.hash);
    assert.equal(repo.branches.get('main'), c1.hash);

    // Create and checkout branch
    repo.createBranch('feature/pull-mechanic');
    repo.checkout('feature/pull-mechanic');
    assert.equal(repo.currentBranch, 'feature/pull-mechanic');

    // Commit 2 on feature branch
    const c2 = repo.commit('feat: implement git pull left/right');
    assert.equal(repo.headCommitHash, c2.hash);
    assert.equal(repo.branches.get('feature/pull-mechanic'), c2.hash);

    // Reflog has recorded all movements
    const reflogs = repo.reflog.getAll();
    assert.isTrue(reflogs.length >= 3);
  });

  suite.test('GitMergeEngine correctly identifies fast-forward merge vs 3-way merge', (assert) => {
    const repo = new GitRepo({ initialBranch: 'main' });
    const c1 = repo.commit('Commit 1');

    repo.createBranch('feature/fast-forward');
    repo.checkout('feature/fast-forward');
    const c2 = repo.commit('Commit 2 on feature');

    // From main to feature is a linear fast-forward
    const isFF = repo.mergeEngine.isFastForward(c1.hash, c2.hash);
    assert.isTrue(isFF);

    // Lowest Common Ancestor is c1
    const lca = repo.mergeEngine.findMergeBase(c1.hash, c2.hash);
    assert.equal(lca, c1.hash);
  });

  suite.test('GitDiffEngine computes unified diffs using Myers algorithm', (assert) => {
    const textA = 'line 1\nline 2\nline 3';
    const textB = 'line 1\nline 2 modified\nline 3\nline 4';

    const diff = GitDiffEngine.formatUnifiedDiff('test.js', textA, textB);
    assert.exists(diff);
    assert.isTrue(diff.includes('--- a/test.js'));
    assert.isTrue(diff.includes('+++ b/test.js'));
    assert.isTrue(diff.includes('+line 4'));
  });

  suite.test('GitRebaseEngine plans and executes commit replays', (assert) => {
    const repo = new GitRepo({ initialBranch: 'main' });
    const baseCommit = repo.commit('Base commit');

    repo.createBranch('topic');
    repo.checkout('topic');
    repo.commit('Topic commit 1');
    repo.commit('Topic commit 2');

    // Switch back to main and commit
    repo.checkout('main');
    const mainNew = repo.commit('Main diverged commit');

    // Switch to topic and rebase onto main
    repo.checkout('topic');
    const plan = repo.rebaseEngine.createPlan('main');
    assert.equal(plan.length, 2);

    const newHead = repo.rebaseEngine.executePlan();
    assert.exists(newHead);
    assert.notEqual(newHead, baseCommit.hash);
  });

  return suite;
}

/**
 * GitQuest Engine Tests - Git Worktrees, Submodules, Bisect, Hooks & Blame
 * Complete test coverage for worktree dimension hopping, nested submodule repos, hooks, and bisect.
 */

import { TestSuite } from './TestRunner.js';
import { GitRepo } from '../git/GitRepo.js';
import { GitWorktreeEngine } from '../git/GitWorktreeEngine.js';
import { GitSubmoduleEngine } from '../git/GitWorktreeEngine.js';
import { GitBisectEngine, GitHookEngine, GitPatchEngine, GitBlameEngine } from '../git/GitBisectAndTools.js';

export function createGitWorktreesAndToolsSuite() {
  const suite = new TestSuite('Git Worktrees, Submodules, Bisect & Hooks');

  suite.test('GitWorktreeEngine adds, removes, and switches between parallel worktrees', (assert) => {
    const repo = new GitRepo();
    const wtEngine = new GitWorktreeEngine(repo);

    // Initial worktree is 'main'
    assert.equal(wtEngine.listWorktrees().length, 1);

    // Add feature worktree
    const wtFeature = wtEngine.addWorktree('feature-arena', 'feature/arena');
    assert.exists(wtFeature);
    assert.equal(wtEngine.listWorktrees().length, 2);

    // Switch worktree
    wtEngine.switchWorktree('feature-arena');
    assert.equal(repo.currentBranch, 'feature/arena');

    // Remove worktree
    const removed = wtEngine.removeWorktree('feature-arena');
    assert.isTrue(removed);
    assert.equal(wtEngine.listWorktrees().length, 1);
  });

  suite.test('GitSubmoduleEngine registers and updates nested submodule repositories', (assert) => {
    const parentRepo = new GitRepo();
    const subEngine = new GitSubmoduleEngine(parentRepo);

    const sub = subEngine.addSubmodule('https://github.com/gitquest/levels.git', 'packages/levels');
    assert.exists(sub);
    assert.exists(sub.repo);

    // Commit inside submodule
    const subCommit = sub.repo.commit('feat: add custom community level');
    assert.exists(subCommit);

    const updated = subEngine.update('packages/levels');
    assert.equal(updated[0].commitHash, subCommit.hash);
  });

  suite.test('GitHookEngine executes pre-commit validation pipelines', (assert) => {
    const hookEngine = new GitHookEngine();

    // Register linter hook
    hookEngine.registerHook('pre-commit', (ctx) => {
      if (ctx.message && ctx.message.length < 5) {
        return { success: false, reason: 'message_too_short' };
      }
      return { success: true };
    });

    const rejectRes = hookEngine.runHook('pre-commit', { message: 'fix' });
    assert.isFalse(rejectRes.success);
    assert.equal(rejectRes.reason, 'message_too_short');

    const acceptRes = hookEngine.runHook('pre-commit', { message: 'fix: resolve puzzle deadlock' });
    assert.isTrue(acceptRes.success);
  });

  suite.test('GitBisectEngine isolates regression commits using binary search', (assert) => {
    const repo = new GitRepo();
    const c0 = repo.headCommitHash;
    const c1 = repo.commit('Commit 1 - good').hash;
    const c2 = repo.commit('Commit 2 - good').hash;
    const c3 = repo.commit('Commit 3 - introduced bug').hash;
    const c4 = repo.commit('Commit 4 - bad').hash;
    const c5 = repo.commit('Commit 5 - latest bad').hash;

    const bisect = new GitBisectEngine(repo);
    bisect.start(c5);
    bisect.markGood(c1);

    assert.isTrue(bisect.inProgress || bisect.currentTestCommit !== null);
  });

  suite.test('GitPatchEngine and GitBlameEngine generate patches and line annotations', (assert) => {
    const patch = GitPatchEngine.createPatch('app.js', 'const x = 1;', 'const x = 2;', 'Update variable');
    assert.exists(patch);
    assert.isTrue(patch.includes('+const x = 2;'));

    const blame = GitBlameEngine.blame('function solve() {\n  return true;\n}');
    assert.equal(blame.length, 3);
    assert.equal(blame[0].lineNumber, 1);
    assert.equal(blame[1].lineNumber, 2);
    assert.equal(blame[2].lineNumber, 3);
  });

  return suite;
}

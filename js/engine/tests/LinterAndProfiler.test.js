/**
 * GitQuest Engine Tests - Git Linter & Performance Profiler
 * Tests for GitRepositoryLinter DAG validation, commit message format checks, and high-res profiler metrics.
 */

import { TestSuite } from './TestRunner.js';
import { GitRepo } from '../git/GitRepo.js';
import { GitRepositoryLinter, EnginePerformanceProfiler } from '../profiling/GitRepositoryLinter.js';

export function createLinterAndProfilerSuite() {
  const suite = new TestSuite('Git Repository Linter & Performance Profiler');

  suite.test('GitRepositoryLinter validates healthy repository without errors', (assert) => {
    const repo = new GitRepo();
    repo.commit('feat: initial release');

    const result = GitRepositoryLinter.lint(repo);
    assert.isTrue(result.isValid);
  });

  suite.test('GitRepositoryLinter validates conventional commit message formatting', (assert) => {
    const resValid1 = GitRepositoryLinter.validateCommitMessage('feat(engine): add magnetic physics');
    assert.isTrue(resValid1.valid);

    const resValid2 = GitRepositoryLinter.validateCommitMessage('fix: resolve deadlock in level 04');
    assert.isTrue(resValid2.valid);

    const resInvalid = GitRepositoryLinter.validateCommitMessage('just fixed stuff');
    assert.isFalse(resInvalid.valid);
  });

  suite.test('EnginePerformanceProfiler records sample timings and produces statistical aggregates', (assert) => {
    const profiler = new EnginePerformanceProfiler();

    profiler.start('astar_solver');
    // Simulated work
    let sum = 0;
    for (let i = 0; i < 10000; i++) sum += i;
    profiler.end('astar_solver');

    const metrics = profiler.getMetrics('astar_solver');
    assert.exists(metrics);
    assert.equal(metrics.samplesCount, 1);
    assert.isTrue(metrics.avgMs >= 0);
  });

  return suite;
}

/**
 * GitQuest Engine Tests - Git Graph, Revision Parser & Audio Synthesizer
 * Tests for ASCII graph tree generation, HEAD~N/HEAD^ revision resolving, git config, and audio synthesis.
 */

import { TestSuite } from './TestRunner.js';
import { GitRepo } from '../git/GitRepo.js';
import { GitGraphVisualizer, GitRevisionParser } from '../git/GitGraphVisualizer.js';
import { GitConfigEngine, GitFilterBranchEngine } from '../git/GitConfigEngine.js';
import { SoundSynthesizerEngine } from '../audio/SoundSynthesizerEngine.js';

export function createGitGraphAndToolsSuite() {
  const suite = new TestSuite('Git Graph, Revision Parser & Audio Synthesizer');

  suite.test('GitRevisionParser resolves HEAD, HEAD~1, and branch names', (assert) => {
    const repo = new GitRepo();
    const c1 = repo.headCommitHash;
    const c2 = repo.commit('Commit 2').hash;
    const c3 = repo.commit('Commit 3').hash;

    assert.equal(GitRevisionParser.resolve('HEAD', repo), c3);
    assert.equal(GitRevisionParser.resolve('HEAD~1', repo), c2);
    assert.equal(GitRevisionParser.resolve('HEAD~2', repo), c1);
    assert.equal(GitRevisionParser.resolve('main', repo), c3);
  });

  suite.test('GitGraphVisualizer generates structured ASCII history lines', (assert) => {
    const repo = new GitRepo();
    repo.commit('Feature addition');
    repo.commit('Bug fix');

    const graph = GitGraphVisualizer.renderGraph(repo);
    assert.exists(graph);
    assert.isTrue(graph.includes('*'));
    assert.isTrue(graph.includes('Feature addition'));
  });

  suite.test('GitConfigEngine gets, sets, and serializes INI format configuration', (assert) => {
    const config = new GitConfigEngine();
    assert.equal(config.get('user.name'), 'GitQuest Player');

    config.set('user.email', 'architect@gitquest.dev');
    assert.equal(config.get('user.email'), 'architect@gitquest.dev');

    const ini = config.serializeINI();
    assert.isTrue(ini.includes('[user]'));
    assert.isTrue(ini.includes('email = architect@gitquest.dev'));
  });

  suite.test('SoundSynthesizerEngine initializes audio triggers without throwing errors', (assert) => {
    const synth = new SoundSynthesizerEngine();
    synth.isMuted = true;

    // Trigger synthetic audio events safely
    synth.playMove();
    synth.playPush();
    synth.playPull();
    synth.playSwitch();
    synth.playLaser();
    synth.playPortal();
    synth.playError();
    synth.playCommitVictory();

    assert.isTrue(synth.isMuted);
  });

  return suite;
}

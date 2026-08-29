/**
 * GitQuest Engine Tests - Command AST Transformer & Autocomplete Trie
 * Tests for alias expansion (st -> status, ci -> commit), chained commands, and autocomplete trie suggestions.
 */

import { TestSuite } from './TestRunner.js';
import { CommandAstTransformer, AutoCompleteTrie, CommandHistoryBuffer } from '../commands/CommandAstTransformer.js';

export function createCommandAstAndHistorySuite() {
  const suite = new TestSuite('Command AST Transformer & Autocomplete');

  suite.test('CommandAstTransformer expands git aliases (st -> status, ci -> commit)', (assert) => {
    const transformer = new CommandAstTransformer();
    const res1 = transformer.transform('git st');
    assert.equal(res1.length, 1);
    assert.equal(res1[0], 'git status');

    const res2 = transformer.transform('git ci -m "Fix"');
    assert.equal(res2.length, 1);
    assert.equal(res2[0], 'git commit -m "Fix"');
  });

  suite.test('CommandAstTransformer splits chained commands (&&, ;)', (assert) => {
    const transformer = new CommandAstTransformer();
    const res = transformer.transform('git status && git pull left && git commit');
    assert.equal(res.length, 3);
    assert.equal(res[0], 'git status');
    assert.equal(res[1], 'git pull left');
    assert.equal(res[2], 'git commit');
  });

  suite.test('AutoCompleteTrie suggests matching commands by prefix', (assert) => {
    const trie = new AutoCompleteTrie([
      'git status',
      'git push',
      'git pull',
      'git pull left',
      'git pull right',
      'git commit',
      'git switch',
      'git branch',
      'git merge',
      'git rebase'
    ]);

    const suggestions = trie.suggest('git pu');
    assert.equal(suggestions.length, 4); // git push, git pull, git pull left, git pull right
    assert.isTrue(suggestions.includes('git push'));
    assert.isTrue(suggestions.includes('git pull'));
  });

  suite.test('CommandHistoryBuffer searches history with regex', (assert) => {
    const buffer = new CommandHistoryBuffer();
    buffer.push('git status');
    buffer.push('git branch feat/1');
    buffer.push('git checkout feat/1');
    buffer.push('git commit -m "Add feature"');

    const matches = buffer.searchRegex('feat');
    assert.equal(matches.length, 3);
  });

  return suite;
}

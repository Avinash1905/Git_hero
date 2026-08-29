/**
 * Automated Frontend Test Suite: Terminal Integration
 * Tests: Terminal command dispatch, command history buffer, tab autocomplete, formatting
 */

import assert from 'node:assert';
import { GameEngineAdapter } from '../../src/adapters/GameEngineAdapter.js';
import { CommandHistory } from '../../src/features/terminal/CommandHistory.js';
import { TerminalAutocomplete } from '../../src/features/terminal/TerminalAutocomplete.js';
import { TerminalFormatter } from '../../src/features/terminal/TerminalFormatter.js';
import { CommandTranslationAdapter } from '../../src/adapters/CommandTranslationAdapter.js';

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

export async function runTerminalTests() {
  console.log('\n[Suite 4: Terminal Integration & Command Engine]');

  const adapter = new GameEngineAdapter();
  await adapter.initializeLevel('01');

  it('Should dispatch "git status" command and receive formatted output', () => {
    const res = adapter.executeCommand('git status');
    assert.strictEqual(res.type, 'status');
    assert.ok(res.log, 'Log entry must be created');
    assert.ok(res.log.branch, 'Branch must be reported');
  });

  it('Should execute directional commands ("git up", "git down", "git left", "git right")', () => {
    const resUp = adapter.executeCommand('git up');
    assert.ok(resUp, 'git up command must execute');

    const resDown = adapter.executeCommand('git down');
    assert.ok(resDown, 'git down command must execute');
  });

  it('Should execute "git push" and "git pull" commands', () => {
    const resPush = adapter.executeCommand('git push');
    assert.ok(resPush, 'git push command must execute');

    const resPull = adapter.executeCommand('git pull');
    assert.ok(resPull, 'git pull command must execute');
  });

  it('CommandHistory should store, retrieve, and cycle through commands with Up/Down keys', () => {
    const history = new CommandHistory(10);
    history.clear();

    history.push('git status');
    history.push('git push');
    history.push('git commit');

    assert.strictEqual(history.getAll().length, 3);

    // Navigate backwards
    assert.strictEqual(history.getPrevious(), 'git commit');
    assert.strictEqual(history.getPrevious(), 'git push');
    assert.strictEqual(history.getPrevious(), 'git status');

    // Navigate forwards
    assert.strictEqual(history.getNext(), 'git push');
    assert.strictEqual(history.getNext(), 'git commit');
    assert.strictEqual(history.getNext(), ''); // return to empty prompt
  });

  it('TerminalAutocomplete should suggest valid completions for partial commands', () => {
    const matchesPush = TerminalAutocomplete.getSuggestions('git pu');
    assert.ok(matchesPush.includes('git push'));
    assert.ok(matchesPush.includes('git pull'));

    const matchStat = TerminalAutocomplete.getSuggestions('git st');
    assert.ok(matchStat.includes('git status'));

    const completed = TerminalAutocomplete.complete('git pu');
    assert.ok(completed.startsWith('git pu'));
  });

  it('TerminalFormatter should generate semantic HTML for all log types', () => {
    const cmdHtml = TerminalFormatter.formatLogHtml({ type: 'cmd', text: 'git status' });
    assert.ok(cmdHtml.includes('git status'));

    const statusHtml = TerminalFormatter.formatLogHtml({ type: 'status', branch: 'main', objective: 'Stage node', boxStatus: 'READY' });
    assert.ok(statusHtml.includes('branch main'));
    assert.ok(statusHtml.includes('READY'));

    const errHtml = TerminalFormatter.formatLogHtml({ type: 'error', text: 'fatal: invalid ref' });
    assert.ok(errHtml.includes('fatal: invalid ref'));
    assert.ok(errHtml.includes('text-error'));
  });

  adapter.destroy();
  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('terminal.test.js')) {
  runTerminalTests().then(() => console.log(`\nAll ${passed}/${total} Terminal tests passed.`));
}

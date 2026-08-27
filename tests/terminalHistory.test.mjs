import { describe, test, assert, assertEqual } from './runTests.mjs';
import { TerminalHistory } from '../js/terminal/TerminalHistory.js';

describe('Terminal History Buffer', () => {
  test('manages command pushes and arrow navigation', () => {
    const history = new TerminalHistory(10);
    history.push('git status');
    history.push('git push');
    history.push('git commit');

    assertEqual(history.getPrevious(), 'git commit');
    assertEqual(history.getPrevious(), 'git push');
    assertEqual(history.getPrevious(), 'git status');
    assertEqual(history.getNext(), 'git push');
    assertEqual(history.getNext(), 'git commit');
  });

  test('deduplicates identical consecutive commands', () => {
    const history = new TerminalHistory(10);
    history.push('git status');
    history.push('git status');

    assertEqual(history.history.length, 1);
  });
});

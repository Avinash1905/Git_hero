// Frontend Unit Tests: Terminal Theme Manager, Suggester & Session Logger
import assert from 'node:assert';
import { TerminalThemeManager } from '../../src/terminal/TerminalThemeManager.js';
import { GitCommandSuggester } from '../../src/terminal/GitCommandSuggester.js';
import { TerminalSessionLogger } from '../../src/terminal/TerminalSessionLogger.js';

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

export async function runTerminalEnhancementsTests() {
  console.log('\n[Suite: Terminal Themes, Suggestions & Session Logs]');

  it('Should manage terminal themes and palettes', () => {
    const themeMgr = new TerminalThemeManager();
    assert.ok(themeMgr.getTheme() !== null, 'Current theme should exist');
    themeMgr.setTheme('MATRIX');
    assert.strictEqual(themeMgr.getTheme().id, 'MATRIX', 'Setting theme should update active theme');
  });

  it('Should provide fuzzy Levenshtein suggestions for mistyped git commands', () => {
    const suggestions = GitCommandSuggester.getSuggestions('git stauts');
    assert.ok(suggestions.length > 0, 'Should find suggestions for typo');
    assert.strictEqual(suggestions[0].command, 'git status', 'Top suggestion should be git status');

    const msg = GitCommandSuggester.formatSuggestionMessage('git pull leftt');
    assert.ok(typeof msg === 'string' && msg.includes('git pull left'), 'Formatted message should include correction');
  });

  it('Should log sessions, support search, and export formatted markdown transcripts', () => {
    const logger = new TerminalSessionLogger();
    logger.logEntry('git status', 'On branch main. Nothing to commit.', true);
    logger.logEntry('git pull left', 'Obstructed pull path.', false);

    const searchResults = logger.searchHistory('status');
    assert.strictEqual(searchResults.length, 1, 'Search history should find 1 entry');
    assert.strictEqual(searchResults[0].command, 'git status', 'Found entry should be git status');

    const mdExport = logger.exportMarkdown();
    assert.ok(mdExport.includes('# GitHero Terminal Session Log'), 'Markdown export should contain title');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('terminal_enhancements.test.js')) {
  runTerminalEnhancementsTests().then(() => console.log(`\nAll ${passed}/${total} Terminal Enhancements tests passed.`));
}


/**
 * Automated Frontend Test Suite: Command AST & Pipeline Routing
 * Tests: Tokenization, flag parsing, command routing, direction sanitization, error diagnostics
 */

import assert from 'node:assert';
import { CommandTranslationAdapter } from '../../src/adapters/CommandTranslationAdapter.js';
import { TerminalAutocomplete } from '../../src/features/terminal/TerminalAutocomplete.js';
import { TerminalGraphRenderer } from '../../src/features/terminal/TerminalGraphRenderer.js';
import { TerminalDiffViewer } from '../../src/features/terminal/TerminalDiffViewer.js';

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

export async function runCommandAstTests() {
  console.log('\n[Suite 9: Command AST & Pipeline Routing]');

  it('CommandTranslationAdapter should sanitize whitespace and normalize inputs', () => {
    assert.strictEqual(CommandTranslationAdapter.sanitize('  git   status  '), 'git status');
    assert.strictEqual(CommandTranslationAdapter.sanitize('\tgit\tpush\n'), 'git push');
    assert.strictEqual(CommandTranslationAdapter.sanitize(''), '');
  });

  it('isGitCommand should accurately classify Git CLI invocations', () => {
    assert.strictEqual(CommandTranslationAdapter.isGitCommand('git status'), true);
    assert.strictEqual(CommandTranslationAdapter.isGitCommand('GIT PUSH'), true);
    assert.strictEqual(CommandTranslationAdapter.isGitCommand('git pull left'), true);
    assert.strictEqual(CommandTranslationAdapter.isGitCommand('clear'), false);
    assert.strictEqual(CommandTranslationAdapter.isGitCommand('help'), false);
  });

  it('parseTokens should decompose verb, subcommand, and argument arrays', () => {
    const parsed1 = CommandTranslationAdapter.parseTokens('git commit -m "feat: new arena"');
    assert.strictEqual(parsed1.verb, 'git');
    assert.strictEqual(parsed1.subcommand, 'commit');
    assert.ok(parsed1.args.length >= 1);

    const parsed2 = CommandTranslationAdapter.parseTokens('git pull left');
    assert.strictEqual(parsed2.verb, 'git');
    assert.strictEqual(parsed2.subcommand, 'pull');
    assert.deepStrictEqual(parsed2.args, ['left']);
  });

  it('TerminalGraphRenderer should generate ASCII graph lines with HEAD tag', () => {
    const commits = [
      { hash: 'a1b2c3d', message: 'Initial commit', branch: 'main', isHead: false, parents: [] },
      { hash: 'e4f5g6h', message: 'feat: add puzzles', branch: 'main', isHead: true, parents: ['a1b2c3d'] }
    ];
    const ascii = TerminalGraphRenderer.renderAsciiGraph(commits);
    assert.ok(ascii.includes('a1b2c3d'));
    assert.ok(ascii.includes('HEAD -> main'));
    assert.ok(ascii.includes('●'));
  });

  it('TerminalGraphRenderer should render styled HTML graph for active branch', () => {
    const commits = [
      { hash: '12345678', message: 'Update level grid', branch: 'feature/lasers', isHead: true, parents: [] }
    ];
    const html = TerminalGraphRenderer.renderHtmlGraph(commits);
    assert.ok(html.includes('1234567'));
    assert.ok(html.includes('HEAD -> feature/lasers'));
    assert.ok(html.includes('text-tertiary'));
  });

  it('TerminalDiffViewer should format additions, deletions, and hunk headers', () => {
    const sampleDiff = `diff --git a/index.html b/index.html
--- a/index.html
+++ b/index.html
@@ -1,3 +1,4 @@
-const oldMode = false;
+const newMode = true;
 const stable = true;`;

    const html = TerminalDiffViewer.formatDiffHtml(sampleDiff);
    assert.ok(html.includes('text-primary'), 'Additions should be styled with text-primary');
    assert.ok(html.includes('text-error'), 'Deletions should be styled with text-error');
    assert.ok(html.includes('text-secondary'), 'Hunk headers should be styled with text-secondary');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('command_ast_pipeline.test.js')) {
  runCommandAstTests().then(() => console.log(`\nAll ${passed}/${total} Command AST tests passed.`));
}

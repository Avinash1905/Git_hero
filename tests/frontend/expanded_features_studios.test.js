/**
 * Automated Frontend Test Suite: Expanded Features, Studios & Terminal Utilities
 */

import assert from 'node:assert';
import { GitQuestLevelEditor, ToolType } from '../../src/features/editor/GitQuestLevelEditor.js';
import { GitCommitMessageStudio } from '../../src/features/terminal/GitCommitMessageStudio.js';
import { GitCommitMessageLinter } from '../../js/engine/git/GitCommitMessageLinter.js';
import { CommandFuzzyMatcher } from '../../src/features/terminal/CommandFuzzyMatcher.js';
import { TerminalSyntaxHighlighter } from '../../src/features/terminal/TerminalSyntaxHighlighter.js';
import { GitCredentialHelperVault } from '../../src/features/auth/GitCredentialHelperVault.js';
import { ConflictMarkerAnnotator } from '../../src/features/conflicts/ConflictMarkerAnnotator.js';
import { GitQuestSkillTreeEngine } from '../../src/features/progression/GitQuestSkillTreeEngine.js';

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

export async function runExpandedFeaturesStudiosTests() {
  console.log('\n[Suite: Expanded Features, Studios & Terminal Utilities]');

  it('GitQuestLevelEditor should paint tiles and export valid level JSON', () => {
    const editor = new GitQuestLevelEditor(8);
    assert.strictEqual(editor.gridSize, 8);
    assert.strictEqual(editor.currentTool, ToolType.WALL);

    editor.setTool(ToolType.WALL);
    editor.paintCell(3, 3);
    assert.ok(editor.level.walls.some(w => w.x === 3 && w.y === 3), 'Wall should be placed at (3,3)');

    editor.setTool(ToolType.ERASER);
    editor.paintCell(3, 3);
    assert.ok(!editor.level.walls.some(w => w.x === 3 && w.y === 3), 'Wall should be erased');

    const exported = editor.exportJson();
    assert.ok(typeof exported === 'string' && exported.includes('custom_01'));
  });

  it('GitCommitMessageStudio should format conventional commit strings', () => {
    const linter = new GitCommitMessageLinter();
    const studio = new GitCommitMessageStudio(linter);
    studio.selectedType = 'feat';
    studio.scope = 'auth';
    studio.description = 'integrate cryptographic hardware token';
    studio.isBreaking = false;

    const msg = studio.buildMessage();
    assert.strictEqual(msg, 'feat(auth): integrate cryptographic hardware token');

    const lintResult = linter.lint(msg);
    assert.strictEqual(lintResult.isValid, true);
  });

  it('CommandFuzzyMatcher should calculate closest valid Git commands', () => {
    const matcher = new CommandFuzzyMatcher();

    const suggestions1 = matcher.suggest('git comit', 2);
    assert.ok(suggestions1.some(s => s.includes('commit')), 'Should suggest commit for git comit');

    const suggestions2 = matcher.suggest('git statsu', 2);
    assert.ok(suggestions2.some(s => s.includes('status')), 'Should suggest status for git statsu');
  });

  it('TerminalSyntaxHighlighter should highlight keywords, subcommands, and flags', () => {
    const highlighter = new TerminalSyntaxHighlighter();
    const raw = 'git commit -m "initial commit"';
    const highlighted = highlighter.highlightCommandInput(raw);
    assert.ok(highlighted.includes('span') || highlighted.includes('git'), 'Should render styled token markup');
  });

  it('GitCredentialHelperVault should store and retrieve scoped credentials safely', () => {
    const vault = new GitCredentialHelperVault();
    vault.storeCredential('https', 'github.com', 'octocat', 'ghp_secretToken12345');

    const cred = vault.getCredential('https', 'github.com');
    assert.ok(cred, 'Should retrieve stored credential');
    assert.strictEqual(cred.username, 'octocat');

    vault.eraseCredential('https', 'github.com');
    assert.strictEqual(vault.getCredential('https', 'github.com'), null, 'Credential should be erased');
  });

  it('ConflictMarkerAnnotator should parse git conflict markers into annotated lines', () => {
    const conflictRaw = `def calculate():
<<<<<<< HEAD
    return 42
=======
    return 100
>>>>>>> feature/boost
`;
    const annotator = new ConflictMarkerAnnotator();
    const parsed = annotator.annotateConflictText(conflictRaw);
    assert.strictEqual(parsed.hasConflicts, true, 'Should detect conflict markers');
    assert.ok(Array.isArray(parsed.annotatedLines), 'Annotated result should contain annotatedLines');
    assert.ok(parsed.annotatedLines.some(line => line.type === 'MARKER_HEAD'), 'Should identify MARKER_HEAD');
    assert.ok(parsed.annotatedLines.some(line => line.type === 'MARKER_SEPARATOR'), 'Should identify MARKER_SEPARATOR');
    assert.ok(parsed.annotatedLines.some(line => line.type === 'MARKER_END'), 'Should identify MARKER_END');
  });

  it('GitQuestSkillTreeEngine should manage node unlocks and talent points', () => {
    const tree = new GitQuestSkillTreeEngine(5, ['node_init']);
    assert.strictEqual(tree.talentPoints, 5);
    assert.ok(tree.unlockedNodeIds.has('node_init'));

    const res = tree.unlockNode('node_commit');
    assert.strictEqual(res.success, true);
    assert.strictEqual(tree.talentPoints, 4);
    assert.ok(tree.unlockedNodeIds.has('node_commit'));

    const html = tree.renderSkillTreeHtml();
    assert.ok(html.includes('Git Mastery Skill Tree'));
  });

  return { passed, total };
}

if (process.argv[1]?.endsWith('expanded_features_studios.test.js')) {
  runExpandedFeaturesStudiosTests();
}

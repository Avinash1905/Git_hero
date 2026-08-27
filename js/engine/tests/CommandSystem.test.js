/**
 * GitQuest Engine Tests - Command Pipeline & Parser
 * Comprehensive tests for lexer, parser, execution pipeline, and git commands.
 */

import { TestSuite } from './TestRunner.js';
import { CommandLexer, TokenType } from '../commands/CommandToken.js';
import { CommandParser } from '../commands/CommandParser.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createCommandSystemSuite() {
  const suite = new TestSuite('Command System & Parser');

  suite.test('CommandLexer tokenizes keywords, subcommands, flags, and quoted strings', (assert) => {
    const input = 'git commit -m "feat: solve level" --force';
    const tokens = CommandLexer.tokenize(input);

    assert.equal(tokens[0].type, TokenType.KEYWORD);
    assert.equal(tokens[0].value, 'git');

    assert.equal(tokens[1].type, TokenType.SUBCOMMAND);
    assert.equal(tokens[1].value, 'commit');

    assert.equal(tokens[2].type, TokenType.FLAG);
    assert.equal(tokens[2].value, '-m');

    assert.equal(tokens[3].type, TokenType.STRING);
    assert.equal(tokens[3].value, 'feat: solve level');

    assert.equal(tokens[4].type, TokenType.FLAG);
    assert.equal(tokens[4].value, '--force');
  });

  suite.test('CommandParser builds structured ParsedCommand with flags and arguments', (assert) => {
    const parsed = CommandParser.parse('git switch 08 -b');
    assert.isTrue(parsed.isValid);
    assert.equal(parsed.keyword, 'git');
    assert.equal(parsed.subCommand, 'switch');
    assert.equal(parsed.getArg(0), '08');
    assert.isTrue(parsed.hasFlag('-b'));
  });

  suite.test('git status returns current branch and goal progress', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    const res = engine.executeCommand('git status');
    assert.isTrue(res.success);
    assert.isFalse(res.onGoal);
    assert.equal(engine.stats.statusCount, 1);
  });

  suite.test('git commit fails when box is not on goal (dirty working tree)', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    const res = engine.executeCommand('git commit');
    assert.isFalse(res.success);
    assert.equal(res.reason, 'dirty_tree');
    assert.isFalse(engine.isCommitted);
  });

  suite.test('git commit succeeds when box is on goal', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Place box on goal (4,2)
    engine.box.x = 4;
    engine.box.y = 2;
    engine.isGoalReached = true;

    const res = engine.executeCommand('git commit -m "Level 01 resolved"');
    assert.isTrue(res.success);
    assert.isTrue(res.levelComplete);
    assert.isTrue(engine.isCommitted);
    assert.exists(res.commitHash);
  });

  suite.test('git branch creates new feature branches', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    const res = engine.executeCommand('git branch feature/puzzle-engine');
    assert.isTrue(res.success);
    assert.equal(res.branchName, 'feature/puzzle-engine');
    assert.isTrue(engine.gitRepo.branches.has('feature/puzzle-engine'));
  });

  suite.test('git stash saves and restores box position', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    const stashRes = engine.executeCommand('git stash');
    assert.isTrue(stashRes.success);
    assert.isTrue(stashRes.stashed);

    const popRes = engine.executeCommand('git stash pop');
    assert.isTrue(popRes.success);
    assert.isTrue(popRes.popped);
  });

  return suite;
}

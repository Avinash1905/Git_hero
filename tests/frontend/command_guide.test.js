/**
 * Automated Frontend Test Suite: GitHero Command Guide
 * Tests: Basic commands, movement commands, directional pull commands, and beginner example.
 */

import assert from 'node:assert';
import { 
  BASIC_COMMANDS, 
  MOVEMENT_COMMANDS, 
  DIRECTIONAL_PULL_COMMANDS, 
  BEGINNER_EXAMPLE, 
  renderCommandGuideHtml 
} from '../../src/features/manual/GitHeroCommandGuide.js';

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

export async function runCommandGuideTests() {
  console.log('\n[Suite: GitHero Terminal Command Guide]');

  it('All basic commands must provide command, whatItDoes, whenToUseIt, and simpleExample', () => {
    const required = ['git status', 'git push', 'git pull', 'git commit', 'git switch'];
    assert.strictEqual(BASIC_COMMANDS.length, 5);

    for (const name of required) {
      const item = BASIC_COMMANDS.find(c => c.command === name);
      assert.ok(item, `Command ${name} must exist`);
      assert.ok(item.whatItDoes && item.whatItDoes.length > 10);
      assert.ok(item.whenToUseIt && item.whenToUseIt.length > 10);
      assert.ok(item.simpleExample && item.simpleExample.startsWith('git'));
    }
  });

  it('All movement commands must provide directional navigation specifications', () => {
    const required = ['git up', 'git down', 'git left', 'git right'];
    assert.strictEqual(MOVEMENT_COMMANDS.length, 4);

    for (const name of required) {
      const item = MOVEMENT_COMMANDS.find(c => c.command === name);
      assert.ok(item, `Movement command ${name} must exist`);
      assert.ok(item.whatItDoes.includes('tile'));
    }
  });

  it('All directional pull commands must provide directional extraction specifications', () => {
    const required = ['git pull left', 'git pull right', 'git pull up', 'git pull down'];
    assert.strictEqual(DIRECTIONAL_PULL_COMMANDS.length, 4);

    for (const name of required) {
      const item = DIRECTIONAL_PULL_COMMANDS.find(c => c.command === name);
      assert.ok(item, `Directional pull command ${name} must exist`);
      assert.ok(item.whatItDoes.includes('pull'));
    }
  });

  it('Beginner example must define objective, sequential commands, and layout disclaimer', () => {
    assert.ok(BEGINNER_EXAMPLE.objective.includes('Reach the exit'));
    assert.deepStrictEqual(BEGINNER_EXAMPLE.possibleSolution, [
      'git status',
      'git right',
      'git right',
      'git up'
    ]);
    assert.ok(BEGINNER_EXAMPLE.explanation.includes('layout'));
  });

  it('renderCommandGuideHtml should generate complete styled cards for all command groups', () => {
    const html = renderCommandGuideHtml();
    assert.ok(html.includes('Basic GitHero Commands'));
    assert.ok(html.includes('Movement Commands'));
    assert.ok(html.includes('Directional Pull Commands'));
    assert.ok(html.includes('Beginner Level Example'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('command_guide.test.js')) {
  runCommandGuideTests().then(() => console.log(`\nAll ${passed}/${total} Command Guide tests passed.`));
}
